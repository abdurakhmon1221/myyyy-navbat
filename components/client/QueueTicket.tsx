
import React from 'react';
import {
    Clock, Zap, Calendar, List, Share2, UserCheck,
    Navigation2, MoveRight, X, AlertTriangle,
    Ticket as TicketIcon, MapPin, Fingerprint
} from 'lucide-react';
import { QueueItem, Organization } from '../../types';

interface QueueTicketProps {
    queue: QueueItem;
    org: Organization;
    onMarkAsComing: (id: string) => void;
    onStartDirection: (org: Organization) => void;
    onSwapToNext: (id: string) => void;
    onCancel: (id: string) => void;
    onEmergencyRequest: () => void;
    onShare: (queue: QueueItem, org: Organization) => void;
    profilePhone: string;
}

const QueueTicket: React.FC<QueueTicketProps> = ({
    queue, org, onMarkAsComing, onStartDirection, onSwapToNext, onCancel, onEmergencyRequest, onShare, profilePhone
}) => {
    const isApp = !!queue.appointmentTime;
    const isCalled = queue.status === 'CALLED';
    const isComing = queue.logs.some(l => l.action === 'COMING');
    const service = org.services.find(s => s.id === queue.serviceId);
    const eta = isCalled ? 0 : Math.max(0, queue.position * (org.estimatedServiceTime || 15));

    return (
        <div key={queue.id} className="relative animate-ticket-entry">
            {/* Physical Ticket Base */}
            <div className={`
                relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500
                ${isCalled ? 'ring-4 ring-emerald-500 scale-[1.02]' : 'border border-gray-100 dark:border-slate-800'}
                paper-texture
            `}>

                {/* Top Section */}
                <div className="p-8 pb-6">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:rotate-3 ${isCalled ? 'bg-emerald-500 text-white' : (isApp ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'bg-gray-50 dark:bg-slate-800 text-emerald-600')}`}>
                                {isApp ? <Calendar size={30} strokeWidth={2.5} /> : <TicketIcon size={30} strokeWidth={2.5} />}
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-black text-[var(--text-main)] text-xl leading-tight truncate tracking-tight">{org.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <MapPin size={10} className="text-gray-400" />
                                    <p className="text-[10px] text-gray-400 font-bold truncate">{org.address || 'Manzil ko\'rsatilmagan'}</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => onShare(queue, org)} className="w-10 h-10 bg-gray-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all active:scale-90">
                            <Share2 size={18} />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl w-fit border ${isApp ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-emerald-500/5 border-emerald-500/10'}`}>
                            {isApp ? <Calendar size={11} className="text-indigo-500" /> : <List size={11} className="text-emerald-500" />}
                            <span className={`text-[9px] font-black uppercase tracking-widest ${isApp ? 'text-indigo-600' : 'text-emerald-600'}`}>
                                {isApp ? `BRON: ${new Date(queue.appointmentTime!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : (service?.name || 'Umumiy xizmat')}
                            </span>
                        </div>
                        {isApp && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 rounded-xl w-fit border border-emerald-500/10">
                                <List size={11} className="text-emerald-500" />
                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{service?.name}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Perforation Line Area */}
                <div className="relative h-6 flex items-center px-4">
                    <div className="ticket-cutout-left"></div>
                    <div className="w-full perforation-line h-[1px]"></div>
                    <div className="ticket-cutout-right"></div>
                </div>

                {/* Middle Section (The Number) */}
                <div className="p-8 pt-6">
                    <div className="bg-gray-50 dark:bg-slate-800/50 rounded-[2.5rem] p-8 border border-dashed border-gray-200 dark:border-slate-700 relative group overflow-hidden">
                        {isCalled && <div className="absolute inset-0 bg-emerald-500/5 animate-pulse"></div>}

                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4">Sizning raqamingiz</span>
                            <div className="relative">
                                <span className={`text-7xl font-[1000] text-[var(--text-main)] tracking-tighter italic ${isCalled ? 'animate-bounce inline-block text-emerald-600' : ''}`}>
                                    {queue.number}
                                </span>
                                <div className="absolute -top-4 -right-8 w-12 h-12 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                            </div>

                            <div className="mt-6 flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Oldingizda</p>
                                    <h5 className="text-2xl font-black text-[var(--text-main)]">{queue.position} kishi</h5>
                                </div>
                                <div className="w-px h-8 bg-gray-200 dark:bg-slate-700"></div>
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Kutish</p>
                                    <h5 className="text-2xl font-black text-emerald-600">~{eta} min</h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress with Micro-animations */}
                    {!isCalled && (
                        <div className="mt-8 px-2">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Navbatning holati</span>
                                <span className="text-[10px] font-black text-emerald-500 uppercase">{Math.round(Math.max(5, 100 - (queue.position / 10) * 100))}%</span>
                            </div>
                            <div className="h-3 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden border border-gray-200 dark:border-slate-700 p-0.5">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                    style={{ width: `${Math.max(5, 100 - (queue.position / 10) * 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Section (Actions) */}
                <div className="p-8 pt-2 bg-gray-50/50 dark:bg-slate-900/50 ticket-zigzag-bottom">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <button
                            onClick={() => onMarkAsComing(queue.id)}
                            disabled={isComing || isCalled}
                            className={`
                                py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] flex flex-col items-center justify-center gap-2 transition-all relative overflow-hidden group
                                ${isComing ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white shadow-xl hover:shadow-emerald-500/20 active:scale-95'}
                                disabled:opacity-50
                            `}
                        >
                            <UserCheck size={20} className="group-hover:scale-110 transition-transform" />
                            {isComing ? 'Yoldaman' : 'Kelmoqdaman'}
                        </button>
                        <button
                            onClick={() => onStartDirection(org)}
                            className="py-5 rounded-2xl bg-white dark:bg-slate-800 text-[var(--text-main)] font-black text-[11px] uppercase tracking-[0.15em] flex flex-col items-center justify-center gap-2 shadow-lg border border-gray-100 dark:border-slate-700 hover:bg-gray-50 transition-all active:scale-95 group"
                        >
                            <Navigation2 size={20} className="text-emerald-500 group-hover:-translate-y-1 transition-transform" />
                            Xarita
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => onSwapToNext(queue.id)}
                            disabled={isCalled || queue.position === 0}
                            className="flex-1 py-4 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 transition-all disabled:opacity-30"
                        >
                            <MoveRight size={14} /> Surish
                        </button>
                        <button
                            onClick={() => onCancel(queue.id)}
                            className="flex-1 py-4 rounded-xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 text-rose-500 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-100 transition-all"
                        >
                            <X size={14} /> Bekor qilish
                        </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-dashed border-gray-200 dark:border-slate-700 flex flex-col items-center">
                        <Fingerprint size={24} className="text-gray-300 dark:text-slate-700 mb-3" />
                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.5em]">Digital Ticket ID: {queue.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                </div>
            </div>

            {/* Emergency Button - Separate from ticket body for priority */}
            <button
                onClick={onEmergencyRequest}
                className="mt-6 w-full py-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-dashed border-gray-200 dark:border-slate-800 text-[var(--text-muted)] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:border-rose-400 hover:text-rose-500 transition-all group"
            >
                <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
                    <AlertTriangle size={18} />
                </div>
                Maxsus yordam so'rash
            </button>
        </div>
    );
};

export default QueueTicket;
