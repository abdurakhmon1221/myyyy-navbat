
import React, { useState } from 'react';
import {
    Building, Search, Filter, Briefcase, Eye, ShieldAlert, MoreVertical, CheckCircle2, XCircle, LayoutGrid, List, Plus, X, MapPin, Trash2, Pencil, ShieldCheck
} from 'lucide-react';
import { useOrganizations } from '../../hooks/useOrganizations';
import { useMobile } from '../../hooks/useMobile';
import { Organization } from '../../types';

const CompanyManager: React.FC = () => {
    const { organizations, addOrganization, updateOrganization, deleteOrganization } = useOrganizations();
    const isMobile = useMobile();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPlan, setFilterPlan] = useState<'ALL' | 'BASIC' | 'PRO' | 'ENTERPRISE'>('ALL');
    const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('LIST');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

    // Form State
    const [newOrg, setNewOrg] = useState<Partial<Organization>>({
        name: '',
        category: 'Private',
        plan: 'BASIC',
        status: 'OPEN',
        address: ''
    });

    const filteredOrgs = organizations.filter(org =>
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterPlan === 'ALL' || org.plan === filterPlan)
    );

    const handleSaveOrg = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingOrg) {
            // Update existing
            const updated: Organization = {
                ...editingOrg,
                name: newOrg.name || editingOrg.name,
                category: newOrg.category || editingOrg.category,
                plan: (newOrg.plan as any) || editingOrg.plan,
                address: newOrg.address || editingOrg.address,
            };
            updateOrganization(updated);
        } else {
            // Create new
            const id = `org_${Date.now()}`;
            const org: Organization = {
                id,
                name: newOrg.name || 'Nomsiz',
                category: newOrg.category || 'Other',
                plan: (newOrg.plan as any) || 'BASIC',
                status: 'OPEN',
                adminStatus: 'APPROVED',
                address: newOrg.address || 'Toshkent',
                location: { lat: 41.2995, lng: 69.2401 },
                services: [],
                employees: [],
                workingHours: { days: [1, 2, 3, 4, 5], open: '09:00', close: '18:00' },
                estimatedServiceTime: 15,
                earnedBadges: []
            };
            addOrganization(org);
        }

        closeModal();
    };

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`"${name}" tashkilotini o'chirishni tasdiqlaysizmi?`)) {
            deleteOrganization(id);
        }
    };

    const handleStatusChange = (org: Organization, newStatus: string) => {
        updateOrganization({ ...org, adminStatus: newStatus as any });
    };

    const openEditModal = (org: Organization) => {
        setEditingOrg(org);
        setNewOrg({
            name: org.name,
            category: org.category,
            plan: org.plan || 'BASIC',
            address: org.address
        });
        setShowAddModal(true);
    };

    const closeModal = () => {
        setShowAddModal(false);
        setEditingOrg(null);
        setNewOrg({ name: '', category: 'Private', plan: 'BASIC', address: '' });
    };

    return (
        <div className={`space-y-6 animate-in fade-in max-w-7xl mx-auto pb-24 relative ${isMobile ? 'p-0' : ''}`}>
            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative">
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-black text-gray-900 mb-6">
                            {editingOrg ? 'Tashkilotni Tahrirlash' : 'Yangi Tashkilot'}
                        </h2>

                        <form onSubmit={handleSaveOrg} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tashkilot Nomi</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-gray-50 p-4 rounded-xl font-bold outline-none border-2 border-transparent focus:border-indigo-500 transition-all"
                                    placeholder="Masalan: Rayhon Milliy Taomlar"
                                    value={newOrg.name}
                                    onChange={e => setNewOrg({ ...newOrg, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Manzil</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 pl-11 pr-4 py-4 rounded-xl font-bold outline-none border-2 border-transparent focus:border-indigo-500 transition-all"
                                        placeholder="Ko'cha va uy raqami"
                                        value={newOrg.address}
                                        onChange={e => setNewOrg({ ...newOrg, address: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Kategoriya</label>
                                    <select
                                        className="w-full bg-gray-50 p-4 rounded-xl font-bold outline-none"
                                        value={newOrg.category}
                                        onChange={e => setNewOrg({ ...newOrg, category: e.target.value })}
                                    >
                                        <option value="Private">Xususiy</option>
                                        <option value="Gov">Davlat</option>
                                        <option value="Health">Tibbiyot</option>
                                        <option value="Finance">Moliya</option>
                                        <option value="Education">Ta'lim</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tarif</label>
                                    <select
                                        className="w-full bg-gray-50 p-4 rounded-xl font-bold outline-none"
                                        value={newOrg.plan}
                                        onChange={e => setNewOrg({ ...newOrg, plan: e.target.value as any })}
                                    >
                                        <option value="BASIC">Basic</option>
                                        <option value="PRO">Pro</option>
                                        <option value="ENTERPRISE">Enterprise</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl font-black uppercase tracking-wider shadow-lg shadow-indigo-200 mt-4 transition-all active:scale-95"
                            >
                                {editingOrg ? 'Saqlash' : 'Yaratish'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <header className={`flex justify-between items-center ${isMobile ? 'px-4' : 'mb-8'}`}>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tashkilotlar</h1>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Hamkorlarni boshqarish markazi</p>
                </div>
                {!isMobile && (
                    <div className="flex gap-3">
                        <div className="bg-white p-1 rounded-xl border border-gray-100 flex shadow-sm">
                            <button
                                onClick={() => setViewMode('GRID')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'GRID' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <LayoutGrid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('LIST')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'LIST' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <List size={18} />
                            </button>
                        </div>
                        <button
                            onClick={() => {
                                setEditingOrg(null);
                                setNewOrg({ name: '', category: 'Private', plan: 'BASIC', address: '' });
                                setShowAddModal(true);
                            }}
                            className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2"
                        >
                            <Plus size={16} /> Yangi Qo'shish
                        </button>
                    </div>
                )}
            </header>

            <div className={`flex flex-col gap-4 ${isMobile ? 'px-4' : 'mb-8'}`}>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 bg-white p-1 pl-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                        <Search size={20} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="ID yoki Nom bo'yicha qidirish..."
                            className="flex-1 bg-transparent outline-none text-gray-900 font-bold placeholder:text-gray-300 placeholder:font-medium py-3"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        {['ALL', 'BASIC', 'PRO', 'ENTERPRISE'].map((plan) => (
                            <button
                                key={plan}
                                onClick={() => setFilterPlan(plan as any)}
                                className={`px-4 py-3 rounded-xl font-bold text-xs uppercase transition-all whitespace-nowrap ${filterPlan === plan
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                    : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
                                    }`}
                            >
                                {plan}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            {isMobile ? (
                // Mobile View
                <div className="px-4 space-y-4 pb-24">
                    {filteredOrgs.map((org) => (
                        <div key={org.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 object-cover flex items-center justify-center text-gray-300 font-black text-lg overflow-hidden">
                                        {org.imageUrl ? <img src={org.imageUrl} alt={org.name} className="w-full h-full object-cover" /> : <Briefcase size={20} />}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900">{org.name}</h3>
                                        <p className="text-xs text-gray-400 font-bold">{org.category}</p>
                                    </div>
                                </div>
                                <button className="p-2 rounded-xl bg-gray-50 text-gray-400"><MoreVertical size={20} /></button>
                            </div>

                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Holat</p>
                                    <span className={`text-xs font-black ${org.adminStatus === 'APPROVED' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {org.adminStatus}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Tarif</p>
                                    <span className="text-xs font-black text-indigo-600">{org.plan}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="fixed bottom-24 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center z-30"
                    >
                        <Plus size={28} />
                    </button>
                </div>
            ) : (
                // Desktop View
                <>
                    {viewMode === 'LIST' && (
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="text-left py-5 px-8 font-black text-[10px] uppercase tracking-widest text-gray-400">Tashkilot</th>
                                            <th className="text-left py-5 px-6 font-black text-[10px] uppercase tracking-widest text-gray-400">Holat</th>
                                            <th className="text-left py-5 px-6 font-black text-[10px] uppercase tracking-widest text-gray-400">Tarif</th>
                                            <th className="text-left py-5 px-6 font-black text-[10px] uppercase tracking-widest text-gray-400">Kategoriya</th>
                                            <th className="text-right py-5 px-8 font-black text-[10px] uppercase tracking-widest text-gray-400">Amallar</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredOrgs.map((org) => (
                                            <tr key={org.id} className="group hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 px-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                                                            {org.imageUrl ? <img src={org.imageUrl} alt={org.name} className="w-full h-full object-cover" /> : <Briefcase size={20} />}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-black text-gray-900">{org.name}</h4>
                                                            <p className="text-xs text-gray-400 font-bold">ID: {org.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${org.adminStatus === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' :
                                                        org.adminStatus === 'REJECTED' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                                                        }`}>
                                                        {org.adminStatus === 'APPROVED' ? <CheckCircle2 size={12} /> :
                                                            org.adminStatus === 'REJECTED' ? <XCircle size={12} /> : <ShieldAlert size={12} />}
                                                        {org.adminStatus || 'PENDING'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border ${org.plan === 'PREMIUM' ? 'border-indigo-100 text-indigo-600 bg-indigo-50' :
                                                        org.plan === 'PRO' ? 'border-amber-100 text-amber-600 bg-amber-50' :
                                                            'border-gray-100 text-gray-500 bg-gray-50'
                                                        }`}>
                                                        {org.plan || 'FREE'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
                                                        {org.category}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-8 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => openEditModal(org)}
                                                            className="p-2 hover:bg-indigo-50 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors"
                                                            title="Tahrirlash"
                                                        >
                                                            <Pencil size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(org, org.adminStatus === 'APPROVED' ? 'REJECTED' : 'APPROVED')}
                                                            className={`p-2 rounded-lg transition-colors ${org.adminStatus === 'APPROVED' ? 'hover:bg-rose-50 text-emerald-500 hover:text-rose-600' : 'hover:bg-emerald-50 text-rose-500 hover:text-emerald-600'}`}
                                                            title={org.adminStatus === 'APPROVED' ? 'Bloklash' : 'Faollashtirish'}
                                                        >
                                                            {org.adminStatus === 'APPROVED' ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(org.id, org.name)}
                                                            className="p-2 hover:bg-rose-50 rounded-lg text-gray-400 hover:text-rose-600 transition-colors"
                                                            title="O'chirish"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {viewMode === 'GRID' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredOrgs.map((org) => (
                                <div key={org.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-50 object-cover flex items-center justify-center text-gray-300 font-black text-2xl overflow-hidden shadow-inner">
                                            {org.imageUrl ? <img src={org.imageUrl} alt={org.name} className="w-full h-full object-cover" /> : <Briefcase size={24} />}
                                        </div>
                                        <div className="flex gap-1">
                                            <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-400"><MoreVertical size={20} /></button>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-gray-900 mb-1">{org.name}</h3>
                                    <p className="text-xs text-gray-400 font-bold mb-4">{org.category}</p>

                                    <div className="flex items-center gap-2 mb-6">
                                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${org.adminStatus === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                            {org.adminStatus || 'PENDING'}
                                        </span>
                                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border ${org.plan === 'PREMIUM' ? 'border-indigo-100 text-indigo-600 bg-indigo-50' :
                                            org.plan === 'PRO' ? 'border-amber-100 text-amber-600 bg-amber-50' : 'border-gray-100 text-gray-500 bg-gray-50'
                                            }`}>
                                            {org.plan || 'FREE'}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => openEditModal(org)}
                                        className="w-full py-3 rounded-xl bg-gray-50 text-gray-500 font-bold text-xs uppercase hover:bg-indigo-600 hover:text-white transition-all"
                                    >
                                        Boshqarish / Tahrirlash
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CompanyManager;
