
import React, { useState, useEffect } from 'react';
import { UserRole, Organization, QueueItem, Language } from '../types';
import {
    Clock, User as UserIcon, LogOut, Settings, Camera, X,
    Zap, Mic, DollarSign, Calendar, ListChecks, History,
    ShieldCheck, Edit3, ChevronRight, HelpCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { haptics } from '../services/haptics';
import { announceTicketCall } from '../services/voiceService';

// Extracted Components
import SoloHeader from '../components/solo/SoloHeader';
import SoloDashboard from '../components/solo/SoloDashboard';
import ProfilePage from '../components/shared/ProfilePage';

import { SoloAnalytics, SoloFinance, SoloReviews } from '../components/solo/SoloStats';
import { SoloQRModal, SoloSettingsModal } from '../components/solo/SoloModals';

interface SoloViewProps {
    organization: Organization;
    profile: any;
    onUpdateProfile: (data: any) => void;
    onLogout?: () => void;
    activeTab: string;
}

const SoloView: React.FC<SoloViewProps> = ({ organization, profile, onUpdateProfile, onLogout, activeTab }) => {
    const { language } = useLanguage();
    const [servingTicket, setServingTicket] = useState<QueueItem | null>(null);
    const [waitingCount, setWaitingCount] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isBusy, setIsBusy] = useState(false);
    const [serviceTimer, setServiceTimer] = useState(0);
    const [breakTimer, setBreakTimer] = useState(0);
    const [isRecording, setIsRecording] = useState(false);

    const [soloSubTab, setSoloSubTab] = useState<'DASHBOARD' | 'ANALYTICS' | 'REVIEWS' | 'FINANCE'>('DASHBOARD');

    const [showQR, setShowQR] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showKB, setShowKB] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [showInventoryModal, setShowInventoryModal] = useState(false);

    const [stats] = useState({
        served: 32,
        avgTime: '18m',
        rating: 4.98,
        income: '1,240,000',
        tips: '150,000',
        activeClients: 4,
        loyaltyVips: 12
    });

    const [currentNote, setCurrentNote] = useState("");

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
            }
        };
        checkQueues();
        const interval = setInterval(checkQueues, 5000);
        return () => clearInterval(interval);
    }, [organization.id]);

    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleCallNext = () => {
        const saved = localStorage.getItem('navbat_active_queues');
        if (saved) {
            const queues: QueueItem[] = JSON.parse(saved);
            const nextIndex = queues.findIndex(q => q.organizationId === organization.id && q.status === 'WAITING');
            if (nextIndex !== -1) {
                const next = queues[nextIndex];
                next.status = 'CALLED';
                setServingTicket(next);
                localStorage.setItem('navbat_active_queues', JSON.stringify(queues));
                announceTicketCall(next.number, 1, language);
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

    const toggleVoiceControl = () => {
        haptics.medium();
        setIsRecording(!isRecording);
        if (!isRecording) {
            setTimeout(() => { setIsRecording(false); handleCallNext(); }, 2000);
        }
    };

    return (
        <div className="animate-in fade-in max-w-lg mx-auto pb-24">
            <SoloHeader organization={organization} onShowQR={() => setShowQR(true)} onShowSettings={() => setShowSettings(true)} soloSubTab={soloSubTab} setSoloSubTab={setSoloSubTab} haptics={haptics} />

            {activeTab === 'DASHBOARD' && (
                <>
                    {soloSubTab === 'DASHBOARD' && (
                        <SoloDashboard
                            stats={stats} servingTicket={servingTicket} waitingCount={waitingCount}
                            handleCallNext={handleCallNext} toggleVoiceControl={toggleVoiceControl}
                            isRecording={isRecording} isPaused={isPaused} setIsPaused={setIsPaused}
                            breakTimer={breakTimer} isBusy={isBusy} setIsBusy={setIsBusy}
                            formatTime={formatTime} serviceTimer={serviceTimer}
                            setShowNoteModal={setShowNoteModal} handleFinish={handleFinish}
                            haptics={haptics} language={language} announceTicketCall={announceTicketCall}
                            setServingTicket={setServingTicket} setShowHistory={setShowHistory}
                            setShowKB={setShowKB} setShowInventoryModal={setShowInventoryModal}
                        />
                    )}
                    {soloSubTab === 'ANALYTICS' && <SoloAnalytics stats={stats} />}
                    {soloSubTab === 'FINANCE' && <SoloFinance stats={stats} />}
                    {soloSubTab === 'REVIEWS' && <SoloReviews stats={stats} />}
                </>
            )}

            {activeTab === 'PROFILE' && (
                <ProfilePage
                    profile={profile}
                    onUpdateProfile={onUpdateProfile}
                    onLogout={onLogout}
                    role="SOLO"
                />
            )}


            <SoloQRModal show={showQR} onClose={() => setShowQR(false)} />
            <SoloSettingsModal show={showSettings} onClose={() => setShowSettings(false)} orgName={organization.name} haptics={haptics} />

            {showNoteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[1500] flex items-center justify-center p-6 animate-in zoom-in duration-500">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[4rem] p-12 shadow-2xl space-y-8 relative">
                        <div className="flex justify-between items-center"><h3 className="text-2xl font-[1000] italic text-indigo-600">CLIENT NOTE</h3><button onClick={() => setShowNoteModal(false)}><X /></button></div>
                        <textarea className="w-full h-40 bg-gray-50 p-6 rounded-[2rem] font-bold text-sm outline-none border-4 border-transparent focus:border-indigo-100 resize-none" placeholder="Mijoz uchun xizmat turi, soch stili..." value={currentNote} onChange={(e) => setCurrentNote(e.target.value)} />
                        <button onClick={() => setShowNoteModal(false)} className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95">QAYD ETISH</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SoloView;
