
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { UserRole, Organization } from './types';
import Layout from './components/Layout';
import AIAssistant from './components/AIAssistant';
import ClientView from './views/ClientView'; // Client view stays critical (not lazy)
import Logo from './components/Logo';
import SEOMetadata from './components/SEOMetadata';
import {
  Loader2, ArrowRight, Lock,
  User, Terminal, UserCircle2, Smartphone, Briefcase, Eye, EyeOff,
  UserSquare2, Users, Building2, ChevronLeft, ChevronRight, QrCode, X, MessageSquare, MapPin, Send
} from 'lucide-react';
import { MOCK_ORGANIZATIONS } from './constants';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { mockWS } from './services/webSocketService';
import { notificationService } from './services/notificationService';


// Lazy Load Views to reduce initial bundle size
const AdminView = React.lazy(() => import('./views/AdminView'));
const OrgView = React.lazy(() => import('./views/OrgView'));
const EmployeeView = React.lazy(() => import('./views/EmployeeView'));
const SoloView = React.lazy(() => import('./views/SoloView'));
const AuthView = React.lazy(() => import('./views/AuthView'));

export type BusinessAuthStep = 'CHOICE' | 'ORG_TYPE' | 'LOGIN';

export interface CountryConfig {
  code: string;
  prefix: string;
  length: number;
  placeholder: string;
}

export const COUNTRY_DATA: Record<string, CountryConfig> = {
  UZ: { code: 'UZ', prefix: '+998', length: 9, placeholder: '90 123 45 67' },
  RU: { code: 'RU', prefix: '+7', length: 10, placeholder: '900 123 45 67' },
  KZ: { code: 'KZ', prefix: '+7', length: 10, placeholder: '700 123 45 67' },
  US: { code: 'US', prefix: '+1', length: 10, placeholder: '202 555 0123' },
  DEFAULT: { code: 'UZ', prefix: '+998', length: 9, placeholder: '90 123 45 67' }
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [role, setRole] = useState<UserRole>(UserRole.CLIENT);
  const [loginMode, setLoginMode] = useState<'CLIENT' | 'BUSINESS' | 'SYSTEM_ADMIN'>('CLIENT');
  const [businessType, setBusinessType] = useState<'CORPORATE' | 'SOLO'>('CORPORATE');

  // Geo-location based country config
  const [countryConfig, setCountryConfig] = useState<CountryConfig>(COUNTRY_DATA.DEFAULT);

  const [userProfile, setUserProfile] = useState({
    name: '',
    phone: '',
    imageUrl: '',
    trustScore: 36.5,
    city: 'Toshkent',
    telegramId: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detectLocation = async () => {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz.includes('Tashkent')) setCountryConfig(COUNTRY_DATA.UZ);
        else if (tz.includes('Moscow')) setCountryConfig(COUNTRY_DATA.RU);
        else if (tz.includes('Almaty')) setCountryConfig(COUNTRY_DATA.KZ);

        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data.country_code && COUNTRY_DATA[data.country_code]) {
          setCountryConfig(COUNTRY_DATA[data.country_code]);
        }
      } catch (e) {
        console.log("Location detection skipped, using default");
      }
    };

    const savedAuth = localStorage.getItem('navbat_auth_session');
    if (savedAuth) {
      const session = JSON.parse(savedAuth);
      setRole(session.role || UserRole.CLIENT);
      setIsGuest(session.isGuest || false);
      setUserProfile(session.profile || userProfile);
      setBusinessType((session.businessType as 'CORPORATE' | 'SOLO') || 'CORPORATE');
      setIsAuthenticated(true);
      if (session.role !== UserRole.CLIENT) {
        if (session.role === UserRole.COMPANY) setActiveTab('DASHBOARD');
        else if (session.role === UserRole.EMPLOYEE) setActiveTab('WORK');
        else if (session.role === UserRole.ADMIN) setActiveTab('HEALTH');
      }
    }

    // Real-time & Notifications Setup
    notificationService.requestPermission();
    const unsubscribe = mockWS.subscribe((update) => {
      if (update.type === 'QUEUE_UPDATE') {
        notificationService.sendNotification(
          'NAVBAT Yangilanishi',
          'Sizning navbatingiz bitta o\'ringa surildi!',
          'https://cdn-icons-png.flaticon.com/512/3448/3448609.png'
        );
      }
    });

    detectLocation().finally(() => setIsLoading(false));
    return () => {
      unsubscribe();
      mockWS.stop();
    };
  }, []);


  // SEO State
  const [selectedOrgForSEO, setSelectedOrgForSEO] = useState<Organization | undefined>(undefined);

  const handleLogout = () => {
    localStorage.removeItem('navbat_auth_session');
    setIsAuthenticated(false);
    setIsGuest(false);
    setRole(UserRole.CLIENT);
    setActiveTab('home');
    setUserProfile({
      name: '',
      phone: '',
      imageUrl: '',
      trustScore: 36.5,
      city: 'Toshkent',
      telegramId: ''
    });
  };

  const handleLogoClick = () => {
    // Hidden internal click logic can be added here if needed, 
    // but AuthView handles the secret admin access for login.
  };

  const saveSession = (newRole: UserRole, guest: boolean = false, customProfile?: any, bizType: 'CORPORATE' | 'SOLO' = businessType) => {
    const finalProfile = customProfile || userProfile;
    localStorage.setItem('navbat_auth_session', JSON.stringify({
      role: newRole,
      isGuest: guest,
      profile: finalProfile,
      businessType: bizType,
      timestamp: Date.now()
    }));
  };

  const handleGuestLogin = () => {
    setIsGuest(true);
    setRole(UserRole.CLIENT);
    setIsAuthenticated(true);
    const guestProfile = { ...userProfile, name: 'Mehmon', phone: 'Guest' };
    setUserProfile(guestProfile);
    saveSession(UserRole.CLIENT, true, guestProfile);
  };

  const updateProfile = (newData: Partial<typeof userProfile>) => {
    const updated = { ...userProfile, ...newData };
    setUserProfile(updated);
    if (isAuthenticated) {
      const savedAuth = localStorage.getItem('navbat_auth_session');
      if (savedAuth) {
        const session = JSON.parse(savedAuth);
        const isStillGuest = session.isGuest && (updated.phone === 'Guest' || !updated.phone);
        setIsGuest(isStillGuest);
        saveSession(session.role, isStillGuest, updated);
      }
    }
  };

  // These handlers are now simplified and called from AuthView

  if (isLoading) return <div className="min-h-screen bg-emerald-600 flex items-center justify-center"><Loader2 className="animate-spin text-white" size={48} /></div>;

  if (!isAuthenticated) {
    return (
      <AuthView
        onLogin={(role, isGuest = false, customProfile, bizType = 'CORPORATE') => {
          const finalProfile = customProfile || userProfile;
          setRole(role);
          setIsGuest(isGuest);
          setBusinessType(bizType as 'CORPORATE' | 'SOLO');
          setIsAuthenticated(true);

          if (role === UserRole.COMPANY) setActiveTab('DASHBOARD');
          else if (role === UserRole.EMPLOYEE) setActiveTab('WORK');
          else if (role === UserRole.ADMIN) setActiveTab('HEALTH');
          else setActiveTab('home');

          saveSession(role, isGuest, finalProfile, bizType as 'CORPORATE' | 'SOLO');
        }}
        onUpdateProfile={updateProfile}
        userProfile={userProfile}
        countryConfig={countryConfig}
      />
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <SEOMetadata organization={selectedOrgForSEO} />
        <Layout activeTab={activeTab} setActiveTab={setActiveTab} role={role} onLogout={handleLogout} userName={userProfile.name} userImage={userProfile.imageUrl}>
          <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>}>
            {role === UserRole.CLIENT && <ClientView activeTab={activeTab} setActiveTab={setActiveTab} isGuest={isGuest} profile={userProfile} onUpdateProfile={updateProfile} countryConfig={countryConfig} onOrgSelect={(org: Organization) => setSelectedOrgForSEO(org)} />}
            {role === UserRole.COMPANY && (
              businessType === 'SOLO' ?
                <SoloView organization={MOCK_ORGANIZATIONS[0]} profile={userProfile} onUpdateProfile={updateProfile} onLogout={handleLogout} activeTab={activeTab} /> :
                <OrgView role={role} onLogout={handleLogout} profile={userProfile} onUpdateProfile={updateProfile} activeTab={activeTab} setActiveTab={setActiveTab} />
            )}
            {role === UserRole.EMPLOYEE && <EmployeeView organization={MOCK_ORGANIZATIONS[0]} employee={{ ...MOCK_ORGANIZATIONS[0].employees[0], name: userProfile.name } as any} profile={userProfile} onUpdateProfile={updateProfile} onLogout={handleLogout} activeTab={activeTab} />}
            {role === UserRole.ADMIN && <AdminView role={role} profile={userProfile} onUpdateProfile={updateProfile} onLogout={handleLogout} activeTab={activeTab} />}
          </Suspense>
          <AIAssistant />
        </Layout>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;