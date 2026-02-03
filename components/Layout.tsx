import React from 'react';
import {
  Home, Map, Settings, QrCode, ChevronLeft, Star, Building2,
  LogOut, ListTodo, LayoutDashboard, Users, Activity, Terminal,
  Building, Briefcase, ClipboardList, Zap, Moon, Sun, BarChart3, Coffee
} from 'lucide-react';

import { UserRole } from '../types';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

// Define NavItem interface
interface NavItem {
  id: string;
  icon: React.ElementType;
  labelKey: string;
  special?: boolean;
}

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
  onLogout?: () => void;
  userName?: string;
  userImage?: string;
  userBadge?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  role,
  onLogout,
  userName = 'Foydalanuvchi',
  userImage,
  userBadge
}) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { t } = useLanguage();

  const showBackButton = activeTab !== 'home' && activeTab !== 'DASHBOARD' && activeTab !== 'WORK' && activeTab !== 'HEALTH';

  const handleBack = () => {
    if (role === UserRole.CLIENT) setActiveTab('home');
    else if (role === UserRole.COMPANY) setActiveTab('DASHBOARD');
    else if (role === UserRole.EMPLOYEE) setActiveTab('WORK');
    else setActiveTab('HEALTH');
  };

  const defaultImages = {
    [UserRole.CLIENT]: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop',
    [UserRole.EMPLOYEE]: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    [UserRole.COMPANY]: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=100&h=100&fit=crop',
    [UserRole.ADMIN]: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
  };

  const currentImg = userImage || defaultImages[role as keyof typeof defaultImages] || defaultImages[UserRole.CLIENT];
  const currentBadge = userBadge || (role === UserRole.COMPANY ? t('organization') : (role === UserRole.ADMIN ? t('admin') : '36.5°C'));

  const navItems: Record<UserRole, NavItem[]> = {
    [UserRole.CLIENT]: [
      { id: 'home', icon: Home, labelKey: 'nav_home' },
      { id: 'map', icon: Map, labelKey: 'nav_map' },
      { id: 'scan', icon: QrCode, labelKey: 'nav_scan', special: true },
      { id: 'my-queues', icon: ListTodo, labelKey: 'nav_queues' },
      { id: 'settings', icon: Settings, labelKey: 'nav_profile' },
    ],
    [UserRole.COMPANY]: [
      { id: 'DASHBOARD', icon: LayoutDashboard, labelKey: 'nav_dashboard' },
      { id: 'ANALYTICS', icon: BarChart3, labelKey: 'nav_analytics' },
      { id: 'EMPLOYEES', icon: Users, labelKey: 'nav_employees' },
      { id: 'SETTINGS', icon: Settings, labelKey: 'nav_profile' },
    ],
    [UserRole.EMPLOYEE]: [
      { id: 'WORK', icon: Zap, labelKey: 'nav_work' },
      { id: 'HISTORY', icon: ClipboardList, labelKey: 'nav_history' },
      { id: 'PROFILE', icon: Settings, labelKey: 'nav_profile' },
    ],
    [UserRole.ADMIN]: [
      { id: 'HEALTH', icon: Activity, labelKey: 'nav_system' },
      { id: 'ORGS', icon: Building, labelKey: 'nav_orgs' },
      { id: 'LOGS', icon: Terminal, labelKey: 'nav_audit' },
      { id: 'PROFILE', icon: Settings, labelKey: 'nav_profile' },
    ]
  };

  const currentNav = navItems[role as keyof typeof navItems] || navItems[UserRole.CLIENT];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg-app)]">
      {/* Header - Fixed height */}
      <header className="flex-shrink-0 bg-[var(--bg-card)]/80 backdrop-blur-xl border-b border-[var(--border-main)] px-5 py-3 h-20 flex justify-between items-center shadow-[0_1px_10px_rgba(0,0,0,0.02)] z-50">
        <div className="flex items-center gap-4">
          {showBackButton ? (
            <button onClick={handleBack} className="p-3 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-[1.25rem] transition-all text-emerald-600 border border-[var(--border-main)] shadow-sm active:scale-90">
              <ChevronLeft size={24} />
            </button>
          ) : (
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-[1.5rem] blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative w-14 h-14 bg-white dark:bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-xl border border-emerald-50 dark:border-emerald-900/30 overflow-hidden transform group-hover:scale-105 transition-transform">
                <Logo size={42} variant="neon" primaryColor="#10b981" secondaryColor="#94a3b8" />
              </div>
            </div>
          )}

          <div className="flex flex-col">
            <h1 className="text-2xl font-[1000] text-emerald-700 dark:text-emerald-500 tracking-tighter leading-none">{t('app_name')}</h1>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="h-[2px] w-4 bg-emerald-500/30 rounded-full animate-pulse-subtle"></div>
              <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">{t('slogan')}</span>
            </div>
          </div>
        </div>


        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 pl-4 py-2 pr-2 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-50 dark:border-emerald-900/20 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] max-w-[200px] overflow-hidden group hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-all hover:shadow-lg">
            <div className="flex flex-col items-end min-w-0">
              <span className="text-xs font-[1000] text-gray-900 dark:text-gray-100 truncate w-full text-right leading-tight tracking-tight">{userName}</span>
              <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg mt-1.5 ${role === UserRole.COMPANY ? 'bg-indigo-500/10 text-indigo-600' : 'bg-emerald-500/10 text-emerald-600'} border border-current/10`}>
                {role === UserRole.COMPANY ? <Building2 size={10} /> : <Star size={10} className="fill-current" />}
                <span className="text-[8px] font-black uppercase tracking-wider leading-none">{currentBadge}</span>
              </div>
            </div>
            <div className={`flex-shrink-0 w-12 h-12 border-2 border-white dark:border-slate-800 shadow-lg overflow-hidden relative group-hover:scale-105 transition-transform ${role === UserRole.COMPANY ? 'rounded-xl' : 'rounded-full'}`}>
              <img src={currentImg} alt={userName} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Scrollable */}
      <main className="flex-1 overflow-y-auto scroll-smooth relative">
        <div className="max-w-md mx-auto p-4 pb-20">
          {children}
          {(activeTab.toLowerCase().includes('settings') || activeTab.toLowerCase().includes('profile')) && onLogout && (
            <div className="mt-8 px-4 pb-12">
              <button onClick={onLogout} className="w-full bg-rose-50 hover:bg-rose-100 text-rose-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-rose-100 hover:border-rose-200 active:scale-[0.98] transition-all group">
                <LogOut size={18} className="group-hover:rotate-12 transition-transform" /> {t('logout')}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Global Unified Bottom Navigation - Fixed to bottom of screen */}
      <nav className="flex-shrink-0 bg-[var(--bg-card)] border-t border-[var(--border-main)] safe-bottom flex justify-around items-center py-2 px-2 z-[60] shadow-[0_-8px_30px_-10px_rgba(0,0,0,0.12)]">
        {currentNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.special) {
            return (
              <div key={item.id} className="flex-1 flex justify-center h-12">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`absolute -top-6 w-16 h-16 rounded-[1.75rem] flex items-center justify-center shadow-2xl transition-all active:scale-90 border-4 border-[var(--bg-card)] ${isActive ? 'bg-emerald-700 text-white shadow-emerald-200' : 'bg-emerald-600 text-white'}`}
                >
                  <Icon size={30} />
                </button>
              </div>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-1.5 transition-all group ${isActive ? 'text-emerald-600 scale-105' : 'text-[var(--text-muted)] hover:text-emerald-500'}`}
            >
              <div className="relative">
                <Icon size={22} className={`transition-transform group-hover:scale-110 ${isActive ? 'fill-emerald-50/30' : ''}`} />
                {isActive && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full"></div>}
              </div>
              <span className="text-[9px] font-black uppercase tracking-tighter">{t(item.labelKey)}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;