import React, { useState, useEffect } from 'react';
import { Organization, Employee, QueueItem } from '../types';
import { announceTicketCall } from '../services/voiceService';
import { useLanguage } from '../contexts/LanguageContext';
import { haptics } from '../services/haptics';
import api from '../services/api';
import { useQueueSubscription } from '../hooks/useQueueSubscription';

// Extracted Components
import EmployeeDashboard from '../components/employee/EmployeeDashboard';
import { SkipModal, TransferModal, SummaryModal, GuideModal } from '../components/employee/EmployeeModals';
import { SoloQRModal } from '../components/solo/SoloModals';
import ProfilePage from '../components/shared/ProfilePage';

interface EmployeeViewProps {
  organization: Organization;
  employee: Employee;
  onLogout?: () => void;
  profile: any;
  onUpdateProfile: (data: any) => void;
  activeTab: string;
}

const EmployeeView: React.FC<EmployeeViewProps> = ({ organization, employee, onLogout, profile, onUpdateProfile, activeTab }) => {
  const { language } = useLanguage();
  const { queue, forceRefresh } = useQueueSubscription(organization.id);

  const [servingTicket, setServingTicket] = useState<QueueItem | null>(null);
  const [activeQueue, setActiveQueue] = useState<QueueItem[]>([]);
  const [waitingCount, setWaitingCount] = useState(0);
  const [serviceTimer, setServiceTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [breakTimer, setBreakTimer] = useState(0);
  const [nextClient, setNextClient] = useState<QueueItem | null>(null);
  const [onHold, setOnHold] = useState(false);
  const [isEmergencyStopped, setIsEmergencyStopped] = useState(false);

  // Modals
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showKBModal, setShowKBModal] = useState(false);

  const [dailyStats] = useState({ served: 24, avgTime: '12m', rating: 4.9, target: 50 });

  const [loading, setLoading] = useState(false);

  // Sync with subscription
  useEffect(() => {
    setWaitingCount(queue.filter(q => q.status === 'WAITING').length);
    setNextClient(queue.find(q => q.status === 'WAITING') || null);
    // Also check if I am serving a ticket? 
    // Usually serving ticket is local state, but backend might say I am serving X.
    // For now stick to local unless refreshed.
  }, [queue]);

  const refreshQueue = forceRefresh; // Alias for compatibility

  useEffect(() => {
    let timer: any;
    if (servingTicket && !isPaused) {
      timer = setInterval(() => setServiceTimer(prev => prev + 1), 1000);
    } else if (isPaused) {
      timer = setInterval(() => setBreakTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [servingTicket, isPaused]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCallNext = async () => {
    if (isEmergencyStopped || !nextClient) return;

    setLoading(true);
    try {
      const res = await api.queues.updateStatus(nextClient.id, 'CALLED', employee.id);
      if (res.success) {
        setServingTicket(res.data);
        announceTicketCall(res.data.number, 1, language); // Defaulting to window 1 for now
        haptics.heavy();
        refreshQueue();
      }
    } catch (e) {
      console.error("Failed to call next", e);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    if (!servingTicket) return;

    haptics.success();
    try {
      await api.queues.updateStatus(servingTicket.id, 'SERVED', employee.id);
      setServingTicket(null);
      setServiceTimer(0);
      refreshQueue();
    } catch (e) {
      console.error("Failed to finish", e);
    }
  };

  const handleSkip = async (reason: string) => {
    if (!servingTicket) return;
    try {
      // Assuming 'SKIPPED' status exists or we use cancel/update
      await api.queues.updateStatus(servingTicket.id, 'SKIPPED', employee.id);
      setServingTicket(null);
      setServiceTimer(0);
      setShowSkipModal(false);
      refreshQueue();
    } catch (e) {
      console.error("Failed to skip", e);
    }
  };

  const handleTransfer = (target: string) => {
    if (!servingTicket) return;
    // For now just finish, as transfer logic mimics finish in local version
    handleFinish();
    setShowTransferModal(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      {activeTab === 'WORK' && (
        <EmployeeDashboard
          dailyStats={dailyStats} servingTicket={servingTicket}
          waitingCount={waitingCount} nextClient={nextClient}
          isPaused={isPaused} isEmergencyStopped={isEmergencyStopped}
          breakTimer={breakTimer} serviceTimer={serviceTimer}
          formatTime={formatTime} handleCallNext={handleCallNext}
          handleRecall={() => servingTicket && announceTicketCall(servingTicket.number, 4, language)}
          handleFinish={handleFinish} handleHold={() => setOnHold(!onHold)}
          onHold={onHold} setShowSkipModal={setShowSkipModal}
          setShowTransferModal={setShowTransferModal} setIsPaused={setIsPaused}
          setBreakTimer={setBreakTimer} setIsEmergencyStopped={setIsEmergencyStopped}
          setShowQRModal={setShowQRModal} setShowKBModal={setShowKBModal}
          setShowSummaryModal={setShowSummaryModal} setShowHistoryModal={setShowHistoryModal}
        />
      )}

      {activeTab === 'PROFILE' && (
        <ProfilePage
          profile={profile}
          onUpdateProfile={onUpdateProfile}
          onLogout={onLogout}
          role="EMPLOYEE"
        />
      )}

      <SkipModal show={showSkipModal} onClose={() => setShowSkipModal(false)} onSkip={handleSkip} />
      <TransferModal show={showTransferModal} onClose={() => setShowTransferModal(false)} onTransfer={handleTransfer} />
      <SummaryModal show={showSummaryModal} onClose={() => setShowSummaryModal(false)} dailyStats={dailyStats} />

      {/* New Modals */}
      <SoloQRModal show={showQRModal} onClose={() => setShowQRModal(false)} organization={organization} />
      <GuideModal show={showKBModal} onClose={() => setShowKBModal(false)} />
    </div>
  );
};

export default EmployeeView;