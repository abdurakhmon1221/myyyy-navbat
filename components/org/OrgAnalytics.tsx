
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

const OrgAnalytics: React.FC = () => {
    const barData = [
        { day: 'Du', count: 45 }, { day: 'Se', count: 52 }, { day: 'Ch', count: 48 },
        { day: 'Pa', count: 61 }, { day: 'Ju', count: 55 }, { day: 'Sh', count: 32 }
    ];
    const pieData = [
        { name: 'Kredit', value: 40, color: '#4f46e5' },
        { name: 'Karta', value: 30, color: '#10b981' },
        { name: 'Konsultatsiya', value: 30, color: '#f59e0b' }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-24">
            <div className="px-1">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Chuqur tahlil</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Oylik hisobotlar</p>
            </div>
            <div className="grid grid-cols-1 gap-6">
                <section className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Haftalik o'sish</h4>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                                <Bar dataKey="count" fill="#4f46e5" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>
                <section className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Xizmatlar ulushi</h4>
                    <div className="h-[200px] flex items-center justify-center">
                        <PieChart width={200} height={200}>
                            <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default OrgAnalytics;
