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
  { id: 'Gov', label: 'Davlat xizmatlari', labelKey: 'cat_gov', icon: <Landmark size={24} />, color: '#0ea5e9', gradient: 'from-sky-500 to-blue-600' },
  { id: 'Health', label: 'Tibbiyot', labelKey: 'cat_medical', icon: <Hospital size={24} />, color: '#10b981', gradient: 'from-emerald-500 to-teal-600' },
  { id: 'Finance', label: 'Bank va moliya', labelKey: 'cat_finance', icon: <Building2 size={24} />, color: '#6366f1', gradient: 'from-indigo-500 to-purple-600' },
  { id: 'Transport', label: 'Transport va avto', labelKey: 'cat_transport', icon: <Car size={24} />, color: '#f59e0b', gradient: 'from-amber-500 to-orange-600' },
  { id: 'Education', label: 'Ta’lim', labelKey: 'cat_education', icon: <GraduationCap size={24} />, color: '#f43f5e', gradient: 'from-rose-500 to-red-600' },
  { id: 'Utility', label: 'Kommunal xizmatlar', labelKey: 'cat_utility', icon: <Zap size={24} />, color: '#06b6d4', gradient: 'from-cyan-500 to-blue-500' },
  { id: 'RealEstate', label: 'Uy-joy va kadastr', labelKey: 'cat_real_estate', icon: <Home size={24} />, color: '#8b5cf6', gradient: 'from-violet-500 to-purple-600' },
  { id: 'Private', label: 'Xususiy xizmatlar', labelKey: 'cat_private', icon: <Briefcase size={24} />, color: '#475569', gradient: 'from-slate-600 to-slate-800' },
  { id: 'Other', label: 'boshqalar', labelKey: 'cat_other', icon: <LayoutGrid size={24} />, color: '#64748b', gradient: 'from-gray-500 to-gray-700' },
];


export const MOCK_ORGANIZATIONS: Organization[] = [];
