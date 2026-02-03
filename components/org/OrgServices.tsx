
import React from 'react';
import { Plus, ListTree, Settings, Trash2 } from 'lucide-react';
import { Service } from '../../types';

interface OrgServicesProps {
    services: Service[];
}

const OrgServices: React.FC<OrgServicesProps> = ({ services }) => {
    return (
        <div className="space-y-8 animate-in fade-in pb-24">
            <div className="flex justify-between items-center mb-4 px-1">
                <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Xizmatlar</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Hujjatlar nazorati</p>
                </div>
                <button className="bg-indigo-600 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                    <Plus size={18} /> Yangi xizmat
                </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {services?.map(srv => (
                    <div key={srv.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm group hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                    <ListTree size={28} />
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-900 text-base">{srv.name}</h4>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">15 min</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-3 text-gray-400 hover:text-indigo-600"><Settings size={18} /></button>
                                <button className="p-3 text-gray-400 hover:text-rose-500"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrgServices;
