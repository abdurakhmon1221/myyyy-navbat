
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

admin.initializeApp();
const db = admin.firestore();

// Telegram Bot Token from Firebase Config
const TELEGRAM_BOT_TOKEN = functions.config().telegram?.token || process.env.TELEGRAM_BOT_TOKEN;

/**
 * Generate a random 5-digit OTP
 */
function generateOtp(): string {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

/**
 * HTTP Function: Send OTP via Telegram
 * POST /sendTelegramOtp
 * Body: { phone: string, chatId: string }
 */
export const sendTelegramOtp = functions.https.onRequest(async (req, res) => {
    // Enable CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ success: false, error: 'Method not allowed' });
        return;
    }

    const { phone, chatId } = req.body;

    if (!phone || !chatId) {
        res.status(400).json({ success: false, error: 'Phone and chatId are required' });
        return;
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
        }

        res.json({ success: true, message: 'OTP sent to Telegram' });
    } catch (error: any) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * HTTP Function: Verify OTP
 * POST /verifyTelegramOtp
 * Body: { phone: string, otp: string }
 */
export const verifyTelegramOtp = functions.https.onRequest(async (req, res) => {
    // Enable CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ success: false, error: 'Method not allowed' });
        return;
    }

    const { phone, otp } = req.body;

    if (!phone || !otp) {
        res.status(400).json({ success: false, error: 'Phone and OTP are required' });
        return;
    }

    try {
        const otpDoc = await db.collection('otps').doc(phone).get();

        if (!otpDoc.exists) {
            res.status(400).json({ success: false, error: 'OTP not found. Please request a new one.' });
            return;
        }

        const otpData = otpDoc.data();

        if (otpData?.expiresAt < Date.now()) {
            await db.collection('otps').doc(phone).delete();
            res.status(400).json({ success: false, error: 'OTP expired. Please request a new one.' });
            return;
        }

        if (otpData?.code !== otp) {
            res.status(400).json({ success: false, error: 'Invalid OTP' });
            return;
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

        res.json({
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
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Sends a push notification when a queue status changes.
 * Specifically, when a user's queue status changes to 'CALLED', send a "Your turn!" notification.
 */
export const onQueueStatusChange = functions.firestore
    .document('queues/{queueId}')
    .onUpdate(async (change, context) => {
        const newData = change.after.data();
        const previousData = change.before.data();

        // Check if status changed to CALLED
        if (newData.status === 'CALLED' && previousData.status !== 'CALLED') {
            const userId = newData.userId;
            const orgName = newData.organizationName || 'Tashkilot';

            // Get user's FCM token from Users collection
            const userDoc = await admin.firestore().collection('users').doc(userId).get();
            const userData = userDoc.data();

            if (userData && userData.fcmToken) {
                const payload = {
                    notification: {
                        title: 'Sizning navbatingiz keldi!',
                        body: `${orgName} da navbatingiz chaqirildi. Iltimos, kiring.`,
                        sound: 'default',
                        clickAction: 'FLUTTER_NOTIFICATION_CLICK',
                    },
                    data: {
                        queueId: context.params.queueId,
                        organizationId: newData.organizationId,
                        type: 'QUEUE_CALLED'
                    }
                };

                try {
                    await admin.messaging().sendToDevice(userData.fcmToken, payload);
                    console.log(`Notification sent to user ${userId}`);
                } catch (error) {
                    console.error('Error sending notification:', error);
                }
            }
        }
    });

/**
 * Health check endpoint
 */
export const health = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.json({ status: 'ok', timestamp: Date.now() });
});

