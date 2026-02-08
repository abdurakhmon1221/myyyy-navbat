
import React, { useState } from 'react';
import {
    Users, Search, Filter, Ban, Eye, User as UserIcon, MoreVertical, Phone, Clock, Calendar, Trash2, ShieldCheck
} from 'lucide-react';
import { useMobile } from '../../hooks/useMobile';

const ClientManager: React.FC = () => {
    const isMobile = useMobile();
    const [clients, setClients] = useState([
        { id: 1, name: 'Ali Valiyev', phone: '+998 90 123 45 67', status: 'ACTIVE', lastVisit: '10 daqiqa oldin', visits: 12 },
        { id: 2, name: 'Sardor Rahimov', phone: '+998 99 987 65 43', status: 'BANNED', lastVisit: '2 kun oldin', visits: 4 },
        { id: 3, name: 'Malika Karimova', phone: '+998 93 555 44 33', status: 'ACTIVE', lastVisit: 'Hozir online', visits: 25 },
        { id: 4, name: 'Aziza Sobirova', phone: '+998 91 111 22 33', status: 'ACTIVE', lastVisit: '1 soat oldin', visits: 8 },
        { id: 5, name: 'Bekzod Aliyev', phone: '+998 97 777 88 99', status: 'ACTIVE', lastVisit: '3 kun oldin', visits: 15 },
    ]);
    const [clientSearch, setClientSearch] = useState('');

    const handleBan = (id: number) => {
        setClients(clients.map(c => c.id === id ? { ...c, status: c.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE' } : c));
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Mijozni o'chirishni tasdiqlaysizmi?")) {
            setClients(clients.filter(c => c.id !== id));
        }
    };

    const filteredClients = clients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()) || c.phone.includes(clientSearch));

    return (
        <div className={`space-y-6 animate-in fade-in max-w-6xl mx-auto pb-24 ${isMobile ? 'p-0' : ''}`}>
            <header className={`flex justify-between items-center ${isMobile ? 'px-4 mb-4' : 'mb-8'}`}>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mijozlar Bazasi</h1>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Foydalanuvchilarni nazorat qilish</p>
                </div>
            </header>

            <div className={`flex gap-4 ${isMobile ? 'px-4 flex-col' : 'mb-8'}`}>
                <div className="flex-1 bg-white p-2 pl-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                    <Search size={20} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Ism yoki Telefon raqam..."
                        className="flex-1 bg-transparent outline-none text-gray-900 font-bold placeholder:text-gray-300 placeholder:font-medium py-3"
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                    />
                </div>
                {!isMobile && (
                    <button className="bg-white p-4 rounded-2xl border border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm">
                        <Filter size={20} />
                    </button>
                )}
            </div>

            <div className={`grid grid-cols-1 gap-4 ${isMobile ? 'px-4' : ''}`}>
                {filteredClients.map(client => (
                    isMobile ? (
                        // Mobile Card
                        <div key={client.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4 active:scale-[0.98] transition-all">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                                        <UserIcon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900">{client.name}</h3>
                                        <p className="text-xs text-gray-400 font-bold">{client.phone}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleBan(client.id)}
                                        className={`p-2 rounded-xl ${client.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}
                                    >
                                        {client.status === 'ACTIVE' ? <ShieldCheck size={20} /> : <Ban size={20} />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(client.id)}
                                        className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-rose-600"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1"><Clock size={10} /> Oxirgi tashrif</p>
                                    <p className="text-xs font-black text-gray-700">{client.lastVisit}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400 text-right flex items-center justify-end gap-1"><Calendar size={10} /> Tashriflar</p>
                                    <p className="text-xs font-black text-gray-700 text-right">{client.visits} ta</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase ${client.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {client.status}
                                </span>
                            </div>
                        </div>
                    ) : (
                        // Desktop Card
                        <div key={client.id} className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                                    <UserIcon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-gray-900">{client.name}</h3>
                                    <p className="text-xs text-gray-400 font-bold">{client.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Oxirgi tashrif</p>
                                    <p className="text-xs font-bold text-gray-700">{client.lastVisit}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Tashriflar</p>
                                    <p className="text-xs font-bold text-gray-700">{client.visits} ta</p>
                                </div>
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${client.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {client.status}
                                </span>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleBan(client.id)}
                                        className={`p-2 rounded-lg transition-colors ${client.status === 'ACTIVE' ? 'hover:bg-rose-50 text-emerald-500 hover:text-rose-600' : 'hover:bg-emerald-50 text-rose-500 hover:text-emerald-600'}`}
                                        title={client.status === 'ACTIVE' ? "Bloklash" : "Faollashtirish"}
                                    >
                                        {client.status === 'ACTIVE' ? <ShieldCheck size={18} /> : <Ban size={18} />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(client.id)}
                                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                        title="O'chirish"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default ClientManager;
