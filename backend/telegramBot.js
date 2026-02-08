/**
 * NAVBAT Telegram Bot Service
 * 
 * Handles Telegram bot integration for queue notifications.
 * Users can link their phone number to Telegram for instant updates.
 */

import { userDB, queueDB, organizationDB } from './database.js';

// Bot configuration
const getBotToken = () => process.env.TELEGRAM_BOT_TOKEN || '';
const getBotUsername = () => process.env.TELEGRAM_BOT_USERNAME || 'navbat_bot';

// Telegram API base URL
const getApiUrl = () => `https://api.telegram.org/bot${getBotToken()}`;

// ============================================================================
// TELEGRAM API HELPERS
// ============================================================================

/**
 * Send a message to a Telegram chat
 */
export async function sendMessage(chatId, text, options = {}) {
    if (!getBotToken()) {
        console.log(`[TG] Bot token not set. Would send to ${chatId}: ${text}`);
        return { ok: false, description: 'Bot token not configured' };
    }

    try {
        const response = await fetch(`${getApiUrl()}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                parse_mode: 'HTML',
                ...options
            })
        });

        const result = await response.json();

        if (!result.ok) {
            console.error('[TG] Failed to send message:', result.description);
        }

        return result;
    } catch (error) {
        console.error('[TG] Error sending message:', error);
        return { ok: false, description: error.message };
    }
}

/**
 * Send a message with inline keyboard
 */
export async function sendMessageWithButtons(chatId, text, buttons) {
    return sendMessage(chatId, text, {
        reply_markup: {
            inline_keyboard: buttons
        }
    });
}

// ============================================================================
// BOT COMMANDS
// ============================================================================

const COMMANDS = {
    '/start': handleStart,
    '/navbat': handleMyQueues,
    '/bekor': handleCancel,
    '/yordam': handleHelp,
    '/help': handleHelp
};

/**
 * Handle /start command - Link phone number
 */
async function handleStart(chatId, message, args) {
    // Check if user already linked
    const existingUser = findUserByChatId(chatId);

    if (existingUser) {
        return sendMessage(chatId,
            `✅ Siz allaqachon ro'yxatdan o'tgansiz!\n\n` +
            `📱 Telefon: ${existingUser.phone}\n\n` +
            `Buyruqlar:\n` +
            `/navbat - Mening navbatlarim\n` +
            `/bekor - Navbatni bekor qilish\n` +
            `/yordam - Yordam`
        );
    }

    // If deep link with phone verification
    if (args && args.length > 0) {
        const verificationCode = args[0];
        // In real app, verify this code against a pending verification
        return sendMessage(chatId,
            `🔗 Telefon raqamingizni bog'lash uchun ilovada "Telegram ulash" tugmasini bosing.`
        );
    }

    return sendMessage(chatId,
        `👋 <b>NAVBAT botiga xush kelibsiz!</b>\n\n` +
        `Bu bot orqali navbatingiz yaqinlashganda xabarnoma olasiz.\n\n` +
        `📱 Telefon raqamingizni bog'lash uchun:\n` +
        `1. NAVBAT ilovasini oching\n` +
        `2. Profil → Telegram ulash\n` +
        `3. Ko'rsatilgan kodni bu yerga yuboring\n\n` +
        `Yoki telefon raqamingizni to'g'ridan-to'g'ri yuboring (masalan: +998901234567)`
    );
}

/**
 * Handle /navbat command - Show user's active queues
 */
async function handleMyQueues(chatId, message) {
    const user = findUserByChatId(chatId);

    if (!user) {
        return sendMessage(chatId,
            `❌ Siz hali ro'yxatdan o'tmagansiz.\n\n` +
            `Telefon raqamingizni yuboring (masalan: +998901234567)`
        );
    }

    const queues = queueDB.getByPhone(user.phone, 'WAITING');

    if (queues.length === 0) {
        return sendMessage(chatId,
            `📋 Sizda hozircha faol navbat yo'q.\n\n` +
            `Navbatga yozilish uchun NAVBAT ilovasidan foydalaning.`
        );
    }

    let text = `📋 <b>Sizning navbatlaringiz:</b>\n\n`;

    for (const queue of queues) {
        const org = organizationDB.getById(queue.organizationId);
        text += `🏢 <b>${org?.name || 'Noma\'lum'}</b>\n`;
        text += `🎫 Raqam: <code>${queue.number}</code>\n`;
        text += `📍 Pozitsiya: ${queue.position}\n`;
        text += `⏱ Taxminiy vaqt: ~${queue.position * 10} daqiqa\n\n`;
    }

    // Add cancel buttons
    const buttons = queues.map(q => [{
        text: `❌ ${q.number} ni bekor qilish`,
        callback_data: `cancel_${q.id}`
    }]);

    return sendMessageWithButtons(chatId, text, buttons);
}

/**
 * Handle /bekor command - Cancel queue
 */
async function handleCancel(chatId, message) {
    const user = findUserByChatId(chatId);

    if (!user) {
        return sendMessage(chatId, `❌ Avval ro'yxatdan o'ting.`);
    }

    const queues = queueDB.getByPhone(user.phone, 'WAITING');

    if (queues.length === 0) {
        return sendMessage(chatId, `📋 Bekor qilish uchun faol navbat yo'q.`);
    }

    if (queues.length === 1) {
        // Auto-cancel if only one queue
        const queue = queues[0];
        queueDB.updateStatus(queue.id, 'CANCELLED', {
            timestamp: Date.now(),
            action: 'CANCELLED',
            actorId: 'telegram_bot',
            reason: 'Telegram orqali bekor qilindi'
        });
        queueDB.moveToHistory(queue.id);

        const org = organizationDB.getById(queue.organizationId);
        return sendMessage(chatId,
            `✅ Navbat bekor qilindi!\n\n` +
            `🏢 ${org?.name}\n` +
            `🎫 Raqam: ${queue.number}`
        );
    }

    // Multiple queues - show selection
    const buttons = queues.map(q => {
        const org = organizationDB.getById(q.organizationId);
        return [{
            text: `${q.number} - ${org?.name?.slice(0, 20) || 'Noma\'lum'}`,
            callback_data: `cancel_${q.id}`
        }];
    });

    return sendMessageWithButtons(chatId,
        `Qaysi navbatni bekor qilmoqchisiz?`,
        buttons
    );
}

/**
 * Handle /yordam command - Show help
 */
async function handleHelp(chatId, message) {
    return sendMessage(chatId,
        `📚 <b>NAVBAT Bot Yordam</b>\n\n` +
        `<b>Buyruqlar:</b>\n` +
        `/start - Boshlash\n` +
        `/navbat - Mening navbatlarim\n` +
        `/bekor - Navbatni bekor qilish\n` +
        `/yordam - Yordam\n\n` +
        `<b>Qanday ishlaydi?</b>\n` +
        `1. Telefon raqamingizni ulang\n` +
        `2. NAVBAT ilovasida navbatga yoziling\n` +
        `3. Navbatingiz yaqinlashganda xabarnoma olasiz\n\n` +
        `❓ Savollar: @navbat_support`
    );
}

// ============================================================================
// CALLBACK QUERY HANDLERS
// ============================================================================

/**
 * Handle callback queries (button clicks)
 */
async function handleCallbackQuery(callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;
    const messageId = callbackQuery.message.message_id;

    // Cancel queue
    if (data.startsWith('cancel_')) {
        const queueId = data.replace('cancel_', '');
        const queue = queueDB.getById(queueId);

        if (!queue) {
            return answerCallback(callbackQuery.id, 'Navbat topilmadi');
        }

        queueDB.updateStatus(queue.id, 'CANCELLED', {
            timestamp: Date.now(),
            action: 'CANCELLED',
            actorId: 'telegram_bot',
            reason: 'Telegram orqali bekor qilindi'
        });
        queueDB.moveToHistory(queue.id);

        const org = organizationDB.getById(queue.organizationId);

        // Update the message
        await editMessage(chatId, messageId,
            `✅ Navbat bekor qilindi!\n\n` +
            `🏢 ${org?.name}\n` +
            `🎫 Raqam: ${queue.number}`
        );

        return answerCallback(callbackQuery.id, '✅ Bekor qilindi');
    }

    // Confirm queue
    if (data.startsWith('confirm_')) {
        const queueId = data.replace('confirm_', '');
        // Mark as confirmed (user is coming)
        return answerCallback(callbackQuery.id, '✅ Tasdiqlandi! Tez orada keling.');
    }
}

/**
 * Answer callback query
 */
async function answerCallback(callbackQueryId, text) {
    if (!getBotToken()) return;

    try {
        await fetch(`${getApiUrl()}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                callback_query_id: callbackQueryId,
                text
            })
        });
    } catch (error) {
        console.error('[TG] Error answering callback:', error);
    }
}

/**
 * Edit message
 */
async function editMessage(chatId, messageId, text) {
    if (!getBotToken()) return;

    try {
        await fetch(`${getApiUrl()}/editMessageText`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                message_id: messageId,
                text,
                parse_mode: 'HTML'
            })
        });
    } catch (error) {
        console.error('[TG] Error editing message:', error);
    }
}

// ============================================================================
// PHONE NUMBER HANDLING
// ============================================================================

/**
 * Handle phone number message for linking
 */
async function handlePhoneNumber(chatId, phone) {
    // Normalize phone number
    const normalizedPhone = phone.replace(/\s+/g, '').replace(/[()-]/g, '');

    // Find user by phone
    const user = userDB.getByPhone(normalizedPhone);

    if (!user) {
        return sendMessage(chatId,
            `❌ Bu telefon raqam tizimda topilmadi.\n\n` +
            `Iltimos, avval NAVBAT ilovasida ro'yxatdan o'ting.`
        );
    }

    // Link Telegram chat ID to user
    user.telegramChatId = String(chatId);
    userDB.update(user);

    return sendMessage(chatId,
        `✅ <b>Muvaffaqiyatli ulandi!</b>\n\n` +
        `📱 Telefon: ${user.phone}\n` +
        `👤 Ism: ${user.name}\n\n` +
        `Endi navbatingiz yaqinlashganda xabarnoma olasiz! 🔔`
    );
}

// ============================================================================
// NOTIFICATION FUNCTIONS
// ============================================================================

/**
 * Send queue called notification
 */
export async function notifyQueueCalled(queue, windowNumber = 1) {
    const user = userDB.getByPhone(queue.userPhone);

    if (!user?.telegramChatId) {
        console.log(`[TG] User ${queue.userPhone} has no Telegram linked`);
        return false;
    }

    const org = organizationDB.getById(queue.organizationId);

    const text =
        `🔔 <b>NAVBATINGIZ KELDI!</b>\n\n` +
        `🏢 ${org?.name}\n` +
        `🎫 Raqamingiz: <b>${queue.number}</b>\n` +
        `🚪 ${windowNumber}-oyna\n\n` +
        `⚡ Iltimos, darhol keling!`;

    const buttons = [[
        { text: '✅ Keldim', callback_data: `confirm_${queue.id}` }
    ]];

    return sendMessageWithButtons(user.telegramChatId, text, buttons);
}

/**
 * Send queue position update
 */
export async function notifyPositionUpdate(queue, newPosition) {
    const user = userDB.getByPhone(queue.userPhone);

    if (!user?.telegramChatId) return false;

    // Only notify when close (position <= 3)
    if (newPosition > 3) return false;

    const org = organizationDB.getById(queue.organizationId);

    const text =
        `⏳ <b>Navbat yangilandi</b>\n\n` +
        `🏢 ${org?.name}\n` +
        `🎫 Raqamingiz: ${queue.number}\n` +
        `📍 Pozitsiya: <b>${newPosition}</b>\n\n` +
        `${newPosition === 1 ? '🚨 Keyingi siz!' : `~${newPosition * 10} daqiqa qoldi`}`;

    return sendMessage(user.telegramChatId, text);
}

/**
 * Send queue joined confirmation
 */
export async function notifyQueueJoined(queue) {
    const user = userDB.getByPhone(queue.userPhone);

    if (!user?.telegramChatId) return false;

    const org = organizationDB.getById(queue.organizationId);

    const text =
        `✅ <b>Navbatga yozildingiz!</b>\n\n` +
        `🏢 ${org?.name}\n` +
        `🎫 Raqamingiz: <b>${queue.number}</b>\n` +
        `📍 Pozitsiya: ${queue.position}\n` +
        `⏱ Taxminiy vaqt: ~${queue.position * 10} daqiqa\n\n` +
        `Navbat yaqinlashganda xabar beramiz! 🔔`;

    const buttons = [[
        { text: '❌ Bekor qilish', callback_data: `cancel_${queue.id}` }
    ]];

    return sendMessageWithButtons(user.telegramChatId, text, buttons);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Find user by Telegram chat ID
 */
function findUserByChatId(chatId) {
    // This is a simple implementation - in production, use an index
    const chatIdStr = String(chatId);

    // Query database for user with this chat ID
    // For now, we'll do a simple check using the existing userDB
    // In a real implementation, you'd add a proper index/query

    // Placeholder - need to extend userDB to support this query
    return null; // Will be implemented when we add the query
}

// ============================================================================
// WEBHOOK HANDLER
// ============================================================================

/**
 * Process incoming Telegram webhook update
 */
export async function processWebhook(update) {
    console.log('[TG] Received update:', JSON.stringify(update, null, 2));

    // Handle callback queries (button clicks)
    if (update.callback_query) {
        return handleCallbackQuery(update.callback_query);
    }

    // Handle messages
    if (update.message) {
        const message = update.message;
        const chatId = message.chat.id;
        const text = message.text || '';

        // Check if it's a command
        if (text.startsWith('/')) {
            const parts = text.split(' ');
            const command = parts[0].split('@')[0]; // Remove bot username if present
            const args = parts.slice(1);

            const handler = COMMANDS[command];
            if (handler) {
                return handler(chatId, message, args);
            } else {
                return sendMessage(chatId,
                    `❓ Noma'lum buyruq.\n\nYordam uchun /yordam yuboring.`
                );
            }
        }

        // Check if it's a phone number
        if (text.match(/^\+?[0-9]{9,15}$/)) {
            return handlePhoneNumber(chatId, text);
        }

        // Default response
        return sendMessage(chatId,
            `Buyruqlar ro'yxati uchun /yordam yuboring.`
        );
    }
}

/**
 * Set webhook URL (call this once to configure)
 */
export async function setWebhook(webhookUrl) {
    if (!getBotToken()) {
        console.log('[TG] Bot token not set, cannot set webhook');
        return false;
    }

    try {
        const response = await fetch(`${getApiUrl()}/setWebhook`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: webhookUrl,
                allowed_updates: ['message', 'callback_query']
            })
        });

        const result = await response.json();
        console.log('[TG] Set webhook result:', result);
        return result.ok;
    } catch (error) {
        console.error('[TG] Error setting webhook:', error);
        return false;
    }
}

/**
 * Get bot info
 */
export async function getBotInfo() {
    if (!getBotToken()) {
        return { ok: false, description: 'Bot token not configured' };
    }

    try {
        const response = await fetch(`${getApiUrl()}/getMe`);
        return response.json();
    } catch (error) {
        return { ok: false, description: error.message };
    }
}

export default {
    sendMessage,
    sendMessageWithButtons,
    notifyQueueCalled,
    notifyQueueJoined,
    notifyPositionUpdate,
    processWebhook,
    setWebhook,
    getBotInfo
};
