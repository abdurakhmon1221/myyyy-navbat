/**
 * Haptic Feedback utility to provide physical feedback on mobile devices.
 */
export const haptics = {
    /**
     * Short light vibration for subtle interactions
     */
    light: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
    },

    /**
     * Medium vibration for significant interactions (e.g., success)
     */
    medium: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate(30);
        }
    },

    /**
     * Strong vibration for warnings or errors
     */
    heavy: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate([50, 30, 50]);
        }
    },

    /**
     * Double pulse for specific confirmations
     */
    success: () => {
        if ('vibrate' in navigator) {
            navigator.vibrate([15, 30, 15]);
        }
    }
};
