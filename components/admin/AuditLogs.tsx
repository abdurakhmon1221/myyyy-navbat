
import React, { useState } from 'react';
import {
    FileText, User, ShieldAlert, Monitor, Calendar
} from 'lucide-react';
import { AuditLog } from '../../types';
import { useMobile } from '../../hooks/useMobile';

const AuditLogs: React.FC = () => {
    const isMobile = useMobile();
    // Mock Audit Logs
    const [logs, setLogs] = useState<AuditLog[]>([
        { id: 'l1', adminName: 'Super Admin', action: 'LOGIN', target: 'System', timestamp: Date.now(), ipAddress: '192.168.1.1' },
        { id: 'l2', adminName: 'Manager Ali', action: 'DELETE', target: 'Client: John Doe', timestamp: Date.now() - 3600000, ipAddress: '192.168.1.15' },
        { id: 'l3', adminName: 'Super Admin', action: 'EDIT', target: 'Company: Agrobank', timestamp: Date.now() - 7200000, ipAddress: '192.168.1.1' },
        { id: 'l4', adminName: 'Kassir Z', action: 'CREATE', target: 'Queue: #402', timestamp: Date.now() - 86400000, ipAddress: '192.168.1.20' },
    ]);

    return (
        <div className={`space-y-6 animate-in fade-in max-w-6xl mx-auto pb-24 ${isMobile ? 'p-0' : ''}`}>
            <header className={`flex justify-between items-center ${isMobile ? 'px-4 mb-4' : 'mb-8'}`}>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Audit Loglar</h1>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Xavfsizlik va Harakatlar Tarixi</p>
                </div>
                {!isMobile && (
                    <button className="bg-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-gray-50 transition-all border border-gray-100 text-gray-400 flex items-center gap-2">
                        <FileText size={16} /> Export CSV
                    </button>
                )}
            </header>

            {isMobile ? (
                // Mobile View
                <div className="px-4 space-y-4">
                    {logs.map(log => {
                        let actionColor = 'text-gray-500 bg-gray-50';
                        if (log.action === 'LOGIN') actionColor = 'text-blue-500 bg-blue-50';
                        if (log.action === 'DELETE') actionColor = 'text-rose-500 bg-rose-50';
                        if (log.action === 'CREATE') actionColor = 'text-emerald-500 bg-emerald-50';
                        if (log.action === 'EDIT') actionColor = 'text-amber-500 bg-amber-50';

                        return (
                            <div key={log.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold text-xs">
                                            {log.adminName.substring(0, 1)}
                                        </div>
                                        <div>
                                            <span className="font-bold text-gray-900 text-sm block">{log.adminName}</span>
                                            <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1"><Monitor size={10} /> {log.ipAddress}</span>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${actionColor}`}>
                                        {log.action}
                                    </span>
                                </div>

                                <div className="bg-gray-50 p-3 rounded-2xl">
                                    <p className="font-mono text-xs text-gray-600 font-bold break-all flex items-center gap-2">
                                        <ShieldAlert size={12} className="text-gray-400" />
                                        {log.target}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                                    <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                        <Calendar size={12} />
                                        {new Date(log.timestamp).toLocaleDateString()}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400">
                                        {new Date(log.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                // Desktop View
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Admin</th>
                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Harakat</th>
                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Obyekt</th>
                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">IP Manzil</th>
                                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Vaqt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {logs.map(log => {
                                let actionColor = 'text-gray-500 bg-gray-50';
                                if (log.action === 'LOGIN') actionColor = 'text-blue-500 bg-blue-50';
                                if (log.action === 'DELETE') actionColor = 'text-rose-500 bg-rose-50';
                                if (log.action === 'CREATE') actionColor = 'text-emerald-500 bg-emerald-50';
                                if (log.action === 'EDIT') actionColor = 'text-amber-500 bg-amber-50';

                                return (
                                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold text-xs">
                                                    {log.adminName.substring(0, 1)}
                                                </div>
                                                <span className="font-bold text-gray-900 text-sm">{log.adminName}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${actionColor}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="p-6 font-mono text-xs text-gray-600 font-bold">{log.target}</td>
                                        <td className="p-6 text-xs text-gray-400 font-bold">{log.ipAddress}</td>
                                        <td className="p-6 text-right text-xs text-gray-400 font-bold">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AuditLogs;
