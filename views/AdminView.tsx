

import React, { useState } from 'react';
import { UserRole, AdminSection } from '../types';
import { haptics } from '../services/haptics';
import { Menu, X, LogOut } from 'lucide-react';
import { useMobile } from '../hooks/useMobile';

// Split Components
import AdminSidebar from '../components/admin/AdminSidebar';
import Dashboard from '../components/admin/Dashboard';
import CompanyManager from '../components/admin/CompanyManager';
import ClientManager from '../components/admin/ClientManager';
import QueueMonitor from '../components/admin/QueueMonitor';
import GlobalCMS from '../components/admin/GlobalCMS';
import RoleManager from '../components/admin/RoleManager';
import AuditLogs from '../components/admin/AuditLogs';
import SystemSettings from '../components/admin/SystemSettings';
import SmartCRM from '../components/admin/SmartCRM';
import AIConsole from '../components/admin/AIConsole';
import ProfilePage from '../components/shared/ProfilePage';


interface AdminViewProps {
  role: UserRole;
  profile: any;
  onUpdateProfile: (data: any) => void;
  onLogout?: () => void;
  activeTab: string;
}

const AdminView: React.FC<AdminViewProps> = ({ role, profile, onUpdateProfile, onLogout, activeTab }) => {
  const isMobile = useMobile();
  const [activeSection, setActiveSection] = useState<AdminSection>((activeTab as AdminSection) || 'DASHBOARD');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync prop with state
  React.useEffect(() => {
    if (activeTab) {
      setActiveSection(activeTab as AdminSection);
    }
  }, [activeTab]);

  const handleSectionChange = (section: AdminSection) => {
    haptics.light();
    setActiveSection(section);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'DASHBOARD': return <Dashboard />;
      case 'COMPANIES': return <CompanyManager />;
      case 'CLIENTS': return <ClientManager />;
      case 'QUEUES': return <QueueMonitor />;
      case 'CMS': return <GlobalCMS />;
      case 'ROLES': return <RoleManager />;
      case 'LOGS': return <AuditLogs />;
      case 'SETTINGS': return <SystemSettings />;
      case 'CRM': return <SmartCRM />;
      case 'AI_CONSOLE': return <AIConsole />;
      case 'PROFILE': return <ProfilePage profile={profile} onUpdateProfile={onUpdateProfile} onLogout={onLogout} role="ADMIN" />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F9FC] dark:bg-slate-950 overflow-hidden">

      {/* Mobile Sidebar Overlay */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm animate-in fade-in" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        ${isMobile ? 'fixed inset-y-0 left-0 z-50 w-72 shadow-2xl transform transition-transform duration-300 ease-in-out' : 'fixed top-0 left-0 h-full z-50 transition-all duration-300 border-r border-[var(--border-main)]'}
        ${isMobile ? (mobileMenuOpen ? 'translate-x-0' : '-translate-x-full') : (sidebarCollapsed ? 'w-20' : 'w-72 hidden md:block')}
        bg-[var(--bg-card)]
      `}>
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        )}

        <AdminSidebar
          activeSection={activeSection}
          setActiveSection={handleSectionChange}
          onLogout={onLogout}
          profileName={profile.name || 'Admin'}
          profileRole={role}
          profileImage={profile.imageUrl}
          collapsed={isMobile ? false : sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </aside>

      {/* Main Content - offset by sidebar width */}
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${isMobile ? 'ml-0' : (sidebarCollapsed ? 'ml-20' : 'ml-0 md:ml-72')}`}>
        <div className={`min-h-screen ${isMobile ? 'p-4 pb-24' : 'p-8 lg:p-12'}`}>
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8 sticky top-0 bg-[#F8F9FC] dark:bg-slate-950 z-30 py-2">
            <div className="flex items-center gap-4">
              {isMobile && (
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm text-gray-600 dark:text-gray-300 active:scale-95 transition-transform"
                >
                  <Menu size={24} />
                </button>
              )}
              <div>
                <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-black text-gray-900 dark:text-white tracking-tight`}>
                  {activeSection === 'DASHBOARD' ? 'Boshqaruv' :
                    activeSection === 'COMPANIES' ? 'Tashkilotlar' :
                      activeSection === 'CLIENTS' ? 'Mijozlar' :
                        activeSection === 'QUEUES' ? 'Navbatlar' :
                          activeSection === 'CMS' ? 'Global CMS' :
                            activeSection === 'ROLES' ? 'Rollar' :
                              activeSection === 'LOGS' ? 'Audit Jurnal' :
                                activeSection === 'SETTINGS' ? 'Sozlamalar' :
                                  activeSection === 'CRM' ? 'Smart CRM' :
                                    activeSection === 'AI_CONSOLE' ? 'AI Console' : 'Boshqaruv'}
                </h1>
                {!isMobile && (
                  <p className="text-sm font-bold text-gray-400 mt-1">
                    Xush kelibsiz, {profile.name || 'Admin'}! Tizim barqaror ishlayapti.
                  </p>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex items-center gap-3">
              {!isMobile && (
                <>
                  <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-colors">
                    Eksport
                  </button>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
                    + Yangi
                  </button>
                </>
              )}
              <button
                onClick={onLogout}
                className={`${isMobile ? 'p-2' : 'px-4 py-2'} bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-sm font-bold hover:bg-rose-100 transition-colors flex items-center gap-2`}
                title="Chiqish"
              >
                {isMobile ? <LogOut size={20} /> : <span>Chiqish</span>}
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="relative z-10">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminView;