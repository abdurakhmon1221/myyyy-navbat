
import React from 'react';
import { Users, Clock, Star, Zap, Coffee, Smartphone, Send, ChevronRight, RotateCcw, MoveRight, UserX, AlertTriangle, QrCode, HelpCircle } from 'lucide-react';
import { QueueItem } from '../../types';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

interface EmployeeDashboardProps {
    dailyStats: any;
    servingTicket: QueueItem | null;
    waitingCount: number;
    nextClient: QueueItem | null;
    isPaused: boolean;
    isEmergencyStopped: boolean;
    breakTimer: number;
    serviceTimer: number;
    formatTime: (s: number) => string;
    handleCallNext: () => void;
    handleRecall: () => void;
    handleFinish: () => void;
    handleHold: () => void;
    onHold: boolean;
    setShowSkipModal: (v: boolean) => void;
    setShowTransferModal: (v: boolean) => void;
    setIsPaused: (v: boolean) => void;
    setBreakTimer: (v: number) => void;
    setIsEmergencyStopped: (v: boolean) => void;
    setShowQRModal: (v: boolean) => void;
    setShowKBModal: (v: boolean) => void;
    setShowSummaryModal: (v: boolean) => void;
    setShowHistoryModal: (v: boolean) => void;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
    dailyStats, servingTicket, waitingCount, nextClient, isPaused, isEmergencyStopped,
    breakTimer, serviceTimer, formatTime, handleCallNext, handleRecall, handleFinish,
    handleHold, onHold, setShowSkipModal, setShowTransferModal, setIsPaused, setBreakTimer,
    setIsEmergencyStopped, setShowQRModal, setShowKBModal, setShowSummaryModal, setShowHistoryModal
}) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-24">
            {/* Top Bar: Sync & Level */}
            <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Tizimga bog'langan</span>
                </div>
                <div className="flex items-center gap-2 bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full border border-amber-500/20">
                    <Zap size={10} className="fill-current" />
                    <span className="text-[9px] font-black uppercase">GOLD EXPERT (Lv.12)</span>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3">
                {[
                    { label: 'Bugun', val: dailyStats.served, icon: <Users size={14} />, color: 'bg-indigo-50 text-indigo-600' },
                    { label: 'O\'rtacha', val: dailyStats.avgTime, icon: <Clock size={14} />, color: 'bg-emerald-50 text-emerald-600' },
                    { label: 'Reyting', val: dailyStats.rating, icon: <Star size={14} />, color: 'bg-amber-50 text-amber-600' },
                    { label: 'Reja', val: '48%', icon: <Zap size={14} />, color: 'bg-rose-50 text-rose-600' }
                ].map((item, i) => (
                    <div key={i} className="p-4 rounded-[1.75rem] bg-white dark:bg-slate-900 border border-[var(--border-main)] flex flex-col items-center justify-center text-center shadow-sm overflow-hidden">
                        <div className={`w-8 h-8 rounded-xl ${item.color} flex items-center justify-center mb-2 shrink-0`}>{item.icon}</div>
                        <p className="text-[7px] font-black text-[var(--text-muted)] uppercase tracking-widest truncate w-full">{item.label}</p>
                        <h5 className="text-xs font-black text-[var(--text-main)] mt-0.5 truncate w-full">{item.val}</h5>
                    </div>
                ))}
            </div>

            <div className={`bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-xl border-4 transition-all duration-500 overflow-hidden ${servingTicket ? 'border-emerald-500 shadow-emerald-100 dark:shadow-none' : 'border-[var(--border-main)]'}`}>
                {!servingTicket ? (
                    <div className="py-12 flex flex-col items-center text-center space-y-8">
                        <div className="relative">
                            <div className="w-24 h-24 bg-gray-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center text-gray-300">
                                <Users size={48} />
                            </div>
                            {waitingCount > 0 && <span className="absolute -top-2 -right-2 bg-rose-500 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm border-4 border-white dark:border-slate-900 animate-bounce">{waitingCount}</span>}
                        </div>

                        {/* Next Client Preview */}
                        {nextClient && (
                            <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/20 flex flex-col items-center">
                                <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mb-1">Keyingi mijoz</p>
                                <h4 className="text-xl font-black text-indigo-700 italic">{nextClient.number}</h4>
                            </div>
                        )}

                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-[var(--text-main)] tracking-tight">Qabulga tayyor</h3>
                            <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-[0.15em]">Tugmani bosing</p>
                            {waitingCount > 0 && <p className="text-sm font-black text-emerald-600 animate-pulse">Navbatda: {waitingCount} mijoz kutmoqda</p>}
                        </div>
                        <button onClick={() => handleCallNext()} disabled={waitingCount === 0 || isPaused || isEmergencyStopped} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-6 rounded-[2rem] shadow-xl shadow-emerald-200 dark:shadow-none active:scale-95 transition-all uppercase tracking-[0.2em] text-[11px] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed">Keyingisini chaqirish</button>
                        <button onClick={() => { setIsPaused(!isPaused); if (!isPaused) setBreakTimer(0); }} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${isPaused ? 'bg-amber-100 text-amber-600' : 'text-gray-400 hover:text-amber-500'}`}>
                            <Coffee size={14} /> {isPaused ? `Tanaffusda: ${formatTime(breakTimer)}` : 'Tanaffusga chiqish'}
                        </button>
                    </div>
                ) : (
                    <div className="animate-in zoom-in duration-500 flex flex-col items-center text-center">
                        <div className="w-full flex justify-between items-center mb-8 px-2">
                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full uppercase tracking-widest animate-pulse">Xizmat ko'rsatilyapti</span>
                            <div className="flex items-center gap-2 text-rose-600">
                                <Clock size={14} className="animate-spin-slow" />
                                <span className="text-sm font-black italic">{formatTime(serviceTimer)}</span>
                            </div>
                        </div>
                        <div className="space-y-2 mb-10">
                            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Mijoz raqami</p>
                            <h1 className="text-9xl font-[1000] text-gray-900 dark:text-white tracking-tighter italic leading-none">{servingTicket.number}</h1>
                        </div>
                        <div className="w-full space-y-4 mb-10">
                            <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-[2rem] border border-[var(--border-main)] flex items-center justify-between text-left">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm"><Smartphone size={24} className="text-gray-400" /></div>
                                    <div><p className="text-[8px] font-black text-[var(--text-muted)] uppercase">Telefon</p><h5 className="text-base font-black text-[var(--text-main)]">+998 {servingTicket.userPhone}</h5></div>
                                </div>
                                <button className="p-3 bg-emerald-500 text-white rounded-xl active:scale-90 shadow-md"><Send size={18} /></button>
                            </div>
                        </div>

                        <div className="flex gap-4 w-full">
                            <button onClick={handleFinish} className="flex-[2] bg-gray-900 text-white font-black py-6 rounded-3xl shadow-xl active:scale-95 transition-all uppercase tracking-[0.2em] text-[11px]">Yakunlash</button>
                            <button onClick={handleHold} className={`flex-1 rounded-3xl flex items-center justify-center shadow-inner active:scale-95 transition-all ${onHold ? 'bg-amber-500 text-white' : 'bg-gray-100 dark:bg-slate-800 text-[var(--text-muted)]'}`}>
                                {onHold ? <Clock size={24} className="animate-pulse" /> : <ChevronRight size={24} />}
                            </button>
                        </div>

                        <div className="flex gap-4 w-full mt-4">
                            <button onClick={handleRecall} className="flex-1 py-4 bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                                <RotateCcw size={14} /> Chaqirish
                            </button>
                            <button onClick={() => setShowTransferModal(true)} className="flex-1 py-4 bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                                <MoveRight size={14} /> Yo'naltirish
                            </button>
                        </div>

                        <button onClick={() => setShowSkipModal(true)} className="mt-8 text-rose-500 font-bold uppercase text-[9px] tracking-widest flex items-center gap-2 bg-rose-50 dark:bg-rose-900/10 px-6 py-2 rounded-full">
                            <UserX size={12} /> Kelmadi
                        </button>
                    </div>
                )}
            </div>

            {/* Grid Tools */}
            <div className="grid grid-cols-4 gap-3">
                <button onClick={() => setIsEmergencyStopped(!isEmergencyStopped)} className={`p-5 rounded-[2rem] border flex flex-col items-center justify-center gap-2 transition-all ${isEmergencyStopped ? 'bg-rose-600 border-rose-600 text-white animate-pulse' : 'bg-white dark:bg-slate-900 border-[var(--border-main)] text-rose-500 shadow-sm'}`}>
                    <AlertTriangle size={20} />
                    <span className="text-[7px] font-black uppercase text-center">Stop</span>
                </button>
                <button onClick={() => setShowQRModal(true)} className="p-5 bg-white dark:bg-slate-900 rounded-[2rem] border border-[var(--border-main)] flex flex-col items-center justify-center gap-2 text-indigo-600 active:scale-95 transition-all shadow-sm">
                    <QrCode size={20} />
                    <span className="text-[7px] font-black uppercase text-center">My QR</span>
                </button>
                <button onClick={() => setShowKBModal(true)} className="p-5 bg-white dark:bg-slate-900 rounded-[2rem] border border-[var(--border-main)] flex flex-col items-center justify-center gap-2 text-emerald-600 active:scale-95 transition-all shadow-sm">
                    <HelpCircle size={20} />
                    <span className="text-[7px] font-black uppercase text-center">Qo'llanma</span>
                </button>
                <button onClick={() => setShowSummaryModal(true)} className="p-5 bg-white dark:bg-slate-900 rounded-[2rem] border border-[var(--border-main)] flex flex-col items-center justify-center gap-2 text-amber-600 active:scale-95 transition-all shadow-sm">
                    <Send size={20} />
                    <span className="text-[7px] font-black uppercase text-center">Smena</span>
                </button>
            </div>

            {/* Chart section */}
            <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-[var(--border-main)]">
                <h4 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-6">Reyting dinamikasi (Haftalik)</h4>
                <div className="h-[100px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[{ v: 4.5 }, { v: 4.8 }, { v: 4.7 }, { v: 4.9 }, { v: 5.0 }, { v: 4.9 }, { v: 5.0 }]}>
                            <defs>
                                <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRating)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </section>
        </div>
    );
};

export default EmployeeDashboard;
