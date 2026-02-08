
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

/**
 * Send OTP via Telegram bot
 * @param chatId - The Telegram chat ID to send the message to
 * @param otpCode - The OTP code to include in the message
 */
export async function sendTelegramOTP(chatId: string, otpCode: string): Promise<boolean> {
    if (!TELEGRAM_TOKEN) {
        console.error('TELEGRAM_BOT_TOKEN environment variable is not set');
        return false;
    }

    const message = `Antigravity: Sizning tasdiqlash kodingiz: *${otpCode}*`;

    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
        });
        return true;
    } catch (error: any) {
        console.error('Telegramga yuborishda xatolik:', error.message);
        return false;
    }
}
