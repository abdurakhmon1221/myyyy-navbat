/**
 * NAVBAT - Authentication Service
 * 
 * Manages user authentication with:
 * - OTP-based phone verification
 * - JWT token management
 * - Session persistence
 * - Auto token refresh
 */

import { config } from './config';
import http, { tokenManager, HttpError, ErrorCodes } from './httpClient';

// ============================================================================
// TYPES
// ============================================================================

export interface User {
    id: string;
    phone: string;
    name: string;
    trustScore: number;
    telegramChatId?: string; // Telegram ID
    role?: 'CLIENT' | 'EMPLOYEE' | 'ADMIN' | 'COMPANY';
    organizationId?: string; // For employees/company owners
}

export interface AuthSession {
    user: User;
    token: string;
    expiresAt: number;
    issuedAt: number;
}

export interface OtpResponse {
    sent: boolean;
    expiresIn: number; // seconds until OTP expires
    maskedPhone: string; // e.g., "+998 ** *** 1234"
}

export interface LoginResponse {
    session: AuthSession;
    isNewUser: boolean;
}

// ============================================================================
// AUTH STATE
// ============================================================================

let currentSession: AuthSession | null = null;
let refreshTimer: number | null = null;

// Event emitter for auth state changes
type AuthListener = (session: AuthSession | null) => void;
const authListeners: Set<AuthListener> = new Set();

const notifyListeners = () => {
    authListeners.forEach(listener => listener(currentSession));
};

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Load session from storage
 */
const loadSession = (): AuthSession | null => {
    try {
        const stored = localStorage.getItem(config.storage.AUTH_SESSION);
        if (!stored) return null;

        const session = JSON.parse(stored) as AuthSession;

        // Check if session is expired
        if (session.expiresAt < Date.now()) {
            clearSession();
            return null;
        }

        return session;
    } catch {
        return null;
    }
};

/**
 * Save session to storage
 */
const saveSession = (session: AuthSession): void => {
    localStorage.setItem(config.storage.AUTH_SESSION, JSON.stringify(session));
    localStorage.setItem(config.storage.AUTH_USER, JSON.stringify(session.user));
    tokenManager.setToken(session.token);
};

/**
 * Clear session from storage
 */
const clearSession = (): void => {
    localStorage.removeItem(config.storage.AUTH_SESSION);
    localStorage.removeItem(config.storage.AUTH_USER);
    tokenManager.clearToken();
    currentSession = null;

    if (refreshTimer) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
    }
};

/**
 * Schedule token refresh before expiry
 */
const scheduleRefresh = (session: AuthSession): void => {
    if (refreshTimer) {
        clearTimeout(refreshTimer);
    }

    const timeUntilExpiry = session.expiresAt - Date.now();
    const refreshTime = timeUntilExpiry - config.auth.tokenRefreshThresholdMs;

    if (refreshTime > 0) {
        refreshTimer = window.setTimeout(async () => {
            try {
                await authService.refreshToken();
            } catch (error) {
                console.error('[Auth] Token refresh failed:', error);
                authService.logout();
            }
        }, refreshTime);
    }
};

// ============================================================================
// AUTH SERVICE
// ============================================================================

export const authService = {
    /**
     * Initialize auth service - load existing session
     */
    init(): AuthSession | null {
        currentSession = loadSession();
        if (currentSession) {
            scheduleRefresh(currentSession);
        }
        return currentSession;
    },

    /**
     * Subscribe to auth state changes
     */
    subscribe(listener: AuthListener): () => void {
        authListeners.add(listener);
        // Immediately notify with current state
        listener(currentSession);
        return () => authListeners.delete(listener);
    },

    /**
     * Get current session
     */
    getSession(): AuthSession | null {
        return currentSession;
    },

    /**
     * Get current user
     */
    getUser(): User | null {
        return currentSession?.user || null;
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return currentSession !== null && currentSession.expiresAt > Date.now();
    },

    /**
     * Request OTP for phone number
     */
    async requestOtp(phone: string): Promise<OtpResponse> {
        // In mock mode, simulate OTP
        if (config.api.useMockApi) {
            console.log(`[Auth] Mock OTP sent to ${phone}: 12345`);
            await new Promise(resolve => setTimeout(resolve, config.api.mockLatencyMs));
            return {
                sent: true,
                expiresIn: 120,
                maskedPhone: phone.replace(/(.{3})(.*)(.{4})/, '$1 ** *** $3')
            };
        }

        const response = await http.post<{ data: OtpResponse }>('/auth/request-otp', {
            phone
        }, { skipAuth: true });

        return response.data.data;
    },

    /**
     * Verify OTP and login
     */
    async verifyOtp(phone: string, otp: string): Promise<LoginResponse> {
        // In mock mode, simulate login
        if (config.api.useMockApi) {
            await new Promise(resolve => setTimeout(resolve, config.api.mockLatencyMs));

            if (otp !== '12345') {
                const error: HttpError = {
                    status: 401,
                    message: 'Noto\'g\'ri kod kiritildi',
                    code: ErrorCodes.UNAUTHORIZED
                };
                throw error;
            }

            const now = Date.now();
            const session: AuthSession = {
                user: {
                    id: `U${phone.replace(/\D/g, '')}`,
                    phone,
                    name: 'Foydalanuvchi',
                    trustScore: 36.5,
                    role: 'CLIENT'
                },
                token: `mock_token_${now}`,
                expiresAt: now + config.auth.sessionTimeoutMs,
                issuedAt: now
            };

            currentSession = session;
            saveSession(session);
            scheduleRefresh(session);
            notifyListeners();

            return { session, isNewUser: false };
        }

        const response = await http.post<{ data: LoginResponse }>('/auth/verify-otp', {
            phone,
            otp
        }, { skipAuth: true });

        const { session, isNewUser } = response.data.data;

        currentSession = session;
        saveSession(session);
        scheduleRefresh(session);
        notifyListeners();

        return { session, isNewUser };
    },

    /**
     * Refresh authentication token
     */
    async refreshToken(): Promise<AuthSession> {
        if (!currentSession) {
            throw new Error('No session to refresh');
        }

        // In mock mode, just extend the session
        if (config.api.useMockApi) {
            const now = Date.now();
            const refreshedSession: AuthSession = {
                ...currentSession,
                token: `mock_token_${now}`,
                expiresAt: now + config.auth.sessionTimeoutMs,
                issuedAt: now
            };

            currentSession = refreshedSession;
            saveSession(refreshedSession);
            scheduleRefresh(refreshedSession);
            notifyListeners();

            return refreshedSession;
        }

        const response = await http.post<{ data: AuthSession }>('/auth/refresh');
        const session = response.data.data;

        currentSession = session;
        saveSession(session);
        scheduleRefresh(session);
        notifyListeners();

        return session;
    },

    /**
     * Update user profile
     */
    async updateProfile(updates: Partial<Pick<User, 'name'>>): Promise<User> {
        if (!currentSession) {
            throw new Error('Not authenticated');
        }

        // In mock mode, update locally
        if (config.api.useMockApi) {
            const updatedUser = { ...currentSession.user, ...updates };
            currentSession = { ...currentSession, user: updatedUser };
            saveSession(currentSession);
            notifyListeners();
            return updatedUser;
        }

        const response = await http.patch<{ data: User }>('/auth/profile', updates);
        const user = response.data.data;

        currentSession = { ...currentSession, user };
        saveSession(currentSession);
        notifyListeners();

        return user;
    },

    /**
     * Logout and clear session
     */
    logout(): void {
        clearSession();
        notifyListeners();
    },

    /**
     * Get formatted phone for display
     */
    formatPhone(phone: string): string {
        // Format: +998 (XX) XXX-XX-XX
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 12) {
            return `+${cleaned.slice(0, 3)} (${cleaned.slice(3, 5)}) ${cleaned.slice(5, 8)}-${cleaned.slice(8, 10)}-${cleaned.slice(10)}`;
        }
        return phone;
    }
};

// Initialize on import
authService.init();

export default authService;
