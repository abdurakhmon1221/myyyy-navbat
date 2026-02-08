import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

export const getOrganizations = async (req: Request, res: Response) => {
    try {
        const orgs = await prisma.organization.findMany({
            include: {
                services: true
            }
        });

        res.json({
            success: true,
            data: orgs,
            timestamp: Date.now()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Tashkilotlarni yuklashda xatolik',
            timestamp: Date.now()
        });
    }
};

export const createOrganization = async (req: Request, res: Response) => {
    const { name, category, address, phone } = req.body;
    const userId = (req as AuthRequest).user?.id;

    if (!userId) {
        return res.status(401).json({ success: false, error: 'User ID not found' });
    }

    try {
        const org = await prisma.organization.create({
            data: {
                name,
                category,
                address,
                phone,
                ownerId: userId
            }
        });

        res.status(201).json({
            success: true,
            data: org,
            timestamp: Date.now()
        });
    } catch (error) {
        try {
            require('fs').appendFileSync('C:\\Users\\Administrator\\Downloads\\myyyy navbat\\my Navbat\\backend\\error_debug.log', `Create Org Error: ${error}\n`);
        } catch (e) {
            console.error('Logging failed', e);
        }
        res.status(400).json({
            success: false,
            error: 'Tashkilot yaratishda xatolik',
            timestamp: Date.now()
        });
    }
};
