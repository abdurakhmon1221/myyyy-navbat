import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const EMAIL = process.env.ESKIZ_EMAIL || 'test@eskiz.uz';
const PASSWORD = process.env.ESKIZ_PASSWORD || 'secret';
let TOKEN: string | null = null;

const api = axios.create({
    baseURL: 'https://notify.eskiz.uz/api',
    timeout: 10000,
});

const authenticate = async () => {
    try {
        const res = await api.post('/auth/login', {
            email: EMAIL,
            password: PASSWORD,
        });
        if (res.data?.data?.token) {
            TOKEN = res.data.data.token;
            console.log('Eskiz Token acquired');
        }
    } catch (error) {
        console.error('Auth failed', error);
    }
};

export const sendSms = async (phone: string, message: string) => {
    if (!TOKEN) await authenticate();

    const cleanPhone = phone.replace(/\D/g, ''); // 998901234567

    try {
        const res = await api.post(
            '/message/sms/send',
            {
                mobile_phone: cleanPhone,
                message: message,
                from: '4546', // Default sender ID
                callback_url: '',
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        );
        return res.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            await authenticate();
            // Retry once
            try {
                const res = await api.post(
                    '/message/sms/send',
                    {
                        mobile_phone: cleanPhone,
                        message: message,
                        from: '4546',
                        callback_url: '',
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${TOKEN}`,
                        },
                    }
                );
                return res.data;
            } catch (retryError) {
                console.error('Sms send retry failed', retryError);
                throw retryError;
            }
        }
        console.error('Sms send failed', error);
        throw error;
    }
};
