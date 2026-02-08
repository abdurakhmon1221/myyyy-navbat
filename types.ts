
export enum UserRole {
  CLIENT = 'CLIENT',
  COMPANY = 'COMPANY',
  EMPLOYEE = 'EMPLOYEE',
  ADMIN = 'ADMIN'
}

export type BusinessType = 'CORPORATE' | 'SOLO';

export enum Language {
  UZ = 'uz',
  RU = 'ru',
  EN = 'en'
}

export interface ClientSettings {
  notifications: {
    reminders: boolean;
    arrivalAlerts: boolean;
    telegramSync: boolean;
  };
  queuePrefs: {
    defaultArrivalStatus: 'IDLE' | 'COMING';
    autoSwapPermission: boolean;
    accessibilityMode: boolean;
  };
  privacy: {
    showNametoCompany: boolean;
    anonymousRating: boolean;
  };
}

export interface WorkingHours {
  days: number[]; // 0 for Sunday, 1-6 for Mon-Sat
  open: string;  // HH:mm
  close: string; // HH:mm
}

export interface Organization {
  id: string;
  name: string;
  address: string;
  imageUrl?: string;
  phone?: string;
  description?: string;
  password?: string;
  category: string;
  status: 'OPEN' | 'CLOSED' | 'BUSY';
  estimatedServiceTime: number; // minutes
  employees: Employee[];
  services: Service[];

  location: { lat: number; lng: number };
  earnedBadges: string[];
  workingHours: WorkingHours;
  plan?: 'FREE' | 'PRO' | 'PREMIUM';
  adminStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'BANNED';
  busyHours?: { hour: string; load: number }[];
}


export interface Service {
  id: string;
  name: string;
  description?: string;
  requiredDocuments?: string[];
}

export interface Employee {
  id: string;
  name: string;
  phone?: string;
  imageUrl?: string;
  role?: string; // e.g. 'Master', 'Manager'
  status: 'ACTIVE' | 'INACTIVE' | 'OFFLINE' | 'BUSY';
  organizationId: string;
  assignedServiceIds: string[];
  performance: {
    avgWaitTime: number;
    servedCount: number;
    rating?: number;
  };
  earnedBadges: string[];
}

export interface QueueItem {
  id: string;
  userId: string;
  userPhone: string;
  organizationId: string;
  serviceId: string;
  position: number;
  number: string;
  status: 'WAITING' | 'CALLED' | 'SERVED' | 'SKIPPED' | 'CANCELLED';
  entryTime: number;
  estimatedStartTime: number;
  appointmentTime?: number; // Null for live queues
  logs: QueueLog[];
  evaluated?: boolean;
}

export interface QueueLog {
  timestamp: number;
  action: string;
  actorId: string;
  reason?: string;
}

export interface TrustBadge {
  id: string;
  label: string;
  description: string;
  icon: string;
  role: 'CLIENT' | 'PROVIDER';
}

export interface Evaluation {
  queueId: string;
  evaluatorId: string;
  targetId: string;
  positiveTraits: string[]; // Badge IDs
  comment?: string;
  isNegative: boolean; // Internal only
}

export interface ServiceCategory {
  id: string;
  name: Record<Language, string>;
  icon: string; // Lucide icon name
  requiredFields: string[]; // e.g., ['car_number', 'passport_series']
  isActive: boolean;
}

export interface AppTheme {
  primaryColor: string; // Hex code
  secondaryColor: string;
  logoUrl?: string;
  darkMode: boolean;
  borderRadius: string; // e.g., '1rem'
}

export type Permission =
  | 'VIEW_DASHBOARD'
  | 'MANAGE_COMPANIES' // Create, Edit, Ban
  | 'VIEW_CLIENTS'
  | 'MANAGE_QUEUES' // Emergency Stop
  | 'MANAGE_CMS' // Edit text
  | 'MANAGE_ROLES' // Create new roles
  | 'VIEW_LOGS'
  | 'AI_ACCESS';

export interface CustomRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  usersCount: number;
}

export interface AuditLog {
  id: string;
  adminName: string;
  action: 'LOGIN' | 'CREATE' | 'DELETE' | 'EDIT' | 'EXPORT';
  target: string; // e.g., "Company: Agrobank"
  timestamp: number;
  ipAddress: string;
}

export type AdminSection = 'DASHBOARD' | 'COMPANIES' | 'CLIENTS' | 'QUEUES' | 'ANALYTICS' | 'AI_CONSOLE' | 'SETTINGS' | 'LOGS' | 'CMS' | 'ROLES' | 'CRM' | 'PROFILE';
