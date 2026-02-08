
import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin (Singleton) - repeated logic for Vercel cold starts
if (!admin.apps.length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        } catch (e) {
            console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT', e);
        }
    } else {
        admin.initializeApp();
    }
}

const db = admin.firestore();

/**
 * Vercel Serverless Function: Verify OTP
 * POST /api/verifyTelegramOtp
 * Body: { phone: string, otp: string }
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

    const { phone, otp } = req.body;

    if (!phone || !otp) {
        return res.status(400).json({ success: false, error: 'Phone and OTP are required' });
    }

    try {
        const otpDoc = await db.collection('otps').doc(phone).get();

        if (!otpDoc.exists) {
            return res.status(400).json({ success: false, error: 'OTP not found. Please request a new one.' });
        }

        const otpData = otpDoc.data();

        if (otpData?.expiresAt < Date.now()) {
            await db.collection('otps').doc(phone).delete();
            return res.status(400).json({ success: false, error: 'OTP expired. Please request a new one.' });
        }

        if (otpData?.code !== otp) {
            return res.status(400).json({ success: false, error: 'Invalid OTP' });
        }

        // OTP is valid - delete it
        await db.collection('otps').doc(phone).delete();

        // Create or get user
        let userId = phone.replace(/\D/g, '');
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            await userRef.set({
                phone,
                chatId: otpData?.chatId,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                role: 'CLIENT',
                trustScore: 36.5
            });
        }

        // Generate a custom token for Firebase Auth
        const customToken = await admin.auth().createCustomToken(userId);

        return res.status(200).json({
            success: true,
            token: customToken,
            user: {
                id: userId,
                phone,
                role: userDoc.exists ? userDoc.data()?.role : 'CLIENT'
            }
        });
    } catch (error: any) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
