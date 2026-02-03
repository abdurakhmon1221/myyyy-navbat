import React, { useState } from 'react';
import {
    Users, Search, Filter, Ban, Eye, User as UserIcon
} from 'lucide-react';

const ClientManager: React.FC = () => {
    // Mock Clients Data
    const mockClients = [
        { id: 1, name: 'Ali Valiyev', phone: '+998 90 123 45 67', status: 'ACTIVE', lastVisit: '10 daqiqa oldin', visits: 12 },
        { id: 2, name: 'Sardor Rahimov', phone: '+998 99 987 65 43', status: 'BANNED', lastVisit: '2 kun oldin', visits: 4 },
        { id: 3, name: 'Malika Karimova', phone: '+998 93 555 44 33', status: 'ACTIVE', lastVisit: 'Hozir online', visits: 25 },
    ];
    const [clientSearch, setClientSearch] = useState('');

    const filteredClients = mockClients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()));

    return (
        <div className="space-y-6 animate-in fade-in max-w-6xl mx-auto pb-24">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mijozlar Bazasi</h1>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Foydalanuvchilarni nazorat qilish</p>
                </div>
            </header>

            <div className="flex gap-4 mb-8">
                <div className="flex-1 bg-white p-2 pl-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                    <Search size={20} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Ism yoki Telefon raqam..."
                        className="flex-1 bg-transparent outline-none text-gray-900 font-bold placeholder:text-gray-300 placeholder:font-medium"
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                    />
                </div>
                <button className="bg-white p-4 rounded-2xl border border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm">
                    <Filter size={20} />
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredClients.map(client => (
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
                                <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Eye size={18} /></button>
                                <button className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Ban size={18} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClientManager;
