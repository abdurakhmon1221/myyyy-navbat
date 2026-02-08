import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, Users, DollarSign, Clock, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const OrgAnalytics: React.FC = () => {
    const { t } = useLanguage();
    const [filter, setFilter] = useState<'WEEK' | 'MONTH' | 'YEAR'>('WEEK');

    // ... (data definitions remain same)

    // Helper for labels
    const getFilterLabel = (f: string) => {
        if (f === 'WEEK') return 'Hafta'; // Should use t('week') if available
        if (f === 'MONTH') return 'Oy';
        return 'Yil';
    };

    const barData = [
        { day: 'Du', count: 45, income: 1200 }, { day: 'Se', count: 52, income: 1500 },
        { day: 'Ch', count: 48, income: 1300 }, { day: 'Pa', count: 61, income: 1800 },
        { day: 'Ju', count: 55, income: 1600 }, { day: 'Sh', count: 32, income: 900 }
    ];

    const pieData = [
        { name: t('services') || 'Xizmatlar', value: 45, color: '#4f46e5' },
        { name: 'Mahsulotlar', value: 25, color: '#10b981' },
        { name: 'Konsultatsiya', value: 30, color: '#f59e0b' }
    ];

    const trafficData = [
        { time: '09:00', load: 20 }, { time: '11:00', load: 60 }, { time: '13:00', load: 85 },
        { time: '15:00', load: 50 }, { time: '17:00', load: 70 }, { time: '19:00', load: 30 }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-24">
            {/* Header */}
            <div className="flex justify-between items-center px-1">
                <div>
                    <h3 className="text-2xl font-black text-[var(--text-main)] tracking-tight">{t('nav_analytics')}</h3>
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">Biznes ko'rsatkichlari</p>
                </div>
                <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
                    {['WEEK', 'MONTH', 'YEAR'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${filter === f ? 'bg-white dark:bg-slate-900 shadow-sm text-indigo-600' : 'text-gray-400'}`}
                        >
                            {getFilterLabel(f)}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4">
                {[
                    { label: 'Jami Tushum', val: '12.4 M', trend: '+12%', isUp: true, icon: <DollarSign size={20} />, color: 'bg-emerald-50 text-emerald-600' },
                    { label: 'Yangi Mijozlar', val: '142', trend: '+8%', isUp: true, icon: <Users size={20} />, color: 'bg-indigo-50 text-indigo-600' },
                    { label: 'O\'rtacha Chek', val: '85k', trend: '-2%', isUp: false, icon: <TrendingUp size={20} />, color: 'bg-blue-50 text-blue-600' },
                    { label: 'Kutish Vaqti', val: '14m', trend: '-5%', isUp: true, icon: <Clock size={20} />, color: 'bg-amber-50 text-amber-600' },
                ].map((kpi, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-[var(--border-main)] shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div className={`w-10 h-10 rounded-xl ${kpi.color} dark:bg-opacity-20 flex items-center justify-center`}>{kpi.icon}</div>
                            <span className={`text-[10px] font-bold flex items-center gap-1 ${kpi.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {kpi.trend} {kpi.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            </span>
                        </div>
                        <h4 className="text-2xl font-[1000] text-[var(--text-main)] mb-1">{kpi.val}</h4>
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{kpi.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Income Chart */}
                <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-[var(--border-main)] shadow-sm">
                    <h4 className="text-sm font-black text-[var(--text-main)] uppercase tracking-widest mb-6">Daromad Dinamikasi</h4>
                    <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} dy={10} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="income" fill="#4f46e5" radius={[8, 8, 8, 8]} barSize={12} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Categories Chart */}
                <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-[var(--border-main)] shadow-sm">
                    <h4 className="text-sm font-black text-[var(--text-main)] uppercase tracking-widest mb-6">Tushum Manbalari</h4>
                    <div className="h-[220px] flex items-center justify-center relative">
                        <PieChart width={220} height={220}>
                            <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                                {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-[1000] text-[var(--text-main)]">100%</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Jami</span>
                        </div>
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                        {pieData.map((entry, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                                <span className="text-[10px] font-bold text-gray-500">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Traffic Forecast */}
            <section className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-[var(--border-main)] shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-black text-[var(--text-main)] uppercase tracking-widest">Mijoz Oqimi (Prognoz)</h4>
                    <Calendar size={18} className="text-gray-400" />
                </div>
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trafficData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} dy={10} />
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                            <Line type="monotone" dataKey="load" stroke="#10b981" strokeWidth={4} dot={{ r: 0 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </section>
        </div>
    );
};

export default OrgAnalytics;
