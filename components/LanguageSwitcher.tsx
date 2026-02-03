
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../types';
import { Globe, ChevronDown, Check } from 'lucide-react';

const LANGUAGE_DATA = {
    [Language.UZ]: {
        flag: 'https://flagcdn.com/w20/uz.png',
        name: "O'zbekcha",
        shortName: 'UZ'
    },
    [Language.RU]: {
        flag: 'https://flagcdn.com/w20/ru.png',
        name: 'Русский',
        shortName: 'RU'
    },
    [Language.EN]: {
        flag: 'https://flagcdn.com/w20/gb.png',
        name: 'English',
        shortName: 'EN'
    }
};

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const currentLang = LANGUAGE_DATA[language];
    const languages = Object.entries(LANGUAGE_DATA);

    const handleSelect = (lang: Language) => {
        setLanguage(lang);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/40 text-white transition-all active:scale-95 group"
            >
                <div className="w-5 h-5 rounded-full overflow-hidden border border-white/30 shadow-sm">
                    <img src={currentLang.flag} alt={currentLang.shortName} className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider">{currentLang.shortName}</span>
                <ChevronDown size={12} className={`text-white/60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        {languages.map(([key, data]) => (
                            <button
                                key={key}
                                onClick={() => handleSelect(key as Language)}
                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors group ${language === key ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}
                            >
                                <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-gray-100 dark:border-slate-600 shadow-sm group-hover:scale-110 transition-transform">
                                    <img src={data.flag} alt={data.shortName} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 text-left">
                                    <span className={`text-xs font-bold ${language === key ? 'text-emerald-600' : 'text-gray-700 dark:text-gray-200'}`}>{data.name}</span>
                                </div>
                                {language === key && (
                                    <Check size={16} className="text-emerald-500" />
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default LanguageSwitcher;
