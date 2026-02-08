
/**
 * Browser Notification Service for NAVBAT
 */

export const notificationService = {
    async requestPermission() {
        if (!('Notification' in window)) return false;
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    },

    async sendNotification(title: string, body: string, icon = '/logo.png') {
        if (!('Notification' in window)) return;
        if (Notification.permission === 'granted') {
            try {
                // If supported by browser
                const registration = await navigator.serviceWorker.ready;
                registration.showNotification(title, {
                    body,
                    icon,
                    badge: icon,
                    tag: 'navbat-update'
                } as NotificationOptions);
            } catch (e) {
                // Fallback to simple notification if SW fails
                new Notification(title, { body, icon });
            }
        }
    }
};
