import React from 'react';
import {
    ListTree, Clock, CheckCircle2, User as UserIcon, AlertTriangle
} from 'lucide-react';
import { MOCK_ORGANIZATIONS } from '../../constants';

const QueueMonitor: React.FC = () => {
    // Flatten all queues for global view
    const allQueues = MOCK_ORGANIZATIONS.flatMap(org =>
        org.queues.map(q => ({ ...q, orgName: org.name, orgLogo: org.logoUrl }))
    );

    return (
        <div className="space-y-6 animate-in fade-in max-w-6xl mx-auto pb-24">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Global Navbat</h1>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Barcha filiallarni kuzatish</p>
                </div>
                <button className="bg-rose-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-rose-600 active:scale-95 transition-all shadow-xl shadow-rose-200 flex items-center gap-2">
                    <AlertTriangle size={16} /> Emergency Stop
                </button>
            </header>

            <div className="grid grid-cols-2 gap-6">
                {allQueues.map((queue, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-bold text-gray-400">
                                    {queue.id}
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-900 text-lg leading-tight">{queue.currentNumber}</h3>
                                    <p className="text-xs text-gray-400 font-bold mt-1">{queue.orgName}</p>
                                </div>
                            </div>
                            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase animate-pulse">
                                Active
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs font-bold text-gray-500 bg-gray-50 p-3 rounded-xl">
                                <span className="flex items-center gap-2"><UserIcon size={14} /> Kutilmoqda</span>
                                <span className="text-gray-900">12 kishi</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold text-gray-500 bg-gray-50 p-3 rounded-xl">
                                <span className="flex items-center gap-2"><Clock size={14} /> O'rtacha vaqt</span>
                                <span className="text-gray-900">4 daqiqa</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold text-gray-500 bg-gray-50 p-3 rounded-xl">
                                <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Xizmat ko'rsatildi</span>
                                <span className="text-gray-900">45 bugun</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QueueMonitor;
