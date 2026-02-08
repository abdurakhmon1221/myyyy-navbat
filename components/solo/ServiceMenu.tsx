
import React, { useState, useEffect } from 'react';
import {
    Scissors, Clock, DollarSign, Edit, Trash2, Plus, X,
    Star, TrendingUp, Users, Check
} from 'lucide-react';

interface Service {
    id: string;
    name: string;
    category: string;
    price: number;
    duration: number; // minutes
    description?: string;
    isPopular?: boolean;
    bookingCount: number;
}

const DEFAULT_SERVICES: Service[] = [];

const CATEGORIES = ['All', 'General'];

interface ServiceMenuProps {
    onClose: () => void;
}

const ServiceMenu: React.FC<ServiceMenuProps> = ({ onClose }) => {
    const [services, setServices] = useState<Service[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showAddService, setShowAddService] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    // Form states
    const [formName, setFormName] = useState('');
    const [formCategory, setFormCategory] = useState('General');
    const [formPrice, setFormPrice] = useState('');
    const [formDuration, setFormDuration] = useState('');
    const [formDescription, setFormDescription] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('solo_services');
        if (saved) {
            setServices(JSON.parse(saved));
        } else {
            setServices(DEFAULT_SERVICES);
        }
    }, []);

    const saveToStorage = (newServices: Service[]) => {
        setServices(newServices);
        localStorage.setItem('solo_services', JSON.stringify(newServices));
    };

    const filteredServices = services.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const totalServices = services.length;
    const avgPrice = services.length > 0 ? Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length) : 0;
    const popularServices = services.filter(s => s.isPopular).length;

    const handleEditService = (service: Service) => {
        setEditingService(service);
        setFormName(service.name);
        setFormCategory(service.category);
        setFormPrice(service.price.toString());
        setFormDuration(service.duration.toString());
        setFormDescription(service.description || '');
        setShowAddService(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Rostdan ham o'chirmoqchimisiz?")) {
            const updated = services.filter(s => s.id !== id);
            saveToStorage(updated);
        }
    };

    const handleSave = () => {
        if (!formName || !formPrice) return;

        const newSrv: Service = {
            id: editingService ? editingService.id : Date.now().toString(),
            name: formName,
            category: formCategory,
            price: Number(formPrice),
            duration: Number(formDuration) || 30,
            description: formDescription,
            isPopular: editingService ? editingService.isPopular : false,
            bookingCount: editingService ? editingService.bookingCount : 0
        };

        if (editingService) {
            const updated = services.map(s => s.id === editingService.id ? newSrv : s);
            saveToStorage(updated);
        } else {
            saveToStorage([...services, newSrv]);
        }
        resetForm();
    };

    const resetForm = () => {
        setFormName('');
        setFormCategory('General');
        setFormPrice('');
        setFormDuration('');
        setFormDescription('');
        setEditingService(null);
        setShowAddService(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[200] flex items-end md:items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[95vh] md:max-h-[90vh] rounded-t-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-4 md:p-8 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Xizmatlar</h2>
                            <p className="text-xs md:text-sm font-bold text-gray-500 mt-1">Narxlar va xizmat turlari</p>
                        </div>
                        <button onClick={onClose} className="p-2 md:p-3 bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl hover:bg-gray-50">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-2 md:gap-4">
                        <div className="bg-white dark:bg-slate-800 p-3 md:p-5 rounded-xl md:rounded-3xl text-center">
                            <Scissors size={16} className="text-teal-600 mx-auto mb-1" />
                            <h3 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white">{totalServices}</h3>
                            <span className="text-[8px] md:text-xs font-bold text-gray-400 uppercase">Xizmat</span>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-3 md:p-5 rounded-xl md:rounded-3xl text-center">
                            <DollarSign size={16} className="text-emerald-600 mx-auto mb-1" />
                            <h3 className="text-lg md:text-3xl font-black text-emerald-600">{(avgPrice / 1000).toFixed(0)}k</h3>
                            <span className="text-[8px] md:text-xs font-bold text-gray-400 uppercase">O'rtacha</span>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-3 md:p-5 rounded-xl md:rounded-3xl text-center">
                            <Star size={16} className="text-amber-600 mx-auto mb-1" />
                            <h3 className="text-xl md:text-3xl font-black text-amber-600">{popularServices}</h3>
                            <span className="text-[8px] md:text-xs font-bold text-gray-400 uppercase">TOP</span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="p-3 md:p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center gap-2">
                    <div className="flex gap-1.5 md:gap-2 overflow-x-auto scrollbar-hide flex-1">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold uppercase whitespace-nowrap flex-shrink-0 ${selectedCategory === cat
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-gray-100 dark:bg-slate-800 text-gray-500'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setShowAddService(true)}
                        className="p-2.5 md:px-6 md:py-3 bg-teal-600 text-white rounded-xl md:rounded-2xl font-black text-xs uppercase flex items-center gap-2 hover:bg-teal-700 flex-shrink-0"
                    >
                        <Plus size={18} /><span className="hidden md:inline">Yangi</span>
                    </button>
                </div>

                {/* Services List */}
                <div className="flex-1 overflow-y-auto p-3 md:p-6">
                    <div className="space-y-2 md:space-y-3">
                        {filteredServices.map(service => (
                            <div
                                key={service.id}
                                className="bg-gray-50 dark:bg-slate-800 p-3 md:p-6 rounded-xl md:rounded-3xl border border-gray-100 dark:border-gray-700 hover:border-teal-300 transition-all"
                            >
                                <div className="flex items-center gap-3 md:gap-5">
                                    <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 bg-teal-100 text-teal-600 dark:bg-teal-900/40`}>
                                        <Scissors size={20} className="md:hidden" />
                                        <Scissors size={28} className="hidden md:block" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 md:gap-3 flex-wrap">
                                            <h4 className="font-black text-sm md:text-lg text-gray-900 dark:text-white truncate">{service.name}</h4>
                                            {service.isPopular && (
                                                <Star size={12} fill="#f59e0b" className="text-amber-500 flex-shrink-0" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 md:gap-6 text-[10px] md:text-sm mt-1">
                                            <span className="font-bold text-gray-400 flex items-center gap-1">
                                                <Clock size={12} /> {service.duration}m
                                            </span>
                                            <span className="font-bold text-teal-600">{(service.price / 1000).toFixed(0)}k</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 md:gap-4 flex-shrink-0">
                                        <button
                                            onClick={() => handleEditService(service)}
                                            className="p-2 md:p-3 bg-white dark:bg-slate-700 rounded-lg md:rounded-xl hover:bg-teal-50"
                                        >
                                            <Edit size={16} className="text-teal-600" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="p-2 md:p-3 bg-white dark:bg-slate-700 rounded-lg md:rounded-xl hover:bg-rose-50"
                                        >
                                            <Trash2 size={16} className="text-rose-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add/Edit Service Modal */}
                {showAddService && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 rounded-[3rem] z-10">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-6">
                            <h3 className="text-2xl font-black">{editingService ? 'Xizmatni tahrirlash' : 'Yangi Xizmat'}</h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Xizmat nomi"
                                    value={formName}
                                    onChange={e => setFormName(e.target.value)}
                                    className="w-full p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-teal-500"
                                />
                                <select
                                    value={formCategory}
                                    onChange={e => setFormCategory(e.target.value)}
                                    className="w-full p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none"
                                >
                                    {CATEGORIES.filter(c => c !== 'All').map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="number"
                                        placeholder="Narxi (so'm)"
                                        value={formPrice}
                                        onChange={e => setFormPrice(e.target.value)}
                                        className="w-full p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Davomiyligi (min)"
                                        value={formDuration}
                                        onChange={e => setFormDuration(e.target.value)}
                                        className="w-full p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none"
                                    />
                                </div>
                                <textarea
                                    placeholder="Tavsif (ixtiyoriy)"
                                    value={formDescription}
                                    onChange={e => setFormDescription(e.target.value)}
                                    className="w-full p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none resize-none h-24"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={resetForm} className="flex-1 p-4 bg-gray-100 dark:bg-slate-700 rounded-2xl font-bold">
                                    Bekor qilish
                                </button>
                                <button onClick={handleSave} className="flex-1 p-4 bg-teal-600 text-white rounded-2xl font-bold">
                                    Saqlash
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceMenu;
