import React, { useMemo } from 'react';
import { Search, Mic, MicOff, WifiOff, ListTodo, ChevronRight, Map } from 'lucide-react';
import { Organization } from '../../types';
import { haptics } from '../../services/haptics';
import { OrgCardSkeleton } from '../Skeleton';
import OrganizationCard from './OrganizationCard';
import BentoDashboard from './BentoDashboard';
import { useOrganizations } from '../../hooks/useOrganizations';

interface HomeTabProps {
    t: (key: string) => string;
    isOnline: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isListening: boolean;
    handleVoiceSearch: () => void;
    activeQueuesCount: number;
    setActiveTab: (tab: string) => void;
    activeFilter: 'ALL' | 'NEARBY' | 'POPULAR';
    setActiveFilter: (filter: 'ALL' | 'NEARBY' | 'POPULAR') => void;
    recentlyVisited: string[];
    isLoading: boolean;
    handleJoinQueueRequest: (org: Organization) => void;
    setViewingCategory: (category: string | null) => void;
    selectedCategory: string | null;
    favorites: string[];
    toggleFavorite: (id: string) => void;

}

const HomeTab: React.FC<HomeTabProps> = ({
    t, isOnline, searchQuery, setSearchQuery, isListening, handleVoiceSearch,
    activeQueuesCount, setActiveTab, activeFilter, setActiveFilter,
    recentlyVisited, isLoading, handleJoinQueueRequest, setViewingCategory, selectedCategory,
    favorites, toggleFavorite
}) => {
    const { organizations } = useOrganizations();

    const filteredOrgs = useMemo(() => {
        let list = [...organizations];

        // Filter by category first
        if (selectedCategory) {
            list = list.filter(o => o.category === selectedCategory);
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            list = list.filter(o => o.name.toLowerCase().includes(q) || o.address.toLowerCase().includes(q));
        }
        if (activeFilter === 'NEARBY') list.sort((a, b) => (a.id > b.id ? 1 : -1));
        else if (activeFilter === 'POPULAR') list = list.filter(o => o.earnedBadges?.includes('trusted_org'));
        return list;
    }, [searchQuery, activeFilter, organizations, selectedCategory]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">
            {!isOnline && (
                <div className="bg-rose-500 text-white px-6 py-3 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top duration-500 shadow-lg">
                    <WifiOff size={20} className="animate-pulse" />
                    <div>
                        <p className="text-xs font-black uppercase leading-none">{t('offline_mode')}</p>
                        <p className="text-[10px] font-medium opacity-80">{t('data_from_cache')}</p>
                    </div>
                </div>
            )}



            {/* Filters */}
            <div className="flex bg-[var(--bg-card)] p-1.5 rounded-2xl border border-[var(--border-main)]">
                {(['ALL', 'NEARBY', 'POPULAR'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => { haptics.light(); setActiveFilter(f); }}
                        className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeFilter === f ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-400 hover:text-[var(--text-main)]'}`}
                    >
                        {f === 'ALL' ? t('filter_all') : f === 'NEARBY' ? t('filter_nearby') : t('filter_popular')}
                    </button>
                ))}
            </div>

            <BentoDashboard
                recentlyVisited={recentlyVisited}
                searchQuery={searchQuery}
                organizations={filteredOrgs}
                isLoading={isLoading}
                onJoinQueue={handleJoinQueueRequest}
                onCategorySelect={setViewingCategory}
                onTabChange={setActiveTab}
                haptics={haptics}
                t={t}
            />

            <section className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                        {selectedCategory ? `${selectedCategory} - Muassasalar` : (searchQuery ? t('search_results') : t('recommendations'))}
                    </h2>
                    {selectedCategory && (
                        <button
                            onClick={() => setViewingCategory(null)}
                            className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                        >
                            Barchasini ko'rish ✕
                        </button>
                    )}
                </div>
                <div className="space-y-2">
                    {isLoading ? Array(3).fill(0).map((_, i) => <OrgCardSkeleton key={i} />) :
                        filteredOrgs.map((org, index) => (
                            <div
                                key={org.id}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                            >
                                <OrganizationCard
                                    org={org}
                                    isFav={favorites.includes(org.id)}
                                    onToggleFavorite={toggleFavorite}
                                    onJoinQueue={handleJoinQueueRequest}
                                    onStartDirection={(o) => o.location?.lat && o.location?.lng ? window.open(`https://www.google.com/maps/dir/?api=1&destination=${o.location.lat},${o.location.lng}`) : alert('Joylashuv mavjud emas')}
                                    t={t}
                                />
                            </div>
                        ))}
                </div>
            </section>
        </div>
    );
};

export default HomeTab;
