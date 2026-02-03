
import React from 'react';
import { UserPlus, MoreVertical, Users } from 'lucide-react';
import { Employee } from '../../types';

interface OrgEmployeesProps {
    employees: Employee[];
}

const OrgEmployees: React.FC<OrgEmployeesProps> = ({ employees }) => {
    return (
        <div className="space-y-8 animate-in fade-in pb-24">
            <div className="flex justify-between items-center mb-4 px-1">
                <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Xodimlar</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Samaradorlik nazorati</p>
                </div>
                <button className="bg-indigo-600 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                    <UserPlus size={18} /> Qo'shish
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {employees?.map(emp => (
                    <div key={emp.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm group hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden border-4 border-gray-50 shadow-md">
                                    <img src={emp.imageUrl || 'https://i.pravatar.cc/100'} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-900 text-base">{emp.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`w-2 h-2 rounded-full ${emp.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                                        <span className="text-[9px] text-gray-400 font-black uppercase">{emp.status === 'ACTIVE' ? 'Ishda' : 'Tanaffusda'}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="p-3 text-gray-400 hover:text-indigo-600"><MoreVertical size={18} /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <p className="text-[8px] font-black text-gray-400 uppercase">Vaqt</p>
                                <h6 className="text-sm font-black text-indigo-600">{emp.performance?.avgWaitTime || '12'}m</h6>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <p className="text-[8px] font-black text-gray-400 uppercase">Mijozlar</p>
                                <h6 className="text-sm font-black text-emerald-600">{emp.performance?.servedCount || '0'}</h6>
                            </div>
                        </div>
                    </div>
                ))}
                {(!employees || employees.length === 0) && (
                    <div className="col-span-2 text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
                        <Users size={48} className="mx-auto mb-4 text-gray-200" />
                        <p className="text-sm text-gray-400 font-black uppercase">Xodimlar yo'q</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrgEmployees;
