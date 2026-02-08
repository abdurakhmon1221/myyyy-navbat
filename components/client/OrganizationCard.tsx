
import React, { useState } from 'react';
import { Heart, MapPin, Building2, Navigation2, X, Phone, Globe, Send, Instagram, Clock, Users, Star, ExternalLink, Copy, Check } from 'lucide-react';
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
    const [showDetails, setShowDetails] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopied(field);
        setTimeout(() => setCopied(null), 2000);
    };

    const formatPhone = (phone?: string) => {
        if (!phone) return null;
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 9) return `+998 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7)}`;
        return phone;
    };

    return (
        <>
            <div
                key={org.id}
                className="glass rounded-[2.5rem] p-6 shadow-sm border border-gray-100 group transition-all hover:shadow-md animate-slide-up relative overflow-hidden bg-[var(--bg-card)] cursor-pointer"
                onClick={() => setShowDetails(true)}
            >
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(org.id); }}
                    className={`absolute top-6 right-6 p-2 rounded-xl transition-all ${isFav ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-500' : 'bg-gray-50 dark:bg-slate-800 text-gray-400 opacity-0 group-hover:opacity-100'}`}
                >
                    <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
                </button>

                <div className="flex items-center gap-5 mb-3">
                    <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-[1.5rem] flex items-center justify-center text-emerald-600 dark:text-emerald-400 transition-transform group-hover:scale-110 overflow-hidden">
                        {org.image ? (
                            <img src={org.image} alt={org.name} className="w-full h-full object-cover" />
                        ) : (
                            CATEGORY_LIST.find(c => c.id === org.category)?.icon || <Building2 size={28} />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h4 className="font-black text-[var(--text-main)] truncate">{org.name}</h4>
                            <span className={`w-2 h-2 rounded-full ${org.status === 'OPEN' ? 'bg-emerald-500' : 'bg-rose-400'}`}></span>
                        </div>
                        <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold uppercase truncate mt-0.5">
                            {CATEGORY_LIST.find(c => c.id === org.category)?.label || org.category}
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase truncate mt-1 flex items-center gap-1.5"><MapPin size={10} /> {org.address}</p>
                    </div>
                </div>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onJoinQueue(org)} className="flex-[2] py-4 rounded-2xl bg-emerald-500 dark:bg-emerald-600 text-white font-black text-xs uppercase shadow-xl hover:bg-emerald-600 dark:hover:bg-emerald-700 active:scale-95 transition-all">{t('join_queue')}</button>
                    <button onClick={() => onStartDirection(org)} className="flex-1 py-4 rounded-2xl bg-gray-900 dark:bg-slate-800 text-white font-black text-xs uppercase flex items-center justify-center gap-2 active:scale-95 transition-all"><Navigation2 size={16} /> {t('address')}</button>
                </div>
            </div>

            {/* Organization Details Modal */}
            {showDetails && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-300" onClick={() => setShowDetails(false)}>
                    <div
                        className="bg-white dark:bg-slate-900 rounded-t-[3rem] sm:rounded-[3rem] w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-hide animate-in slide-in-from-bottom duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Image */}
                        <div className="relative h-48 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-t-[3rem] overflow-hidden">
                            {org.image ? (
                                <img src={org.image} alt={org.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Building2 size={80} className="text-white/30" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                            {/* Close button */}
                            <button
                                onClick={() => setShowDetails(false)}
                                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            {/* Favorite button */}
                            <button
                                onClick={() => onToggleFavorite(org.id)}
                                className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${isFav ? 'bg-rose-500 text-white' : 'bg-white/20 backdrop-blur-xl text-white'}`}
                            >
                                <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
                            </button>

                            {/* Status badge */}
                            <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${org.status === 'OPEN' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                                    {org.status === 'OPEN' ? 'Ochiq' : 'Yopiq'}
                                </span>
                                {org.rating && (
                                    <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center gap-1">
                                        <Star size={10} fill="currentColor" /> {org.rating}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Name & Category */}
                            <div>
                                <h2 className="text-2xl font-black text-[var(--text-main)]">{org.name}</h2>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase mt-1">
                                    {CATEGORY_LIST.find(c => c.id === org.category)?.label || org.category}
                                </p>
                            </div>

                            {/* Description */}
                            {org.description && (
                                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{org.description}</p>
                            )}

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4 text-center">
                                    <Clock size={20} className="mx-auto text-emerald-500 mb-1" />
                                    <p className="text-lg font-black text-emerald-600">{org.estimatedServiceTime || 15}</p>
                                    <p className="text-[8px] font-bold uppercase text-gray-500">min/xizmat</p>
                                </div>
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4 text-center">
                                    <Users size={20} className="mx-auto text-indigo-500 mb-1" />
                                    <p className="text-lg font-black text-indigo-600">{org.currentQueue || 0}</p>
                                    <p className="text-[8px] font-bold uppercase text-gray-500">navbatda</p>
                                </div>
                                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 text-center">
                                    <Star size={20} className="mx-auto text-amber-500 mb-1" />
                                    <p className="text-lg font-black text-amber-600">{org.rating || 4.5}</p>
                                    <p className="text-[8px] font-bold uppercase text-gray-500">reyting</p>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aloqa ma'lumotlari</p>

                                {/* Address */}
                                <div
                                    onClick={() => onStartDirection(org)}
                                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors group"
                                >
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-500">
                                        <MapPin size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-[var(--text-main)] truncate">{org.address}</p>
                                        <p className="text-[10px] text-gray-500">Xaritada ko'rish</p>
                                    </div>
                                    <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                </div>

                                {/* Phone */}
                                {org.phone && (
                                    <div
                                        onClick={() => window.open(`tel:+998${org.phone}`, '_self')}
                                        className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors group"
                                    >
                                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-500">
                                            <Phone size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-[var(--text-main)]">{formatPhone(org.phone)}</p>
                                            <p className="text-[10px] text-gray-500">Qo'ng'iroq qilish</p>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); copyToClipboard(org.phone!, 'phone'); }}
                                            className="p-2 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                                        >
                                            {copied === 'phone' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} className="text-gray-400" />}
                                        </button>
                                    </div>
                                )}

                                {/* Website */}
                                {org.website && (
                                    <div
                                        onClick={() => window.open(org.website!.startsWith('http') ? org.website : `https://${org.website}`, '_blank')}
                                        className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors group"
                                    >
                                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-500">
                                            <Globe size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-[var(--text-main)] truncate">{org.website}</p>
                                            <p className="text-[10px] text-gray-500">Veb-saytga o'tish</p>
                                        </div>
                                        <ExternalLink size={16} className="text-gray-400 group-hover:text-purple-500 transition-colors" />
                                    </div>
                                )}

                                {/* Telegram */}
                                {org.telegram && (
                                    <div
                                        onClick={() => window.open(org.telegram!.startsWith('http') ? org.telegram : `https://t.me/${org.telegram!.replace('@', '')}`, '_blank')}
                                        className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors group"
                                    >
                                        <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center text-sky-500">
                                            <Send size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-[var(--text-main)]">{org.telegram}</p>
                                            <p className="text-[10px] text-gray-500">Telegram'da yozish</p>
                                        </div>
                                        <ExternalLink size={16} className="text-gray-400 group-hover:text-sky-500 transition-colors" />
                                    </div>
                                )}

                                {/* Instagram */}
                                {org.instagram && (
                                    <div
                                        onClick={() => window.open(org.instagram!.startsWith('http') ? org.instagram : `https://instagram.com/${org.instagram!.replace('@', '')}`, '_blank')}
                                        className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors group"
                                    >
                                        <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center text-pink-500">
                                            <Instagram size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-[var(--text-main)]">{org.instagram}</p>
                                            <p className="text-[10px] text-gray-500">Instagram'da ko'rish</p>
                                        </div>
                                        <ExternalLink size={16} className="text-gray-400 group-hover:text-pink-500 transition-colors" />
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 pb-6">
                                <button
                                    onClick={() => { setShowDetails(false); onJoinQueue(org); }}
                                    className="flex-1 py-4 rounded-2xl bg-emerald-500 text-white font-black text-xs uppercase shadow-xl hover:bg-emerald-600 active:scale-95 transition-all"
                                >
                                    {t('join_queue')}
                                </button>
                                <button
                                    onClick={() => { setShowDetails(false); onStartDirection(org); }}
                                    className="py-4 px-6 rounded-2xl bg-gray-900 dark:bg-slate-700 text-white font-black text-xs uppercase flex items-center justify-center gap-2 active:scale-95 transition-all"
                                >
                                    <Navigation2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrganizationCard;
