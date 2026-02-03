import React from 'react';
import {
    Users, Star, DollarSign, Heart, Zap, Mic, Coffee, Clock,
    CheckCircle2, RotateCcw, UserX, Calendar, Edit3, Smartphone,
    MessageSquare, History, LayoutGrid
} from 'lucide-react';
import { QueueItem } from '../../types';
import { ResponsiveContainer, BarChart, Bar, Cell, Tooltip, XAxis } from 'recharts';

interface SoloDashboardProps {
    stats: any;
    servingTicket: QueueItem | null;
    waitingCount: number;
    handleCallNext: () => void;
    toggleVoiceControl: () => void;
    isRecording: boolean;
    isPaused: boolean;
    setIsPaused: (v: boolean) => void;
    breakTimer: number;
    isBusy: boolean;
    setIsBusy: (v: boolean) => void;
    formatTime: (sec: number) => string;
    serviceTimer: number;
    setShowNoteModal: (v: boolean) => void;
    handleFinish: () => void;
    haptics: any;
    language: any;
    announceTicketCall: any;
    setServingTicket: (v: any) => void;
    setShowHistory: (v: boolean) => void;
    setShowKB: (v: boolean) => void;
    setShowInventoryModal: (v: boolean) => void;
}

const SoloDashboard: React.FC<SoloDashboardProps> = ({
    stats, servingTicket, waitingCount, handleCallNext, toggleVoiceControl, isRecording,
    isPaused, setIsPaused, breakTimer, isBusy, setIsBusy, formatTime, serviceTimer,
    setShowNoteModal, handleFinish, haptics, language, announceTicketCall, setServingTicket,
    setShowHistory, setShowKB, setShowInventoryModal
}) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* 1. KPIs Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Bugun', val: stats.served, trend: '+12', icon: <Users size={18} />, color: 'text-indigo-600' },
                    { label: 'Reyting', val: stats.rating, trend: 'Top 1%', icon: <Star size={18} />, color: 'text-amber-600' },
                    { label: 'Tushum', val: stats.income, trend: 'Sizga', icon: <DollarSign size={18} />, color: 'text-emerald-600' },
                    { label: 'VIP Mijoz', val: stats.loyaltyVips, trend: 'Gvardiya', icon: <Heart size={18} />, color: 'text-rose-600' }
                ].map((s, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-[var(--border-main)] shadow-sm hover:shadow-lg transition-all">
                        <div className={`${s.color} mb-4 flex justify-between items-start`}>
                            {s.icon}
                            <span className="text-[8px] font-black uppercase tracking-tighter opacity-50">{s.trend}</span>
                        </div>
                        <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">{s.label}</p>
                        <h4 className="text-xl font-[1000] text-[var(--text-main)] italic tracking-tighter whitespace-nowrap">{s.val}</h4>
                    </div>
                ))}
            </div>

            {/* 2. Main Console */}
            <div className={`bg-white dark:bg-slate-900 rounded-[4rem] p-12 shadow-2xl border-4 transition-all duration-700 relative overflow-hidden ${servingTicket ? 'border-emerald-500' : 'border-[var(--border-main)]'}`}>
                {!servingTicket ? (
                    <div className="py-12 flex flex-col items-center text-center space-y-10 relative">
                        <div className="relative group cursor-pointer" onClick={handleCallNext}>
                            <div className="w-32 h-32 bg-gray-50 dark:bg-slate-800 rounded-[3.5rem] flex items-center justify-center text-gray-300 group-hover:scale-105 transition-transform duration-500">
                                <Users size={64} />
                            </div>
                            {waitingCount > 0 && <span className="absolute -top-3 -right-3 bg-rose-500 text-white w-12 h-12 rounded-[1.5rem] flex items-center justify-center font-[1000] text-lg border-6 border-white dark:border-slate-900 animate-bounce shadow-xl">{waitingCount}</span>}
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-3xl font-[1000] text-[var(--text-main)] tracking-tighter italic">MIJOZ QABULI</h3>
                            <p className="text-xs text-[var(--text-muted)] font-black uppercase tracking-[0.3em] leading-relaxed">Navbatda {waitingCount} ta kishi sizni kutmoqda.</p>
                        </div>
                        <div className="flex gap-4 w-full max-w-sm">
                            <button onClick={handleCallNext} disabled={waitingCount === 0 || isPaused || isBusy} className="flex-[3] bg-indigo-600 text-white py-7 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-3"><Users size={18} /> KEYINGISI</button>
                            <button onClick={toggleVoiceControl} className={`flex-1 rounded-[2.5rem] flex items-center justify-center transition-all ${isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}><Mic size={24} /></button>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in zoom-in duration-500 flex flex-col items-center relative">
                        <div className="flex justify-between items-center w-full mb-12">
                            <div className="flex items-center gap-3"><span className="bg-emerald-500 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse shadow-lg shadow-emerald-100">XIZMATDA</span></div>
                            <div className="flex items-center gap-3 text-rose-500 bg-rose-50 px-5 py-2 rounded-full border border-rose-100"><Clock size={18} className="animate-spin-slow" /><span className="text-xl font-[1000] italic leading-none">{formatTime(serviceTimer)}</span></div>
                        </div>
                        <div className="mb-12 text-center group cursor-pointer" onClick={() => setShowNoteModal(true)}>
                            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-3 opacity-40">Mijoz kodi</p>
                            <h1 className="text-9xl font-[1000] text-gray-900 tracking-tighter italic leading-none group-hover:scale-105 transition-transform">{servingTicket.number}</h1>
                        </div>
                        <div className="flex gap-5 w-full">
                            <button onClick={handleFinish} className="flex-[3] bg-gray-900 text-white py-7 rounded-[2.5rem] font-[1000] uppercase tracking-[0.3em] text-xs shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"><CheckCircle2 size={20} /> TAYYOR / FINISH</button>
                            <button onClick={() => { haptics.light(); announceTicketCall(servingTicket.number, 1, language); }} className="flex-1 bg-white border-2 border-[var(--border-main)] rounded-[2.5rem] flex items-center justify-center text-gray-400 active:scale-95 transition-all shadow-sm"><RotateCcw size={28} /></button>
                        </div>
                    </div>
                )}
            </div>

            {/* 3. Daily Utilities Row */}
            <div className="grid grid-cols-4 gap-3">
                {[
                    { label: 'Tarix', icon: <History size={20} />, action: () => setShowHistory(true), color: 'text-indigo-500 bg-indigo-50' },
                    { label: 'Hujjatlar', icon: <CheckCircle2 size={20} />, action: () => setShowKB(true), color: 'text-emerald-500 bg-emerald-50' },
                    { label: 'Ombor', icon: <LayoutGrid size={20} />, action: () => setShowInventoryModal(true), color: 'text-amber-500 bg-amber-50' },
                ].map((u, i) => (
                    <button key={i} onClick={u.action} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-[var(--border-main)] shadow-sm hover:shadow-xl transition-all flex flex-col items-center justify-center gap-3 group active:scale-95">
                        <div className={`w-12 h-12 ${u.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>{u.icon}</div>
                        <span className="text-[8px] font-[1000] uppercase text-[var(--text-muted)] group-hover:text-indigo-600 transition-colors">{u.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SoloDashboard;
