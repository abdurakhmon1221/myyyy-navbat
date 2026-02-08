
import React, { useState, useEffect } from 'react';
import {
    Users, Search, Star, Heart, Calendar, Phone, Mail,
    Edit, Trash2, Plus, X, Gift, Award, TrendingUp, Clock, Filter, Eye, MoreVertical, LayoutGrid, List
} from 'lucide-react';
import { useMobile } from '../../hooks/useMobile';

interface Customer {
    id: string;
    name: string;
    phone: string;
    email?: string;
    visits: number;
    totalSpent: number;
    lastVisit: string;
    loyalty: 'BRONZE' | 'SILVER' | 'GOLD' | 'VIP';
    birthday?: string;
    notes?: string;
    favoriteService?: string;
}

const DEFAULT_CUSTOMERS: Customer[] = [
    { id: '1', name: 'Alisher Karimov', phone: '+998901234567', visits: 24, totalSpent: 1200000, lastVisit: '2024-02-04', loyalty: 'VIP', birthday: '1990-05-15', favoriteService: 'Soch olish' },
    { id: '2', name: 'Malika Toshmatova', phone: '+998907654321', visits: 18, totalSpent: 980000, lastVisit: '2024-02-03', loyalty: 'GOLD', birthday: '1995-08-22', favoriteService: 'Manikur' },
    { id: '3', name: 'Sardor Azimov', phone: '+998909876543', visits: 12, totalSpent: 560000, lastVisit: '2024-02-01', loyalty: 'SILVER', favoriteService: 'Soqol olish' },
    { id: '4', name: 'Dilnoza Rahimova', phone: '+998901111111', visits: 8, totalSpent: 320000, lastVisit: '2024-01-28', loyalty: 'BRONZE', favoriteService: 'Pedikur' },
    { id: '5', name: 'Jamshid Aliyev', phone: '+998902223344', visits: 2, totalSpent: 80000, lastVisit: '2024-01-25', loyalty: 'BRONZE', favoriteService: 'Soch olish' },
];

interface CustomerDatabaseProps {
    onClose: () => void;
}

const CustomerDatabase: React.FC<CustomerDatabaseProps> = ({ onClose }) => {
    const isMobile = useMobile();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [showAddCustomer, setShowAddCustomer] = useState(false);
    const [filter, setFilter] = useState<'ALL' | 'VIP' | 'GOLD' | 'SILVER' | 'BRONZE'>('ALL');
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

    // Form State
    const [formName, setFormName] = useState('');
    const [formPhone, setFormPhone] = useState('');
    const [formLoyalty, setFormLoyalty] = useState<'BRONZE' | 'SILVER' | 'GOLD' | 'VIP'>('BRONZE');
    const [formNotes, setFormNotes] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('solo_customers');
        if (saved) {
            setCustomers(JSON.parse(saved));
        } else {
            setCustomers(DEFAULT_CUSTOMERS);
        }
    }, []);

    const saveToStorage = (newCustomers: Customer[]) => {
        setCustomers(newCustomers);
        localStorage.setItem('solo_customers', JSON.stringify(newCustomers));
    };

    const filteredCustomers = customers.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone.includes(searchQuery);
        const matchesFilter = filter === 'ALL' || c.loyalty === filter;
        return matchesSearch && matchesFilter;
    });

    const getLoyaltyColor = (loyalty: string) => {
        switch (loyalty) {
            case 'VIP': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'GOLD': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'SILVER': return 'bg-gray-50 text-gray-700 border-gray-200';
            default: return 'bg-orange-50 text-orange-700 border-orange-200';
        }
    };

    const handleEdit = (customer: Customer) => {
        setEditingCustomer(customer);
        setFormName(customer.name);
        setFormPhone(customer.phone);
        setFormLoyalty(customer.loyalty);
        setFormNotes(customer.notes || '');
        setShowAddCustomer(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Mijozni o'chirmoqchimisiz?")) {
            saveToStorage(customers.filter(c => c.id !== id));
            if (selectedCustomer?.id === id) setSelectedCustomer(null);
        }
    };

    const handleSave = () => {
        if (!formName || !formPhone) return;

        const newCustomer: Customer = {
            id: editingCustomer ? editingCustomer.id : 'c-' + Date.now(),
            name: formName,
            phone: formPhone,
            loyalty: formLoyalty,
            notes: formNotes,
            visits: editingCustomer ? editingCustomer.visits : 0,
            totalSpent: editingCustomer ? editingCustomer.totalSpent : 0,
            lastVisit: editingCustomer ? editingCustomer.lastVisit : new Date().toISOString().split('T')[0],
            email: editingCustomer?.email,
            birthday: editingCustomer?.birthday,
            favoriteService: editingCustomer?.favoriteService
        };

        if (editingCustomer) {
            saveToStorage(customers.map(c => c.id === editingCustomer.id ? newCustomer : c));
        } else {
            saveToStorage([...customers, newCustomer]);
        }
        resetForm();
    };

    const resetForm = () => {
        setFormName('');
        setFormPhone('');
        setFormLoyalty('BRONZE');
        setFormNotes('');
        setEditingCustomer(null);
        setShowAddCustomer(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[200] flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
            <div className={`bg-white dark:bg-slate-900 w-full md:max-w-7xl h-full md:h-[90vh] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative ${isMobile ? 'rounded-none' : ''}`}>

                {/* Header */}
                <div className="flex-none p-6 md:p-8 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900 z-10">
                    <div className="flex justify-between items-center mb-6 md:mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Mijozlar Bazasi</h2>
                            <p className="text-xs md:text-sm font-bold text-gray-400">Jami {filteredCustomers.length} ta mijoz</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowAddCustomer(true)}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                            >
                                <Plus size={18} /> Yangi Mijoz
                            </button>
                            <button onClick={onClose} className="p-3 bg-gray-100 dark:bg-slate-800 rounded-2xl hover:bg-gray-200 transition-colors text-gray-500">
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="relative">
                            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Qidirish..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-800 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all border border-transparent focus:border-indigo-500"
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {['ALL', 'VIP', 'GOLD', 'SILVER', 'BRONZE'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f as any)}
                                    className={`px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase whitespace-nowrap transition-all border ${filter === f
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200'
                                        : 'bg-white dark:bg-slate-800 text-gray-500 border-gray-200 dark:border-gray-700'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-slate-950/50 p-4 md:p-8">
                    {/* MOBILE VIEW cards */}
                    {isMobile ? (
                        <div className="space-y-4 pb-20">
                            {filteredCustomers.map(customer => (
                                <div
                                    key={customer.id}
                                    onClick={() => setSelectedCustomer(customer)}
                                    className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm active:scale-[0.98] transition-all"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-black text-lg">
                                                {customer.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900 dark:text-white">{customer.name}</h4>
                                                <p className="text-xs text-gray-400 font-bold">{customer.phone}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase border ${getLoyaltyColor(customer.loyalty)}`}>
                                            {customer.loyalty}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center bg-gray-50 dark:bg-slate-800/50 p-3 rounded-2xl">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-gray-400">Tashriflar</p>
                                            <p className="font-black text-gray-900 dark:text-white">{customer.visits}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase font-bold text-gray-400">Jami</p>
                                            <p className="font-black text-emerald-600">{customer.totalSpent.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Floating Add Button for Mobile */}
                            <button
                                onClick={() => setShowAddCustomer(true)}
                                className="fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center z-30"
                            >
                                <Plus size={32} />
                            </button>
                        </div>
                    ) : (
                        // DESKTOP VIEW Table
                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-gray-700">
                                        <tr>
                                            <th className="text-left py-5 px-8 font-black text-[10px] uppercase tracking-widest text-gray-400">Mijoz</th>
                                            <th className="text-left py-5 px-6 font-black text-[10px] uppercase tracking-widest text-gray-400">Status</th>
                                            <th className="text-left py-5 px-6 font-black text-[10px] uppercase tracking-widest text-gray-400">Aloqa</th>
                                            <th className="text-left py-5 px-6 font-black text-[10px] uppercase tracking-widest text-gray-400">Statistika</th>
                                            <th className="text-right py-5 px-8 font-black text-[10px] uppercase tracking-widest text-gray-400">Amallar</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                        {filteredCustomers.map(customer => (
                                            <tr key={customer.id} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                                                <td className="py-4 px-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-black text-lg">
                                                            {customer.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-black text-gray-900 dark:text-white">{customer.name}</h4>
                                                            <p className="text-xs text-gray-400 font-bold">ID: {customer.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border ${getLoyaltyColor(customer.loyalty)}`}>
                                                        {customer.loyalty}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300">
                                                            <Phone size={14} className="text-gray-400" /> {customer.phone}
                                                        </div>
                                                        {customer.email && (
                                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                                                <Mail size={14} className="text-gray-400" /> {customer.email}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex gap-4">
                                                        <div>
                                                            <p className="text-[10px] uppercase font-bold text-gray-400">Tashriflar</p>
                                                            <p className="text-sm font-black text-gray-900 dark:text-white">{customer.visits}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] uppercase font-bold text-gray-400">Jami Xarajat</p>
                                                            <p className="text-sm font-black text-emerald-600">{customer.totalSpent.toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-8 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                                        <button onClick={() => handleEdit(customer)} className="p-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 rounded-xl text-indigo-600 hover:bg-indigo-50"><Edit size={18} /></button>
                                                        <button onClick={() => handleDelete(customer.id)} className="p-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 rounded-xl text-rose-600 hover:bg-rose-50"><Trash2 size={18} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Add/Edit Customer Modal */}
                {showAddCustomer && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-6 z-50 animate-in fade-in">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md space-y-6">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white text-center">{editingCustomer ? 'Tahrirlash' : 'Yangi Mijoz'}</h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Ism Familiya"
                                    value={formName}
                                    onChange={e => setFormName(e.target.value)}
                                    className="w-full p-5 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-500 transition-all text-lg"
                                />
                                <input
                                    type="text"
                                    placeholder="Telefon Raqam"
                                    value={formPhone}
                                    onChange={e => setFormPhone(e.target.value)}
                                    className="w-full p-5 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-500 transition-all"
                                />
                                <select
                                    value={formLoyalty}
                                    onChange={e => setFormLoyalty(e.target.value as any)}
                                    className="w-full p-5 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none text-gray-900 dark:text-white"
                                >
                                    {['BRONZE', 'SILVER', 'GOLD', 'VIP'].map(loyalty => <option key={loyalty} value={loyalty}>{loyalty}</option>)}
                                </select>
                                <textarea
                                    placeholder="Eslatmalar"
                                    value={formNotes}
                                    onChange={e => setFormNotes(e.target.value)}
                                    className="w-full p-5 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-500 transition-all resize-none h-32"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button onClick={resetForm} className="flex-1 p-4 bg-gray-100 dark:bg-slate-700 rounded-2xl font-black text-xs uppercase tracking-wider text-gray-500 hover:bg-gray-200 transition-colors">Bekor qilish</button>
                                <button onClick={handleSave} className="flex-1 p-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">Saqlash</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Customer Detail Drawer/Modal */}
                {selectedCustomer && !showAddCustomer && (
                    <div className="absolute inset-y-0 right-0 w-full md:max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-gray-100 dark:border-gray-800 animate-in slide-in-from-right z-20 flex flex-col">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                            <h3 className="font-black text-xl text-gray-900 dark:text-white">Mijoz Profili</h3>
                            <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors"><X size={20} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="text-center">
                                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-xl mb-4">
                                    {selectedCustomer.name.charAt(0)}
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white">{selectedCustomer.name}</h2>
                                <p className="text-gray-500 font-bold">{selectedCustomer.phone}</p>
                                <div className="flex justify-center gap-2 mt-4">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase border ${getLoyaltyColor(selectedCustomer.loyalty)}`}>
                                        {selectedCustomer.loyalty}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl text-center">
                                    <Calendar className="w-5 h-5 mx-auto text-gray-400 mb-2" />
                                    <p className="text-xs font-bold text-gray-400 uppercase">Oxirgi tashrif</p>
                                    <p className="font-black text-gray-900 dark:text-white">{selectedCustomer.lastVisit}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl text-center">
                                    <TrendingUp className="w-5 h-5 mx-auto text-emerald-500 mb-2" />
                                    <p className="text-xs font-bold text-gray-400 uppercase">Jami to'lov</p>
                                    <p className="font-black text-gray-900 dark:text-white">{selectedCustomer.totalSpent.toLocaleString()}</p>
                                </div>
                            </div>

                            {selectedCustomer.favoriteService && (
                                <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-2xl border border-amber-100 dark:border-amber-800">
                                    <div className="flex items-center gap-2 mb-2 text-amber-700 font-bold text-xs uppercase">
                                        <Star size={16} /> Sevimli xizmat
                                    </div>
                                    <p className="text-lg font-black text-gray-900 dark:text-white">{selectedCustomer.favoriteService}</p>
                                </div>
                            )}

                            {selectedCustomer.notes && (
                                <div className="bg-gray-50 dark:bg-slate-800 p-5 rounded-2xl">
                                    <p className="text-gray-400 text-xs font-bold uppercase mb-2">Eslatmalar</p>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 italic">"{selectedCustomer.notes}"</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3 pt-4">
                                <button className="py-4 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors">SMS Yozish</button>
                                <button onClick={() => handleEdit(selectedCustomer)} className="py-4 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white font-bold text-sm hover:bg-gray-200 transition-colors">Tahrirlash</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDatabase;
