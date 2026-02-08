
import React, { useState, useRef } from 'react';
import {
    User, Phone, Globe, Moon, Sun, HelpCircle, Info, Building2,
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
    favoritesCount?: number;
    onWalletClick?: () => void;
    onOpenBusinessSettings?: () => void;
    organization?: any; // For admin views to show org info in header
}

const LANGUAGE_OPTIONS = [
    { key: Language.UZ, name: "O'zbekcha", flag: '🇺🇿' },
    { key: Language.RU, name: 'Русский', flag: '🇷🇺' },
    { key: Language.EN, name: 'English', flag: '🇬🇧' },
];

const ProfilePage: React.FC<ProfilePageProps> = ({ profile, onUpdateProfile, onLogout, role, favoritesCount = 0, onWalletClick, onOpenBusinessSettings, organization }) => {
    const isAdminView = role === 'SOLO' || role === 'COMPANY' || role === 'ORGANIZATION' || role === 'STAFF';
    const displayData = isAdminView && organization ? {
        name: organization.name || profile.name,
        phone: organization.phone || profile.phone,
        imageUrl: organization.imageUrl || profile.imageUrl,
        category: organization.category || role
    } : {
        name: profile.name,
        phone: profile.phone,
        imageUrl: profile.imageUrl,
        category: role
    };
    const { language, setLanguage, t } = useLanguage();
    const { theme, toggleTheme, isDark } = useTheme();

    const [view, setView] = useState<'PROFILE'>('PROFILE');
    const [showHelp, setShowHelp] = useState(false);
    const [showSecurity, setShowSecurity] = useState(false);
    const [showAbout, setShowAbout] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showLangSelector, setShowLangSelector] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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

    // Image upload
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                onUpdateProfile({ imageUrl: base64 });
                haptics.success();
            };
            reader.readAsDataURL(file);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: 'NAVBAT - Online Navbat',
            text: 'Navbat ilovasi orqali vaqtingizni tejang! Hozir yuklab oling.',
            url: window.location.origin,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                throw new Error('Web Share API not supported');
            }
        } catch (error) {
            console.log('Error sharing:', error);
            // Fallback to clipboard
            try {
                await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
                haptics.success();
                alert("Havola buferga nusxalandi!");
            } catch (err) {
                haptics.error();
                alert("Ulashish imkonsiz. Iltimos, havolani qo'lda nusxalang.");
            }
        }
    };

    const sections = [
        {
            title: t('personal_info'),
            items: [
                // Add Business Settings for SOLO and COMPANY
                ...((role === 'SOLO' || role === 'COMPANY' || role === 'ORGANIZATION') && onOpenBusinessSettings ? [{
                    id: 'business',
                    label: 'Tashkilot Sozlamalari',
                    sub: 'Business Profile',
                    icon: <Building2 size={18} className="text-amber-500" />,
                    action: () => { haptics.medium(); onOpenBusinessSettings(); }
                }] : [])
            ]
        },
        {
            title: t('app_settings'),
            items: [
                {
                    id: 'telegram',
                    label: 'Telegram Bot',
                    sub: profile.telegramChatId ? t('connected') : t('connect'),
                    icon: <MessageSquare size={18} className="text-sky-500" />,
                    action: () => {
                        window.open('https://t.me/navbat_uzbot', '_blank');
                    }
                },
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
                    sub: notificationsEnabled ? t('on') : t('off'),
                    icon: <Bell size={18} className="text-rose-500" />,
                    action: () => { haptics.medium(); setNotificationsEnabled(!notificationsEnabled); }
                }
            ]
        },
        {
            title: t('support_info'),
            inline: true,
            items: [
                { id: 'about', label: t('about_app'), icon: <Info size={16} className="text-gray-400" />, action: () => setShowAbout(true) },
                { id: 'privacy', label: t('privacy_policy'), icon: <ShieldCheck size={16} className="text-gray-400" />, action: () => setShowPrivacy(true) },
                { id: 'share', label: t('share_app'), icon: <Share2 size={16} className="text-sky-500" />, action: handleShare }
            ]
        }
    ];



    return (
        <React.Fragment>
            <div className="space-y-6 animate-fade-in-up pb-24 max-w-2xl mx-auto">
                {/* Professional Header Section */}
                <div className="relative pt-12 pb-8 px-6 bg-white dark:bg-slate-900 rounded-[3.5rem] border border-[var(--border-main)] shadow-xl overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-emerald-500 to-emerald-700 opacity-10"></div>

                    <div className="relative flex flex-col items-center">
                        {/* Large Organization/Profile Image */}
                        <div className="relative mb-6">
                            <div className="w-28 h-28 rounded-[2.5rem] bg-emerald-50 dark:bg-slate-800 border-[6px] border-white dark:border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center">
                                {displayData.imageUrl ? (
                                    <img src={displayData.imageUrl} className="w-full h-full object-cover" alt="Profile" />
                                ) : isAdminView ? (
                                    <Building2 size={48} className="text-emerald-500/50" />
                                ) : (
                                    <User size={48} className="text-emerald-500/50" />
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        <h3 className="text-2xl font-black text-[var(--text-main)] tracking-tight leading-none mb-2">{displayData.name || t('guest_login')}</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">{displayData.phone}</span>
                            <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{displayData.category}</span>
                        </div>

                        {/* Trust Score with Profile Edit Button */}
                        {role === 'CLIENT' && (
                            <div className="mt-4 flex items-center gap-3">
                                {/* Small Profile Picture with Edit */}
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="relative w-10 h-10 rounded-xl bg-emerald-50 dark:bg-slate-800 overflow-hidden flex items-center justify-center hover:ring-2 hover:ring-emerald-400 transition-all"
                                    title="Profilni tahrirlash"
                                >
                                    {profile.imageUrl ? (
                                        <img src={profile.imageUrl} className="w-full h-full object-cover" alt="User" />
                                    ) : (
                                        <User size={20} className="text-emerald-500/50" />
                                    )}
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                        <Camera size={14} className="text-white" />
                                    </div>
                                </button>

                                {/* Trust Score */}
                                {profile.trustScore && (
                                    <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
                                        <ShieldCheck size={12} className="text-emerald-500" />
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">{t('trust_score')}: {profile.trustScore}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Admin View - Edit Button */}
                        {isAdminView && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="mt-4 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 hover:bg-emerald-500/20 transition-colors"
                            >
                                <User size={14} className="text-emerald-500" />
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Profilni tahrirlash</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Quick Stats Grid */}
                {role === 'CLIENT' && (
                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={() => alert('Sevimli tashkilotlar ro\'yxati')}
                            className="bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border-main)] hover:border-rose-300 dark:hover:border-rose-800 transition-all group cursor-pointer active:scale-95 flex items-center gap-3"
                        >
                            <div className="w-8 h-8 bg-rose-50 dark:bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                                <Heart size={16} />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-xs font-black text-[var(--text-main)]">{t('favorites')}</p>
                            </div>
                            <span className="text-sm font-black text-rose-500">{favoritesCount}</span>
                            <ChevronRight size={16} className="text-gray-300" />
                        </button>
                    </div>
                )}

                {/* Settings Categories */}
                <div className="space-y-8">
                    {sections.map((section, sidx) => (
                        <div key={sidx} className="space-y-3">
                            <h4 className="px-6 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">{section.title}</h4>
                            {(section as any).inline ? (
                                <div className="flex gap-2 px-2">
                                    {section.items.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => { haptics.light(); item.action(); }}
                                            className="flex-1 bg-[var(--bg-card)] p-3 rounded-2xl border border-[var(--border-main)] flex flex-col items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-all active:scale-95"
                                        >
                                            <div className="w-8 h-8 rounded-xl bg-[var(--bg-app)] flex items-center justify-center">
                                                {item.icon}
                                            </div>
                                            <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-wide text-center">{item.label}</p>
                                        </button>
                                    ))}
                                </div>
                            ) : (
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
                                            {item.id === 'notifications' ? (
                                                <div className={`w-12 h-7 rounded-full p-1 transition-colors relative ${notificationsEnabled ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-slate-700'}`}>
                                                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 left-1 transition-transform duration-200 ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                                </div>
                                            ) : (
                                                <ChevronRight size={18} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
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
            </div>

            {/* Professional Edit Profile Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] border border-[var(--border-main)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 my-8">
                        <div className="p-6 border-b border-[var(--border-main)] flex justify-between items-center">
                            <h3 className="text-xl font-black text-[var(--text-main)] tracking-tight">{t('edit_profile')}</h3>
                            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Profile Picture Section */}
                            <div className="flex flex-col items-center">
                                <div className="relative mb-3">
                                    <div className="w-24 h-24 rounded-[2rem] bg-emerald-50 dark:bg-slate-800 overflow-hidden flex items-center justify-center shadow-lg">
                                        {profile.imageUrl ? (
                                            <img src={profile.imageUrl} className="w-full h-full object-cover" alt="Profile" />
                                        ) : (
                                            <User size={40} className="text-emerald-500/50" />
                                        )}
                                    </div>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute -bottom-1 -right-1 bg-emerald-600 border-4 border-white dark:border-slate-900 text-white p-2 rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all"
                                    >
                                        <Camera size={14} />
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Rasmni o'zgartirish uchun bosing</p>
                            </div>

                            {/* Name Field */}
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

                            {/* Phone Field */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest pl-2">{t('phone_placeholder')}</label>
                                <div className="relative">
                                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="tel"
                                        maxLength={9}
                                        value={phone}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                                            setPhone(val);
                                        }}
                                        className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none font-bold text-[var(--text-main)] transition-all focus:bg-white dark:focus:bg-slate-800"
                                    />
                                </div>
                            </div>

                            {/* Password Section */}
                            <div className="pt-4 border-t border-[var(--border-main)] space-y-4">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck size={18} className="text-blue-500" />
                                    <h4 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Xavfsizlik - Parol</h4>
                                </div>
                                <div className="space-y-3">
                                    <input
                                        type="password"
                                        placeholder="Yangi parol (ixtiyoriy)"
                                        className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-[var(--text-main)] transition-all text-sm"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Parolni tasdiqlang"
                                        className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-[var(--text-main)] transition-all text-sm"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
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

            {/* About Modal */}
            {showAbout && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-[var(--border-main)] shadow-2xl relative">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-4"><Info size={32} /></div>
                            <h3 className="text-2xl font-black text-[var(--text-main)]">NAVBAT App</h3>
                            <p className="text-sm text-gray-500 font-bold">Versiya 2.5.0</p>
                            <p className="text-xs text-gray-400">Navbat ilovasi orqali siz o'z vaqtingizni qadrlang va navbatlarni onlayn band qiling.</p>
                            <button onClick={() => setShowAbout(false)} className="w-full bg-gray-100 dark:bg-slate-800 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-500">Yopish</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Privacy Modal */}
            {showPrivacy && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-[var(--border-main)] shadow-2xl relative">
                        <h3 className="text-xl font-black text-[var(--text-main)] mb-4">{t('privacy_policy')}</h3>
                        <div className="h-48 overflow-y-auto text-xs text-gray-500 space-y-2 pr-2">
                            <p>Ushbu maxfiylik siyosati sizning shaxsiy ma'lumotlaringizni qanday to'plashimiz, ishlatishimiz va himoya qilishimizni tushuntiradi.</p>
                            <p>1. Biz sizning telefon raqamingiz va ismingizni saqlaymiz.</p>
                            <p>2. Ma'lumotlar uchinchi shaxslarga berilmaydi.</p>
                            <p>3. Xavfsizlik eng yuqori darajada ta'minlanadi.</p>
                        </div>
                        <button onClick={() => setShowPrivacy(false)} className="w-full mt-6 bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-colors">Tushundim</button>
                    </div>
                </div>
            )}

            {/* Security Modal */}
            {showSecurity && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[3rem] border border-[var(--border-main)] shadow-2xl overflow-hidden">
                        <div className="p-8 border-b border-[var(--border-main)] flex justify-between items-center">
                            <h3 className="text-xl font-black text-[var(--text-main)] tracking-tight">Xavfsizlik</h3>
                            <button onClick={() => setShowSecurity(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                                <ShieldCheck size={24} className="text-blue-500" />
                                <div>
                                    <p className="text-sm font-black text-[var(--text-main)]">2-Faktorli autentifikatsiya</p>
                                    <p className="text-[10px] text-gray-500">Hozircha test rejimida</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Parol o'rnatish</h4>
                                <div className="space-y-3">
                                    <input
                                        type="password"
                                        placeholder="Yangi parol"
                                        className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none font-bold text-[var(--text-main)] transition-all text-sm"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Parolni tasdiqlang"
                                        className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none font-bold text-[var(--text-main)] transition-all text-sm"
                                    />
                                </div>
                                <button
                                    onClick={() => { haptics.success(); alert('Parol saqlandi!'); setShowSecurity(false); }}
                                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                                >
                                    Parolni saqlash
                                </button>
                            </div>

                            <p className="text-[10px] text-center text-gray-400">Parolingiz shifrlangan holda saqlanadi va hech kimga ko'rinmaydi.</p>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default ProfilePage;
