
import React, { useState, useEffect, Suspense } from 'react';
import { Organization, QueueItem } from '../types';
import {
    Clock, Users, Star, DollarSign, Heart, Mic, MicOff,
    PauseCircle, PlayCircle, Coffee, CheckCircle2, Volume2,
    Wallet, Package, Megaphone, Scissors, Calendar, TrendingUp,
    PieChart, MessageSquare, Award, Target, Zap, ChevronLeft
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { haptics } from '../services/haptics';
import { announceTicketCall } from '../services/voiceService';

// Hooks
import { useQueue } from '../hooks/useQueue';
import { useModal } from '../hooks/useModal';
import { useSoloState } from '../hooks/useSoloState';

// Components
import SoloHeader from '../components/solo/SoloHeader';
import ProfilePage from '../components/shared/ProfilePage';
import OrgSettings from '../components/org/OrgSettings';
import { SoloQRModal, SoloSettingsModal } from '../components/solo/SoloModals';
import LazyLoading from '../components/shared/LazyLoading';

// Lazy loaded components
const FinanceManager = React.lazy(() => import('../components/solo/FinanceManager'));
const CustomerDatabase = React.lazy(() => import('../components/solo/CustomerDatabase'));
const CalendarView = React.lazy(() => import('../components/solo/CalendarView'));
const InventoryManager = React.lazy(() => import('../components/solo/InventoryManager'));
const MarketingHub = React.lazy(() => import('../components/solo/MarketingHub'));
const ServiceMenu = React.lazy(() => import('../components/solo/ServiceMenu'));

interface SoloViewProps {
    organization: Organization;
    profile: any;
    onUpdateProfile: (data: any) => void;
    onUpdateOrganization?: (org: Organization) => Promise<void>;
    onLogout?: () => void;
    activeTab: string;
}

const SoloView: React.FC<SoloViewProps> = ({ organization, profile, onUpdateProfile, onUpdateOrganization, onLogout, activeTab }) => {
    const { language, t } = useLanguage();
    const { activeQueues, updateQueueStatus } = useQueue(profile.phone);
    const { modals, openModal, closeModal } = useModal([
        'qr', 'settings', 'note', 'finance', 'customers', 'calendar', 'inventory', 'marketing', 'services'
    ]);

    const {
        servingTicket, setServingTicket,
        isPaused, setIsPaused,
        isBusy, setIsBusy,
        serviceTimer, breakTimer,
        currentNote, setCurrentNote
    } = useSoloState(organization.id);

    const [waitingCount, setWaitingCount] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [analyticsTab, setAnalyticsTab] = useState<'STATS' | 'FINANCE' | 'REVIEWS'>('STATS');
    const [showOrgSettings, setShowOrgSettings] = useState(false);

    // Stats - Set to 0 for initial state
    const [stats] = useState({
        served: 0,
        avgTime: '0m',
        rating: 0,
        income: '0',
        tips: '0',
        activeClients: 0,
        loyaltyVips: 0,
        todayBookings: 0,
        pendingReviews: 0,
        weeklyGrowth: '0%',
        monthlyClients: 0,
        repeatRate: '0%'
    });

    useEffect(() => {
        const waiting = activeQueues.filter(q => q.organizationId === organization.id && q.status === 'WAITING');
        setWaitingCount(waiting.length);
    }, [activeQueues, organization.id]);

    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleCallNext = () => {
        haptics.heavy();
        const nextTicket = activeQueues.find(q => q.organizationId === organization.id && q.status === 'WAITING');
        if (nextTicket) {
            updateQueueStatus(nextTicket.id, 'CALLED');
            setServingTicket(nextTicket);
            announceTicketCall(nextTicket.number.toString(), 1, language);
        } else {
            // No waiting tickets - simply do nothing or show toast
            // Removed demo ticket creation
        }
    };

    const handleFinish = () => {
        if (!servingTicket) return;
        haptics.success();
        updateQueueStatus(servingTicket.id, 'SERVED');
        setServingTicket(null);
    };

    const toggleVoiceControl = () => {
        haptics.medium();
        setIsRecording(!isRecording);
        if (!isRecording) setTimeout(() => { setIsRecording(false); handleCallNext(); }, 2000);
    };

    // ==================== TAB 1: ASOSIY (Main) - Live Queue Only ====================
    const renderMainTab = () => (
        <div className="space-y-6 animate-in fade-in duration-500 p-4">
            {/* Header with Status */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-[1000] text-[var(--text-main)]">{organization.name}</h1>
                    <p className="text-xs font-bold text-[var(--text-muted)]">
                        {isPaused ? '⏸️ Tanaffusda' : isBusy ? '🔴 Band' : '🟢 Faol'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => openModal('qr')} className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                    </button>
                    <button onClick={() => openModal('settings')} className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-gray-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                </div>
            </div>

            {/* Live Queue Console */}
            <div className={`bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-xl border-4 transition-all ${servingTicket ? 'border-emerald-500' : 'border-[var(--border-main)]'}`}>
                {!servingTicket ? (
                    <div className="text-center space-y-6">
                        <div className="relative inline-block">
                            <div className="w-24 h-24 bg-gray-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center">
                                <Users size={48} className="text-gray-300" />
                            </div>
                            {waitingCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-rose-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-sm animate-bounce">{waitingCount}</span>
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-[1000] text-[var(--text-main)]">NAVBAT QABULI</h3>
                            <p className="text-xs text-[var(--text-muted)]">Kutmoqda: <span className="text-rose-600 font-black">{waitingCount}</span> kishi</p>
                        </div>
                        <button
                            onClick={handleCallNext}
                            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            <Users size={20} /> KEYINGI MIJOZ
                        </button>
                    </div>
                ) : (
                    <div className="text-center space-y-6 animate-in zoom-in">
                        <div className="flex justify-between items-center">
                            <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase animate-pulse">XIZMATDA</span>
                            <div className="flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-full text-rose-600">
                                <Clock size={16} className="animate-spin" style={{ animationDuration: '3s' }} />
                                <span className="font-[1000] text-lg">{formatTime(serviceTimer)}</span>
                            </div>
                        </div>
                        <div className="py-4">
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Chipta</p>
                            <h2 className="text-6xl font-[1000] text-indigo-600">{servingTicket?.number}</h2>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => { announceTicketCall(String(servingTicket?.number), 1, language); }} className="flex-1 bg-amber-100 text-amber-700 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2">
                                <Volume2 size={18} /> QAYTA CHAQIRISH
                            </button>
                            <button onClick={handleFinish} className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2">
                                <CheckCircle2 size={18} /> YAKUNLASH
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Status Controls */}
            <div className="flex gap-3">
                <button onClick={() => { haptics.light(); setIsPaused(!isPaused); }} className={`flex-1 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all ${isPaused ? 'bg-amber-500 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-500'}`}>
                    {isPaused ? <PlayCircle size={18} /> : <PauseCircle size={18} />}
                    {isPaused ? `Davom (${formatTime(breakTimer)})` : 'Tanaffus'}
                </button>
                <button onClick={() => { haptics.light(); setIsBusy(!isBusy); }} className={`flex-1 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all ${isBusy ? 'bg-rose-500 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-500'}`}>
                    <Coffee size={18} /> {isBusy ? 'Band' : "Bo'sh"}
                </button>
                <button onClick={toggleVoiceControl} className={`w-14 rounded-2xl flex items-center justify-center transition-all ${isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-slate-800 text-gray-500'}`}>
                    {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
            </div>

            {/* Today's Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[var(--border-main)] text-center">
                    <p className="text-2xl font-[1000] text-indigo-600">{stats.served}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Xizmat qilindi</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[var(--border-main)] text-center">
                    <p className="text-2xl font-[1000] text-emerald-600">{stats.income}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Tushum</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[var(--border-main)] text-center">
                    <p className="text-2xl font-[1000] text-amber-600">{stats.rating}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Reyting</p>
                </div>
            </div>
        </div>
    );

    // ==================== TAB 2: BOSHQARUV (Management) - Quick Tools ====================
    const renderManageTab = () => (
        <div className="space-y-4 animate-in fade-in duration-500 p-4">
            <h2 className="text-xl font-[1000] text-[var(--text-main)] mb-4">Boshqaruv Paneli</h2>

            {/* Quick Tools - Vertical List */}
            <div className="space-y-3">
                {[
                    { label: 'Moliya Boshqaruvi', desc: 'Daromad, xarajat, hisobotlar', icon: <Wallet size={24} />, color: 'text-emerald-600 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30', action: () => openModal('finance') },
                    { label: 'Mijozlar Bazasi', desc: 'CRM va mijozlar tarixi', icon: <Users size={24} />, color: 'text-indigo-600 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30', action: () => openModal('customers') },
                    { label: 'Kalendar va Bronlar', desc: 'Uchrashuvlar va jadval', icon: <Calendar size={24} />, color: 'text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30', action: () => openModal('calendar') },
                    { label: 'Ombor va Inventar', desc: 'Mahsulotlar boshqaruvi', icon: <Package size={24} />, color: 'text-amber-600 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30', action: () => openModal('inventory') },
                    { label: 'Marketing va Reklama', desc: 'Aksiyalar va kampaniyalar', icon: <Megaphone size={24} />, color: 'text-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30', action: () => openModal('marketing') },
                    { label: 'Xizmatlar Menyusi', desc: 'Narxlar va xizmat turlari', icon: <Scissors size={24} />, color: 'text-teal-600 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30', action: () => openModal('services') },
                ].map((tool, i) => (
                    <button
                        key={i}
                        onClick={tool.action}
                        className="w-full bg-white dark:bg-slate-900 p-3 md:p-4 rounded-2xl border border-[var(--border-main)] shadow-sm hover:shadow-xl transition-all flex items-center gap-3 md:gap-4 group active:scale-[0.98]"
                    >
                        <div className={`w-12 h-12 md:w-14 md:h-14 ${tool.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0`}>
                            {tool.icon}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <h4 className="text-xs md:text-sm font-black text-[var(--text-main)] group-hover:text-indigo-600 transition-colors truncate">{tool.label}</h4>
                            <p className="text-[9px] md:text-[10px] font-bold text-[var(--text-muted)] truncate">{tool.desc}</p>
                        </div>
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-gray-300 group-hover:text-indigo-600 transition-all shrink-0">
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );

    // ==================== TAB 3: TAHLIL (Analytics) ====================
    const renderAnalyticsTab = () => (
        <div className="space-y-4 animate-in fade-in duration-500 p-4">
            {/* Sub-tabs */}
            <div className="flex gap-2 bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl">
                {[
                    { id: 'STATS', label: 'Statistika', icon: <TrendingUp size={16} /> },
                    { id: 'FINANCE', label: 'Moliya', icon: <DollarSign size={16} /> },
                    { id: 'REVIEWS', label: 'Sharhlar', icon: <Star size={16} /> },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setAnalyticsTab(tab.id as any)}
                        className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-2 transition-all ${analyticsTab === tab.id ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-gray-500'}`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {analyticsTab === 'STATS' && (
                <div className="space-y-4">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Haftalik o\'sish', val: stats.weeklyGrowth, icon: <TrendingUp size={20} />, color: 'text-emerald-600 bg-emerald-50' },
                            { label: 'Oylik mijozlar', val: stats.monthlyClients, icon: <Users size={20} />, color: 'text-indigo-600 bg-indigo-50' },
                            { label: 'Takroriy tashrif', val: stats.repeatRate, icon: <Target size={20} />, color: 'text-amber-600 bg-amber-50' },
                            { label: 'VIP mijozlar', val: stats.loyaltyVips, icon: <Award size={20} />, color: 'text-purple-600 bg-purple-50' },
                        ].map((kpi, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[var(--border-main)]">
                                <div className={`w-10 h-10 ${kpi.color} rounded-xl flex items-center justify-center mb-3`}>{kpi.icon}</div>
                                <p className="text-2xl font-[1000] text-[var(--text-main)]">{kpi.val}</p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase">{kpi.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Progress Bars */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-[var(--border-main)] space-y-4">
                        <h3 className="font-black text-sm mb-4">Mijozlar Tahlili</h3>
                        {[
                            { label: 'Yangi mijozlar', val: 40, color: 'bg-indigo-600' },
                            { label: 'Doimiy mijozlar', val: 60, color: 'bg-emerald-600' },
                            { label: 'Qoniqish darajasi', val: 98, color: 'bg-amber-500' }
                        ].map((item, i) => (
                            <div key={i} className="space-y-1">
                                <div className="flex justify-between text-[10px] font-bold">
                                    <span className="text-gray-600">{item.label}</span>
                                    <span className="text-gray-400">{item.val}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.val}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {analyticsTab === 'FINANCE' && (
                <div className="space-y-4">
                    {/* Income Card */}
                    <div className="bg-gradient-to-br from-gray-900 to-slate-800 rounded-[2rem] p-8 text-white">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Bugungi tushum</p>
                        <h2 className="text-4xl font-[1000]">{stats.income} <span className="text-sm opacity-50">UZS</span></h2>
                        <div className="flex gap-4 mt-6">
                            <div>
                                <p className="text-xs opacity-50">Choyxo'r</p>
                                <p className="text-lg font-black">{stats.tips} UZS</p>
                            </div>
                            <div>
                                <p className="text-xs opacity-50">Xizmatlar</p>
                                <p className="text-lg font-black">{stats.served} ta</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[var(--border-main)]">
                        <h3 className="font-black text-sm mb-4">So'nggi operatsiyalar</h3>
                        {stats.income === '0' ? (
                            <div className="text-center py-4 text-gray-400 text-xs">
                                Hozircha operatsiyalar yo'q
                            </div>
                        ) : (
                            [
                                // Real transactions would be mapped here
                            ].map((tx: any, i) => (
                                <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-slate-800 last:border-0">
                                    <div>
                                        <p className="font-bold text-sm text-[var(--text-main)]">{tx.name}</p>
                                        <p className="text-[10px] text-gray-400">{tx.time}</p>
                                    </div>
                                    <span className="font-black text-emerald-600">{tx.amount}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {analyticsTab === 'REVIEWS' && (
                <div className="space-y-4">
                    {/* Rating Overview */}
                    <div className="flex gap-4">
                        <div className="flex-1 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-[var(--border-main)] text-center">
                            <h2 className="text-4xl font-[1000] text-amber-500">{stats.rating}</h2>
                            <div className="flex justify-center gap-0.5 my-2">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className={s <= 5 ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />)}
                            </div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase">O'rtacha ball</p>
                        </div>
                        <div className="flex-1 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-[var(--border-main)] text-center">
                            <h2 className="text-4xl font-[1000] text-indigo-600">1.2k</h2>
                            <p className="text-[9px] font-bold text-gray-400 uppercase mt-2">Jami sharhlar</p>
                        </div>
                    </div>

                    {/* Recent Reviews */}
                    <div className="space-y-3">
                        {stats.pendingReviews === 0 ? (
                            <div className="text-center py-8 bg-white dark:bg-slate-900 rounded-2xl border border-[var(--border-main)]">
                                <MessageSquare size={32} className="mx-auto text-gray-300 mb-2" />
                                <p className="text-xs text-gray-400">Hozircha sharhlar yo'q</p>
                            </div>
                        ) : (
                            [
                                // Real reviews would go here
                            ].map((r: any, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[var(--border-main)]">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-black text-gray-600">{r.user[0]}</div>
                                            <div>
                                                <h5 className="text-sm font-black">{r.user}</h5>
                                                <p className="text-[9px] text-gray-400">{r.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} className={s <= r.score ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />)}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-600 italic">"{r.text}"</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    // ==================== TAB 4: PROFIL ====================
    // ==================== TAB 4: PROFIL ====================
    const renderProfileTab = () => (
        <div className="animate-in fade-in duration-500">
            {showOrgSettings && onUpdateOrganization ? (
                <div className="space-y-4">
                    <button
                        onClick={() => { haptics.light(); setShowOrgSettings(false); }}
                        className="flex items-center gap-2 text-emerald-600 font-bold px-2 py-2 hover:bg-emerald-50 rounded-xl transition-colors"
                    >
                        <ChevronLeft size={20} /> Orqaga
                    </button>
                    <OrgSettings
                        organization={organization}
                        onSaveOrganization={async (updatedOrg) => {
                            await onUpdateOrganization(updatedOrg);
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
                    role="SOLO"
                    organization={organization}
                    onOpenBusinessSettings={() => setShowOrgSettings(true)}
                />
            )}
        </div>
    );

    return (
        <div className="max-w-lg mx-auto pb-24">
            {activeTab === 'MAIN' && renderMainTab()}
            {activeTab === 'MANAGE' && renderManageTab()}
            {activeTab === 'ANALYTICS' && renderAnalyticsTab()}
            {activeTab === 'PROFILE' && renderProfileTab()}

            {/* Legacy support */}
            {activeTab === 'DASHBOARD' && renderMainTab()}
            {activeTab === 'SETTINGS' && renderProfileTab()}

            {/* Modals */}
            <SoloQRModal show={modals.qr} onClose={() => closeModal('qr')} organization={organization} />
            <SoloSettingsModal show={modals.settings} onClose={() => closeModal('settings')} orgName={organization.name} haptics={haptics} />

            <Suspense fallback={<LazyLoading size="md" />}>
                {modals.finance && <FinanceManager onClose={() => closeModal('finance')} />}
                {modals.customers && <CustomerDatabase onClose={() => closeModal('customers')} />}
                {modals.calendar && <CalendarView onClose={() => closeModal('calendar')} />}
                {modals.inventory && <InventoryManager onClose={() => closeModal('inventory')} />}
                {modals.marketing && <MarketingHub onClose={() => closeModal('marketing')} />}
                {modals.services && <ServiceMenu onClose={() => closeModal('services')} />}
            </Suspense>
        </div>
    );
};

export default SoloView;
