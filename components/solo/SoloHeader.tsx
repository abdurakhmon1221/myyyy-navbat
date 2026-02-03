
import React from 'react';
import { Scissors, QrCode, Settings, LayoutGrid, TrendingUp, DollarSign, Star } from 'lucide-react';
import { Organization } from '../../types';

interface SoloHeaderProps {
    organization: Organization;
    onShowQR: () => void;
    onShowSettings: () => void;
    soloSubTab: string;
    setSoloSubTab: (tab: any) => void;
    haptics: any;
}

const SoloHeader: React.FC<SoloHeaderProps> = ({
    organization, onShowQR, onShowSettings, soloSubTab, setSoloSubTab, haptics
}) => {
    return (
        <div className="flex flex-col gap-6 mb-8 px-1">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
                        <Scissors size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-[1000] text-[var(--text-main)] italic tracking-tighter leading-none">{organization.name}</h2>
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Faol (Solo Mode)</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={onShowQR} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-[var(--border-main)] text-indigo-600 shadow-sm active:scale-95 transition-all hover:bg-indigo-50">
                        <QrCode size={20} />
                    </button>
                    <button onClick={onShowSettings} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-[var(--border-main)] text-gray-400 shadow-sm active:scale-95 transition-all">
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {[
                    { id: 'DASHBOARD', label: 'Asosiy', icon: <LayoutGrid size={14} /> },
                    { id: 'ANALYTICS', label: 'Tahlil', icon: <TrendingUp size={14} /> },
                    { id: 'FINANCE', label: 'Moliya', icon: <DollarSign size={14} /> },
                    { id: 'REVIEWS', label: 'Sharhlar', icon: <Star size={14} /> }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { haptics.light(); setSoloSubTab(tab.id as any); }}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap transition-all ${soloSubTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-white dark:bg-slate-900 text-gray-400 border border-[var(--border-main)]'}`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SoloHeader;
