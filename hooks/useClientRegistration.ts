import { useState } from 'react';
import api from '../services/api';

export const useClientRegistration = (onSuccess: (data: { name: string, phone: string, token: string }) => void) => {
    const [regStep, setRegStep] = useState<'INFO' | 'OTP'>('INFO');
    const [regName, setRegName] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regOtp, setRegOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitInfo = async () => {
        if (regName.trim().length > 2 && regPhone.length >= 7) {
            setIsLoading(true);
            setError(null);
            try {
                // Request OTP
                const response = await api.auth.requestOtp(regPhone);
                if (response.success) {
                    setRegStep('OTP');
                    return true;
                } else {
                    setError(response.message || 'Error sending OTP');
                    return false;
                }
            } catch (err) {
                setError('Network error');
                return false;
            } finally {
                setIsLoading(false);
            }
        }
        return false;
    };

    const handleVerifyOtp = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.auth.verifyOtp(regPhone, regOtp);
            if (response.success && response.data) {
                // Pass token back
                onSuccess({ name: regName, phone: regPhone, token: response.data.token });
                return true;
            } else {
                setError(response.message || 'Invalid code');
                return false;
            }
        } catch (err) {
            setError('Verification failed');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const resetRegistration = () => {
        setRegStep('INFO');
        setRegName('');
        setRegPhone('');
        setRegOtp('');
        setError(null);
    };

    return {
        regStep, setRegStep,
        regName, setRegName,
        regPhone, setRegPhone,
        regOtp, setRegOtp,
        isLoading,
        error,
        submitInfo,
        handleVerifyOtp,
        resetRegistration
    };
};
