import { useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { api } from '../services/api';

export const usePushNotifications = (isAuthenticated: boolean, userId?: string) => {
    useEffect(() => {
        if (!isAuthenticated || !userId) return;
        if (!Capacitor.isNativePlatform()) return;

        const registerPush = async () => {
            try {
                let permStatus = await PushNotifications.checkPermissions();

                if (permStatus.receive === 'prompt') {
                    permStatus = await PushNotifications.requestPermissions();
                }

                if (permStatus.receive !== 'granted') {
                    console.log('User denied permissions!');
                    return;
                }

                await PushNotifications.register();

                PushNotifications.addListener('registration', (token) => {
                    console.info('My token: ' + token.value);
                    // Send token to backend to save in user profile
                    api.users.updateFcmToken(userId, token.value);
                });

                PushNotifications.addListener('registrationError', (error: any) => {
                    console.error('Error on registration: ' + JSON.stringify(error));
                });

                PushNotifications.addListener('pushNotificationReceived', (notification) => {
                    console.log('Push received: ' + JSON.stringify(notification));
                });

                PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
                    console.log('Push action performed: ' + JSON.stringify(notification));
                    // Handle deep links or navigation here
                });
            } catch (e) {
                console.error('Push notification setup failed', e);
            }
        };

        registerPush();

        return () => {
            if (Capacitor.isNativePlatform()) {
                PushNotifications.removeAllListeners();
            }
        };
    }, [isAuthenticated, userId]);
};
