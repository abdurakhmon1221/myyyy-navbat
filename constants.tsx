
import React from 'react';
import { UserRole, Language, Organization, TrustBadge } from './types';
import {
  Hospital, Building2, Landmark, Car,
  GraduationCap, Zap, Home, Briefcase,
  LayoutGrid
} from 'lucide-react';

export const THEME = {
  primary: '#10b981', // emerald-500
  primaryDark: '#059669', // emerald-600
  bg: '#f8fafc',
  text: '#1e293b',
};

export const DEFAULT_TRUST_SCORE = 36.5;

export const LANGUAGES = [
  { code: Language.UZ, label: 'O‘zbekcha' },
  { code: Language.RU, label: 'Русский' },
  { code: Language.EN, label: 'English' },
];

export const TRUST_BADGES: TrustBadge[] = [
  // Client Badges
  { id: 'on_time', label: 'Vaqtni qadrlaydi', description: 'O\'z vaqtida keladi', icon: '⏱️', role: 'CLIENT' },
  { id: 'polite_client', label: 'Xushmuomala', description: 'Xodimlar bilan muloyim', icon: '🤝', role: 'CLIENT' },
  { id: 'fair_client', label: 'Odil mijoz', description: 'Navbatni buzmaydi', icon: '⚖️', role: 'CLIENT' },

  // Provider Badges (Employee/Org)
  { id: 'fast_service', label: 'Tezkor xizmat', description: 'Mijozlarni tez qabul qiladi', icon: '⚡', role: 'PROVIDER' },
  { id: 'polite_staff', label: 'Muloyim xodim', description: 'Mijozlarga xushmuomala', icon: '😊', role: 'PROVIDER' },
  { id: 'well_organized', label: 'Tartibli', description: 'Navbatni yaxshi tashkil etgan', icon: '📋', role: 'PROVIDER' },
  { id: 'trusted_org', label: 'Ishonchli maskan', description: 'Shaffof navbat tizimi', icon: '🛡️', role: 'PROVIDER' },
];

export const CATEGORY_LIST = [
  { id: 'Gov', label: 'Davlat xizmatlari', icon: <Landmark size={24} />, color: '#0ea5e9', gradient: 'from-sky-500 to-blue-600' },
  { id: 'Health', label: 'Tibbiyot', icon: <Hospital size={24} />, color: '#10b981', gradient: 'from-emerald-500 to-teal-600' },
  { id: 'Finance', label: 'Bank va moliya', icon: <Building2 size={24} />, color: '#6366f1', gradient: 'from-indigo-500 to-purple-600' },
  { id: 'Transport', label: 'Transport va avto', icon: <Car size={24} />, color: '#f59e0b', gradient: 'from-amber-500 to-orange-600' },
  { id: 'Education', label: 'Ta’lim', icon: <GraduationCap size={24} />, color: '#f43f5e', gradient: 'from-rose-500 to-red-600' },
  { id: 'Utility', label: 'Kommunal xizmatlar', icon: <Zap size={24} />, color: '#06b6d4', gradient: 'from-cyan-500 to-blue-500' },
  { id: 'RealEstate', label: 'Uy-joy va kadastr', icon: <Home size={24} />, color: '#8b5cf6', gradient: 'from-violet-500 to-purple-600' },
  { id: 'Private', label: 'Xususiy xizmatlar', icon: <Briefcase size={24} />, color: '#475569', gradient: 'from-slate-600 to-slate-800' },
  { id: 'Other', label: 'boshqalar', icon: <LayoutGrid size={24} />, color: '#64748b', gradient: 'from-gray-500 to-gray-700' },
];


export const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: 'org1',
    name: 'Toshkent Markaziy Poliklinikasi',
    address: 'Amir Temur ko\'chasi, 15',
    category: 'Health',
    status: 'OPEN',
    estimatedServiceTime: 12,
    location: { lat: 41.3111, lng: 69.2797 },
    services: [
      { id: 's1', name: 'Umumiy ko\'rik', requiredDocuments: ['ID-karta', 'Sug\'urta polisi'] },
      { id: 's2', name: 'Tahlil topshirish', requiredDocuments: ['Yo\'llanma', 'Pasport'] },
    ],
    employees: [],
    earnedBadges: ['fast_service', 'well_organized'],
    workingHours: {
      days: [1, 2, 3, 4, 5],
      open: '08:00',
      close: '17:00'
    },
    busyHours: [
      { hour: '08:00', load: 30 }, { hour: '10:00', load: 80 }, { hour: '12:00', load: 95 },
      { hour: '14:00', load: 60 }, { hour: '16:00', load: 40 }
    ]
  },
  {
    id: 'org5',
    name: 'Yagona darcha - Davlat xizmatlari markazi',
    address: 'Shayxontohur tumani, Navoiy ko\'chasi',
    category: 'Gov',
    status: 'BUSY',
    estimatedServiceTime: 25,
    location: { lat: 41.3211, lng: 69.2497 },
    services: [
      { id: 's8', name: 'Biometrik pasport', requiredDocuments: ['Eski pasport', 'Tug\'ilganlik haqida guvohnoma', 'Davlat boji kvitansiyasi'] },
      { id: 's9', name: 'Tadbirkorlikni ro\'yxatdan o\'tkazish', requiredDocuments: ['Ta\'sis hujjatlari', 'Ijara shartnomasi'] },
    ],
    employees: [],
    earnedBadges: ['well_organized', 'trusted_org'],
    workingHours: {
      days: [1, 2, 3, 4, 5, 6],
      open: '09:00',
      close: '18:00'
    },
    busyHours: [
      { hour: '09:00', load: 40 }, { hour: '11:00', load: 90 }, { hour: '13:00', load: 80 },
      { hour: '15:00', load: 100 }, { hour: '17:00', load: 30 }
    ]
  },
  {
    id: 'org2',
    name: 'Xalq Banki - Yunusobod filiali',
    address: 'Bog\'ishamol, 12',
    category: 'Finance',
    status: 'BUSY',
    estimatedServiceTime: 20,
    location: { lat: 41.3501, lng: 69.2882 },
    services: [
      { id: 's3', name: 'Kredit bo\'limi' },
      { id: 's4', name: 'Kassa xizmati' },
    ],
    employees: [],
    earnedBadges: ['trusted_org'],
    workingHours: {
      days: [1, 2, 3, 4, 5, 6],
      open: '09:00',
      close: '18:00'
    },
    busyHours: [
      { hour: '09:00', load: 10 }, { hour: '11:00', load: 50 }, { hour: '13:00', load: 90 },
      { hour: '15:00', load: 70 }, { hour: '17:00', load: 100 }
    ]
  },
  {
    id: 'org6',
    name: 'Korzinka - Sayram',
    address: 'Sayram ko\'chasi, 1',
    category: 'Private',
    status: 'OPEN',
    estimatedServiceTime: 5,
    location: { lat: 41.3311, lng: 69.3197 },
    services: [
      { id: 's10', name: 'Elektron navbat (Kassa)' },
    ],
    employees: [],
    earnedBadges: ['fast_service'],
    workingHours: {
      days: [0, 1, 2, 3, 4, 5, 6],
      open: '08:00',
      close: '23:00'
    },
    busyHours: [
      { hour: '08:00', load: 10 }, { hour: '12:00', load: 40 }, { hour: '18:00', load: 95 },
      { hour: '20:00', load: 100 }, { hour: '22:00', load: 30 }
    ]
  }
];

