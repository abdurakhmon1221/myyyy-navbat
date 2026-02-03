
import React, { useState, useEffect } from 'react';
import { UserRole, Organization, QueueItem } from '../types';
import { MOCK_ORGANIZATIONS } from '../constants';
import { haptics } from '../services/haptics';

// Extracted Components
import OrgDashboard from '../components/org/OrgDashboard';
import OrgAnalytics from '../components/org/OrgAnalytics';
import OrgEmployees from '../components/org/OrgEmployees';
import OrgServices from '../components/org/OrgServices';
import OrgSettings from '../components/org/OrgSettings';
import { BroadcastModal, AuditLogsModal, TVModeOverlay } from '../components/org/OrgModals';
import { QrCode, Download } from 'lucide-react';
import ProfilePage from '../components/shared/ProfilePage';


interface OrgViewProps {
  role: UserRole;
  onLogout?: () => void;
  profile: any;
  onUpdateProfile: (data: any) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const OrgView: React.FC<OrgViewProps> = ({ role, onLogout, profile, onUpdateProfile, activeTab, setActiveTab }) => {
  const [liveQueues, setLiveQueues] = useState<QueueItem[]>([]);
  const [appointmentQueues, setAppointmentQueues] = useState<QueueItem[]>([]);
  const [org, setOrg] = useState<Organization>({
    ...MOCK_ORGANIZATIONS[0],
    name: profile.name || '',
    address: profile.address || '',
    imageUrl: profile.imageUrl || '',
    category: profile.category || 'Other'
  });

  const [editName, setEditName] = useState(profile.name || '');
  const [editAddress, setEditAddress] = useState(profile.address || '');
  const [editImage, setEditImage] = useState(profile.imageUrl || '');

  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [showTVMode, setShowTVMode] = useState(false);
  const [activityLogs] = useState([
    { id: 1, action: 'Navbat chaqirildi', target: 'A-12', time: '10:15', actor: 'Alijon' }
  ]);

  useEffect(() => {
    const fetchRealStats = () => {
      const saved = localStorage.getItem('navbat_active_queues');
      if (saved) {
        const queues: QueueItem[] = JSON.parse(saved);
        const orgQueues = queues.filter(q => q.organizationId === org.id);
        setLiveQueues(orgQueues.filter(q => !q.appointmentTime && q.status === 'WAITING'));
        setAppointmentQueues(orgQueues.filter(q => !!q.appointmentTime && q.status === 'WAITING'));
      }
    };
    fetchRealStats();
    const interval = setInterval(fetchRealStats, 5000);
    return () => clearInterval(interval);
  }, [org.id]);

  const handleStatusChange = (newStatus: 'OPEN' | 'CLOSED' | 'BUSY') => {
    haptics.medium();
    setOrg(prev => ({ ...prev, status: newStatus }));
  };

  const handleSaveProfile = () => {
    onUpdateProfile({ name: editName, address: editAddress, imageUrl: editImage });
    setOrg(prev => ({ ...prev, name: editName, address: editAddress, imageUrl: editImage }));
    alert("Saqlandi!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {activeTab === 'DASHBOARD' && (
        <OrgDashboard
          org={org} liveQueues={liveQueues}
          appointmentQueues={appointmentQueues}
          handleStatusChange={handleStatusChange}
          setShowAuditLogs={setShowAuditLogs}
          setShowBroadcastModal={setShowBroadcastModal}
          setShowTVMode={setShowTVMode}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === 'ANALYTICS' && <OrgAnalytics />}
      {activeTab === 'EMPLOYEES' && <OrgEmployees employees={org.employees} />}
      {activeTab === 'SERVICES' && <OrgServices services={org.services} />}
      {activeTab === 'SETTINGS' && (
        <ProfilePage
          profile={profile}
          onUpdateProfile={onUpdateProfile}
          onLogout={onLogout}
          role="ORGANIZATION"
        />
      )}

      {activeTab === 'QR' && (
        <div className="p-10 text-center flex flex-col items-center gap-6 animate-in zoom-in">
          <div className="w-64 h-64 border-8 border-indigo-600/10 rounded-[3.5rem] flex items-center justify-center p-8 bg-white shadow-2xl">
            <QrCode size={180} className="text-gray-900" />
          </div>
          <button className="flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">
            <Download size={20} /> PDF YUKLASH
          </button>
          <button onClick={() => setActiveTab('DASHBOARD')} className="text-gray-400 font-bold uppercase text-[10px]">Orqaga</button>
        </div>
      )}

      <BroadcastModal
        show={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        message={broadcastMessage}
        setMessage={setBroadcastMessage}
        onSend={() => { alert("Xabar yuborildi!"); setShowBroadcastModal(false); }}
      />

      <AuditLogsModal show={showAuditLogs} onClose={() => setShowAuditLogs(false)} logs={activityLogs} />

      <TVModeOverlay show={showTVMode} onClose={() => setShowTVMode(false)} liveQueues={liveQueues} />
    </div>
  );
};

export default OrgView;