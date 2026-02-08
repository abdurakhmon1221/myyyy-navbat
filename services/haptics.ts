/**
 * Haptic Feedback utility to provide physical feedback on mobile devices.
 */
export const haptics = {
    light: () => {
        if ('vibrate' in navigator) navigator.vibrate(10);
    },
    medium: () => {
        if ('vibrate' in navigator) navigator.vibrate(30);
    },
    heavy: () => {
        if ('vibrate' in navigator) navigator.vibrate(60);
    },
    success: () => {
        if ('vibrate' in navigator) navigator.vibrate([20, 30, 40]);
    },
    error: () => {
        if ('vibrate' in navigator) navigator.vibrate([50, 50, 50, 50, 50]);
    },
    warning: () => {
        if ('vibrate' in navigator) navigator.vibrate([30, 100, 30]);
    },
    calling: () => {
        // Heartbeat-like pattern for when being called to a desk
        if ('vibrate' in navigator) navigator.vibrate([100, 50, 100, 50, 100]);
    }
};
