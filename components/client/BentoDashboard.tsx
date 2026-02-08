
import React from 'react';
import { History, ChevronRight, Zap, MapPin, Star, Award, TrendingUp } from 'lucide-react';
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


    haptics: any;
    t: (key: string) => string;
}

const BentoDashboard: React.FC<BentoDashboardProps> = ({
    recentlyVisited, searchQuery, organizations, isLoading, onJoinQueue, onCategorySelect, onTabChange, haptics, t
}) => {
    if (searchQuery) return null;

    return (
        <div className="space-y-6 pt-6">
            {/* Main Featured Grid */}


            {/* Categories Grid - 5 items across or similar bento style */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{t('categories')}</h2>
                    <TrendingUp size={14} className="text-emerald-500" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {isLoading ? (
                        Array(6).fill(0).map((_, i) => <CategorySkeleton key={i} />)
                    ) : (
                        CATEGORY_LIST.slice(0, 6).map((cat, i) => (
                            <button
                                key={cat.id}
                                onClick={() => { haptics.light(); onCategorySelect(cat.id); }}
                                className={`flex flex-col items-start justify-between p-4 aspect-square rounded-[2rem] border border-[var(--border-main)] shadow-sm active:scale-90 transition-all group relative overflow-hidden 
                                ${cat.label === 'Bank' ? 'bg-blue-50/50 dark:bg-blue-900/20' :
                                        cat.label === 'Klinika' ? 'bg-amber-50/50 dark:bg-amber-900/20' :
                                            'bg-[var(--bg-card)]'} 
                                hover:border-emerald-500`}
                            >
                                <div className="text-emerald-600 dark:text-emerald-400 mb-3 group-hover:scale-110 group-hover:-rotate-6 transition-transform">{cat.icon}</div>
                                <span className="text-[9px] font-black uppercase text-[var(--text-main)] max-w-[80%] leading-tight">{t((cat as any).labelKey || 'cat_other')}</span>
                                <div className="absolute -right-4 -bottom-4 opacity-5 dark:opacity-10 group-hover:scale-110 transition-transform">
                                    {React.cloneElement(cat.icon as React.ReactElement, { size: 60 })}
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Recently Visited - Horizontal scroll or small list */}
            {
                recentlyVisited.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{t('recently_visited')}</h2>
                            <History size={14} className="text-indigo-500" />
                        </div>

                        <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
                            {recentlyVisited.slice(0, 4).map(id => {
                                const org = organizations.find(o => o.id === id);
                                if (!org) return null;
                                return (
                                    <div
                                        key={id}
                                        onClick={() => onJoinQueue(org)}
                                        className="min-w-[160px] bg-[var(--bg-card)] border border-[var(--border-main)] p-4 rounded-3xl active:scale-95 transition-all cursor-pointer shadow-sm relative overflow-hidden"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center text-indigo-600">
                                                <Star size={12} className="fill-current" />
                                            </div>
                                            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                            <p className="text-[8px] font-black text-emerald-500 uppercase tracking-wider">Trusted</p>
                                        </div>
                                        <p className="font-black text-xs text-[var(--text-main)] truncate">{org.name}</p>
                                        <p className="text-[7px] font-bold text-[var(--text-muted)] uppercase mt-0.5 truncate">{org.address}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default BentoDashboard;
