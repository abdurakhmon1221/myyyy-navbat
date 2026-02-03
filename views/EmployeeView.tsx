
import React, { useState, useEffect, useRef } from 'react';
import { Organization, Employee, QueueItem } from '../types';
import { announceTicketCall } from '../services/voiceService';
import { useLanguage } from '../contexts/LanguageContext';
import { haptics } from '../services/haptics';

// Extracted Components
import EmployeeDashboard from '../components/employee/EmployeeDashboard';
import { SkipModal, TransferModal, SummaryModal } from '../components/employee/EmployeeModals';
import { User, Camera, X } from 'lucide-react';
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
  const [servingTicket, setServingTicket] = useState<QueueItem | null>(null);
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

  useEffect(() => {
    let timer: any;
    if (servingTicket && !isPaused) {
      timer = setInterval(() => setServiceTimer(prev => prev + 1), 1000);
    } else if (isPaused) {
      timer = setInterval(() => setBreakTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [servingTicket, isPaused]);

  useEffect(() => {
    const checkQueues = () => {
      const saved = localStorage.getItem('navbat_active_queues');
      if (saved) {
        const queues: QueueItem[] = JSON.parse(saved);
        const filtered = queues.filter(q => q.organizationId === organization.id && q.status === 'WAITING');
        setWaitingCount(filtered.length);
        setNextClient(filtered[0] || null);
      }
    };
    checkQueues();
    const interval = setInterval(checkQueues, 5000);
    return () => clearInterval(interval);
  }, [organization.id]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCallNext = () => {
    if (isEmergencyStopped) return;
    const saved = localStorage.getItem('navbat_active_queues');
    if (saved) {
      const queues: QueueItem[] = JSON.parse(saved);
      const nextIndex = queues.findIndex(q => q.organizationId === organization.id && q.status === 'WAITING');
      if (nextIndex !== -1) {
        const next = queues[nextIndex];
        next.status = 'CALLED';
        setServingTicket(next);
        localStorage.setItem('navbat_active_queues', JSON.stringify(queues));
        announceTicketCall(next.number, 4, language);
        haptics.heavy();
      }
    }
  };

  const handleFinish = () => {
    if (!servingTicket) return;
    haptics.success();
    const saved = localStorage.getItem('navbat_active_queues');
    if (saved) {
      const queues: QueueItem[] = JSON.parse(saved);
      const filtered = queues.filter(q => q.id !== servingTicket.id);
      localStorage.setItem('navbat_active_queues', JSON.stringify(filtered));
    }
    setServingTicket(null);
    setServiceTimer(0);
  };

  const handleSkip = (reason: string) => {
    if (!servingTicket) return;
    handleFinish();
    setShowSkipModal(false);
  };

  const handleTransfer = (target: string) => {
    if (!servingTicket) return;
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
    </div>
  );
};

export default EmployeeView;