/**
 * Employee Service for NAVBAT
 * Handles employee CRUD operations and invite logic
 */

import { Employee } from '../types';
import { smsService } from './smsService';

// Local storage key for employees
const EMPLOYEES_STORAGE_KEY = 'navbat_employees';
const INVITES_STORAGE_KEY = 'navbat_employee_invites';

export interface EmployeeInvite {
    id: string;
    phone: string;
    name: string;
    role: string;
    organizationId: string;
    organizationName: string;
    inviteCode: string;
    status: 'PENDING' | 'ACCEPTED' | 'EXPIRED';
    createdAt: number;
    expiresAt: number;
}

// Generate random invite code
const generateInviteCode = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Generate random password for new employee
const generateTempPassword = (): string => {
    return Math.random().toString(36).substring(2, 10);
};

export const employeeService = {
    /**
     * Get all employees for an organization
     */
    getByOrganization(orgId: string): Employee[] {
        const stored = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
        if (!stored) return [];
        const all: Employee[] = JSON.parse(stored);
        return all.filter(e => e.organizationId === orgId);
    },

    /**
     * Get all pending invites for an organization
     */
    getPendingInvites(orgId: string): EmployeeInvite[] {
        const stored = localStorage.getItem(INVITES_STORAGE_KEY);
        if (!stored) return [];
        const all: EmployeeInvite[] = JSON.parse(stored);
        return all.filter(i => i.organizationId === orgId && i.status === 'PENDING');
    },

    /**
     * Create and send employee invite
     */
    async inviteEmployee(data: {
        name: string;
        phone: string;
        role: string;
        organizationId: string;
        organizationName: string;
    }): Promise<{ success: boolean; message: string; invite?: EmployeeInvite }> {
        // Normalize phone number
        const normalizedPhone = data.phone.replace(/\D/g, '');

        // Check if already invited or exists
        const existingInvites = this.getPendingInvites(data.organizationId);
        if (existingInvites.some(i => i.phone === normalizedPhone)) {
            return { success: false, message: "Bu telefon raqamga allaqachon taklif yuborilgan" };
        }

        // Generate invite code and temp password
        const inviteCode = generateInviteCode();
        const tempPassword = generateTempPassword();

        // Create invite record
        const invite: EmployeeInvite = {
            id: 'inv-' + Date.now(),
            phone: normalizedPhone,
            name: data.name,
            role: data.role,
            organizationId: data.organizationId,
            organizationName: data.organizationName,
            inviteCode,
            status: 'PENDING',
            createdAt: Date.now(),
            expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
        };

        // Save invite
        const stored = localStorage.getItem(INVITES_STORAGE_KEY);
        const invites: EmployeeInvite[] = stored ? JSON.parse(stored) : [];
        invites.push(invite);
        localStorage.setItem(INVITES_STORAGE_KEY, JSON.stringify(invites));

        // Send SMS with invite details
        const smsMessage = `NAVBAT: ${data.organizationName} sizni xodim sifatida taklif qilmoqda.\n\nKirish kodi: ${inviteCode}\nVaqtincha parol: ${tempPassword}\n\nIlovaga kiring: navbat.uz/employee`;

        const smsResult = await smsService.sendCustomSMS(normalizedPhone, smsMessage);

        if (!smsResult.success) {
            // Remove invite if SMS failed
            const updatedInvites = invites.filter(i => i.id !== invite.id);
            localStorage.setItem(INVITES_STORAGE_KEY, JSON.stringify(updatedInvites));
            return { success: false, message: `SMS yuborib bo'lmadi: ${smsResult.message}` };
        }

        // Save temp password association (for demo)
        localStorage.setItem(`navbat_emp_temp_${normalizedPhone}`, JSON.stringify({
            password: tempPassword,
            inviteCode,
            organizationId: data.organizationId
        }));

        return {
            success: true,
            message: `Taklif ${data.phone} raqamiga yuborildi`,
            invite
        };
    },

    /**
     * Verify invite code and accept
     */
    async acceptInvite(phone: string, inviteCode: string, newPassword: string): Promise<{ success: boolean; message: string; employee?: Employee }> {
        const normalizedPhone = phone.replace(/\D/g, '');

        // Find invite
        const stored = localStorage.getItem(INVITES_STORAGE_KEY);
        if (!stored) return { success: false, message: "Taklif topilmadi" };

        const invites: EmployeeInvite[] = JSON.parse(stored);
        const invite = invites.find(i =>
            i.phone === normalizedPhone &&
            i.inviteCode === inviteCode.toUpperCase() &&
            i.status === 'PENDING'
        );

        if (!invite) {
            return { success: false, message: "Noto'g'ri kod yoki taklif muddati tugagan" };
        }

        if (Date.now() > invite.expiresAt) {
            // Update invite status
            invite.status = 'EXPIRED';
            localStorage.setItem(INVITES_STORAGE_KEY, JSON.stringify(invites));
            return { success: false, message: "Taklif muddati tugagan" };
        }

        // Create employee
        const employee: Employee = {
            id: 'emp-' + Date.now(),
            name: invite.name,
            role: invite.role,
            organizationId: invite.organizationId,
            status: 'OFFLINE',
            imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(invite.name)}&background=random`,
            assignedServiceIds: [],
            earnedBadges: [],
            performance: { servedCount: 0, rating: 5, avgWaitTime: 0 }
        };

        // Save employee
        const empStored = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
        const employees: Employee[] = empStored ? JSON.parse(empStored) : [];
        employees.push(employee);
        localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));

        // Update invite status
        invite.status = 'ACCEPTED';
        localStorage.setItem(INVITES_STORAGE_KEY, JSON.stringify(invites));

        // Save employee credentials
        localStorage.setItem(`navbat_emp_cred_${normalizedPhone}`, JSON.stringify({
            employeeId: employee.id,
            organizationId: invite.organizationId,
            passwordHash: btoa(newPassword) // Simple encoding for demo
        }));

        return { success: true, message: "Muvaffaqiyatli ro'yxatdan o'tdingiz!", employee };
    },

    /**
     * Verify employee login
     */
    verifyLogin(phone: string, password: string): { success: boolean; employee?: Employee; organizationId?: string } {
        const normalizedPhone = phone.replace(/\D/g, '');
        const credJson = localStorage.getItem(`navbat_emp_cred_${normalizedPhone}`);

        if (!credJson) {
            // Check temp password
            const tempJson = localStorage.getItem(`navbat_emp_temp_${normalizedPhone}`);
            if (tempJson) {
                const temp = JSON.parse(tempJson);
                if (temp.password === password) {
                    return { success: true, organizationId: temp.organizationId };
                }
            }
            return { success: false };
        }

        const cred = JSON.parse(credJson);
        if (btoa(password) !== cred.passwordHash) {
            return { success: false };
        }

        // Find employee
        const empStored = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
        if (!empStored) return { success: false };

        const employees: Employee[] = JSON.parse(empStored);
        const employee = employees.find(e => e.id === cred.employeeId);

        return { success: true, employee, organizationId: cred.organizationId };
    },

    /**
     * Cancel pending invite
     */
    cancelInvite(inviteId: string): boolean {
        const stored = localStorage.getItem(INVITES_STORAGE_KEY);
        if (!stored) return false;

        const invites: EmployeeInvite[] = JSON.parse(stored);
        const updated = invites.filter(i => i.id !== inviteId);
        localStorage.setItem(INVITES_STORAGE_KEY, JSON.stringify(updated));
        return true;
    },

    /**
     * Delete employee
     */
    deleteEmployee(employeeId: string): boolean {
        const stored = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
        if (!stored) return false;

        const employees: Employee[] = JSON.parse(stored);
        const updated = employees.filter(e => e.id !== employeeId);
        localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(updated));
        return true;
    }
};
