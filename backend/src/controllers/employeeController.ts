import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getEmployees = async (req: Request, res: Response) => {
    const { orgId } = req.params;

    try {
        const employees = await prisma.employee.findMany({
            where: { organizationId: orgId },
            include: {
                services: true
            }
        });

        res.json({
            success: true,
            data: employees,
            timestamp: Date.now()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Xodimlarni yuklashda xatolik',
            timestamp: Date.now()
        });
    }
};
