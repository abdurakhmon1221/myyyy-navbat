
import React from 'react';
import { Star, ChevronRight, CheckCircle2, DollarSign } from 'lucide-react';

export const SoloAnalytics: React.FC<{ stats: any }> = ({ stats }) => (
    <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-24">
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-[var(--border-main)] shadow-sm">
            <h3 className="text-xl font-[1000] italic mb-8">MIJOZLAR TAXLILI</h3>
            <div className="space-y-6">
                {[
                    { label: 'Yangi mijozlar', val: '12 ta', per: 40, color: 'bg-indigo-600' },
                    { label: 'Doimiy mijozlar', val: '20 ta', per: 60, color: 'bg-emerald-600' },
                    { label: 'Qoniqish darajasi', val: '98%', per: 98, color: 'bg-amber-500' }
                ].map((item, i) => (
                    <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase"><span>{item.label}</span><span className="text-gray-400">{item.val}</span></div>
                        <div className="w-full h-3 bg-gray-50 dark:bg-slate-800 rounded-full overflow-hidden"><div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.per}%` }}></div></div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const SoloFinance: React.FC<{ stats: any }> = ({ stats }) => (
    <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-24">
        <div className="bg-gradient-to-br from-gray-900 to-slate-800 rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-12">
                <div><p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Bugungi tushum</p><h2 className="text-5xl font-[1000] italic tracking-tighter mt-2">{stats.income} <span className="text-xs font-black uppercase tracking-widest opacity-40 italic">uzs</span></h2></div>
                <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md"><DollarSign size={32} /></div>
            </div>
        </div>
    </div>
);

export const SoloReviews: React.FC<{ stats: any }> = ({ stats }) => (
    <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-24">
        <div className="flex gap-4">
            <div className="flex-1 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-[var(--border-main)] text-center"><h2 className="text-4xl font-[1000] text-amber-500 italic leading-none">{stats.rating}</h2><p className="text-[9px] font-black text-gray-400 uppercase mt-2">O'rtacha ball</p></div>
            <div className="flex-1 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-[var(--border-main)] text-center"><h2 className="text-4xl font-[1000] text-indigo-600 italic leading-none">1.2k</h2><p className="text-[9px] font-black text-gray-400 uppercase mt-2">Jam sharhlar</p></div>
        </div>
        <div className="space-y-4">
            {[
                { user: 'Alisher R.', score: 5, text: 'Juda tez va sifatli xizmat. Maslahat beraman!', date: 'Hozirgina' },
                { user: 'Zarina K.', score: 5, text: 'Sartarosh juda mahoratli ekan. Rahmat!', date: 'Bugun' },
            ].map((r, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-[var(--border-main)] shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3"><div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-black text-gray-600 italic">{r.user[0]}</div><div><h5 className="text-sm font-black text-gray-900">{r.user}</h5><p className="text-[9px] font-bold text-gray-400 uppercase">{r.date}</p></div></div>
                        <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} className={s <= r.score ? 'fill-amber-400 text-amber-400' : 'text-gray-100'} />)}</div>
                    </div>
                    <p className="text-xs font-bold text-gray-600 leading-relaxed italic">"{r.text}"</p>
                </div>
            ))}
        </div>
    </div>
);
