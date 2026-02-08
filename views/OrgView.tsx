
import React, { useState, useEffect, Suspense } from 'react';
import { UserRole, Organization, QueueItem } from '../types';
import { useOrganizations } from '../hooks/useOrganizations';
import { haptics } from '../services/haptics';
import { useModal } from '../hooks/useModal';

// Extracted Components
import OrgDashboard from '../components/org/OrgDashboard';
import OrgAnalytics from '../components/org/OrgAnalytics';
import OrgEmployees from '../components/org/OrgEmployees';
import OrgServices from '../components/org/OrgServices';
import OrgQueueJournal from '../components/org/OrgQueueJournal';
import OrgSettings from '../components/org/OrgSettings';
import { BroadcastModal, AuditLogsModal, TVModeOverlay } from '../components/org/OrgModals';
import { QrCode, Download, ChevronLeft } from 'lucide-react';
import ProfilePage from '../components/shared/ProfilePage';
import LazyLoading from '../components/shared/LazyLoading';
import { SoloQRModal } from '../components/solo/SoloModals';

// Lazy loaded components (reusing Solo components where applicable or new Org versions)
const FinanceManager = React.lazy(() => import('../components/solo/FinanceManager'));
const CustomerDatabase = React.lazy(() => import('../components/solo/CustomerDatabase'));
const CalendarView = React.lazy(() => import('../components/solo/CalendarView'));
const InventoryManager = React.lazy(() => import('../components/solo/InventoryManager'));
const MarketingHub = React.lazy(() => import('../components/solo/MarketingHub'));


interface OrgViewProps {
  role: UserRole;
  onLogout?: () => void;
  profile: any;
  onUpdateProfile: (data: any) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const OrgView: React.FC<OrgViewProps> = ({ role, onLogout, profile, onUpdateProfile, activeTab, setActiveTab }) => {
  const { organizations, updateOrganization } = useOrganizations();
  const [liveQueues, setLiveQueues] = useState<QueueItem[]>([]);
  const [appointmentQueues, setAppointmentQueues] = useState<QueueItem[]>([]);
  const [org, setOrg] = useState<Organization>({
    id: 'default',
    name: profile.name || 'My Organization',
    address: profile.address || '',
    category: 'Other',
    status: 'OPEN',
    services: [],
    employees: [],
    workingHours: { days: [1, 2, 3, 4, 5], open: '09:00', close: '18:00' },
    location: { lat: 41, lng: 69 },
    estimatedServiceTime: 15,
    earnedBadges: []
  });

  useEffect(() => {
    if (organizations.length > 0) {
      // Try to find the user's organization
      const userOrg = organizations.find(o => o.id === (profile.organizationId || profile.id));

      if (userOrg) {
        setOrg(userOrg);
      } else {
        // Fallback for new users or if org not found in list yet
        setOrg(prev => ({
          ...prev,
          id: profile.organizationId || profile.id || prev.id,
          name: profile.name || prev.name,
          address: profile.address || prev.address
        }));
      }
    }
  }, [organizations, profile]);

  const { modals, openModal, closeModal } = useModal([
    'qr', 'finance', 'customers', 'calendar', 'inventory', 'marketing'
  ]);

  const [editName, setEditName] = useState(profile.name || '');
  const [editAddress, setEditAddress] = useState(profile.address || '');
  const [editImage, setEditImage] = useState(profile.imageUrl || '');
  const [showOrgSettings, setShowOrgSettings] = useState(false);

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

  return (
    <div className="max-w-4xl mx-auto p-6 pb-24">
      {activeTab === 'DASHBOARD' && (
        <OrgDashboard
          org={org} liveQueues={liveQueues}
          appointmentQueues={appointmentQueues}
          handleStatusChange={handleStatusChange}
          setShowAuditLogs={setShowAuditLogs}
          setShowBroadcastModal={setShowBroadcastModal}
          setShowTVMode={setShowTVMode}
          setActiveTab={setActiveTab}
          openModal={openModal}
        />
      )}

      {activeTab === 'JOURNAL' && <OrgQueueJournal />}
      {activeTab === 'ANALYTICS' && <OrgAnalytics />}
      {activeTab === 'EMPLOYEES' && (
        <OrgEmployees
          employees={org.employees}
          organizationId={org.id}
          organizationName={org.name}
          onUpdate={(newList) => {
            const updatedOrg = { ...org, employees: newList };
            setOrg(updatedOrg);
            updateOrganization(updatedOrg);
          }}
        />
      )}
      {activeTab === 'SERVICES' && (
        <OrgServices
          services={org.services}
          onUpdate={(newList) => {
            const updatedOrg = { ...org, services: newList };
            setOrg(updatedOrg);
            updateOrganization(updatedOrg);
          }}
        />
      )}
      {activeTab === 'SETTINGS' && (
        <div className="animate-in fade-in duration-500">
          {showOrgSettings ? (
            <div className="space-y-4">
              <button
                onClick={() => { haptics.light(); setShowOrgSettings(false); }}
                className="flex items-center gap-2 text-emerald-600 font-bold mb-4 px-2 py-2 hover:bg-emerald-50 rounded-xl transition-colors"
              >
                <ChevronLeft size={20} /> Orqaga
              </button>
              <OrgSettings
                organization={org}
                onSaveOrganization={async (updatedOrg) => {
                  setOrg(updatedOrg);
                  await updateOrganization(updatedOrg);
                  onUpdateProfile({
                    ...profile,
                    name: updatedOrg.name,
                    address: updatedOrg.address,
                    imageUrl: updatedOrg.image || updatedOrg.imageUrl
                  });
                }}
              />
            </div>
          ) : (
            <ProfilePage
              profile={profile}
              onUpdateProfile={onUpdateProfile}
              onLogout={onLogout}
              role={role}
              organization={org}
              onOpenBusinessSettings={() => setShowOrgSettings(true)}
            />
          )}
        </div>
      )}

      {activeTab === 'QR' && (
        <div className="flex justify-center items-center h-full">
          <button onClick={() => openModal('qr')} className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold">Show QR Modal</button>
        </div>
      )}

      {/* Legacy and Utility Modals */}
      <BroadcastModal
        show={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        message={broadcastMessage}
        setMessage={setBroadcastMessage}
        onSend={() => { alert("Xabar yuborildi!"); setShowBroadcastModal(false); }}
      />

      <AuditLogsModal show={showAuditLogs} onClose={() => setShowAuditLogs(false)} logs={activityLogs} />
      <TVModeOverlay show={showTVMode} onClose={() => setShowTVMode(false)} liveQueues={liveQueues} />

      {/* New Management Modals */}
      <SoloQRModal show={modals.qr} onClose={() => closeModal('qr')} organization={org} />

      <Suspense fallback={<LazyLoading size="md" />}>
        {modals.finance && <FinanceManager onClose={() => closeModal('finance')} />}
        {modals.customers && <CustomerDatabase onClose={() => closeModal('customers')} />}
        {modals.calendar && <CalendarView onClose={() => closeModal('calendar')} />}
        {modals.inventory && <InventoryManager onClose={() => closeModal('inventory')} />}
        {modals.marketing && <MarketingHub onClose={() => closeModal('marketing')} />}
      </Suspense>
    </div>
  );
};

export default OrgView;