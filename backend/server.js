/**
 * NAVBAT Development Backend Server (with WebSocket + SQLite)
 * 
 * Now with persistent SQLite database storage.
 * Includes a WebSocket server for real-time queue updates.
 */

import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { WebSocket, WebSocketServer } from 'ws';
import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables
if (fs.existsSync(path.join(rootDir, '.env.local'))) {
    dotenv.config({ path: path.join(rootDir, '.env.local') });
    console.log('[ENV] Loaded .env.local');
} else {
    dotenv.config({ path: path.join(rootDir, '.env') });
    console.log('[ENV] Loaded .env');
}

// Import database layer
import {
    organizationDB,
    userDB,
    sessionDB,
    queueDB,
    seedDatabase
} from './database.js';

// Import Telegram bot
import telegramBot from './telegramBot.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server separately to share with WebSocket
const server = http.createServer(app);

// ============================================================================
// MIDDLEWARE
// ============================================================================

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// ============================================================================
// INITIALIZE DATABASE
// ============================================================================

// Seed with initial data if empty
seedDatabase();

// Map orgId -> Set<WebSocket> (for room broadcasting)
const rooms = new Map();

// ============================================================================
// WEBSOCKET SERVER
// ============================================================================

const wss = new WebSocketServer({ server, path: '/ws' });

// Broadcast helper
function broadcastToOrg(orgId, eventType, data) {
    const clients = rooms.get(orgId);
    if (!clients || clients.size === 0) return;

    const message = JSON.stringify({
        type: eventType,
        organizationId: orgId,
        timestamp: Date.now(),
        data
    });

    console.log(`[WS] Broadcasting ${eventType} to org ${orgId} (${clients.size} clients)`);

    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

wss.on('connection', (ws, req) => {
    const parameters = url.parse(req.url, true);
    const token = parameters.query.token;

    console.log('[WS] Client connected');

    // Validate token (optional for now in dev)
    if (token) {
        // In real app, verify token
    }

    // Send ACK
    ws.send(JSON.stringify({
        type: 'CONNECTION_ACK',
        timestamp: Date.now(),
        data: { message: 'Connected to NAVBAT WebSocket Server' }
    }));

    // Handle messages
    ws.on('message', (message) => {
        try {
            const event = JSON.parse(message);

            if (event.type === 'SUBSCRIBE' && event.organizationId) {
                const orgId = event.organizationId;

                if (!rooms.has(orgId)) {
                    rooms.set(orgId, new Set());
                }

                rooms.get(orgId).add(ws);
                console.log(`[WS] Client subscribed to org ${orgId}`);

                // Track subscriptions on the socket for cleanup
                if (!ws.subscriptions) ws.subscriptions = new Set();
                ws.subscriptions.add(orgId);
            }

            else if (event.type === 'UNSUBSCRIBE' && event.organizationId) {
                const orgId = event.organizationId;
                if (rooms.has(orgId)) {
                    rooms.get(orgId).delete(ws);
                    console.log(`[WS] Client unsubscribed from org ${orgId}`);
                }
                if (ws.subscriptions) ws.subscriptions.delete(orgId);
            }

            else if (event.type === 'PING') {
                ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
            }

        } catch (error) {
            console.error('[WS] Error handling message:', error);
        }
    });

    // Cleanup on close
    ws.on('close', () => {
        console.log('[WS] Client disconnected');
        if (ws.subscriptions) {
            ws.subscriptions.forEach(orgId => {
                if (rooms.has(orgId)) {
                    rooms.get(orgId).delete(ws);
                }
            });
        }
    });
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const successResponse = (data, message) => ({
    success: true,
    data,
    message,
    timestamp: Date.now()
});

const errorResponse = (error, status = 400) => ({
    success: false,
    error,
    timestamp: Date.now()
});

// Auth middleware
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json(errorResponse('Unauthorized'));
    }

    const token = authHeader.split(' ')[1];
    const session = sessionDB.getByToken(token);

    if (!session || session.expiresAt < Date.now()) {
        if (session) sessionDB.delete(token);
        return res.status(401).json(errorResponse('Session expired'));
    }

    req.user = session.user;
    next();
};

// ============================================================================
// AUTH ROUTES
// ============================================================================

// Request OTP
app.post('/api/v1/auth/request-otp', (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json(errorResponse('Phone number required'));
    }

    // In dev, always use 12345 as OTP
    console.log(`[AUTH] OTP for ${phone}: 12345`);

    res.json(successResponse({
        sent: true,
        expiresIn: 120,
        maskedPhone: phone.replace(/(.{3})(.*)(.{4})/, '$1 ** *** $3')
    }, 'OTP sent'));
});

// Verify OTP
app.post('/api/v1/auth/verify-otp', (req, res) => {
    const { phone, otp } = req.body;

    if (otp !== '12345') {
        return res.status(401).json(errorResponse('Invalid OTP'));
    }

    // Find or create user in SQLite
    let user = userDB.getByPhone(phone);
    const isNewUser = !user;

    if (!user) {
        user = {
            id: `U${uuidv4().slice(0, 8)}`,
            phone,
            name: 'Foydalanuvchi',
            trustScore: 36.5,
            role: 'CLIENT'
        };
        userDB.create(user);
    }

    // Create session in SQLite
    const token = `token_${uuidv4()}`;
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    sessionDB.create(token, user.id, expiresAt);

    res.json(successResponse({
        session: {
            user,
            token,
            expiresAt,
            issuedAt: Date.now()
        },
        isNewUser
    }, 'Login successful'));
});

// Refresh token
app.post('/api/v1/auth/refresh', requireAuth, (req, res) => {
    const oldToken = req.headers.authorization.split(' ')[1];

    // Create new session
    const newToken = `token_${uuidv4()}`;
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

    // Delete old session
    sessionDB.delete(oldToken);

    // Create new session
    sessionDB.create(newToken, req.user.id, expiresAt);

    res.json(successResponse({
        user: req.user,
        token: newToken,
        expiresAt,
        issuedAt: Date.now()
    }));
});

// ============================================================================
// ORGANIZATION ROUTES
// ============================================================================

// Get all organizations
app.get('/api/v1/organizations', (req, res) => {
    let orgs = organizationDB.getAll();
    const { category, search, page = 1, limit = 20 } = req.query;

    // Filter by category
    if (category && category !== 'ALL') {
        orgs = orgs.filter(o => o.category === category);
    }

    // Search filter
    if (search) {
        const q = search.toLowerCase();
        orgs = orgs.filter(o =>
            o.name.toLowerCase().includes(q) ||
            o.address.toLowerCase().includes(q)
        );
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const start = (pageNum - 1) * limitNum;
    const paged = orgs.slice(start, start + limitNum);

    res.json(successResponse({
        items: paged,
        total: orgs.length,
        page: pageNum,
        pageSize: limitNum,
        hasMore: start + limitNum < orgs.length
    }));
});

// Get single organization
app.get('/api/v1/organizations/:id', (req, res) => {
    const org = organizationDB.getById(req.params.id);

    if (!org) {
        return res.status(404).json(errorResponse('Organization not found'));
    }

    res.json(successResponse(org));
});

// Create/Update organization
app.post('/api/v1/organizations', requireAuth, (req, res) => {
    const org = req.body;
    const existing = organizationDB.getById(org.id);

    if (existing) {
        organizationDB.update(org);
    } else {
        if (!org.id) {
            org.id = `ORG${uuidv4().slice(0, 8)}`;
        }
        organizationDB.create(org);
    }

    res.json(successResponse(org, 'Organization saved'));
});

// Delete organization
app.delete('/api/v1/organizations/:id', requireAuth, (req, res) => {
    const deleted = organizationDB.delete(req.params.id);

    if (!deleted) {
        return res.status(404).json(errorResponse('Organization not found'));
    }

    res.json(successResponse(true, 'Organization deleted'));
});

// Get organization queue
app.get('/api/v1/organizations/:id/queue', (req, res) => {
    const orgQueues = queueDB.getByOrg(req.params.id, 'WAITING');
    res.json(successResponse(orgQueues));
});

// Get organization employees
app.get('/api/v1/organizations/:id/employees', (req, res) => {
    const org = organizationDB.getById(req.params.id);
    res.json(successResponse(org?.employees || []));
});

// Get organization services
app.get('/api/v1/organizations/:id/services', (req, res) => {
    const org = organizationDB.getById(req.params.id);
    res.json(successResponse(org?.services || []));
});

// Call next in queue
app.post('/api/v1/organizations/:id/queue/call-next', requireAuth, (req, res) => {
    const { employeeId } = req.body;
    const orgId = req.params.id;

    const waitingQueues = queueDB.getByOrg(orgId, 'WAITING');
    const nextInLine = waitingQueues[0];

    if (!nextInLine) {
        return res.json(successResponse(null, 'No customers in queue'));
    }

    // Update status
    const updated = queueDB.updateStatus(nextInLine.id, 'CALLED', {
        timestamp: Date.now(),
        action: 'CALLED',
        actorId: employeeId
    });

    // Broadcast update
    broadcastToOrg(orgId, 'QUEUE_CALLED', { queueItem: updated });

    // Send Telegram notification
    telegramBot.notifyQueueCalled(updated, 1).catch(err => {
        console.log('[TG] Notification skipped:', err.message || 'No Telegram linked');
    });

    res.json(successResponse(updated, 'Customer called'));
});

// ============================================================================
// QUEUE ROUTES
// ============================================================================

// Join queue
app.post('/api/v1/queues/join', (req, res) => {
    const { organizationId, serviceId, userPhone, userName, appointmentTime } = req.body;

    // Check for existing queue
    if (queueDB.checkExisting(userPhone, organizationId)) {
        return res.status(400).json(errorResponse('Already in queue at this organization'));
    }

    // Get next position
    const position = queueDB.getNextPosition(organizationId);

    // Create new queue item
    const newQueue = {
        id: `Q${uuidv4().slice(0, 8)}`,
        userId: `U${userPhone}`,
        userPhone,
        organizationId,
        serviceId,
        position,
        number: `${appointmentTime ? 'B' : 'A'}${String(position).padStart(3, '0')}`,
        status: 'WAITING',
        entryTime: Date.now(),
        estimatedStartTime: Date.now() + ((position - 1) * 10 * 60 * 1000),
        appointmentTime,
        logs: [{
            timestamp: Date.now(),
            action: 'JOINED',
            actorId: userPhone
        }]
    };

    queueDB.create(newQueue);

    // Broadcast update
    broadcastToOrg(organizationId, 'QUEUE_JOINED', { queueItem: newQueue });

    // Send Telegram confirmation
    telegramBot.notifyQueueJoined(newQueue).catch(err => {
        console.log('[TG] Join notification skipped:', err.message || 'No Telegram linked');
    });

    res.json(successResponse(newQueue, 'Successfully joined queue'));
});

// Get my queues
app.get('/api/v1/queues/my', (req, res) => {
    const { phone } = req.query;
    const myQueues = queueDB.getByPhone(phone, 'WAITING');
    res.json(successResponse(myQueues));
});

// Cancel queue
app.post('/api/v1/queues/:id/cancel', (req, res) => {
    const { reason } = req.body;
    const queue = queueDB.getById(req.params.id);

    if (!queue) {
        return res.status(404).json(errorResponse('Queue not found'));
    }

    const orgId = queue.organizationId;

    // Update status with log
    const updated = queueDB.updateStatus(queue.id, 'CANCELLED', {
        timestamp: Date.now(),
        action: 'CANCELLED',
        actorId: queue.userPhone,
        reason
    });

    // Move to history
    queueDB.moveToHistory(queue.id);

    // Broadcast update
    broadcastToOrg(orgId, 'QUEUE_CANCELLED', { queueItem: updated });

    res.json(successResponse(updated, 'Queue cancelled'));
});

// Update queue status
app.patch('/api/v1/queues/:id/status', requireAuth, (req, res) => {
    const { status, actorId } = req.body;
    const queue = queueDB.getById(req.params.id);

    if (!queue) {
        return res.status(404).json(errorResponse('Queue not found'));
    }

    const updated = queueDB.updateStatus(queue.id, status, {
        timestamp: Date.now(),
        action: `STATUS_CHANGED_TO_${status}`,
        actorId
    });

    // Broadcast update
    broadcastToOrg(queue.organizationId, 'QUEUE_UPDATE', { queueItem: updated });

    res.json(successResponse(updated));
});

// Mark as served
app.post('/api/v1/queues/:id/serve', requireAuth, (req, res) => {
    const { employeeId, notes } = req.body;
    const queue = queueDB.getById(req.params.id);

    if (!queue) {
        return res.status(404).json(errorResponse('Queue not found'));
    }

    const orgId = queue.organizationId;

    // Update status
    const updated = queueDB.updateStatus(queue.id, 'SERVED', {
        timestamp: Date.now(),
        action: 'SERVED',
        actorId: employeeId,
        reason: notes
    });

    // Move to history
    queueDB.moveToHistory(queue.id);

    // Recalculate positions for remaining queue
    queueDB.recalculatePositions(orgId);

    // Broadcast update
    broadcastToOrg(orgId, 'QUEUE_SERVED', { queueItem: updated });

    res.json(successResponse(updated, 'Customer served'));
});

// Skip customer
app.post('/api/v1/queues/:id/skip', requireAuth, (req, res) => {
    const { employeeId, reason } = req.body;
    const queue = queueDB.getById(req.params.id);

    if (!queue) {
        return res.status(404).json(errorResponse('Queue not found'));
    }

    const orgId = queue.organizationId;

    // Update status
    const updated = queueDB.updateStatus(queue.id, 'SKIPPED', {
        timestamp: Date.now(),
        action: 'SKIPPED',
        actorId: employeeId,
        reason
    });

    // Move to history
    queueDB.moveToHistory(queue.id);

    // Recalculate positions
    queueDB.recalculatePositions(orgId);

    // Broadcast update
    broadcastToOrg(orgId, 'QUEUE_SKIPPED', { queueItem: updated });

    res.json(successResponse(updated, 'Customer skipped'));
});

// ============================================================================
// STATS ROUTES (for Admin Dashboard)
// ============================================================================

app.get('/api/v1/stats', (req, res) => {
    const totalOrgs = organizationDB.count();
    const totalUsers = userDB.count();

    // Count active queues across all orgs
    let activeQueues = 0;
    const orgs = organizationDB.getAll();
    orgs.forEach(org => {
        activeQueues += queueDB.countByOrg(org.id, 'WAITING');
    });

    res.json(successResponse({
        totalOrganizations: totalOrgs,
        totalUsers: totalUsers,
        activeQueues: activeQueues
    }));
});

// ============================================================================
// TELEGRAM BOT ROUTES
// ============================================================================

// Webhook for Telegram updates
app.post('/api/v1/telegram/webhook', async (req, res) => {
    try {
        await telegramBot.processWebhook(req.body);
        res.json({ ok: true });
    } catch (error) {
        console.error('[TG] Webhook error:', error);
        res.status(500).json({ ok: false, error: error.message });
    }
});

// Set webhook URL (admin only)
app.post('/api/v1/telegram/set-webhook', requireAuth, async (req, res) => {
    const { webhookUrl } = req.body;
    const result = await telegramBot.setWebhook(webhookUrl);
    res.json(successResponse({ success: result }));
});

// Get bot info
app.get('/api/v1/telegram/info', async (req, res) => {
    const info = await telegramBot.getBotInfo();
    res.json(successResponse(info));
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/api/v1/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: Date.now(),
        version: '1.1.0',
        environment: 'development',
        database: 'SQLite',
        wsConnections: wss.clients.size
    });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use((err, req, res, next) => {
    console.error('[ERROR]', err);
    res.status(500).json(errorResponse('Internal server error'));
});

// ============================================================================
// START SERVER
// ============================================================================

// Listen on the HTTP server, causing the WebSocket server to share the port
server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🚀 NAVBAT Development Server v1.2 (SQLite + Telegram)      ║
║                                                              ║
║   API:  http://localhost:${PORT}/api/v1                        ║
║   WS:   ws://localhost:${PORT}/ws                              ║
║   Health: http://localhost:${PORT}/api/v1/health               ║
║   Stats: http://localhost:${PORT}/api/v1/stats                 ║
║   Telegram: http://localhost:${PORT}/api/v1/telegram/webhook   ║
║                                                              ║
║   Database: SQLite (navbat.db)                               ║
║   Default OTP: 12345                                         ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `);
});
