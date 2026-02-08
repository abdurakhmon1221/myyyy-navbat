import { useState, useEffect, useCallback } from 'react';
import { QueueItem } from '../types';
import api from '../services/api';
import { useWebSocket } from './useWebSocket'; // New WebSocket integration
import { QueueUpdateData, WebSocketEvent } from '../services/webSocketService';

export const useQueue = (userPhone: string, organizationId?: string) => {
    const [activeQueues, setActiveQueues] = useState<QueueItem[]>([]);
    const [queueHistory, setQueueHistory] = useState<QueueItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // WebSocket integration
    const { isConnected, subscribe, unsubscribe, lastEvent } = useWebSocket();

    // Initial load and sync
    const syncQueues = useCallback(async () => {
        if (!userPhone) return;

        try {
            const response = await api.queues.getMyQueues(userPhone);
            if (response.success) {
                setActiveQueues(response.data);
            }
        } catch (error) {
            console.error('Failed to sync queues:', error);
        }
    }, [userPhone]);

    // WebSocket subscription management
    useEffect(() => {
        if (!isConnected) return;

        // Subscribe to specific org if provided
        if (organizationId) {
            subscribe(organizationId);
        }

        // Also subscribe to all organizations where user has an active queue
        activeQueues.forEach(q => {
            subscribe(q.organizationId);
        });

        return () => {
            if (organizationId) unsubscribe(organizationId);
            activeQueues.forEach(q => {
                unsubscribe(q.organizationId);
            });
        };
    }, [organizationId, isConnected, subscribe, unsubscribe, activeQueues]);

    // Handle WebSocket updates
    useEffect(() => {
        if (!lastEvent) return;

        // Optimistic Updates based on event type
        switch (lastEvent.type) {
            case 'QUEUE_JOINED':
            case 'QUEUE_CALLED':
            case 'QUEUE_SERVED':
            case 'QUEUE_SKIPPED':
            case 'QUEUE_CANCELLED':
            case 'POSITION_UPDATE':
                // Check if the event is relevant to current user
                // For now, simple strategy: Refresh on any relevant org update
                if (lastEvent.organizationId === organizationId) {
                    syncQueues();
                } else if (lastEvent.type === 'QUEUE_JOINED' || lastEvent.type === 'QUEUE_CANCELLED') {
                    // Always refresh my queues list on major state changes
                    syncQueues();
                }
                break;
        }
    }, [lastEvent, organizationId, syncQueues]);

    // Fallback polling (only if disconnected)
    useEffect(() => {
        syncQueues(); // Initial fetch

        let interval: ReturnType<typeof setInterval>;
        if (!isConnected) {
            interval = setInterval(syncQueues, 5000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [syncQueues, isConnected]);

    const joinQueue = async (orgId: string, serviceId: string) => {
        setIsLoading(true);
        try {
            const response = await api.queues.join({
                organizationId: orgId,
                serviceId,
                userPhone
            });
            if (response.success) {
                await syncQueues();
                return response.data;
            } else {
                console.error(response.message);
                return null;
            }
        } finally {
            setIsLoading(false);
        }
    };

    const cancelQueue = async (id: string, reason?: string) => {
        setIsLoading(true);
        try {
            await api.queues.cancel(id, reason);
            await syncQueues();
        } finally {
            setIsLoading(false);
        }
    };

    const updateQueueStatus = async (id: string, status: QueueItem['status']) => {
        try {
            await api.queues.updateStatus(id, status, userPhone);
            await syncQueues();
        } catch (err) {
            console.error(err);
        }
    };

    return {
        activeQueues,
        queueHistory,
        isLoading,
        isConnected, // Expose connection status
        joinQueue,
        cancelQueue,
        updateQueueStatus,
        refresh: syncQueues
    };
};
