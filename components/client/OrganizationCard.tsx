
import React from 'react';
import { Heart, MapPin, Building2, Navigation2 } from 'lucide-react';
import { Organization } from '../../types';
import { CATEGORY_LIST } from '../../constants';

interface OrganizationCardProps {
    org: Organization;
    isFav: boolean;
    onToggleFavorite: (id: string) => void;
    onJoinQueue: (org: Organization) => void;
    onStartDirection: (org: Organization) => void;
    t: (key: string) => string;
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({
    org, isFav, onToggleFavorite, onJoinQueue, onStartDirection, t
}) => {
    return (
        <div key={org.id} className="glass rounded-[2.5rem] p-6 shadow-sm border border-gray-100 group transition-all hover:shadow-md animate-slide-up relative overflow-hidden bg-[var(--bg-card)]">
            <button
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(org.id); }}
                className={`absolute top-6 right-6 p-2 rounded-xl transition-all ${isFav ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-500' : 'bg-gray-50 dark:bg-slate-800 text-gray-400 opacity-0 group-hover:opacity-100'}`}
            >
                <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
            </button>

            <div className="flex items-center gap-5 mb-3">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-[1.5rem] flex items-center justify-center text-emerald-600 dark:text-emerald-400 transition-transform group-hover:scale-110">
                    {CATEGORY_LIST.find(c => c.id === org.category)?.icon || <Building2 size={28} />}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className="font-black text-[var(--text-main)] truncate">{org.name}</h4>
                        <span className={`w-2 h-2 rounded-full ${org.status === 'OPEN' ? 'bg-emerald-500' : 'bg-rose-400'}`}></span>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase truncate mt-1 flex items-center gap-1.5"><MapPin size={10} /> {org.address}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={() => onJoinQueue(org)} className="flex-[2] py-4 rounded-2xl bg-emerald-500 dark:bg-emerald-600 text-white font-black text-xs uppercase shadow-xl hover:bg-emerald-600 dark:hover:bg-emerald-700 active:scale-95 transition-all">{t('join_queue')}</button>
                <button onClick={() => onStartDirection(org)} className="flex-1 py-4 rounded-2xl bg-gray-900 dark:bg-slate-800 text-white font-black text-xs uppercase flex items-center justify-center gap-2 active:scale-95 transition-all"><Navigation2 size={16} /> {t('address')}</button>
            </div>
        </div>
    );
};

export default OrganizationCard;
