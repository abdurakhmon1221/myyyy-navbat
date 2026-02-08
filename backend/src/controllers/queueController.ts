import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { broadcast } from '../services/socketService'; // WebSocket broadcaster

const prisma = new PrismaClient();

export const joinQueue = async (req: Request, res: Response) => {
    const { organizationId, serviceId, userPhone, userName, appointmentTime } = req.body;

    try {
        // 1. Check existing active queue
        const existing = await prisma.queue.findFirst({
            where: {
                organizationId,
                userPhone,
                status: { in: ['WAITING', 'CALLED'] }
            }
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                error: 'Siz allaqachon navbatdasiz',
                timestamp: Date.now()
            });
        }

        // 2. Count current waiting for position
        const count = await prisma.queue.count({
            where: {
                organizationId,
                status: 'WAITING'
            }
        });

        // 3. Create Queue
        const newQueue = await prisma.queue.create({
            data: {
                number: count + 1,
                userPhone,
                userName,
                organizationId,
                serviceId,
                status: 'WAITING',
                waitingTime: count * 10 // Mock calculation
            }
        });

        // 4. Notify Organization via WebSocket
        broadcast(organizationId, {
            type: 'QUEUE_JOINED',
            data: newQueue
        });

        res.status(201).json({
            success: true,
            data: newQueue,
            timestamp: Date.now()
        });

    } catch (error) {
        console.error('Join Queue Error', error);
        res.status(500).json({
            success: false,
            error: 'Navbatga yozilishda xatolik',
            timestamp: Date.now()
        });
    }
};

export const getMyQueues = async (req: Request, res: Response) => {
    const { phone } = req.query;

    if (!phone) {
        return res.status(400).json({ success: false, error: 'Phone required' });
    }

    try {
        const list = await prisma.queue.findMany({
            where: {
                userPhone: String(phone),
                status: { in: ['WAITING', 'CALLED'] }
            },
            include: {
                organization: true,
                service: true
            }
        });

        res.json({
            success: true,
            data: list,
            timestamp: Date.now()
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
