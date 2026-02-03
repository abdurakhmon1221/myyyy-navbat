import React, { useState } from 'react';
import {
    Building, Search, Filter, Briefcase, Eye, ShieldAlert, MoreVertical
} from 'lucide-react';
import { MOCK_ORGANIZATIONS } from '../../constants';

const CompanyManager: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPlan, setFilterPlan] = useState<'ALL' | 'BASIC' | 'PRO' | 'ENTERPRISE'>('ALL');

    const filteredOrgs = MOCK_ORGANIZATIONS.filter(org =>
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterPlan === 'ALL' || org.plan === filterPlan)
    );

    return (
        <div className="space-y-6 animate-in fade-in max-w-6xl mx-auto pb-24">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tashkilotlar</h1>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Hamkorlarni boshqarish</p>
                </div>
                <button className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2">
                    <Building size={16} /> Yangi Qo'shish
                </button>
            </header>

            <div className="flex gap-4 mb-8">
                <div className="flex-1 bg-white p-2 pl-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                    <Search size={20} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="ID yoki Nom bo'yicha qidirish..."
                        className="flex-1 bg-transparent outline-none text-gray-900 font-bold placeholder:text-gray-300 placeholder:font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="bg-white p-4 rounded-2xl border border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm">
                    <Filter size={20} />
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredOrgs.map((org) => (
                    <div key={org.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all group flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-gray-50 object-cover flex items-center justify-center text-gray-300 font-black text-2xl">
                                {org.logoUrl ? <img src={org.logoUrl} alt={org.name} className="w-full h-full object-cover rounded-2xl" /> : <Briefcase size={24} />}
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 mb-1">{org.name}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg uppercase tracking-wide">{org.industry}</span>
                                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${org.adminStatus === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                        {org.adminStatus}
                                    </span>
                                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border ${org.plan === 'ENTERPRISE' ? 'border-indigo-100 text-indigo-600 bg-indigo-50' :
                                            org.plan === 'PRO' ? 'border-amber-100 text-amber-600 bg-amber-50' : 'border-gray-100 text-gray-500 bg-gray-50'
                                        }`}>
                                        {org.plan}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 text-gray-400 transition-colors" title="Batafsil">
                                <Eye size={20} />
                            </button>
                            <button className="p-3 bg-gray-50 rounded-xl hover:bg-rose-50 hover:text-rose-600 text-gray-400 transition-colors" title="Bloklash">
                                <ShieldAlert size={20} />
                            </button>
                            <button className="p-3 bg-gray-50 rounded-xl hover:bg-gray-200 text-gray-400 transition-colors">
                                <MoreVertical size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompanyManager;
