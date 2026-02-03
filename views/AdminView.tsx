
import React, { useState } from 'react';
import { UserRole, AdminSection } from '../types';
import { haptics } from '../services/haptics';

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
  const [activeSection, setActiveSection] = useState<AdminSection>((activeTab as AdminSection) || 'DASHBOARD');

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
      case 'PROFILE' as any: return <ProfilePage profile={profile} onUpdateProfile={onUpdateProfile} onLogout={onLogout} role="ADMIN" />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#FDFDFF] overflow-hidden">
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={(s) => { haptics.light(); setActiveSection(s); }}
        onLogout={onLogout}
        profileName={profile.name || 'Admin'}
        profileRole={role}
        profileImage={profile.imageUrl}
      />

      <main className="flex-1 overflow-y-auto p-12 custom-scrollbar">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminView;