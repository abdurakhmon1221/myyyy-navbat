/**
 * NAVBAT - WebSocket Service
 * 
 * Real-time communication service with:
 * - Auto-reconnection with exponential backoff
 * - JWT authentication support
 * - Room-based subscriptions (per organization)
 * - Graceful fallback to mock mode
 * - Connection state management
 */

import { config } from './config';
import { tokenManager } from './httpClient';
import { QueueItem } from '../types';

// ============================================================================
// TYPES
// ============================================================================

export type ConnectionState =
    | 'DISCONNECTED'
    | 'CONNECTING'
    | 'CONNECTED'
    | 'RECONNECTING'
    | 'ERROR';

export type WebSocketEventType =
    | 'QUEUE_JOINED'
    | 'QUEUE_CALLED'
    | 'QUEUE_SERVED'
    | 'QUEUE_SKIPPED'
    | 'QUEUE_CANCELLED'
    | 'POSITION_UPDATE'
    | 'QUEUE_STATE'
    | 'ORG_STATUS'
    | 'CONNECTION_ACK'
    | 'ERROR';

export interface WebSocketEvent<T = unknown> {
    type: WebSocketEventType;
    timestamp: number;
    organizationId?: string;
    data: T;
}

export interface QueueUpdateData {
    queueItem?: QueueItem;
    queue?: QueueItem[];
    position?: number;
    message?: string;
}

export interface OrgStatusData {
    organizationId: string;
    status: 'OPEN' | 'CLOSED' | 'BUSY';
    message?: string;
}

type EventListener<T = unknown> = (event: WebSocketEvent<T>) => void;
type ConnectionListener = (state: ConnectionState) => void;

// ============================================================================
// CONFIGURATION
// ============================================================================

const RECONNECT_DELAYS = [1000, 2000, 4000, 8000, 16000, 30000]; // Max 30s
const HEARTBEAT_INTERVAL = 30000; // 30 seconds
const MOCK_UPDATE_INTERVAL = 10000; // 10 seconds for mock mode
const MOCK_UPDATE_PROBABILITY = 0.15;

// ============================================================================
// WEBSOCKET SERVICE CLASS
// ============================================================================

class WebSocketService {
    private ws: WebSocket | null = null;
    private connectionState: ConnectionState = 'DISCONNECTED';
    private reconnectAttempt: number = 0;
    private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
    private mockTimer: ReturnType<typeof setInterval> | null = null;

    // Subscriptions
    private subscribedOrgs: Set<string> = new Set();
    private eventListeners: Set<EventListener> = new Set();
    private connectionListeners: Set<ConnectionListener> = new Set();

    // Pending subscriptions (for reconnection)
    private pendingSubscriptions: Set<string> = new Set();

    // ========================================================================
    // PUBLIC API
    // ========================================================================

    /**
     * Connect to WebSocket server
     */
    connect(): void {
        if (this.connectionState === 'CONNECTED' || this.connectionState === 'CONNECTING') {
            console.log('[WS] Already connected or connecting');
            return;
        }

        // Use mock mode if configured
        if (config.api.useMockApi || !config.features.enableWebSocket) {
            this.startMockMode();
            return;
        }

        this.attemptConnection();
    }

    /**
     * Disconnect from WebSocket server
     */
    disconnect(): void {
        this.cleanup();
        this.setConnectionState('DISCONNECTED');
        console.log('[WS] Disconnected');
    }

    /**
     * Subscribe to updates for a specific organization
     */
    subscribeToOrg(organizationId: string): void {
        if (this.subscribedOrgs.has(organizationId)) {
            return;
        }

        this.subscribedOrgs.add(organizationId);
        this.pendingSubscriptions.add(organizationId);

        if (this.connectionState === 'CONNECTED' && this.ws) {
            this.sendSubscribe(organizationId);
        }

        console.log(`[WS] Subscribed to org: ${organizationId}`);
    }

    /**
     * Unsubscribe from organization updates
     */
    unsubscribeFromOrg(organizationId: string): void {
        this.subscribedOrgs.delete(organizationId);
        this.pendingSubscriptions.delete(organizationId);

        if (this.connectionState === 'CONNECTED' && this.ws) {
            this.sendMessage({
                type: 'UNSUBSCRIBE',
                organizationId
            });
        }

        console.log(`[WS] Unsubscribed from org: ${organizationId}`);
    }

    /**
     * Add event listener for WebSocket events
     */
    onEvent<T = unknown>(listener: EventListener<T>): () => void {
        this.eventListeners.add(listener as EventListener);
        return () => this.eventListeners.delete(listener as EventListener);
    }

    /**
     * Add listener for connection state changes
     */
    onConnectionChange(listener: ConnectionListener): () => void {
        this.connectionListeners.add(listener);
        // Immediately notify current state
        listener(this.connectionState);
        return () => this.connectionListeners.delete(listener);
    }

    /**
     * Get current connection state
     */
    getConnectionState(): ConnectionState {
        return this.connectionState;
    }

    /**
     * Check if connected
     */
    isConnected(): boolean {
        return this.connectionState === 'CONNECTED';
    }

    /**
     * Check if using real-time (WebSocket) vs polling
     */
    isRealtime(): boolean {
        return this.connectionState === 'CONNECTED' && !config.api.useMockApi;
    }

    // ========================================================================
    // PRIVATE METHODS
    // ========================================================================

    private attemptConnection(): void {
        this.setConnectionState(this.reconnectAttempt > 0 ? 'RECONNECTING' : 'CONNECTING');

        const wsUrl = this.buildWsUrl();
        console.log(`[WS] Connecting to ${wsUrl} (attempt ${this.reconnectAttempt + 1})`);

        try {
            this.ws = new WebSocket(wsUrl);
            this.setupEventHandlers();
        } catch (error) {
            console.error('[WS] Failed to create WebSocket:', error);
            this.handleConnectionError();
        }
    }

    private buildWsUrl(): string {
        const baseUrl = config.api.wsUrl;
        const token = tokenManager.getToken();

        if (token) {
            return `${baseUrl}?token=${encodeURIComponent(token)}`;
        }
        return baseUrl;
    }

    private setupEventHandlers(): void {
        if (!this.ws) return;

        this.ws.onopen = () => {
            console.log('[WS] Connected');
            this.reconnectAttempt = 0;
            this.setConnectionState('CONNECTED');
            this.startHeartbeat();
            this.resubscribeAll();
        };

        this.ws.onclose = (event) => {
            console.log(`[WS] Closed: code=${event.code}, reason=${event.reason}`);
            this.stopHeartbeat();

            // Don't reconnect if intentionally closed
            if (event.code === 1000) {
                this.setConnectionState('DISCONNECTED');
            } else {
                this.scheduleReconnect();
            }
        };

        this.ws.onerror = (error) => {
            console.error('[WS] Error:', error);
            this.setConnectionState('ERROR');
        };

        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data) as WebSocketEvent;
                this.handleMessage(message);
            } catch (error) {
                console.error('[WS] Failed to parse message:', error);
            }
        };
    }

    private handleMessage(event: WebSocketEvent): void {
        if (config.features.enableDebugMode) {
            console.log('[WS] Received:', event.type, event);
        }

        // Handle connection acknowledgment
        if (event.type === 'CONNECTION_ACK') {
            console.log('[WS] Connection acknowledged by server');
            return;
        }

        // Notify all listeners
        this.eventListeners.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.error('[WS] Event listener error:', error);
            }
        });
    }

    private sendMessage(message: object): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }

    private sendSubscribe(organizationId: string): void {
        this.sendMessage({
            type: 'SUBSCRIBE',
            organizationId
        });
        this.pendingSubscriptions.delete(organizationId);
    }

    private resubscribeAll(): void {
        // Resubscribe to all organizations after reconnection
        this.subscribedOrgs.forEach(orgId => {
            this.sendSubscribe(orgId);
        });
    }

    private scheduleReconnect(): void {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
        }

        const delay = RECONNECT_DELAYS[Math.min(this.reconnectAttempt, RECONNECT_DELAYS.length - 1)];
        console.log(`[WS] Reconnecting in ${delay}ms...`);

        this.setConnectionState('RECONNECTING');
        this.reconnectAttempt++;

        this.reconnectTimer = setTimeout(() => {
            this.attemptConnection();
        }, delay);
    }

    private handleConnectionError(): void {
        this.setConnectionState('ERROR');
        this.scheduleReconnect();
    }

    private startHeartbeat(): void {
        this.stopHeartbeat();
        this.heartbeatTimer = setInterval(() => {
            this.sendMessage({ type: 'PING' });
        }, HEARTBEAT_INTERVAL);
    }

    private stopHeartbeat(): void {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }

    private setConnectionState(state: ConnectionState): void {
        if (this.connectionState !== state) {
            this.connectionState = state;
            this.connectionListeners.forEach(listener => listener(state));
        }
    }

    private cleanup(): void {
        this.stopHeartbeat();
        this.stopMockMode();

        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        if (this.ws) {
            this.ws.close(1000, 'Client disconnect');
            this.ws = null;
        }

        this.reconnectAttempt = 0;
    }

    // ========================================================================
    // MOCK MODE (for development without backend)
    // ========================================================================

    private startMockMode(): void {
        if (this.mockTimer) return;

        console.log('[WS] Starting mock mode');
        this.setConnectionState('CONNECTED');

        this.mockTimer = setInterval(() => {
            if (Math.random() < MOCK_UPDATE_PROBABILITY) {
                const mockEvent: WebSocketEvent<QueueUpdateData> = {
                    type: 'POSITION_UPDATE',
                    timestamp: Date.now(),
                    data: {
                        position: Math.floor(Math.random() * 10) + 1,
                        message: 'Mock queue update'
                    }
                };

                if (config.features.enableDebugMode) {
                    console.log('[MockWS] Emitting:', mockEvent);
                }

                this.eventListeners.forEach(listener => listener(mockEvent));
            }
        }, MOCK_UPDATE_INTERVAL);
    }

    private stopMockMode(): void {
        if (this.mockTimer) {
            clearInterval(this.mockTimer);
            this.mockTimer = null;
        }
    }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const webSocketService = new WebSocketService();

// Legacy export for backward compatibility
export const mockWS = {
    subscribe: (callback: EventListener): (() => void) => {
        webSocketService.connect();
        return webSocketService.onEvent(callback);
    },
    connect: () => webSocketService.connect(),
    stop: () => webSocketService.disconnect(),
    get connected() {
        return webSocketService.isConnected();
    }
};

export default webSocketService;
