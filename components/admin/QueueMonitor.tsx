
import React from 'react';
import {
    ListTree, Clock, CheckCircle2, User as UserIcon, AlertTriangle
} from 'lucide-react';
import { useOrganizations } from '../../hooks/useOrganizations';
import { useMobile } from '../../hooks/useMobile';

const QueueMonitor: React.FC = () => {
    const { organizations, updateOrganization } = useOrganizations();
    const isMobile = useMobile();

    const handleEmergencyStop = (orgId?: string) => {
        if (orgId) {
            // Stop specific
            const org = organizations.find(o => o.id === orgId);
            if (org && window.confirm(`${org.name} uchun navbatni to'xtatmoqchimisiz?`)) {
                updateOrganization({ ...org, status: 'CLOSED' });
            }
        } else {
            // Stop all
            if (window.confirm("DIQQAT: Barcha navbatlarni to'xtatmoqchimisiz? Bu amal barcha filliallar ishini to'xtatadi.")) {
                organizations.forEach(org => {
                    updateOrganization({ ...org, status: 'CLOSED' });
                });
            }
        }
    };

    // Filter only active organizations for the monitor
    const activeOrgs = organizations.filter(org => org.status !== 'CLOSED');

    return (
        <div className={`space-y-6 animate-in fade-in max-w-6xl mx-auto pb-24 ${isMobile ? 'p-0' : ''}`}>
            <header className={`flex justify-between items-center ${isMobile ? 'px-4 mb-4' : 'mb-8'}`}>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Global Navbat</h1>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Barcha filiallarni kuzatish</p>
                </div>
                {!isMobile ? (
                    <button
                        onClick={() => handleEmergencyStop()}
                        className="bg-rose-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-rose-600 active:scale-95 transition-all shadow-xl shadow-rose-200 flex items-center gap-2"
                    >
                        <AlertTriangle size={16} /> Emergency Stop
                    </button>
                ) : (
                    <button
                        onClick={() => handleEmergencyStop()}
                        className="bg-rose-100 text-rose-600 p-3 rounded-xl"
                    >
                        <AlertTriangle size={24} />
                    </button>
                )}
            </header>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 ${isMobile ? 'px-4' : ''}`}>
                {activeOrgs.map((org) => (
                    <div key={org.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all active:scale-[0.98]">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-bold text-gray-400 overflow-hidden">
                                    {org.imageUrl ? <img src={org.imageUrl} alt={org.name} className="w-full h-full object-cover" /> : <UserIcon />}
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-900 text-lg leading-tight">{org.name}</h3>
                                    <p className="text-xs text-gray-400 font-bold mt-1">ID: {org.id}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleEmergencyStop(org.id)}
                                className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-[10px] font-black uppercase hover:bg-rose-500 hover:text-white transition-colors flex items-center gap-1"
                            >
                                <AlertTriangle size={10} /> Stop
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs font-bold text-gray-500 bg-gray-50 p-3 rounded-xl">
                                <span className="flex items-center gap-2"><UserIcon size={14} /> Kutilmoqda</span>
                                <span className="text-gray-900">{Math.floor(Math.random() * 20)} kishi</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold text-gray-500 bg-gray-50 p-3 rounded-xl">
                                <span className="flex items-center gap-2"><Clock size={14} /> O'rtacha vaqt</span>
                                <span className="text-gray-900">{org.estimatedServiceTime} daqiqa</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold text-gray-500 bg-gray-50 p-3 rounded-xl">
                                <span className="flex items-center gap-2"><CheckCircle2 size={14} /> Holati</span>
                                <span className="text-emerald-600">{org.status}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isMobile && (
                <div className="px-4 mt-6">
                    <button
                        onClick={() => handleEmergencyStop()}
                        className="w-full bg-rose-500 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-200 flex items-center justify-center gap-2"
                    >
                        <AlertTriangle size={18} /> Emergency Stop All
                    </button>
                </div>
            )}
        </div>
    );
};

export default QueueMonitor;
