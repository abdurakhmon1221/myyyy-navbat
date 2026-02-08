
/**
 * SMS Service for NAVBAT
 * Handles OTP sending, custom messages, and Eskiz.uz integration.
 */

interface SMSResponse {
    success: boolean;
    message: string;
    messageId?: string;
}

interface EskizTokenResponse {
    message: string;
    data: {
        token: string;
    };
    token_type: string;
}

const SMS_CONFIG = {
    // For development, we use simulation. 
    // Set VITE_SMS_REAL_SEND=true in .env to enable real provider
    useSimulation: !(import.meta as any).env?.VITE_SMS_REAL_SEND,
    provider: (import.meta as any).env?.VITE_SMS_PROVIDER || 'eskiz',

    // Eskiz.uz credentials
    eskizEmail: (import.meta as any).env?.VITE_ESKIZ_EMAIL || '',
    eskizPassword: (import.meta as any).env?.VITE_ESKIZ_PASSWORD || '',
    eskizToken: '', // Will be fetched dynamically
    eskizFrom: '4546' // Sender ID
};

// Eskiz.uz API base URL
const ESKIZ_API = 'https://notify.eskiz.uz/api';

export const smsService = {
    /**
     * Get or refresh Eskiz.uz auth token
     */
    async getEskizToken(): Promise<string | null> {
        if (SMS_CONFIG.eskizToken) {
            return SMS_CONFIG.eskizToken;
        }

        if (!SMS_CONFIG.eskizEmail || !SMS_CONFIG.eskizPassword) {
            console.error('[smsService] Eskiz credentials missing');
            return null;
        }

        try {
            const formData = new FormData();
            formData.append('email', SMS_CONFIG.eskizEmail);
            formData.append('password', SMS_CONFIG.eskizPassword);

            const response = await fetch(`${ESKIZ_API}/auth/login`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Auth failed: ${response.status}`);
            }

            const data: EskizTokenResponse = await response.json();
            SMS_CONFIG.eskizToken = data.data.token;
            return SMS_CONFIG.eskizToken;
        } catch (error) {
            console.error('[smsService] Token fetch error:', error);
            return null;
        }
    },

    /**
     * Sends an OTP code to a phone number
     */
    async sendOTP(phone: string, code: string): Promise<SMSResponse> {
        const message = `NAVBAT: Tasdiqlash kodingiz: ${code}. Kodni hech kimga bermang.`;
        return this.sendCustomSMS(phone, message);
    },

    /**
     * Sends a custom SMS message
     */
    async sendCustomSMS(phone: string, message: string): Promise<SMSResponse> {
        const normalizedPhone = phone.replace(/\D/g, '');

        // Add country code if missing
        const fullPhone = normalizedPhone.startsWith('998')
            ? normalizedPhone
            : '998' + normalizedPhone;

        console.log(`[smsService] Sending SMS to ${fullPhone}`);

        if (SMS_CONFIG.useSimulation) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log(`[SMS SIMULATION] To: +${fullPhone}`);
            console.log(`[SMS SIMULATION] Message: ${message}`);
            return {
                success: true,
                message: 'SMS yuborildi (Simulyatsiya)',
                messageId: 'sim-' + Date.now()
            };
        }

        // Real Eskiz.uz API call
        try {
            const token = await this.getEskizToken();
            if (!token) {
                return {
                    success: false,
                    message: "SMS xizmati sozlanmagan. VITE_ESKIZ_EMAIL va VITE_ESKIZ_PASSWORD ni .env ga qo'shing"
                };
            }

            const formData = new FormData();
            formData.append('mobile_phone', fullPhone);
            formData.append('message', message);
            formData.append('from', SMS_CONFIG.eskizFrom);

            const response = await fetch(`${ESKIZ_API}/message/sms/send`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok && (data.status === 'waiting' || data.status === 'success')) {
                return {
                    success: true,
                    message: 'SMS muvaffaqiyatli yuborildi',
                    messageId: data.id?.toString()
                };
            } else {
                // Token might be expired, clear it
                if (response.status === 401) {
                    SMS_CONFIG.eskizToken = '';
                }
                return {
                    success: false,
                    message: data.message || 'SMS yuborishda xatolik'
                };
            }
        } catch (error: any) {
            console.error('[smsService] Send error:', error);
            return {
                success: false,
                message: error.message || 'Tarmoq xatosi'
            };
        }
    },

    /**
     * Send employee invite SMS
     */
    async sendEmployeeInvite(phone: string, orgName: string, inviteCode: string, tempPassword: string): Promise<SMSResponse> {
        const message = `NAVBAT: ${orgName} sizni xodim sifatida taklif qilmoqda.\n\nKod: ${inviteCode}\nParol: ${tempPassword}\n\nnavbat.uz/employee`;
        return this.sendCustomSMS(phone, message);
    },

    /**
     * Send queue notification SMS
     */
    async sendQueueNotification(phone: string, ticketNumber: string, orgName: string, position: number): Promise<SMSResponse> {
        const message = `NAVBAT: ${orgName}da ${ticketNumber} raqamli navbatingiz. Siz ${position}-o'rindasiz.`;
        return this.sendCustomSMS(phone, message);
    },

    /**
     * Send queue call SMS (when it's customer's turn)
     */
    async sendQueueCall(phone: string, ticketNumber: string, windowNumber: string): Promise<SMSResponse> {
        const message = `NAVBAT: Sizning navbatingiz keldi! Chipta: ${ticketNumber}. ${windowNumber}-oynaga yaqinlashing.`;
        return this.sendCustomSMS(phone, message);
    }
};
