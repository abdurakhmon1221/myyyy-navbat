
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Command, MoveRight, History, Star, Building2, MapPin } from 'lucide-react';
import { MOCK_ORGANIZATIONS, CATEGORY_LIST } from '../../constants';
import { Organization } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface MasterSearchProps {
    show: boolean;
    onClose: () => void;
    onSelectOrg: (org: Organization) => void;
}

const MasterSearch: React.FC<MasterSearchProps> = ({ show, onClose, onSelectOrg }) => {
    const { t } = useLanguage();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Organization[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                show ? onClose() : onClose(); // This is handled by parent, but good to have
            }
            if (show) {
                if (e.key === 'Escape') onClose();
                if (e.key === 'ArrowDown') setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
                if (e.key === 'ArrowUp') setSelectedIndex(prev => Math.max(prev - 1, 0));
                if (e.key === 'Enter' && results[selectedIndex]) {
                    onSelectOrg(results[selectedIndex]);
                    onClose();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [show, results, selectedIndex, onClose, onSelectOrg]);

    useEffect(() => {
        if (show) {
            setTimeout(() => inputRef.current?.focus(), 100);
            setQuery('');
            setResults([]);
        }
    }, [show]);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        const q = query.toLowerCase();
        const filtered = MOCK_ORGANIZATIONS.filter(org =>
            org.name.toLowerCase().includes(q) ||
            org.address.toLowerCase().includes(q) ||
            org.category.toLowerCase().includes(q)
        ).slice(0, 5);
        setResults(filtered);
        setSelectedIndex(0);
    }, [query]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[400] flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Search Input */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
                    <Search className="text-slate-400 ml-2" size={24} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Muassasa, xizmat yoki savollarni qidiring..."
                        className="flex-1 bg-transparent py-4 text-lg font-bold outline-none text-slate-800 dark:text-white"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                        <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-black text-slate-500">
                            <Command size={10} />
                            <span>K</span>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>
                </div>

                {/* Results/Suggestions */}
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                    {query.trim() === '' ? (
                        <div className="space-y-6 p-4">
                            <section className="space-y-3">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <History size={12} /> Oxirgi qidiruvlar
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {['Toshkent City Bank', 'Sartaroshxona', 'Davlat xizmatlari'].map((s, i) => (
                                        <button key={i} onClick={() => setQuery(s)} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500/50 transition-all text-sm font-bold text-slate-600 dark:text-slate-300">
                                            <span>{s}</span>
                                            <MoveRight size={14} className="opacity-40" />
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <section className="space-y-3">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <Star size={12} /> Ommabop kategoriyalar
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORY_LIST.slice(0, 5).map(cat => (
                                        <button key={cat.id} className="px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider hover:border-emerald-500 transition-all flex items-center gap-2">
                                            <span className="text-emerald-500">{cat.icon}</span>
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="space-y-1">
                            {results.map((org, i) => (
                                <button
                                    key={org.id}
                                    onMouseEnter={() => setSelectedIndex(i)}
                                    onClick={() => { onSelectOrg(org); onClose(); }}
                                    className={`w-full flex items-center gap-4 p-4 rounded-[1.75rem] transition-all group ${selectedIndex === i ? 'bg-emerald-600 text-white shadow-lg' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedIndex === i ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                        <Building2 size={24} />
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <h5 className={`font-black text-sm truncate ${selectedIndex === i ? 'text-white' : 'text-slate-800 dark:text-white'}`}>{org.name}</h5>
                                        <div className="flex items-center gap-2 mt-1">
                                            <MapPin size={10} className={selectedIndex === i ? 'text-white/60' : 'text-slate-400'} />
                                            <span className={`text-[10px] font-bold uppercase truncate ${selectedIndex === i ? 'text-white/60' : 'text-slate-500'}`}>{org.address}</span>
                                        </div>
                                    </div>
                                    <div className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase ${selectedIndex === i ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-600'}`}>
                                        {org.category}
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center opacity-40">
                            <Search size={48} className="mx-auto mb-4" />
                            <p className="text-sm font-bold uppercase tracking-widest">Hech narsa topilmadi</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">Enter</span> Tanlash</span>
                        <span className="flex items-center gap-1"><span className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">↑↓</span> Harakatlanish</span>
                    </div>
                    <div>{results.length} ta natija</div>
                </div>
            </div>
        </div>
    );
};

export default MasterSearch;
