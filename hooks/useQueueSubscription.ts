/**
 * NAVBAT - useQueueSubscription Hook
 * 
 * Manages real-time queue synchronization for a specific organization.
 * Features:
 * - Auto-subscription on mount
 * - Optimistic updates
 * - Fallback to polling if WebSocket disconnected
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { QueueItem } from '../types';
import { useWebSocket } from './useWebSocket';
import { QueueUpdateData, WebSocketEvent } from '../services/webSocketService';
import api from '../services/api';

interface UseQueueSubscriptionReturn {
    queue: QueueItem[];
    isLoading: boolean;
    isRealtime: boolean;
    lastUpdate: number;
    forceRefresh: () => Promise<void>;
}

export const useQueueSubscription = (organizationId: string): UseQueueSubscriptionReturn => {
    const { isConnected, lastEvent, subscribe, unsubscribe } = useWebSocket();
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(Date.now());
    const isMounted = useRef(true);

    const fetchQueue = useCallback(async () => {
        if (!organizationId) return;
        try {
            const response = await api.queues.getOrgQueue(organizationId);
            if (response.success && isMounted.current) {
                setQueue(response.data);
                setLastUpdate(Date.now());
            }
        } catch (error) {
            console.error('Failed to fetch queue:', error);
        } finally {
            if (isMounted.current) setIsLoading(false);
        }
    }, [organizationId]);

    // Setup subscription
    useEffect(() => {
        isMounted.current = true;
        fetchQueue();
        if (isConnected && organizationId) {
            subscribe(organizationId);
        }
        return () => {
            isMounted.current = false;
            // Don't unsubscribe on unmount to prevent flickering if other components use it, 
            // but for now strict cleanup is fine:
            if (isConnected && organizationId) {
                unsubscribe(organizationId);
            }
        };
    }, [organizationId, isConnected, subscribe, unsubscribe, fetchQueue]);

    // Handle updates
    useEffect(() => {
        if (lastEvent && lastEvent.orgId === organizationId) {
            // Refresh on any relevant event
            if (['QUEUE_JOINED', 'QUEUE_CALLED', 'QUEUE_SERVED', 'QUEUE_CANCELLED', 'POSITION_UPDATE'].includes(lastEvent.type)) {
                fetchQueue();
            }
        }
    }, [lastEvent, organizationId, fetchQueue]);

    // Fallback polling
    useEffect(() => {
        let pollInterval: ReturnType<typeof setInterval>;
        if (!isConnected) {
            pollInterval = setInterval(fetchQueue, 5000);
        }
        return () => {
            if (pollInterval) clearInterval(pollInterval);
        };
    }, [isConnected, fetchQueue]);

    return {
        queue,
        isLoading,
        isRealtime: isConnected,
        lastUpdate,
        forceRefresh: fetchQueue
    };
};
