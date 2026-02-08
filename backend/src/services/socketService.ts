import { WebSocketServer, WebSocket } from 'ws';

// Map to store connected clients
export const clients = new Set<any>();

export const initWebSocket = (wss: WebSocketServer) => {
    wss.on('connection', (ws) => {
        console.log('Client connected');
        clients.add(ws);

        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message.toString());
                if (data.type === 'SUBSCRIBE') {
                    (ws as any).orgId = data.orgId;
                    console.log(`Client subscribed to ${data.orgId}`);
                }
            } catch (e) {
                console.error('WS Message error', e);
            }
        });

        ws.on('close', () => {
            clients.delete(ws);
            console.log('Client disconnected');
        });
    });
};

export const broadcast = (orgId: string | undefined, event: any) => {
    clients.forEach((client: any) => {
        if (client.readyState === 1 && (client.orgId === orgId || !client.orgId)) {
            client.send(JSON.stringify(event));
        }
    });
};
