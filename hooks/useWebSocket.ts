/**
 * NAVBAT - useWebSocket Hook
 * 
 * Provides easy access to WebSocket features:
 * - Connection status
 * - Subscription management
 * - Last received event
 */

import { useState, useEffect, useCallback } from 'react';
import { webSocketService, ConnectionState, WebSocketEvent } from '../services/webSocketService';

export const useWebSocket = () => {
    const [connectionState, setConnectionState] = useState<ConnectionState>(
        webSocketService.getConnectionState()
    );
    const [lastEvent, setLastEvent] = useState<WebSocketEvent | null>(null);

    useEffect(() => {
        // Connect on mount
        webSocketService.connect();

        // Subscribe to connection changes
        const unsubscribeConnection = webSocketService.onConnectionChange((state) => {
            setConnectionState(state);
        });

        // Subscribe to events
        const unsubscribeEvents = webSocketService.onEvent((event) => {
            setLastEvent(event);
        });

        return () => {
            unsubscribeConnection();
            unsubscribeEvents();
        };
    }, []);

    const subscribe = useCallback((orgId: string) => {
        webSocketService.subscribeToOrg(orgId);
    }, []);

    const unsubscribe = useCallback((orgId: string) => {
        webSocketService.unsubscribeFromOrg(orgId);
    }, []);

    return {
        isConnected: connectionState === 'CONNECTED',
        isConnecting: connectionState === 'CONNECTING' || connectionState === 'RECONNECTING',
        connectionState,
        lastEvent,
        subscribe,
        unsubscribe,
        connect: () => webSocketService.connect(),
        disconnect: () => webSocketService.disconnect()
    };
};
