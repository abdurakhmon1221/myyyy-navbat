
import { Organization, Employee } from '../types';
import { MOCK_ORGANIZATIONS } from '../constants';

const KEYS = {
    ORGS: 'navbat_db_orgs',
    USERS: 'navbat_db_users', // For future use
    EMPLOYEES: 'navbat_db_employees' // Mapping orgId -> Employee[]
};

class LocalStorageDB {
    private static instance: LocalStorageDB;

    private constructor() {
        this.initialize();
    }

    public static getInstance(): LocalStorageDB {
        if (!LocalStorageDB.instance) {
            LocalStorageDB.instance = new LocalStorageDB();
        }
        return LocalStorageDB.instance;
    }

    private initialize() {
        if (!localStorage.getItem(KEYS.ORGS)) {
            console.log('Initialize DB with Mock Data');
            localStorage.setItem(KEYS.ORGS, JSON.stringify(MOCK_ORGANIZATIONS));
        }
    }

    // --- Organizations ---

    getOrganizations(): Organization[] {
        const data = localStorage.getItem(KEYS.ORGS);
        return data ? JSON.parse(data) : [];
    }

    getOrganizationById(id: string): Organization | undefined {
        return this.getOrganizations().find(o => o.id === id);
    }

    saveOrganization(org: Organization): void {
        const orgs = this.getOrganizations();
        const index = orgs.findIndex(o => o.id === org.id);

        if (index >= 0) {
            orgs[index] = org;
        } else {
            orgs.push(org);
        }

        localStorage.setItem(KEYS.ORGS, JSON.stringify(orgs));
        // Trigger storage event for cross-tab sync if needed, or custom event
        window.dispatchEvent(new Event('navbat_db_change'));
    }

    deleteOrganization(id: string): void {
        const orgs = this.getOrganizations().filter(o => o.id !== id);
        localStorage.setItem(KEYS.ORGS, JSON.stringify(orgs));
        window.dispatchEvent(new Event('navbat_db_change'));
    }

    // --- Employees ---

    getEmployees(orgId: string): Employee[] {
        // In our MOCK structure, employees are inside Organization. 
        // But for better scaling, we might want them separate. 
        // For now, let's keep them inside Organization to match existing types, 
        // but expose this method for future refactoring.
        const org = this.getOrganizationById(orgId);
        return org?.employees || [];
    }

    saveEmployee(orgId: string, employee: Employee): void {
        const org = this.getOrganizationById(orgId);
        if (!org) return;

        const employees = org.employees || [];
        const index = employees.findIndex(e => e.id === employee.id);

        if (index >= 0) {
            employees[index] = employee;
        } else {
            employees.push(employee);
        }

        // Update org
        this.saveOrganization({ ...org, employees });
    }

    deleteEmployee(orgId: string, employeeId: string): void {
        const org = this.getOrganizationById(orgId);
        if (!org || !org.employees) return;

        org.employees = org.employees.filter(e => e.id !== employeeId);
        this.saveOrganization(org);
    }
}

export const db = LocalStorageDB.getInstance();
