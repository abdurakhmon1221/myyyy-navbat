import React, { useState } from 'react';
import {
    FileText, Globe, UserPlus, Settings, Trash2, Building, Activity, LayoutGrid
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Language } from '../../types';

const GlobalCMS: React.FC = () => {
    const { translations, updateTranslation } = useLanguage();
    const [activeCmsTab, setActiveCmsTab] = useState<'TRANSLATIONS' | 'CATEGORIES' | 'THEME'>('TRANSLATIONS');

    // Mock Categories State
    const [categories, setCategories] = useState([
        { id: '1', name: 'Bank Xizmatlari', icon: 'Landmark', requiredFields: ['passport', 'phone'] },
        { id: '2', name: 'Tibbiyot', icon: 'Hospital', requiredFields: ['dob', 'phone'] },
        { id: '3', name: 'Notarius', icon: 'Building2', requiredFields: ['passport_series', 'pinfl'] },
    ]);

    return (
        <div className="space-y-6 animate-in fade-in max-w-6xl mx-auto pb-24">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Global CMS</h1>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Tizim tarkibini boshqarish</p>
                </div>
                <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
                    <button
                        onClick={() => setActiveCmsTab('TRANSLATIONS')}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeCmsTab === 'TRANSLATIONS' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
                    >Tarjimalar</button>
                    <button
                        onClick={() => setActiveCmsTab('CATEGORIES')}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeCmsTab === 'CATEGORIES' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
                    >Kategoriyalar</button>
                    <button
                        onClick={() => setActiveCmsTab('THEME')}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeCmsTab === 'THEME' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
                    >Dizayn</button>
                </div>
            </header>

            {activeCmsTab === 'TRANSLATIONS' && (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Key</th>
                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest"><span className="flex items-center gap-1"><Globe size={12} /> O'zbekcha</span></th>
                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest"><span className="flex items-center gap-1"><Globe size={12} /> Русский</span></th>
                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest"><span className="flex items-center gap-1"><Globe size={12} /> English</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {Object.entries(translations).map(([key, values]) => (
                                <tr key={key} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-6 font-mono text-xs text-gray-400 font-bold">{key}</td>
                                    {(Object.keys(values) as Language[]).map(lang => (
                                        <td key={lang} className="p-4">
                                            <input
                                                type="text"
                                                className="w-full bg-transparent border-b-2 border-transparent focus:border-indigo-500 outline-none font-bold text-gray-700 text-sm py-1 transition-all"
                                                value={values[lang]}
                                                onChange={(e) => updateTranslation(key, lang, e.target.value)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeCmsTab === 'CATEGORIES' && (
                <div className="grid grid-cols-3 gap-6 animate-in fade-in">
                    {/* Create New Card */}
                    <div className="bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/50 transition-all group min-h-[250px]">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform text-gray-300 group-hover:text-indigo-500">
                            <UserPlus size={32} />
                        </div>
                        <h3 className="text-gray-400 font-black uppercase text-xs tracking-widest group-hover:text-indigo-600">Yangi Kategoriya</h3>
                    </div>

                    {categories.map(cat => (
                        <div key={cat.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm relative group overflow-hidden hover:shadow-md transition-all">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button className="p-2 bg-gray-100 rounded-xl hover:bg-blue-50 text-gray-400 hover:text-blue-500"><Settings size={16} /></button>
                                <button className="p-2 bg-gray-100 rounded-xl hover:bg-rose-50 text-gray-400 hover:text-rose-500"><Trash2 size={16} /></button>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mb-4 text-gray-600 shadow-inner">
                                {cat.icon === 'Landmark' && <Globe size={32} />}
                                {cat.icon === 'Hospital' && <Activity size={32} />}
                                {cat.icon === 'Building2' && <Building size={32} />}
                            </div>
                            <h3 className="text-xl font-black text-gray-900">{cat.name}</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">3 ta tashkilot</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[9px] font-bold text-gray-500 uppercase">#passport_id</span>
                                <span className="px-2 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[9px] font-bold text-gray-500 uppercase">#phone</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeCmsTab === 'THEME' && (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 animate-in fade-in text-center">
                    <div className="max-w-md mx-auto">
                        <div className="w-24 h-24 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full mx-auto mb-6 shadow-2xl shadow-emerald-200 animate-pulse"></div>
                        <h3 className="text-2xl font-black text-gray-900">Brending Tizimi</h3>
                        <p className="text-gray-400 mt-2 mb-8">Tizim ranglarini o'zgartirish (Tez kunda)</p>
                        <button className="bg-gray-100 text-gray-400 px-6 py-3 rounded-2xl font-bold text-xs uppercase cursor-not-allowed">Hozircha yopiq</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalCMS;
