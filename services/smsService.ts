
/**
 * SMS Service for NAVBAT
 * Handles OTP sending and verification.
 * Currently supports a Simulation mode and prepared for Eskiz.uz / Twilio integration.
 */

interface SMSResponse {
    success: boolean;
    message: string;
    messageId?: string;
}

const SMS_CONFIG = {
    // For development, we use simulation. 
    // Set VITE_SMS_REAL_SEND=true in .env to enable real provider
    useSimulation: !import.meta.env.VITE_SMS_REAL_SEND,
    provider: import.meta.env.VITE_SMS_PROVIDER || 'eskiz', // 'eskiz' or 'twilio'
    token: import.meta.env.VITE_SMS_TOKEN || ''
};

export const smsService = {
    /**
     * Sends an OTP code to a phone number
     */
    async sendOTP(phone: string, code: string): Promise<SMSResponse> {
        console.log(`[smsService] Attempting to send OTP to ${phone}`);

        if (SMS_CONFIG.useSimulation) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log(`[SMS SIMULATION] To: ${phone}, Message: Navbat kodi: ${code}`);
            return {
                success: true,
                message: 'SMS sent successfully (Simulation)'
            };
        }

        // Real Provider Logic (e.g. Eskiz.uz)
        try {
            if (!SMS_CONFIG.token) {
                throw new Error('SMS API Token is missing. Set VITE_SMS_TOKEN in .env.local');
            }

            // This is a placeholder for actual fetch call to Eskiz/Twilio API
            // Example for Eskiz.uz:
            /*
            const response = await fetch('https://notify.eskiz.uz/api/message/sms/send', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${SMS_CONFIG.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mobile_phone: phone.replace(/\D/g, ''),
                    message: `Navbat kodi: ${code}`,
                    from: '4546'
                })
            });
            const data = await response.json();
            return { success: data.status === 'waiting', message: data.message };
            */

            return { success: true, message: 'SMS logic prepared' };
        } catch (error: any) {
            console.error('[smsService] Error:', error);
            return { success: false, message: error.message };
        }
    }
};
