
import React, { useState } from 'react';
import { Search, Filter, Download, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, User, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { QueueItem } from '../../types';

interface OrgQueueJournalProps {
    // In a real app, this would probably take a date range or similar to fetch data
}

const OrgQueueJournal: React.FC<OrgQueueJournalProps> = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'>('ALL');
    const [currentPage, setCurrentPage] = useState(1);

    // Mock Data for Journal
    const journalData = Array.from({ length: 25 }).map((_, i) => ({
        id: `q-${1000 + i}`,
        number: Math.floor(Math.random() * 900) + 100,
        service: ['Soch olish', 'Soqol olish', 'Kompleks'][Math.floor(Math.random() * 3)],
        client: ['Ali Valiev', 'Jasur Kenjaev', 'Sardor Rahimov', 'Botir Zokirov'][Math.floor(Math.random() * 4)],
        employee: ['Master Sherzod', 'Master Aziz', 'Master Umid'][Math.floor(Math.random() * 3)],
        startTime: '10:30',
        endTime: '11:15',
        duration: '45 daq',
        status: ['COMPLETED', 'CANCELLED', 'NO_SHOW'][Math.floor(Math.random() * 10) > 8 ? (Math.floor(Math.random() * 2) + 1) : 0] as any,
        amount: '85,000',
        rating: Math.floor(Math.random() * 2) + 4
    }));

    const filteredData = journalData.filter(item => {
        const matchesSearch = item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.number.toString().includes(searchTerm);
        const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-[2rem] border border-[var(--border-main)] shadow-sm">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Mijoz yoki raqam..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-slate-800 pl-12 pr-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold text-sm"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl flex-shrink-0">
                        {[
                            { id: 'ALL', label: 'Barchasi' },
                            { id: 'COMPLETED', label: '✓' },
                            { id: 'CANCELLED', label: '✗' },
                            { id: 'NO_SHOW', label: '?' }
                        ].map(filter => (
                            <button
                                key={filter.id}
                                onClick={() => setStatusFilter(filter.id as any)}
                                className={`px-3 py-2 rounded-lg text-xs font-black uppercase transition-all whitespace-nowrap ${statusFilter === filter.id ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    <button className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl hover:bg-emerald-100 transition-colors flex-shrink-0">
                        <Download size={20} />
                    </button>
                    <button className="bg-indigo-50 text-indigo-600 p-3 rounded-2xl hover:bg-indigo-100 transition-colors flex-shrink-0">
                        <CalendarIcon size={20} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-[var(--border-main)] shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
                            <tr>
                                <th className="text-left py-4 px-4 md:px-6 font-black text-[10px] uppercase tracking-widest text-gray-400">№</th>
                                <th className="text-left py-4 px-4 md:px-6 font-black text-[10px] uppercase tracking-widest text-gray-400">Mijoz</th>
                                <th className="text-left py-4 px-4 md:px-6 font-black text-[10px] uppercase tracking-widest text-gray-400 hidden md:table-cell">Xizmat</th>
                                <th className="text-left py-4 px-4 md:px-6 font-black text-[10px] uppercase tracking-widest text-gray-400 hidden lg:table-cell">Xodim</th>
                                <th className="text-left py-4 px-4 md:px-6 font-black text-[10px] uppercase tracking-widest text-gray-400 hidden lg:table-cell">Vaqt</th>
                                <th className="text-left py-4 px-4 md:px-6 font-black text-[10px] uppercase tracking-widest text-gray-400">Holat</th>
                                <th className="text-right py-4 px-4 md:px-6 font-black text-[10px] uppercase tracking-widest text-gray-400">Narx</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                            {filteredData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                                    <td className="py-3 px-4 md:px-6">
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl md:rounded-2xl flex items-center justify-center text-indigo-600 font-[1000] text-sm md:text-lg group-hover:scale-110 transition-transform">
                                            {item.number}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 md:px-6">
                                        <div className="font-bold text-[var(--text-main)] max-w-[80px] md:max-w-[120px] truncate text-sm">{item.client}</div>
                                        <div className="text-[9px] md:text-[10px] text-gray-400 font-medium">{item.id}</div>
                                    </td>
                                    <td className="py-3 px-4 md:px-6 hidden md:table-cell">
                                        <div className="font-bold text-gray-600 dark:text-gray-300 text-sm">{item.service}</div>
                                    </td>
                                    <td className="py-3 px-4 md:px-6 hidden lg:table-cell">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                                                {item.employee[0]}
                                            </div>
                                            <span className="text-sm font-medium">{item.employee}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 md:px-6 hidden lg:table-cell">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1 text-xs font-bold text-[var(--text-main)]">
                                                <Clock size={12} className="text-gray-400" />
                                                {item.startTime} - {item.endTime}
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-medium">{item.duration}</div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 md:px-6">
                                        {item.status === 'COMPLETED' && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg text-[9px] md:text-[10px] font-black">
                                                <CheckCircle2 size={10} />
                                            </span>
                                        )}
                                        {item.status === 'CANCELLED' && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-lg text-[9px] md:text-[10px] font-black">
                                                <XCircle size={10} />
                                            </span>
                                        )}
                                        {item.status === 'NO_SHOW' && (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-lg text-[9px] md:text-[10px] font-black">
                                                <AlertCircle size={10} />
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 md:px-6 text-right">
                                        <div className="font-[1000] text-emerald-600 text-sm">{item.amount}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-[var(--border-main)] flex items-center justify-between">
                    <p className="text-xs text-gray-400 font-bold ml-2">Jami: {journalData.length} ta yozuv</p>
                    <div className="flex gap-2">
                        <button disabled={currentPage === 1} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 transition-colors">
                            <ChevronLeft size={20} className="text-gray-600" />
                        </button>
                        <button className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-200">1</button>
                        <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold transition-colors">2</button>
                        <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold transition-colors">3</button>
                        <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 transition-colors">
                            <ChevronRight size={20} className="text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrgQueueJournal;
