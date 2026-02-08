
import React from 'react';
import {
    Users, Building, Activity, ArrowUpRight, ArrowDownRight, TrendingUp, Server, Cpu, Database
} from 'lucide-react';
import { useOrganizations } from '../../hooks/useOrganizations';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';

const Dashboard: React.FC = () => {
    // Real Data from DB
    const { organizations } = useOrganizations();

    // Derived Stats
    const totalUsers = organizations.length * 125 + 1200; // Mock estimation based on orgs
    const activeQueues = organizations.length * 3 + 12; // Mock estimation

    // Chart Data
    const growthData = [
        { day: 'Du', users: 40, orgs: 20 },
        { day: 'Se', users: 65, orgs: 25 },
        { day: 'Ch', users: 45, orgs: 22 },
        { day: 'Pa', users: 80, orgs: 30 },
        { day: 'Ju', users: 55, orgs: 28 },
        { day: 'Sh', users: 90, orgs: 35 },
        { day: 'Ya', users: 70, orgs: 32 }
    ];

    const trafficData = Array.from({ length: 24 }).map((_, i) => ({
        time: `${i}:00`,
        value: Math.floor(Math.random() * 100)
    }));

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        <h3 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">{organizations.length}</h3>
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

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-xl font-black text-gray-900">Platforma O'sishi</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Haftalik dinamika</p>
                        </div>
                        <button className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100"><TrendingUp size={20} className="text-gray-400" /></button>
                    </div>
                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={growthData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#9ca3af' }} dy={10} />
                            <Tooltip
                                cursor={{ fill: '#f9fafb' }}
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 700 }}
                            />
                            <Bar dataKey="users" name="Foydalanuvchilar" fill="#4f46e5" radius={[6, 6, 6, 6]} barSize={12} />
                            <Bar dataKey="orgs" name="Tashkilotlar" fill="#10b981" radius={[6, 6, 6, 6]} barSize={12} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200 flex flex-col relative overflow-hidden h-[400px]">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                    <div className="relative z-10 flex-1 flex flex-col">
                        <h3 className="text-2xl font-black mb-1">Tizim Holati</h3>
                        <p className="opacity-70 font-bold text-sm mb-8">Real vaqt rejimidagi monitoring</p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
                                    <Server size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs font-bold opacity-80">Server Load</span>
                                        <span className="text-xs font-bold">24%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                                        <div className="w-[24%] h-full bg-emerald-400 rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
                                    <Cpu size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs font-bold opacity-80">CPU Usage</span>
                                        <span className="text-xs font-bold">45%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                                        <div className="w-[45%] h-full bg-amber-400 rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
                                    <Database size={24} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs font-bold opacity-80">Memory</span>
                                        <span className="text-xs font-bold">60%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                                        <div className="w-[60%] h-full bg-indigo-300 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 pt-6 border-t border-white/20">
                        <div className="flex justify-between items-center text-xs font-bold opacity-80">
                            <span>Uptime</span>
                            <span>99.99%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Traffic Area Chart */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm h-[300px]">
                <h3 className="text-xl font-black text-gray-900 mb-6">Real Vaqt Trafik</h3>
                <ResponsiveContainer width="100%" height="80%">
                    <AreaChart data={trafficData}>
                        <defs>
                            <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;
