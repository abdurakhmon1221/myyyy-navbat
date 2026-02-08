
import React from 'react';
import {
    Clock, Users, Star, DollarSign, Heart, Mic, MicOff,
    PauseCircle, PlayCircle, Coffee, CheckCircle2, Volume2, RotateCcw,
    Wallet, Package, Megaphone, Scissors, Calendar
} from 'lucide-react';
import { QueueItem } from '../../types';

interface SoloDashboardProps {
    stats: any;
    servingTicket: QueueItem | null;
    waitingCount: number;
    handleCallNext: () => void;
    handleFinish: () => void;
    toggleVoiceControl: () => void;
    isRecording: boolean;
    isPaused: boolean;
    setIsPaused: (v: boolean) => void;
    isBusy: boolean;
    setIsBusy: (v: boolean) => void;
    serviceTimer: number;
    breakTimer: number;
    formatTime: (sec: number) => string;
    openModal: (modal: string) => void;
    haptics: any;
    language: any;
    announceTicketCall: (num: string, vol: number, lang: any) => void;
    setServingTicket: (v: any) => void;
}

const SoloDashboard: React.FC<SoloDashboardProps> = ({
    stats, servingTicket, waitingCount, handleCallNext, handleFinish,
    toggleVoiceControl, isRecording, isPaused, setIsPaused,
    isBusy, setIsBusy, serviceTimer, breakTimer, formatTime,
    openModal, haptics, language, announceTicketCall, setServingTicket
}) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                    { label: 'Bugun', val: stats.served, trend: '+12', icon: <Users size={18} />, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' },
                    { label: 'Reyting', val: stats.rating, trend: 'Top 1%', icon: <Star size={18} />, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' },
                    { label: 'Tushum', val: stats.income, trend: 'so\'m', icon: <DollarSign size={18} />, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
                    { label: 'VIP', val: stats.loyaltyVips, trend: 'Sodiq', icon: <Heart size={18} />, color: 'text-rose-600 bg-rose-50 dark:bg-rose-900/30' }
                ].map((s, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-[var(--border-main)] shadow-sm hover:shadow-lg transition-all">
                        <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>{s.icon}</div>
                        <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">{s.label}</p>
                        <h4 className="text-2xl font-[1000] text-[var(--text-main)] tracking-tighter">{s.val}</h4>
                        <span className="text-[9px] font-bold text-[var(--text-muted)]">{s.trend}</span>
                    </div>
                ))}
            </div>

            {/* Main Console */}
            <div className={`bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-2xl border-4 transition-all duration-700 relative overflow-hidden ${servingTicket ? 'border-emerald-500' : 'border-[var(--border-main)]'}`}>
                {!servingTicket ? (
                    <div className="py-8 flex flex-col items-center text-center space-y-8 relative">
                        <div className="relative group cursor-pointer" onClick={handleCallNext}>
                            <div className="w-28 h-28 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-[2.5rem] flex items-center justify-center group-hover:scale-105 transition-transform duration-500 shadow-inner">
                                <Users size={56} className="text-gray-300 dark:text-gray-600" />
                            </div>
                            {waitingCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-rose-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-[1000] text-lg border-4 border-white dark:border-slate-900 animate-bounce shadow-xl">{waitingCount}</span>
                            )}
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-[1000] text-[var(--text-main)] tracking-tight">MIJOZ QABULI</h3>
                            <p className="text-xs text-[var(--text-muted)] font-bold">Navbatda <span className="text-rose-600 font-black">{waitingCount}</span> ta kishi kutmoqda</p>
                        </div>
                        <div className="flex gap-3 w-full max-w-sm">
                            <button onClick={handleCallNext} disabled={waitingCount === 0 && !servingTicket} className="flex-[3] bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-indigo-200 dark:shadow-indigo-900/30 active:scale-95 transition-all flex items-center justify-center gap-3">
                                <Users size={18} /> KEYINGISI
                            </button>
                            <button onClick={toggleVoiceControl} className={`flex-1 rounded-[2rem] flex items-center justify-center transition-all shadow-lg ${isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}>
                                {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
                            </button>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => { haptics.light(); setIsPaused(!isPaused); }} className={`px-6 py-3 rounded-2xl text-xs font-black uppercase flex items-center gap-2 transition-all ${isPaused ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}>
                                {isPaused ? <PlayCircle size={16} /> : <PauseCircle size={16} />} {isPaused ? `Tanaffus ${formatTime(breakTimer)}` : 'Tanaffus'}
                            </button>
                            <button onClick={() => { haptics.light(); setIsBusy(!isBusy); }} className={`px-6 py-3 rounded-2xl text-xs font-black uppercase flex items-center gap-2 transition-all ${isBusy ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}>
                                <Coffee size={16} /> {isBusy ? 'Band' : 'Bo\'sh'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in zoom-in duration-500 flex flex-col items-center relative">
                        <div className="flex justify-between items-center w-full mb-8">
                            <span className="bg-emerald-500 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse shadow-lg shadow-emerald-200">XIZMATDA</span>
                            <div className="flex items-center gap-3 text-rose-500 bg-rose-50 px-5 py-2 rounded-full border border-rose-100">
                                <Clock size={18} className="animate-spin" style={{ animationDuration: '3s' }} />
                                <span className="text-xl font-[1000] leading-none">{formatTime(serviceTimer)}</span>
                            </div>
                        </div>
                        <div className="mb-8 text-center group cursor-pointer" onClick={() => openModal('note')}>
                            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-2 opacity-50">Mijoz kodi</p>
                            <h1 className={`text-9xl font-[1000] text-gray-900 dark:text-white tracking-tighter leading-none group-hover:scale-105 transition-transform italic ${serviceTimer > 0 ? 'animate-pulse-subtle text-emerald-600' : ''}`}>{servingTicket.number}</h1>
                        </div>
                        <div className="flex gap-4 w-full">
                            <button onClick={handleFinish} className="flex-[3] bg-gray-900 text-white py-6 rounded-[2rem] font-[1000] uppercase tracking-widest text-xs shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                                <CheckCircle2 size={20} /> TAYYOR
                            </button>
                            <button onClick={() => { haptics.light(); announceTicketCall(servingTicket.number, 1, language); }} className="flex-1 bg-white border-2 border-[var(--border-main)] rounded-[2rem] flex items-center justify-center text-gray-400 active:scale-95 transition-all shadow-sm">
                                <Volume2 size={24} />
                            </button>
                            <button onClick={() => setServingTicket(null)} className="flex-1 bg-rose-50 border-2 border-rose-200 rounded-[2rem] flex items-center justify-center text-rose-600 active:scale-95 transition-all">
                                <RotateCcw size={24} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Featured: Xizmatlar Button - Top */}
            <button
                onClick={() => openModal('services')}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 p-5 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all flex items-center gap-4 group active:scale-[0.98] border-2 border-teal-400"
            >
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform relative">
                    <Scissors size={32} className="text-white" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-teal-600"><path d="M12 5v14M5 12h14" /></svg>
                    </div>
                </div>
                <div className="flex-1 text-left">
                    <h4 className="text-lg font-black text-white">Xizmatlar Menyusi</h4>
                    <p className="text-xs font-bold text-white/70">Narxlar va xizmat turlari</p>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white group-hover:bg-white/30 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
            </button>

            {/* Quick Tools - Vertical List */}
            <div className="space-y-3">
                <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest ml-2">Boshqa Asboblar</p>
                {[
                    { label: 'Moliya Boshqaruvi', desc: 'Daromad, xarajat, hisobotlar', icon: <Wallet size={24} />, color: 'text-emerald-600 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30', action: () => openModal('finance') },
                    { label: 'Mijozlar Bazasi', desc: 'CRM va mijozlar tarixi', icon: <Users size={24} />, color: 'text-indigo-600 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30', action: () => openModal('customers') },
                    { label: 'Kalendar', desc: 'Uchrashuvlar va bronlar', icon: <Calendar size={24} />, color: 'text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30', action: () => openModal('calendar') },
                    { label: 'Ombor', desc: 'Mahsulotlar va inventar', icon: <Package size={24} />, color: 'text-amber-600 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30', action: () => openModal('inventory') },
                    { label: 'Marketing', desc: 'Reklama va aksiyalar', icon: <Megaphone size={24} />, color: 'text-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30', action: () => openModal('marketing') },
                ].map((tool, i) => (
                    <button
                        key={i}
                        onClick={tool.action}
                        className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-[var(--border-main)] shadow-sm hover:shadow-xl transition-all flex items-center gap-4 group active:scale-[0.98] p-4"
                    >
                        <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                            {tool.icon}
                        </div>
                        <div className="flex-1 text-left">
                            <h4 className="text-sm font-black text-[var(--text-main)] group-hover:text-indigo-600 transition-colors">{tool.label}</h4>
                            <p className="text-[10px] font-bold text-[var(--text-muted)]">{tool.desc}</p>
                        </div>
                        <div className="w-8 h-8 bg-gray-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-gray-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </div>
                    </button>
                ))}
            </div>

            {/* Overview Card */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[2.5rem] p-6 text-white shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black">Bugungi Ko'rinish</h3>
                    <span className="text-xs font-bold opacity-70">{new Date().toLocaleDateString('uz-UZ')}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <p className="text-3xl font-black">{stats.todayBookings}</p>
                        <p className="text-xs opacity-70 font-bold">Bronlar</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-black">{stats.income}</p>
                        <p className="text-xs opacity-70 font-bold">Tushum</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-black">{stats.pendingReviews}</p>
                        <p className="text-xs opacity-70 font-bold">Sharhlar</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SoloDashboard;
