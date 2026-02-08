
import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as admin from 'firebase-admin';
import axios from 'axios';

// Initialize Firebase Admin (Singleton)
if (!admin.apps.length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        // Use service account from environment variable (Vercel)
        try {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        } catch (e) {
            console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT', e);
        }
    } else {
        // Fallback for local development or if env var is missing
        console.warn('FIREBASE_SERVICE_ACCOUNT not found. Firestore may fail.');
        admin.initializeApp();
    }
}

const db = admin.firestore();

// Telegram Bot Token
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

/**
 * Generate a random 5-digit OTP
 */
function generateOtp(): string {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

/**
 * Vercel Serverless Function: Send OTP via Telegram
 * POST /api/sendTelegramOtp
 * Body: { phone: string, chatId: string }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const { phone, chatId } = req.body;

    if (!phone || !chatId) {
        return res.status(400).json({ success: false, error: 'Phone and chatId are required' });
    }

    const otp = generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    try {
        // Store OTP in Firestore
        await db.collection('otps').doc(phone).set({
            code: otp,
            chatId,
            expiresAt,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Send OTP via Telegram
        if (TELEGRAM_BOT_TOKEN) {
            await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                chat_id: chatId,
                text: `🔐 Navbat kodingiz: *${otp}*\n\nBu kod 5 daqiqa ichida amal qiladi.`,
                parse_mode: 'Markdown'
            });
        } else {
            console.warn('TELEGRAM_BOT_TOKEN is missing');
        }

        return res.status(200).json({ success: true, message: 'OTP sent to Telegram' });
    } catch (error: any) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
