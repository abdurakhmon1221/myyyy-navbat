
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { UserRole, Organization } from './types';
import Layout from './components/Layout';

// import ClientView from './views/ClientView'; // Client view stays critical (not lazy)
const ClientView = React.lazy(() => import('./views/ClientView'));
import Logo from './components/Logo';
import SEOMetadata from './components/SEOMetadata';
import {
  Loader2, ArrowRight, Lock,
  User, Terminal, UserCircle2, Smartphone, Briefcase, Eye, EyeOff,
  UserSquare2, Users, Building2, ChevronLeft, ChevronRight, QrCode, X, MessageSquare, MapPin, Send
} from 'lucide-react';
import { db } from './services/LocalStorageDB';
import { useOrganizations } from './hooks/useOrganizations';
import { usePushNotifications } from './hooks/usePushNotifications';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { webSocketService } from './services/webSocketService';
import { notificationService } from './services/notificationService';
import { api } from './services/api';

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
  const [orgId, setOrgId] = useState<string>('default');

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

  // Initialize Push Notifications
  usePushNotifications(isAuthenticated, userProfile.phone);

  useEffect(() => {
    const detectLocation = async () => {
      try {
        const fetchPromise = fetch('https://ipapi.co/json/').then(r => r.json());
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject('timeout'), 3000));

        const data: any = await Promise.race([fetchPromise, timeoutPromise]).catch(() => null);

        if (data && data.country_code && COUNTRY_DATA[data.country_code]) {
          setCountryConfig(COUNTRY_DATA[data.country_code]);
        }
      } catch (e) {
        console.log("Location detection skipped or timed out");
      }
    };

    const savedAuth = localStorage.getItem('navbat_auth_session');
    if (savedAuth) {
      const session = JSON.parse(savedAuth);
      setRole(session.role || UserRole.CLIENT);
      setIsGuest(session.isGuest || false);
      setUserProfile(session.profile || userProfile);
      setBusinessType((session.businessType as 'CORPORATE' | 'SOLO') || 'CORPORATE');
      setOrgId(session.orgId || 'default');
      setIsAuthenticated(true);
      if (session.role !== UserRole.CLIENT) {
        if (session.role === UserRole.COMPANY) setActiveTab('DASHBOARD');
        else if (session.role === UserRole.EMPLOYEE) setActiveTab('WORK');
        else if (session.role === UserRole.ADMIN) setActiveTab('home'); // Default to Home for Admin
      }
    }

    // Real-time & Notifications Setup
    notificationService.requestPermission();

    // Connect to WebSocket
    webSocketService.connect();

    const unsubscribe = webSocketService.onEvent((event) => {
      if (event.type === 'QUEUE_CALLED') {
        const queueItem = (event.data as any)?.queueItem;
        // Verify this call is for the current user
        if (queueItem && queueItem.userPhone === userProfile.phone) {
          notificationService.sendNotification(
            'NAVBAT Yangilanishi',
            'Navbatingiz keldi! Iltimos, xodim oldiga boring.',
            '/logo.png'
          );
        }
      } else if (event.type === 'POSITION_UPDATE') {
        // Optional: notify on significant position change
      }
    });

    detectLocation().finally(() => setIsLoading(false));

    return () => {
      unsubscribe();
      webSocketService.disconnect();
    };
  }, [userProfile.phone]); // Re-subscribe when phone changes

  // Ensure activeTab matches Role (only run when role changes)
  useEffect(() => {
    if (role === UserRole.COMPANY) {
      setActiveTab('DASHBOARD'); // Default to Dashboard for Admin
    } else if (role === UserRole.EMPLOYEE) {
      setActiveTab('WORK');
    } else if (role === UserRole.ADMIN) {
      // setActiveTab('HEALTH'); // Removed to keep Admin on Home by default
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);


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
    webSocketService.disconnect();
  };

  const handleLogoClick = () => {
    // Hidden internal click logic can be added here if needed, 
    // but AuthView handles the secret admin access for login.
  };

  const saveSession = (newRole: UserRole, guest: boolean = false, customProfile?: any, bizType: 'CORPORATE' | 'SOLO' = businessType, orgIdToSave: string = orgId) => {
    const finalProfile = customProfile || userProfile;
    localStorage.setItem('navbat_auth_session', JSON.stringify({
      role: newRole,
      isGuest: guest,
      profile: finalProfile,
      businessType: bizType,
      orgId: orgIdToSave,
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

  // Org State
  const { organizations, updateOrganization } = useOrganizations();
  const [fetchedOrg, setFetchedOrg] = useState<Organization | null>(null);

  // Try to find org locally, or use fetched org
  const currentOrg = organizations.find(o => o.id === orgId) || fetchedOrg || (organizations.length > 0 ? organizations[0] : null);

  // Fetch org if missing locally but we have an ID
  useEffect(() => {
    if (role === UserRole.COMPANY && !currentOrg && orgId && orgId !== 'default') {
      const loadOrg = async () => {
        try {
          const response = await api.organizations.getById(orgId);
          if (response.success && response.data) {
            setFetchedOrg(response.data);
          }
        } catch (err) {
          console.error("Failed to load organization", err);
        }
      };
      loadOrg();
    }
  }, [role, currentOrg, orgId, organizations]);

  if (isLoading) return <div className="min-h-screen bg-emerald-600 flex items-center justify-center"><Loader2 className="animate-spin text-white" size={48} /></div>;

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-emerald-600 flex items-center justify-center"><Loader2 className="animate-spin text-white" size={48} /></div>}>
        <AuthView
          onLogin={(role, isGuest = false, customProfile, bizType = 'CORPORATE', orgIdParam = 'default') => {
            const finalProfile = customProfile || userProfile;
            setRole(role);
            setIsGuest(isGuest);
            setBusinessType(bizType as 'CORPORATE' | 'SOLO');
            setOrgId(orgIdParam);
            setIsAuthenticated(true);

            if (role === UserRole.COMPANY) setActiveTab('DASHBOARD');
            else if (role === UserRole.EMPLOYEE) setActiveTab('WORK');
            else if (role === UserRole.ADMIN) setActiveTab('home'); // Default to Home for Admin
            else setActiveTab('home');

            saveSession(role, isGuest, finalProfile, bizType as 'CORPORATE' | 'SOLO', orgIdParam);

            // Connect socket after login
            webSocketService.connect();
          }}
          onUpdateProfile={updateProfile}
          userProfile={userProfile}
          countryConfig={countryConfig}
        />
      </Suspense>
    );
  }

  // Render Logic
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SEOMetadata organization={selectedOrgForSEO} />
        <Layout activeTab={activeTab} setActiveTab={setActiveTab} role={role} businessType={businessType} onLogout={handleLogout} userName={userProfile.name} userImage={userProfile.imageUrl} allowFluid={activeTab === 'map'}>
          <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>}>
            {role === UserRole.CLIENT && <ClientView activeTab={activeTab} setActiveTab={setActiveTab} isGuest={isGuest} profile={userProfile} onUpdateProfile={updateProfile} countryConfig={countryConfig} onOrgSelect={(org: Organization) => setSelectedOrgForSEO(org)} />}
            {role === UserRole.COMPANY && (
              // Ensure we have an organization before rendering
              currentOrg ? (
                businessType === 'SOLO' ?
                  <SoloView organization={currentOrg} profile={userProfile} onUpdateProfile={updateProfile} onUpdateOrganization={updateOrganization} onLogout={handleLogout} activeTab={activeTab} /> :
                  <OrgView role={role} onLogout={handleLogout} profile={userProfile} onUpdateProfile={updateProfile} activeTab={activeTab} setActiveTab={setActiveTab} />
              ) : (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 bg-gray-50 dark:bg-slate-900 rounded-3xl m-4">
                  <Building2 size={64} className="text-gray-300 mb-6" />
                  <h2 className="text-2xl font-black text-gray-800 dark:text-gray-200 mb-2">Tashkilot topilmadi</h2>
                  <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto">Tashkilot ma'lumotlari yuklanmadi yoki o'chirilgan. Yangi tashkilot ochishingiz mumkin.</p>
                  <div className="flex gap-4 w-full max-w-xs">
                    <button onClick={handleLogout} className="flex-1 bg-white border border-gray-200 text-gray-700 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors">Chiqish</button>
                    <button onClick={async () => {
                      const newId = `ORG${Date.now()}`;
                      const newOrg: any = {
                        id: newId,
                        name: 'Mening Tashkilotim',
                        address: 'Toshkent',
                        phone: userProfile.phone || '+998901234567',
                        description: 'Yangi tashkilot',
                        category: 'Barbershop',
                        status: 'OPEN',
                        estimatedServiceTime: 15,
                        services: [],
                        employees: [],
                        earnedBadges: [],
                        workingHours: {},
                        busyHours: []
                      };
                      try {
                        await api.organizations.save(newOrg);
                        setFetchedOrg(newOrg);
                        setOrgId(newId);
                        saveSession(role, isGuest, userProfile, businessType, newId);
                        window.location.reload();
                      } catch (e) {
                        console.error(e);
                        alert('Xatolik yuz berdi. Iltimos qayta urinib ko\'ring.');
                      }
                    }} className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors">Yangi ochish</button>
                  </div>
                </div>
              )
            )}
            {role === UserRole.EMPLOYEE && (
              <EmployeeView
                organization={currentOrg}
                employee={{ ...(currentOrg.employees?.[0] || { id: 'default', name: userProfile.name, status: 'ACTIVE', organizationId: currentOrg.id, assignedServiceIds: [], performance: { avgWaitTime: 0, servedCount: 0 }, earnedBadges: [] }), name: userProfile.name } as any}
                profile={userProfile}
                onUpdateProfile={updateProfile}
                onLogout={handleLogout}
                activeTab={activeTab}
              />
            )}
            {role === UserRole.ADMIN && <AdminView role={role} profile={userProfile} onUpdateProfile={updateProfile} onLogout={handleLogout} activeTab={activeTab} />}
          </Suspense>

        </Layout>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;