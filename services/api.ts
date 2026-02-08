/**
 * NAVBAT API Client
 * 
 * Unified API layer that seamlessly switches between mock and real backend.
 * Uses the new HTTP client for real calls with proper auth and error handling.
 * 
 * To switch to real backend:
 * 1. Set VITE_USE_MOCK_API=false in .env
 * 2. Configure VITE_API_BASE_URL with your backend URL
 */

import { Organization, QueueItem, Employee, Service } from '../types';
import { config, STORAGE_KEYS } from './config';
import http from './httpClient';

// ============================================================================
// RESPONSE TYPES
// ============================================================================

/** Standard API response wrapper */
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
    timestamp: number;
}

/** Paginated response for lists */
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

/** Queue join request payload */
export interface JoinQueueRequest {
    organizationId: string;
    serviceId: string;
    userPhone: string;
    userName?: string;
    appointmentTime?: number;
}

/** Auth request/response types */
export interface AuthRequest {
    phone: string;
    otp?: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        phone: string;
        name: string;
        trustScore: number;
    };
    expiresAt: number;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/** Simulates network latency for mock API calls */
const simulateLatency = <T>(data: T): Promise<T> => {
    if (config.api.mockLatencyMs === 0) {
        return Promise.resolve(data);
    }
    return new Promise(resolve => {
        setTimeout(() => resolve(data), config.api.mockLatencyMs);
    });
};

/** Creates a standard success response */
const successResponse = <T>(data: T, message?: string): ApiResponse<T> => ({
    success: true,
    data,
    message,
    timestamp: Date.now()
});

/** Creates a standard error response */
const errorResponse = <T>(error: string, data: T): ApiResponse<T> => ({
    success: false,
    data,
    error,
    timestamp: Date.now()
});

// ============================================================================
// ORGANIZATION API
// ============================================================================

export const organizationApi = {
    /** Get all organizations with optional filtering */
    async getAll(params?: {
        category?: string;
        search?: string;
        page?: number;
        limit?: number
    }): Promise<ApiResponse<PaginatedResponse<Organization>>> {
        if (config.api.useMockApi) {
            const stored = localStorage.getItem(STORAGE_KEYS.ORGANIZATIONS);
            let orgs: Organization[] = stored ? JSON.parse(stored) : [];

            // Apply filters
            if (params?.category && params.category !== 'ALL') {
                orgs = orgs.filter(o => o.category === params.category);
            }
            if (params?.search) {
                const q = params.search.toLowerCase();
                orgs = orgs.filter(o =>
                    o.name.toLowerCase().includes(q) ||
                    o.address.toLowerCase().includes(q)
                );
            }

            // Pagination
            const page = params?.page || 1;
            const limit = params?.limit || 20;
            const start = (page - 1) * limit;
            const paged = orgs.slice(start, start + limit);

            return simulateLatency(successResponse({
                items: paged,
                total: orgs.length,
                page,
                pageSize: limit,
                hasMore: start + limit < orgs.length
            }));
        }

        // Real API call
        try {
            const queryParams = new URLSearchParams();
            if (params?.category) queryParams.set('category', params.category);
            if (params?.search) queryParams.set('search', params.search);
            if (params?.page) queryParams.set('page', params.page.toString());
            if (params?.limit) queryParams.set('limit', params.limit.toString());

            const response = await http.get<ApiResponse<PaginatedResponse<Organization>>>(
                `/organizations?${queryParams.toString()}`
            );
            return response.data;
        } catch (error) {
            console.error('[API] getAll organizations failed:', error);
            return errorResponse('Failed to fetch organizations', {
                items: [],
                total: 0,
                page: 1,
                pageSize: 20,
                hasMore: false
            });
        }
    },

    /** Get single organization by ID */
    async getById(id: string): Promise<ApiResponse<Organization | null>> {
        if (config.api.useMockApi) {
            const stored = localStorage.getItem(STORAGE_KEYS.ORGANIZATIONS);
            const orgs: Organization[] = stored ? JSON.parse(stored) : [];
            const org = orgs.find(o => o.id === id) || null;
            return simulateLatency(successResponse(org));
        }

        try {
            const response = await http.get<ApiResponse<Organization>>(`/organizations/${id}`);
            return response.data;
        } catch (error) {
            console.error('[API] getById organization failed:', error);
            return errorResponse('Organization not found', null);
        }
    },

    /** Create or update organization */
    async save(org: Organization): Promise<ApiResponse<Organization>> {
        if (config.api.useMockApi) {
            const stored = localStorage.getItem(STORAGE_KEYS.ORGANIZATIONS);
            const orgs: Organization[] = stored ? JSON.parse(stored) : [];
            const index = orgs.findIndex(o => o.id === org.id);

            if (index >= 0) {
                orgs[index] = org;
            } else {
                orgs.push(org);
            }

            localStorage.setItem(STORAGE_KEYS.ORGANIZATIONS, JSON.stringify(orgs));
            window.dispatchEvent(new Event('navbat_db_change'));

            return simulateLatency(successResponse(org, 'Organization saved'));
        }

        try {
            const response = await http.post<ApiResponse<Organization>>('/organizations', org);
            return response.data;
        } catch (error) {
            console.error('[API] save organization failed:', error);
            return errorResponse('Failed to save organization', org);
        }
    },

    /** Delete organization */
    async delete(id: string): Promise<ApiResponse<boolean>> {
        if (config.api.useMockApi) {
            const stored = localStorage.getItem(STORAGE_KEYS.ORGANIZATIONS);
            const orgs: Organization[] = stored ? JSON.parse(stored) : [];
            const filtered = orgs.filter(o => o.id !== id);
            localStorage.setItem(STORAGE_KEYS.ORGANIZATIONS, JSON.stringify(filtered));
            window.dispatchEvent(new Event('navbat_db_change'));
            return simulateLatency(successResponse(true, 'Organization deleted'));
        }

        try {
            const response = await http.delete<ApiResponse<boolean>>(`/organizations/${id}`);
            return response.data;
        } catch (error) {
            console.error('[API] delete organization failed:', error);
            return errorResponse('Failed to delete organization', false);
        }
    }
};

// ============================================================================
// QUEUE API
// ============================================================================

export const queueApi = {
    /** Join a queue */
    async join(request: JoinQueueRequest): Promise<ApiResponse<QueueItem>> {
        if (config.api.useMockApi) {
            const stored = localStorage.getItem(STORAGE_KEYS.QUEUES);
            const queues: QueueItem[] = stored ? JSON.parse(stored) : [];

            // Check for existing queue at same org
            const existing = queues.find(
                q => q.userPhone === request.userPhone &&
                    q.organizationId === request.organizationId &&
                    q.status === 'WAITING'
            );
            if (existing) {
                return simulateLatency(errorResponse('Already in queue at this organization', existing));
            }

            // Create new queue item
            const orgQueues = queues.filter(q => q.organizationId === request.organizationId && q.status === 'WAITING');
            const newQueue: QueueItem = {
                id: `Q${Date.now()}`,
                userId: `U${request.userPhone}`,
                userPhone: request.userPhone,
                organizationId: request.organizationId,
                serviceId: request.serviceId,
                position: orgQueues.length + 1,
                number: `${request.appointmentTime ? 'B' : 'A'}${String(orgQueues.length + 1).padStart(3, '0')}`,
                status: 'WAITING',
                entryTime: Date.now(),
                estimatedStartTime: Date.now() + (orgQueues.length * 10 * 60 * 1000),
                appointmentTime: request.appointmentTime,
                logs: [{
                    timestamp: Date.now(),
                    action: 'JOINED',
                    actorId: request.userPhone
                }]
            };

            queues.push(newQueue);
            localStorage.setItem(STORAGE_KEYS.QUEUES, JSON.stringify(queues));
            window.dispatchEvent(new Event('navbat_queue_change'));

            return simulateLatency(successResponse(newQueue, 'Successfully joined queue'));
        }

        try {
            const response = await http.post<ApiResponse<QueueItem>>('/queues/join', request);
            return response.data;
        } catch (error) {
            console.error('[API] join queue failed:', error);
            return errorResponse('Failed to join queue', {} as QueueItem);
        }
    },

    /** Get user's active queues */
    async getMyQueues(userPhone: string): Promise<ApiResponse<QueueItem[]>> {
        if (config.api.useMockApi) {
            const stored = localStorage.getItem(STORAGE_KEYS.QUEUES);
            const queues: QueueItem[] = stored ? JSON.parse(stored) : [];
            const myQueues = queues.filter(q => q.userPhone === userPhone && q.status === 'WAITING');
            return simulateLatency(successResponse(myQueues));
        }

        try {
            const response = await http.get<ApiResponse<QueueItem[]>>(`/queues/my?phone=${encodeURIComponent(userPhone)}`);
            return response.data;
        } catch (error) {
            console.error('[API] getMyQueues failed:', error);
            return errorResponse('Failed to fetch queues', []);
        }
    },

    /** Cancel a queue */
    async cancel(queueId: string, reason?: string): Promise<ApiResponse<QueueItem>> {
        if (config.api.useMockApi) {
            const stored = localStorage.getItem(STORAGE_KEYS.QUEUES);
            const queues: QueueItem[] = stored ? JSON.parse(stored) : [];
            const index = queues.findIndex(q => q.id === queueId);

            if (index < 0) {
                return simulateLatency(errorResponse('Queue not found', {} as QueueItem));
            }

            const queue = queues[index];
            queue.status = 'CANCELLED';
            queue.logs.push({
                timestamp: Date.now(),
                action: 'CANCELLED',
                actorId: queue.userPhone,
                reason
            });

            // Move to history
            const historyStored = localStorage.getItem(STORAGE_KEYS.QUEUE_HISTORY);
            const history: QueueItem[] = historyStored ? JSON.parse(historyStored) : [];
            history.unshift(queue);
            localStorage.setItem(STORAGE_KEYS.QUEUE_HISTORY, JSON.stringify(history.slice(0, 50)));

            // Remove from active
            queues.splice(index, 1);
            localStorage.setItem(STORAGE_KEYS.QUEUES, JSON.stringify(queues));
            window.dispatchEvent(new Event('navbat_queue_change'));

            return simulateLatency(successResponse(queue, 'Queue cancelled'));
        }

        try {
            const response = await http.post<ApiResponse<QueueItem>>(`/queues/${queueId}/cancel`, { reason });
            return response.data;
        } catch (error) {
            console.error('[API] cancel queue failed:', error);
            return errorResponse('Failed to cancel queue', {} as QueueItem);
        }
    },

    /** Update queue status (for staff) */
    async updateStatus(
        queueId: string,
        status: QueueItem['status'],
        actorId: string
    ): Promise<ApiResponse<QueueItem>> {
        if (config.api.useMockApi) {
            const stored = localStorage.getItem(STORAGE_KEYS.QUEUES);
            const queues: QueueItem[] = stored ? JSON.parse(stored) : [];
            const index = queues.findIndex(q => q.id === queueId);

            if (index < 0) {
                return simulateLatency(errorResponse('Queue not found', {} as QueueItem));
            }

            queues[index].status = status;
            queues[index].logs.push({
                timestamp: Date.now(),
                action: `STATUS_CHANGED_TO_${status}`,
                actorId
            });

            localStorage.setItem(STORAGE_KEYS.QUEUES, JSON.stringify(queues));
            window.dispatchEvent(new Event('navbat_queue_change'));

            return simulateLatency(successResponse(queues[index]));
        }

        try {
            const response = await http.patch<ApiResponse<QueueItem>>(`/queues/${queueId}/status`, {
                status,
                actorId
            });
            return response.data;
        } catch (error) {
            console.error('[API] updateStatus failed:', error);
            return errorResponse('Failed to update queue status', {} as QueueItem);
        }
    },

    /** Get queue for an organization (staff view) */
    async getOrgQueue(orgId: string): Promise<ApiResponse<QueueItem[]>> {
        if (config.api.useMockApi) {
            const stored = localStorage.getItem(STORAGE_KEYS.QUEUES);
            const queues: QueueItem[] = stored ? JSON.parse(stored) : [];
            const orgQueues = queues
                .filter(q => q.organizationId === orgId && q.status === 'WAITING')
                .sort((a, b) => a.position - b.position);
            return simulateLatency(successResponse(orgQueues));
        }

        try {
            const response = await http.get<ApiResponse<QueueItem[]>>(`/organizations/${orgId}/queue`);
            return response.data;
        } catch (error) {
            console.error('[API] getOrgQueue failed:', error);
            return errorResponse('Failed to fetch organization queue', []);
        }
    },

    /** Call next customer (for staff) */
    async callNext(orgId: string, employeeId: string): Promise<ApiResponse<QueueItem | null>> {
        if (config.api.useMockApi) {
            const stored = localStorage.getItem(STORAGE_KEYS.QUEUES);
            const queues: QueueItem[] = stored ? JSON.parse(stored) : [];

            const nextInLine = queues
                .filter(q => q.organizationId === orgId && q.status === 'WAITING')
                .sort((a, b) => a.position - b.position)[0];

            if (!nextInLine) {
                return simulateLatency(successResponse(null, 'No customers in queue'));
            }

            nextInLine.status = 'CALLED';
            nextInLine.logs.push({
                timestamp: Date.now(),
                action: 'CALLED',
                actorId: employeeId
            });

            localStorage.setItem(STORAGE_KEYS.QUEUES, JSON.stringify(queues));
            window.dispatchEvent(new Event('navbat_queue_change'));

            return simulateLatency(successResponse(nextInLine, 'Customer called'));
        }

        try {
            const response = await http.post<ApiResponse<QueueItem | null>>(`/organizations/${orgId}/queue/call-next`, {
                employeeId
            });
            return response.data;
        } catch (error) {
            console.error('[API] callNext failed:', error);
            return errorResponse('Failed to call next customer', null);
        }
    },

    /** Mark customer as served (for staff) */
    async markServed(queueId: string, employeeId: string, notes?: string): Promise<ApiResponse<QueueItem>> {
        if (config.api.useMockApi) {
            const stored = localStorage.getItem(STORAGE_KEYS.QUEUES);
            const queues: QueueItem[] = stored ? JSON.parse(stored) : [];
            const index = queues.findIndex(q => q.id === queueId);

            if (index < 0) {
                return simulateLatency(errorResponse('Queue not found', {} as QueueItem));
            }

            const queue = queues[index];
            queue.status = 'SERVED';
            queue.logs.push({
                timestamp: Date.now(),
                action: 'SERVED',
                actorId: employeeId,
                reason: notes
            });

            // Move to history
            const historyStored = localStorage.getItem(STORAGE_KEYS.QUEUE_HISTORY);
            const history: QueueItem[] = historyStored ? JSON.parse(historyStored) : [];
            history.unshift(queue);
            localStorage.setItem(STORAGE_KEYS.QUEUE_HISTORY, JSON.stringify(history.slice(0, 100)));

            // Remove from active
            queues.splice(index, 1);

            // Recalculate positions for remaining queue
            queues
                .filter(q => q.organizationId === queue.organizationId && q.status === 'WAITING')
                .sort((a, b) => a.position - b.position)
                .forEach((q, i) => {
                    q.position = i + 1;
                });

            localStorage.setItem(STORAGE_KEYS.QUEUES, JSON.stringify(queues));
            window.dispatchEvent(new Event('navbat_queue_change'));

            return simulateLatency(successResponse(queue, 'Customer served'));
        }

        try {
            const response = await http.post<ApiResponse<QueueItem>>(`/queues/${queueId}/serve`, {
                employeeId,
                notes
            });
            return response.data;
        } catch (error) {
            console.error('[API] markServed failed:', error);
            return errorResponse('Failed to mark as served', {} as QueueItem);
        }
    },

    /** Skip customer (for staff) */
    async skipCustomer(queueId: string, employeeId: string, reason: string): Promise<ApiResponse<QueueItem>> {
        if (config.api.useMockApi) {
            const stored = localStorage.getItem(STORAGE_KEYS.QUEUES);
            const queues: QueueItem[] = stored ? JSON.parse(stored) : [];
            const index = queues.findIndex(q => q.id === queueId);

            if (index < 0) {
                return simulateLatency(errorResponse('Queue not found', {} as QueueItem));
            }

            const queue = queues[index];
            queue.status = 'SKIPPED';
            queue.logs.push({
                timestamp: Date.now(),
                action: 'SKIPPED',
                actorId: employeeId,
                reason
            });

            // Move to history
            const historyStored = localStorage.getItem(STORAGE_KEYS.QUEUE_HISTORY);
            const history: QueueItem[] = historyStored ? JSON.parse(historyStored) : [];
            history.unshift(queue);
            localStorage.setItem(STORAGE_KEYS.QUEUE_HISTORY, JSON.stringify(history.slice(0, 100)));

            // Remove from active
            queues.splice(index, 1);

            // Recalculate positions
            queues
                .filter(q => q.organizationId === queue.organizationId && q.status === 'WAITING')
                .sort((a, b) => a.position - b.position)
                .forEach((q, i) => {
                    q.position = i + 1;
                });

            localStorage.setItem(STORAGE_KEYS.QUEUES, JSON.stringify(queues));
            window.dispatchEvent(new Event('navbat_queue_change'));

            return simulateLatency(successResponse(queue, 'Customer skipped'));
        }

        try {
            const response = await http.post<ApiResponse<QueueItem>>(`/queues/${queueId}/skip`, {
                employeeId,
                reason
            });
            return response.data;
        } catch (error) {
            console.error('[API] skipCustomer failed:', error);
            return errorResponse('Failed to skip customer', {} as QueueItem);
        }
    }
};

// ============================================================================
// AUTH API (Legacy - use authService.ts instead)
// ============================================================================

export const authApi = {
    /** Request OTP */
    async requestOtp(phone: string): Promise<ApiResponse<{ sent: boolean }>> {
        if (config.api.useMockApi) {
            console.log(`[MockAPI] OTP sent to ${phone}: 12345`);
            return simulateLatency(successResponse({ sent: true }, 'OTP sent'));
        }

        try {
            const response = await http.post<ApiResponse<{ sent: boolean }>>('/auth/request-otp', {
                phone
            }, { skipAuth: true });
            return response.data;
        } catch (error) {
            console.error('[API] requestOtp failed:', error);
            return errorResponse('Failed to send OTP', { sent: false });
        }
    },

    /** Verify OTP and login */
    async verifyOtp(phone: string, otp: string): Promise<ApiResponse<AuthResponse | null>> {
        if (config.api.useMockApi) {
            if (otp === '12345') {
                const authData: AuthResponse = {
                    token: `mock_token_${Date.now()}`,
                    user: {
                        id: `U${phone}`,
                        phone,
                        name: 'Foydalanuvchi',
                        trustScore: 36.5
                    },
                    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
                };
                return simulateLatency(successResponse(authData, 'Login successful'));
            }
            return simulateLatency(errorResponse('Invalid OTP', null));
        }

        try {
            const response = await http.post<ApiResponse<AuthResponse>>('/auth/verify-otp', {
                phone,
                otp
            }, { skipAuth: true });
            return response.data;
        } catch (error) {
            console.error('[API] verifyOtp failed:', error);
            return errorResponse('Failed to verify OTP', null);
        }
    }
};

// ============================================================================
// EMPLOYEE API
// ============================================================================

export const employeeApi = {
    /** Get employees for an organization */
    async getByOrganization(orgId: string): Promise<ApiResponse<Employee[]>> {
        if (config.api.useMockApi) {
            const stored = localStorage.getItem(STORAGE_KEYS.ORGANIZATIONS);
            const orgs: Organization[] = stored ? JSON.parse(stored) : [];
            const org = orgs.find(o => o.id === orgId);
            return simulateLatency(successResponse(org?.employees || []));
        }

        try {
            const response = await http.get<ApiResponse<Employee[]>>(`/organizations/${orgId}/employees`);
            return response.data;
        } catch (error) {
            console.error('[API] getByOrganization employees failed:', error);
            return errorResponse('Failed to fetch employees', []);
        }
    },

    /** Update employee status */
    async updateStatus(orgId: string, employeeId: string, status: Employee['status']): Promise<ApiResponse<Employee>> {
        if (config.api.useMockApi) {
            const stored = localStorage.getItem(STORAGE_KEYS.ORGANIZATIONS);
            const orgs: Organization[] = stored ? JSON.parse(stored) : [];
            const org = orgs.find(o => o.id === orgId);

            if (!org || !org.employees) {
                return simulateLatency(errorResponse('Employee not found', {} as Employee));
            }

            const employee = org.employees.find(e => e.id === employeeId);
            if (!employee) {
                return simulateLatency(errorResponse('Employee not found', {} as Employee));
            }

            employee.status = status;
            localStorage.setItem(STORAGE_KEYS.ORGANIZATIONS, JSON.stringify(orgs));
            window.dispatchEvent(new Event('navbat_db_change'));

            return simulateLatency(successResponse(employee));
        }

        try {
            const response = await http.patch<ApiResponse<Employee>>(`/organizations/${orgId}/employees/${employeeId}/status`, {
                status
            });
            return response.data;
        } catch (error) {
            console.error('[API] updateStatus employee failed:', error);
            return errorResponse('Failed to update employee status', {} as Employee);
        }
    }
};

// ============================================================================
// SERVICES API
// ============================================================================

export const servicesApi = {
    /** Get services for an organization */
    async getByOrganization(orgId: string): Promise<ApiResponse<Service[]>> {
        if (config.api.useMockApi) {
            const stored = localStorage.getItem(STORAGE_KEYS.ORGANIZATIONS);
            const orgs: Organization[] = stored ? JSON.parse(stored) : [];
            const org = orgs.find(o => o.id === orgId);
            return simulateLatency(successResponse(org?.services || []));
        }

        try {
            const response = await http.get<ApiResponse<Service[]>>(`/organizations/${orgId}/services`);
            return response.data;
        } catch (error) {
            console.error('[API] getByOrganization services failed:', error);
            return errorResponse('Failed to fetch services', []);
        }
    }
};

// ============================================================================
// EXPORT UNIFIED CLIENT
// ============================================================================

export const api = {
    organizations: organizationApi,
    queues: queueApi,
    auth: authApi,
    employees: employeeApi,
    services: servicesApi
};

export default api;
