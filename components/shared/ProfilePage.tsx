
import React, { useState } from 'react';
import {
    User, Phone, Globe, Moon, Sun, HelpCircle, Info,
    LogOut, Camera, ChevronRight, ShieldCheck, Bell,
    MessageSquare, Heart, CreditCard, Share2, Languages,
    Check, X
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Language } from '../../types';
import { haptics } from '../../services/haptics';

interface ProfilePageProps {
    profile: any;
    onUpdateProfile: (data: any) => void;
    onLogout?: () => void;
    role?: string;
}

const LANGUAGE_OPTIONS = [
    { key: Language.UZ, name: "O'zbekcha", flag: '🇺🇿' },
    { key: Language.RU, name: 'Русский', flag: '🇷🇺' },
    { key: Language.EN, name: 'English', flag: '🇬🇧' },
];

const ProfilePage: React.FC<ProfilePageProps> = ({ profile, onUpdateProfile, onLogout, role }) => {
    const { language, setLanguage, t } = useLanguage();
    const { theme, toggleTheme, isDark } = useTheme();

    const [isEditing, setIsEditing] = useState(false);
    const [showLangSelector, setShowLangSelector] = useState(false);

    // Form states
    const [name, setName] = useState(profile.name || '');
    const [phone, setPhone] = useState(profile.phone || '');
    const [address, setAddress] = useState(profile.address || '');

    const handleSave = () => {
        onUpdateProfile({ name, phone, address });
        setIsEditing(false);
        haptics.success();
    };

    const handleLanguageSelect = (lang: Language) => {
        setLanguage(lang);
        setShowLangSelector(false);
        haptics.medium();
    };

    const sections = [
        {
            title: t('personal_info'),
            items: [
                {
                    id: 'edit',
                    label: t('edit_profile'),
                    icon: <User size={18} className="text-emerald-500" />,
                    action: () => setIsEditing(true)
                },
                {
                    id: 'identity',
                    label: t('security'),
                    sub: '2-factor auth',
                    icon: <ShieldCheck size={18} className="text-blue-500" />,
                    action: () => { }
                }
            ]
        },
        {
            title: t('app_settings'),
            items: [
                {
                    id: 'lang',
                    label: t('language'),
                    sub: LANGUAGE_OPTIONS.find(l => l.key === language)?.name,
                    icon: <Globe size={18} className="text-sky-500" />,
                    action: () => setShowLangSelector(true)
                },
                {
                    id: 'theme',
                    label: t('dark_mode'),
                    sub: isDark ? t('on') : t('off'),
                    icon: isDark ? <Moon size={18} className="text-indigo-500" /> : <Sun size={18} className="text-amber-500" />,
                    action: () => { haptics.medium(); toggleTheme(); }
                },
                {
                    id: 'notifications',
                    label: t('notifications'),
                    sub: t('on'),
                    icon: <Bell size={18} className="text-rose-500" />,
                    action: () => haptics.light()
                }
            ]
        },
        {
            title: t('support_info'),
            items: [
                { id: 'help', label: t('help_center'), icon: <HelpCircle size={18} className="text-emerald-500" />, action: () => { } },
                { id: 'about', label: t('about_app'), icon: <Info size={18} className="text-gray-400" />, action: () => { } },
                { id: 'privacy', label: t('privacy_policy'), icon: <ShieldCheck size={18} className="text-gray-400" />, action: () => { } },
                { id: 'share', label: t('share_app'), icon: <Share2 size={18} className="text-sky-500" />, action: () => { } }
            ]
        }
    ];

    return (
        <div className="space-y-6 animate-fade-in-up pb-24 max-w-2xl mx-auto">
            {/* Professional Header Section */}
            <div className="relative pt-12 pb-8 px-6 bg-white dark:bg-slate-900 rounded-[3.5rem] border border-[var(--border-main)] shadow-xl overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-emerald-500 to-emerald-700 opacity-10"></div>

                <div className="relative flex flex-col items-center">
                    <div className="relative mb-6">
                        <div className="w-28 h-28 rounded-[2.5rem] bg-emerald-50 dark:bg-slate-800 border-[6px] border-white dark:border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                            {profile.imageUrl ? (
                                <img src={profile.imageUrl} className="w-full h-full object-cover" alt="Profile" />
                            ) : (
                                <User size={48} className="text-emerald-500/50" />
                            )}
                        </div>
                        <button className="absolute -bottom-1 -right-1 bg-emerald-600 border-4 border-white dark:border-slate-800 text-white p-2.5 rounded-2xl shadow-lg hover:scale-110 active:scale-95 transition-all">
                            <Camera size={16} />
                        </button>
                    </div>

                    <h3 className="text-2xl font-black text-[var(--text-main)] tracking-tight leading-none mb-2">{profile.name || t('guest_login')}</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">{profile.phone}</span>
                        <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{role}</span>
                    </div>

                    {role === 'CLIENT' && profile.trustScore && (
                        <div className="mt-4 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
                            <ShieldCheck size={12} className="text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">{t('trust_score')}: {profile.trustScore}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Stats Grid */}
            {role === 'CLIENT' && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[var(--bg-card)] p-5 rounded-[2rem] border border-[var(--border-main)] hover:border-indigo-300 dark:hover:border-indigo-800 transition-all group cursor-pointer active:scale-95">
                        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 mb-3 group-hover:scale-110 transition-transform">
                            <CreditCard size={20} />
                        </div>
                        <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider mb-1">{t('wallet')}</p>
                        <p className="text-lg font-black text-[var(--text-main)] tracking-tight">0 so'm</p>
                    </div>
                    <div className="bg-[var(--bg-card)] p-5 rounded-[2rem] border border-[var(--border-main)] hover:border-rose-300 dark:hover:border-rose-800 transition-all group cursor-pointer active:scale-95">
                        <div className="w-10 h-10 bg-rose-50 dark:bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500 mb-3 group-hover:scale-110 transition-transform">
                            <Heart size={20} />
                        </div>
                        <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider mb-1">{t('favorites')}</p>
                        <p className="text-lg font-black text-[var(--text-main)] tracking-tight">5 ta</p>
                    </div>
                </div>
            )}

            {/* Settings Categories */}
            <div className="space-y-8">
                {sections.map((section, sidx) => (
                    <div key={sidx} className="space-y-3">
                        <h4 className="px-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">{section.title}</h4>
                        <div className="bg-[var(--bg-card)] rounded-[2.5rem] border border-[var(--border-main)] overflow-hidden shadow-sm">
                            {section.items.map((item, iidx) => (
                                <button
                                    key={item.id}
                                    onClick={() => { haptics.light(); item.action(); }}
                                    className={`w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-all active:scale-[0.99] group ${iidx !== section.items.length - 1 ? 'border-b border-[var(--border-main)]' : ''}`}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-[var(--bg-app)] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                            {item.icon}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-black text-[var(--text-main)] mb-0.5">{item.label}</p>
                                            {item.sub && <p className="text-[10px] font-black text-emerald-500/70 uppercase tracking-widest">{item.sub}</p>}
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Logout Section */}
            <div className="px-4">
                <button
                    onClick={onLogout}
                    className="w-full bg-rose-50 dark:bg-rose-500/10 text-rose-500 py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 border border-rose-100 dark:border-rose-900/40 hover:bg-rose-100 dark:hover:bg-rose-500/20 active:scale-[0.98] transition-all group"
                >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> {t('logout')}
                </button>
            </div>

            <div className="text-center pb-8 space-y-1">
                <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em]">NAVBAT • v2.5.0</p>
                <p className="text-[8px] font-black text-emerald-600/30 uppercase tracking-widest">Designed by Abdurakhmon</p>
            </div>

            {/* Professional Edit Profile Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] border border-[var(--border-main)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-[var(--border-main)] flex justify-between items-center">
                            <h3 className="text-xl font-black text-[var(--text-main)] tracking-tight">{t('edit_profile')}</h3>
                            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>
                        <div className="p-8 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest pl-2">{t('name_placeholder')}</label>
                                <div className="relative">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none font-bold text-[var(--text-main)] transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest pl-2">{t('phone_placeholder')}</label>
                                <div className="relative">
                                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none font-bold text-[var(--text-main)] transition-all"
                                    />
                                </div>
                            </div>
                            {(role === 'SOLO' || role === 'ORGANIZATION') && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest pl-2">{t('address_placeholder')}</label>
                                    <div className="relative">
                                        <Info size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none font-bold text-[var(--text-main)] transition-all"
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setIsEditing(false)} className="flex-1 py-4 bg-gray-100 dark:bg-slate-800 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">{t('cancel')}</button>
                                <button onClick={handleSave} className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">{t('save')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Language Selection Modal */}
            {showLangSelector && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="w-full max-w-xs bg-white dark:bg-slate-900 rounded-[3rem] border border-[var(--border-main)] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
                        <div className="p-8 border-b border-[var(--border-main)]">
                            <h3 className="text-xl font-black text-center text-[var(--text-main)] tracking-tight">{t('language')}</h3>
                        </div>
                        <div className="p-4 space-y-2">
                            {LANGUAGE_OPTIONS.map((opt) => (
                                <button
                                    key={opt.key}
                                    onClick={() => handleLanguageSelect(opt.key)}
                                    className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all ${language === opt.key ? 'bg-emerald-500 text-white shadow-lg' : 'hover:bg-gray-50 dark:hover:bg-slate-800 text-[var(--text-main)]'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">{opt.flag}</span>
                                        <span className="font-black text-sm tracking-tight">{opt.name}</span>
                                    </div>
                                    {language === opt.key && <Check size={20} />}
                                </button>
                            ))}
                        </div>
                        <div className="p-6 border-t border-[var(--border-main)]">
                            <button onClick={() => setShowLangSelector(false)} className="w-full py-4 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest hover:text-[var(--text-main)] transition-colors">{t('cancel')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
