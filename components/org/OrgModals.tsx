
import React from 'react';
import { X, BellRing, ShieldCheck, Monitor } from 'lucide-react';
import Logo from '../Logo';

export const BroadcastModal: React.FC<{ show: boolean, onClose: () => void, message: string, setMessage: (v: string) => void, onSend: () => void }> = ({ show, onClose, message, setMessage, onSend }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[1100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] p-8 shadow-2xl space-y-6">
                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black text-[var(--text-main)] tracking-tight">Ommaviy Xabar</h3>
                </div>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Xabar matnini kiriting..."
                    className="w-full bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-3xl p-6 h-32 outline-none font-bold text-sm resize-none"
                />
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-4 text-[var(--text-muted)] font-black uppercase text-[10px]">Bekor qilish</button>
                    <button onClick={onSend} className="flex-[2] bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all">Yuborish</button>
                </div>
            </div>
        </div>
    );
};

export const AuditLogsModal: React.FC<{ show: boolean, onClose: () => void, logs: any[] }> = ({ show, onClose, logs }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-white dark:bg-slate-900 z-[1200] p-6 overflow-y-auto">
            <div className="max-w-xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black text-[var(--text-main)] tracking-tight">Faolliklar jurnali</h3>
                    <button onClick={onClose} className="p-4 bg-gray-50 dark:bg-slate-800 text-gray-400 rounded-full"><X size={24} /></button>
                </div>
                <div className="space-y-4">
                    {logs.map(log => (
                        <div key={log.id} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-[var(--border-main)]">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white"><ShieldCheck size={20} /></div>
                                <div><h5 className="font-black text-sm text-[var(--text-main)]">{log.action}: {log.target}</h5><p className="text-[10px] font-bold text-[var(--text-muted)]">{log.actor}</p></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const TVModeOverlay: React.FC<{ show: boolean, onClose: () => void, liveQueues: any[] }> = ({ show, onClose, liveQueues }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-slate-900 z-[2000] flex flex-col p-12 text-white animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-16">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl">
                        <Logo size={60} primaryColor="white" secondaryColor="white" />
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter italic">NAVBAT</h1>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-black">{new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}</h2>
                </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-12">
                <div className="bg-slate-800/50 rounded-[4rem] p-12 border-4 border-slate-700/50 flex flex-col items-center justify-center space-y-8 animate-pulse">
                    <p className="text-3xl font-black text-emerald-500 uppercase">NAVATDAGI</p>
                    <h3 className="text-[18rem] font-black leading-none italic">{liveQueues[0]?.number || '---'}</h3>
                </div>
                <div className="space-y-6">
                    {liveQueues.slice(1, 6).map(q => (
                        <div key={q.id} className="flex justify-between items-center p-8 bg-slate-800/30 rounded-[2.5rem] border-2 border-slate-700/30">
                            <span className="text-6xl font-black italic">{q.number}</span>
                            <span className="text-2xl font-black text-white/30 uppercase">KUTISHDA</span>
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={onClose} className="absolute top-8 right-8 p-4 bg-white/5 hover:bg-white/10 rounded-full"><X size={32} /></button>
        </div>
    );
};
