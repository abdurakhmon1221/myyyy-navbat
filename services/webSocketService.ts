
/**
 * Mock WebSocket Service for NAVBAT
 * Simulates real-time queue position updates.
 */

type Listener = (data: any) => void;

class MockWebSocketService {
    private listeners: Set<Listener> = new Set();
    private interval: any = null;

    subscribe(callback: Listener) {
        this.listeners.add(callback);
        if (!this.interval) {
            this.startSimulation();
        }
        return () => this.listeners.delete(callback);
    }

    private startSimulation() {
        console.log('[MockWS] Starting real-time simulation...');
        this.interval = setInterval(() => {
            // 15% chance of a queue update every 10 seconds
            if (Math.random() < 0.15) {
                const mockUpdate = {
                    type: 'QUEUE_UPDATE',
                    data: {
                        timestamp: new Date().toISOString(),
                        action: 'STEP_FORWARD'
                    }
                };
                console.log('[MockWS] Emitting update:', mockUpdate);
                this.listeners.forEach(cb => cb(mockUpdate));
            }
        }, 10000);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

export const mockWS = new MockWebSocketService();
