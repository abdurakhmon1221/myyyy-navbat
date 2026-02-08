import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load env vars
dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.send('NAVBAT API Server Running');
});

// Import Routes (Placeholders for now)
import authRoutes from './routes/authRoutes';
import orgRoutes from './routes/orgRoutes';
import queueRoutes from './routes/queueRoutes';
import employeeRoutes from './routes/employeeRoutes';

// Use Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/orgs', orgRoutes);
app.use('/api/v1/queues', queueRoutes);
app.use('/api/v1/employees', employeeRoutes);

// WebSocket Logic
import { initWebSocket } from './services/socketService';
initWebSocket(wss);

// Start Server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
