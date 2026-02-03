
import React from 'react';
import { History, ChevronRight, Zap, MapPin } from 'lucide-react';
import { Organization } from '../../types';
import { CATEGORY_LIST } from '../../constants';
import { CategorySkeleton } from '../Skeleton';

interface BentoDashboardProps {
    recentlyVisited: string[];
    searchQuery: string;
    organizations: Organization[];
    isLoading: boolean;
    onJoinQueue: (org: Organization) => void;
    onCategorySelect: (id: string) => void;
    onTabChange: (tab: string) => void;
    haptics: any;
}

const BentoDashboard: React.FC<BentoDashboardProps> = ({
    recentlyVisited, searchQuery, organizations, isLoading, onJoinQueue, onCategorySelect, onTabChange, haptics
}) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Large Bento: Recently Visited */}
            {recentlyVisited.length > 0 && !searchQuery && (
                <div className="col-span-2 bg-indigo-600 rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-4 inline-flex items-center gap-2">
                        <History size={12} /> Oxirgi ko'rilganlar
                    </h4>
                    <div className="space-y-3">
                        {recentlyVisited.slice(0, 2).map(id => {
                            const org = organizations.find(o => o.id === id);
                            if (!org) return null;
                            return (
                                <div key={id} onClick={() => onJoinQueue(org)} className="flex items-center justify-between bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 active:scale-95 transition-all cursor-pointer">
                                    <div className="min-w-0">
                                        <p className="font-black text-sm truncate">{org.name}</p>
                                        <p className="text-[8px] font-bold opacity-60 uppercase mt-0.5">{org.address}</p>
                                    </div>
                                    <ChevronRight size={16} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Categories Section */}
            <div className="col-span-2 space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Kategoriyalar</h2>
                    {isLoading ? <div className="w-10 h-2 bg-gray-100 animate-pulse rounded"></div> : <span className="text-[9px] font-black text-emerald-500 uppercase">{CATEGORY_LIST.length} TA</span>}
                </div>

                <div className="grid grid-cols-4 gap-3">
                    {isLoading ? (
                        Array(4).fill(0).map((_, i) => <CategorySkeleton key={i} />)
                    ) : (
                        CATEGORY_LIST.slice(0, 4).map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => { haptics.light(); onCategorySelect(cat.id); }}
                                className="flex flex-col items-center justify-center p-3 aspect-square rounded-[1.75rem] bg-[var(--bg-card)] border border-[var(--border-main)] shadow-sm active:scale-90 transition-all group"
                            >
                                <div className="text-emerald-600 transition-transform group-hover:scale-110 mb-1">{cat.icon}</div>
                                <span className="text-[7px] font-black uppercase text-center leading-tight text-[var(--text-muted)]">{cat.label.split(' ')[0]}</span>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Small Bento Cards */}
            {!searchQuery && (
                <>
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-900/20">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white mb-3">
                            <Zap size={20} className="fill-current" />
                        </div>
                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.15em] mb-1">Tezkor Scan</p>
                        <h5 className="text-xs font-black text-emerald-900 dark:text-emerald-100 leading-tight">Nuqtaga kelganingizda QR ishlatish</h5>
                    </div>

                    <div className="bg-indigo-50 dark:bg-indigo-900/10 p-5 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-900/20" onClick={() => onTabChange('map')}>
                        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white mb-3">
                            <MapPin size={20} />
                        </div>
                        <p className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.15em] mb-1">Xarita</p>
                        <h5 className="text-xs font-black text-indigo-900 dark:text-indigo-100 leading-tight">Yaqin atrofdagi muassasalar</h5>
                    </div>
                </>
            )}
        </div>
    );
};

export default BentoDashboard;
