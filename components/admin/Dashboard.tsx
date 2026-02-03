import React from 'react';
import {
    Users, Building, Activity, ArrowUpRight, ArrowDownRight, TrendingUp
} from 'lucide-react';
import { MOCK_ORGANIZATIONS } from '../../constants';

const Dashboard: React.FC = () => {
    // Mock Stats
    const totalUsers = 12450;
    const activeQueues = 84;
    const todayServed = 1205;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Boshqaruv Paneli</h1>
                    <p className="text-gray-400 font-medium mt-2">Xush kelibsiz, Admin! Bugungi statistikani ko'rib chiqing.</p>
                </div>
            </header>

            <div className="grid grid-cols-3 gap-6">
                <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                                <Users size={24} className="text-white" />
                            </div>
                            <span className="flex items-center gap-1 text-emerald-400 text-xs font-black bg-emerald-500/20 px-3 py-1.5 rounded-full">
                                <ArrowUpRight size={12} /> +12.5%
                            </span>
                        </div>
                        <h3 className="text-5xl font-black tracking-tighter mb-2">{totalUsers.toLocaleString()}</h3>
                        <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Jami Foydalanuvchilar</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="p-3 bg-blue-50 rounded-2xl">
                                <Building size={24} className="text-blue-600" />
                            </div>
                            <span className="flex items-center gap-1 text-emerald-500 text-xs font-black bg-emerald-50 px-3 py-1.5 rounded-full">
                                <ArrowUpRight size={12} /> +2
                            </span>
                        </div>
                        <h3 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">{MOCK_ORGANIZATIONS.length}</h3>
                        <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Faol Tashkilotlar</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="p-3 bg-indigo-50 rounded-2xl">
                                <Activity size={24} className="text-indigo-600" />
                            </div>
                            <span className="flex items-center gap-1 text-rose-500 text-xs font-black bg-rose-50 px-3 py-1.5 rounded-full">
                                <ArrowDownRight size={12} /> -5%
                            </span>
                        </div>
                        <h3 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">{activeQueues}</h3>
                        <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Jonli Navbatlar</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-80 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-gray-900">Haftalik O'sish</h3>
                        <button className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100"><TrendingUp size={20} className="text-gray-400" /></button>
                    </div>
                    <div className="flex-1 flex items-end justify-between gap-2">
                        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                            <div key={i} className="w-full bg-gray-50 rounded-t-2xl relative group overflow-hidden" style={{ height: `${h}%` }}>
                                <div className="absolute bottom-0 left-0 w-full h-0 bg-indigo-500 group-hover:h-full transition-all duration-500 ease-out"></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs font-bold text-gray-400 uppercase">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200 flex flex-col justify-center items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <Activity size={64} className="mb-6 animate-pulse" />
                    <h3 className="text-3xl font-black mb-2">Tizim Barqaror</h3>
                    <p className="opacity-80 font-medium text-sm">Server yuklamasi: 24% | API Javob vaqti: 45ms</p>
                    <div className="mt-8 flex gap-4">
                        <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-xs font-bold">Version 2.4.0</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
