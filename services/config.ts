/**
 * NAVBAT - Application Configuration
 * 
 * Centralized configuration management for the application.
 * Reads from environment variables with sensible defaults.
 */

// ============================================================================
// ENVIRONMENT DETECTION
// ============================================================================

export type Environment = 'development' | 'staging' | 'production';

export const getEnvironment = (): Environment => {
    const env = import.meta.env.MODE || 'development';
    if (env === 'production') return 'production';
    if (env === 'staging') return 'staging';
    return 'development';
};

// ============================================================================
// API CONFIGURATION
// ============================================================================

export interface ApiConfig {
    baseUrl: string;
    wsUrl: string;
    timeout: number;
    useMockApi: boolean;
    mockLatencyMs: number;
}

const getApiConfig = (): ApiConfig => {
    const env = getEnvironment();

    // Check for explicit environment variable overrides
    const envBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const envWsUrl = import.meta.env.VITE_WS_URL;
    const envUseMock = import.meta.env.VITE_USE_MOCK_API;

    // Default configurations per environment
    const configs: Record<Environment, ApiConfig> = {
        development: {
            baseUrl: envBaseUrl || '/api/v1',
            wsUrl: envWsUrl || (typeof window !== 'undefined' ? `ws://${window.location.host}/ws` : 'ws://localhost:3001/ws'),
            timeout: 30000,
            useMockApi: envUseMock !== 'false', // Default to true in dev
            mockLatencyMs: 300
        },
        staging: {
            baseUrl: envBaseUrl || 'https://staging-api.navbat.uz/v1',
            wsUrl: envWsUrl || 'wss://staging-api.navbat.uz/ws',
            timeout: 15000,
            useMockApi: false,
            mockLatencyMs: 0
        },
        production: {
            baseUrl: envBaseUrl || 'https://api.navbat.uz/v1',
            wsUrl: envWsUrl || 'wss://api.navbat.uz/ws',
            timeout: 10000,
            useMockApi: false,
            mockLatencyMs: 0
        }
    };

    return configs[env];
};

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export interface FeatureFlags {
    enableWebSocket: boolean;
    enableTelegramBot: boolean;
    enableSmsNotifications: boolean;
    enableVoiceAnnouncements: boolean;
    enableAnalytics: boolean;
    enableDebugMode: boolean;
}

const getFeatureFlags = (): FeatureFlags => {
    const env = getEnvironment();

    return {
        enableWebSocket: import.meta.env.VITE_ENABLE_WEBSOCKET !== 'false',
        enableTelegramBot: import.meta.env.VITE_ENABLE_TELEGRAM === 'true',
        enableSmsNotifications: import.meta.env.VITE_ENABLE_SMS === 'true',
        enableVoiceAnnouncements: import.meta.env.VITE_ENABLE_VOICE !== 'false',
        enableAnalytics: env === 'production',
        enableDebugMode: env === 'development'
    };
};

// ============================================================================
// AUTH CONFIGURATION
// ============================================================================

export interface AuthConfig {
    tokenStorageKey: string;
    tokenRefreshThresholdMs: number;
    sessionTimeoutMs: number;
}

const getAuthConfig = (): AuthConfig => ({
    tokenStorageKey: 'navbat_auth_token',
    tokenRefreshThresholdMs: 5 * 60 * 1000, // Refresh 5 min before expiry
    sessionTimeoutMs: 7 * 24 * 60 * 60 * 1000 // 7 days
});

// ============================================================================
// STORAGE KEYS
// ============================================================================

export const STORAGE_KEYS = {
    // Auth
    AUTH_TOKEN: 'navbat_auth_token',
    AUTH_SESSION: 'navbat_auth_session',
    AUTH_USER: 'navbat_auth_user',

    // Database (Mock)
    ORGANIZATIONS: 'navbat_db_orgs',
    QUEUES: 'navbat_active_queues',
    QUEUE_HISTORY: 'navbat_queue_history',
    EMPLOYEES: 'navbat_db_employees',

    // Client State
    FAVORITES: 'navbat_favorites',
    RECENT_ORGS: 'navbat_recent_orgs',
    CLIENT_SETTINGS: 'navbat_client_settings',

    // Solo State
    SOLO_STATE_PREFIX: 'navbat_solo_state_'
} as const;

// ============================================================================
// UNIFIED CONFIG EXPORT
// ============================================================================

export const config = {
    env: getEnvironment(),
    api: getApiConfig(),
    features: getFeatureFlags(),
    auth: getAuthConfig(),
    storage: STORAGE_KEYS,

    /** Check if we're in development mode */
    isDev: () => getEnvironment() === 'development',

    /** Check if we're in production mode */
    isProd: () => getEnvironment() === 'production',

    /** Get the full API URL for an endpoint */
    getApiUrl: (endpoint: string) => {
        const baseUrl = getApiConfig().baseUrl;
        return `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    }
};

export default config;
