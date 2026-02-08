/**
 * NAVBAT - HTTP Client
 * 
 * A robust HTTP client wrapper with:
 * - Automatic authentication token injection
 * - Request/response interceptors
 * - Retry logic with exponential backoff
 * - Centralized error handling
 * - Request timeout management
 */

import { config } from './config';

// ============================================================================
// TYPES
// ============================================================================

export interface HttpError {
    status: number;
    message: string;
    code: string;
    details?: Record<string, unknown>;
}

export interface HttpResponse<T> {
    data: T;
    status: number;
    headers: Headers;
    ok: boolean;
}

export interface RequestOptions extends RequestInit {
    timeout?: number;
    retries?: number;
    retryDelay?: number;
    skipAuth?: boolean;
}

// Error codes for client-side errors
export const ErrorCodes = {
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT: 'TIMEOUT',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
    UNKNOWN: 'UNKNOWN'
} as const;

export type ErrorCodeType = typeof ErrorCodes[keyof typeof ErrorCodes];

// ============================================================================
// TOKEN MANAGEMENT
// ============================================================================

class TokenManager {
    private token: string | null = null;

    constructor() {
        // Load token from storage on init
        this.token = localStorage.getItem(config.storage.AUTH_TOKEN);
    }

    getToken(): string | null {
        return this.token;
    }

    setToken(token: string): void {
        this.token = token;
        localStorage.setItem(config.storage.AUTH_TOKEN, token);
    }

    clearToken(): void {
        this.token = null;
        localStorage.removeItem(config.storage.AUTH_TOKEN);
    }

    hasToken(): boolean {
        return this.token !== null && this.token.length > 0;
    }
}

export const tokenManager = new TokenManager();

// ============================================================================
// HTTP CLIENT CLASS
// ============================================================================

class HttpClient {
    private baseUrl: string;
    private defaultTimeout: number;
    private defaultRetries: number = 3;
    private defaultRetryDelay: number = 1000;

    constructor() {
        this.baseUrl = config.api.baseUrl;
        this.defaultTimeout = config.api.timeout;
    }

    /**
     * Build headers with authentication and content type
     */
    private buildHeaders(customHeaders?: HeadersInit, skipAuth?: boolean): Headers {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...customHeaders
        });

        // Add auth token if available and not skipped
        if (!skipAuth && tokenManager.hasToken()) {
            headers.set('Authorization', `Bearer ${tokenManager.getToken()}`);
        }

        return headers;
    }

    /**
     * Create a timeout controller
     */
    private createTimeoutController(timeoutMs: number): { controller: AbortController; timeoutId: number } {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
        return { controller, timeoutId };
    }

    /**
     * Parse error response
     */
    private async parseError(response: Response): Promise<HttpError> {
        let message = 'An error occurred';
        let code: ErrorCodeType = ErrorCodes.UNKNOWN;
        let details: Record<string, unknown> | undefined;

        try {
            const body = await response.json();
            message = body.message || body.error || message;
            details = body.details || body.errors;
        } catch {
            message = response.statusText || message;
        }

        // Map status codes to error codes
        switch (response.status) {
            case 401:
                code = ErrorCodes.UNAUTHORIZED;
                // Clear token on 401
                tokenManager.clearToken();
                break;
            case 403:
                code = ErrorCodes.FORBIDDEN;
                break;
            case 404:
                code = ErrorCodes.NOT_FOUND;
                break;
            case 422:
                code = ErrorCodes.VALIDATION_ERROR;
                break;
            default:
                if (response.status >= 500) {
                    code = ErrorCodes.SERVER_ERROR;
                }
        }

        return { status: response.status, message, code, details };
    }

    /**
     * Sleep helper for retry delay
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Core request method with retry logic
     */
    async request<T>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<HttpResponse<T>> {
        const {
            timeout = this.defaultTimeout,
            retries = this.defaultRetries,
            retryDelay = this.defaultRetryDelay,
            skipAuth = false,
            headers: customHeaders,
            ...fetchOptions
        } = options;

        const url = endpoint.startsWith('http')
            ? endpoint
            : `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

        const headers = this.buildHeaders(customHeaders, skipAuth);

        let lastError: HttpError | null = null;

        for (let attempt = 0; attempt <= retries; attempt++) {
            const { controller, timeoutId } = this.createTimeoutController(timeout);

            try {
                if (config.features.enableDebugMode) {
                    console.log(`[HTTP] ${fetchOptions.method || 'GET'} ${url} (attempt ${attempt + 1})`);
                }

                const response = await fetch(url, {
                    ...fetchOptions,
                    headers,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const error = await this.parseError(response);

                    // Don't retry on client errors (4xx) except 429 (rate limit)
                    if (response.status < 500 && response.status !== 429) {
                        throw error;
                    }

                    lastError = error;

                    // Wait before retry with exponential backoff
                    if (attempt < retries) {
                        const delay = retryDelay * Math.pow(2, attempt);
                        await this.sleep(delay);
                        continue;
                    }

                    throw error;
                }

                const data = await response.json() as T;

                return {
                    data,
                    status: response.status,
                    headers: response.headers,
                    ok: true
                };

            } catch (error) {
                clearTimeout(timeoutId);

                // Handle abort (timeout)
                if (error instanceof DOMException && error.name === 'AbortError') {
                    lastError = {
                        status: 0,
                        message: 'Request timed out',
                        code: ErrorCodes.TIMEOUT
                    };

                    if (attempt < retries) {
                        await this.sleep(retryDelay);
                        continue;
                    }

                    throw lastError;
                }

                // Handle network errors
                if (error instanceof TypeError && error.message === 'Failed to fetch') {
                    lastError = {
                        status: 0,
                        message: 'Network error - please check your connection',
                        code: ErrorCodes.NETWORK_ERROR
                    };

                    if (attempt < retries) {
                        await this.sleep(retryDelay);
                        continue;
                    }

                    throw lastError;
                }

                // Re-throw HttpErrors
                if ((error as HttpError).code) {
                    throw error;
                }

                throw {
                    status: 0,
                    message: (error as Error).message || 'Unknown error',
                    code: ErrorCodes.UNKNOWN
                };
            }
        }

        throw lastError || {
            status: 0,
            message: 'Request failed after retries',
            code: ErrorCodes.UNKNOWN
        };
    }

    // ========================================================================
    // CONVENIENCE METHODS
    // ========================================================================

    async get<T>(endpoint: string, options?: RequestOptions): Promise<HttpResponse<T>> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<HttpResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined
        });
    }

    async put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<HttpResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined
        });
    }

    async patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<HttpResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined
        });
    }

    async delete<T>(endpoint: string, options?: RequestOptions): Promise<HttpResponse<T>> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const http = new HttpClient();
export default http;
