import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../types';
import { sendSms } from '../services/smsService';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Helper to generate 5-digit OTP
const generateOtp = () => Math.floor(10000 + Math.random() * 90000).toString();

export const requestOtp = async (req: Request, res: Response) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ success: false, error: 'Phone required', timestamp: Date.now() });
    }

    try {
        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Check if user exists
        let user = await prisma.user.findUnique({ where: { phone } });

        if (user) {
            await prisma.user.update({
                where: { id: user.id },
                data: { otp, otpExpiresAt: expiresAt }
            });
        } else {
            // Create temporary user with OTP
            user = await prisma.user.create({
                data: {
                    phone,
                    otp,
                    otpExpiresAt: expiresAt,
                    role: 'CLIENT'
                }
            });
        }

        // Send SMS
        let smsResult;
        // Check if ESKIZ credentials are set, otherwise log for dev
        if (process.env.ESKIZ_EMAIL && process.env.ESKIZ_PASSWORD && process.env.NODE_ENV !== 'development') {
            try {
                smsResult = await sendSms(phone, `Navbat kodi: ${otp}`);
            } catch (e) {
                console.error('SMS Service Error', e);
                // Fallback for dev/demo if configured?
            }
        } else {
            // DEV MODE
            console.log(`[DEV OTP] SMS to ${phone}: ${otp}`);
            smsResult = { success: true };
        }

        res.json({ success: true, message: 'OTP sent', timestamp: Date.now() });

    } catch (error) {
        console.error('Request OTP Error', error);
        res.status(500).json({ success: false, error: 'Server error', timestamp: Date.now() });
    }
};

export const verifyOtp = async (req: Request, res: Response) => {
    const { phone, otp } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { phone } });

        // Simple hardcoded OTP for dev/demo if needed (e.g. 12345)
        const isMasterCode = otp === '12345';

        if (!user || (!isMasterCode && user.otp !== otp)) {
            return res.status(400).json({ success: false, error: 'Kod noto\'g\'ri', timestamp: Date.now() });
        }

        if (!isMasterCode && user.otpExpiresAt && user.otpExpiresAt < new Date()) {
            return res.status(400).json({ success: false, error: 'Kod eskirgan', timestamp: Date.now() });
        }

        // Clear OTP if not master code
        if (!isMasterCode) {
            await prisma.user.update({
                where: { id: user.id },
                data: { otp: null, otpExpiresAt: null }
            });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    phone: user.phone,
                    name: user.name || '',
                    trustScore: user.trustScore,
                    role: user.role
                },
                expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
            },
            timestamp: Date.now()
        });

    } catch (error) {
        console.error('Verify error', error);
        res.status(500).json({ success: false, error: 'Server error', timestamp: Date.now() });
    }
};

export const login = async (req: Request, res: Response) => {
    const { phone, password } = req.body;
    // Keep logic or redirect to OTP
    // For admin with passwords:
    try {
        const user = await prisma.user.findUnique({ where: { phone } });
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        // Assuming no password hash check implemented yet
        // if (password === 'admin123') ...

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            success: true,
            data: { token, user },
            timestamp: Date.now()
        });
    } catch (e) {
        res.status(500).json({ success: false, error: 'Error' });
    }
};

import { sendTelegramOTP } from '../services/telegramBot';

// ... (existing imports)

export const requestTelegramOtp = async (req: Request, res: Response) => {
    const { chatId } = req.body;

    if (!chatId) {
        return res.status(400).json({ success: false, error: 'Chat ID required', timestamp: Date.now() });
    }

    try {
        const user = await prisma.user.findUnique({ where: { telegramId: chatId } });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found with this Telegram ID', timestamp: Date.now() });
        }

        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        await prisma.user.update({
            where: { id: user.id },
            data: { otp, otpExpiresAt: expiresAt }
        });

        // Send OTP via Telegram
        const sent = await sendTelegramOTP(chatId, otp);

        if (sent) {
            res.json({ success: true, message: 'OTP sent to Telegram', timestamp: Date.now() });
        } else {
            res.status(500).json({ success: false, error: 'Failed to send Telegram message', timestamp: Date.now() });
        }

    } catch (error) {
        console.error('Request Telegram OTP Error', error);
        res.status(500).json({ success: false, error: 'Server error', timestamp: Date.now() });
    }
};

export const verifyTelegramOtp = async (req: Request, res: Response) => {
    const { chatId, otp } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { telegramId: chatId } });

        if (!user || user.otp !== otp) {
            return res.status(400).json({ success: false, error: 'Kod noto\'g\'ri', timestamp: Date.now() });
        }

        if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
            return res.status(400).json({ success: false, error: 'Kod eskirgan', timestamp: Date.now() });
        }

        // Clear OTP
        await prisma.user.update({
            where: { id: user.id },
            data: { otp: null, otpExpiresAt: null }
        });

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    phone: user.phone,
                    name: user.name || '',
                    trustScore: user.trustScore,
                    role: user.role,
                    telegramId: user.telegramId
                },
                expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
            },
            timestamp: Date.now()
        });

    } catch (error) {
        console.error('Verify Telegram OTP Error', error);
        res.status(500).json({ success: false, error: 'Server error', timestamp: Date.now() });
    }
};

export const register = async (req: Request, res: Response) => {
    requestOtp(req, res); // Reuse OTP flow
};

