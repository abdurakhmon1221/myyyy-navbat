
import React from 'react';
import { CheckCircle2, Timer, XCircle, Clock, Star, Users, History, BellRing, ArrowUpRight, Monitor, Download, QrCode } from 'lucide-react';
import { QueueItem, Organization } from '../../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface OrgDashboardProps {
    org: Organization;
    liveQueues: QueueItem[];
    appointmentQueues: QueueItem[];
    handleStatusChange: (s: 'OPEN' | 'CLOSED' | 'BUSY') => void;
    setShowAuditLogs: (v: boolean) => void;
    setShowBroadcastModal: (v: boolean) => void;
    setShowTVMode: (v: boolean) => void;
    setActiveTab: (v: string) => void;
}

const OrgDashboard: React.FC<OrgDashboardProps> = ({
    org, liveQueues, appointmentQueues, handleStatusChange, setShowAuditLogs,
    setShowBroadcastModal, setShowTVMode, setActiveTab
}) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-24">
            {/* 1. Status Controls */}
            <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-sm border border-[var(--border-main)]">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Hozirgi holat</h3>
                    <span className="flex items-center gap-2 text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full uppercase">
                        LIVE SYNCING
                    </span>
                </div>
                <div className="flex gap-3">
                    {(['OPEN', 'BUSY', 'CLOSED'] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => handleStatusChange(s)}
                            className={`flex-1 flex flex-col items-center justify-center gap-2 py-5 rounded-[2rem] font-black text-[11px] uppercase border-2 transition-all active:scale-95 ${org.status === s
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl'
                                : 'bg-gray-50 dark:bg-slate-800 border-transparent text-gray-400'
                                }`}
                        >
                            {s === 'OPEN' ? <CheckCircle2 size={24} /> : s === 'BUSY' ? <Timer size={24} /> : <XCircle size={24} />}
                            {s === 'OPEN' ? 'Ochiq' : s === 'BUSY' ? 'Band' : 'Yopiq'}
                        </button>
                    ))}
                </div>
            </section>

            {/* 2. Bento Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'O\'rtacha kutish', val: '14m', icon: <Clock />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Xizmat sifati', val: '98%', icon: <Star />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Bugungi mijoz', val: liveQueues.length + 42, icon: <Users />, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Bekor qilish', val: '4%', icon: <XCircle />, color: 'text-rose-600', bg: 'bg-rose-50' },
                ].map((item, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-[var(--border-main)] shadow-sm">
                        <div className={`w-10 h-10 rounded-xl ${item.bg} dark:bg-slate-800 ${item.color} flex items-center justify-center mb-4`}>
                            {item.icon}
                        </div>
                        <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">{item.label}</p>
                        <h4 className={`text-2xl font-black ${item.color}`}>{item.val}</h4>
                    </div>
                ))}
            </div>

            {/* 3. Traffic Chart */}
            <section className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-sm border border-[var(--border-main)] overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-lg font-black text-[var(--text-main)] tracking-tight">Mijozlar oqimi</h3>
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Soatlar bo'yicha tahlil</p>
                    </div>
                    <button onClick={() => setShowAuditLogs(true)} className="p-3 bg-gray-50 dark:bg-slate-800 text-gray-400 rounded-2xl hover:text-indigo-600 transition-all">
                        <History size={20} />
                    </button>
                </div>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={org.busyHours || []}>
                            <defs>
                                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                            <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 900 }} />
                            <Area type="monotone" dataKey="load" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorLoad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* 4. Broadcast */}
            <button
                onClick={() => setShowBroadcastModal(true)}
                className="w-full p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[2.5rem] text-white flex items-center justify-between shadow-xl active:scale-95 transition-all"
            >
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                        <BellRing size={24} />
                    </div>
                    <div className="text-left">
                        <h4 className="font-black text-sm tracking-tight">Ommaviy e'lon yuborish</h4>
                        <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Barcha mijozlar uchun</p>
                    </div>
                </div>
                <ArrowUpRight size={20} />
            </button>

            {/* 5. Live Queue List */}
            <section className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-sm border border-[var(--border-main)]">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black text-[var(--text-main)] tracking-tight">Navbatlar jurnali</h3>
                    <div className="flex gap-2">
                        <button className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl text-gray-400" onClick={() => setShowTVMode(true)}><Monitor size={18} /></button>
                        <button className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl text-gray-400" onClick={() => setActiveTab('QR')}><QrCode size={18} /></button>
                    </div>
                </div>
                <div className="space-y-4">
                    {[...liveQueues, ...appointmentQueues].map((q, i) => (
                        <div key={q.id} className="group relative flex items-center justify-between p-5 bg-gray-50 dark:bg-slate-800/50 rounded-[2rem] border border-[var(--border-main)] hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all">
                            <div className="flex items-center gap-5">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-md ${q.appointmentTime ? 'bg-indigo-600 text-white' : 'bg-emerald-500 text-white'}`}>
                                    {q.number}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-black text-[var(--text-main)] truncate">Mijoz: +998 {q.userPhone}</p>
                                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">
                                        {q.appointmentTime ? 'Qabul' : 'Jonli navbat'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default OrgDashboard;
