import React, { useState } from 'react';
import {
    HardDrive, Save, Activity, Cpu
} from 'lucide-react';

const SystemSettings: React.FC = () => {
    // Settings State
    const [settingsTab, setSettingsTab] = useState<'GENERAL' | 'BACKUP' | 'HEALTH'>('GENERAL');

    return (
        <div className="space-y-6 animate-in fade-in max-w-5xl mx-auto pb-24">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tizim Sozlamalari</h1>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Reliability & Configuration</p>
                </div>
                <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
                    <button
                        onClick={() => setSettingsTab('GENERAL')}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${settingsTab === 'GENERAL' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
                    >Umumiy</button>
                    <button
                        onClick={() => setSettingsTab('BACKUP')}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${settingsTab === 'BACKUP' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
                    >Zaxira (Backup)</button>
                    <button
                        onClick={() => setSettingsTab('HEALTH')}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${settingsTab === 'HEALTH' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
                    >Tizim Holati</button>
                </div>
            </header>

            {settingsTab === 'BACKUP' && (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 flex flex-col items-center text-center animate-in fade-in">
                    <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                        <HardDrive size={40} className="text-indigo-500" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900">Ma'lumotlar Bazasi Zaxirasi</h3>
                    <p className="text-gray-400 mt-2 max-w-md">Bazadan to'liq nusxa olish. Oxirgi nusxa: <span className="font-bold text-gray-900">Bugun, 14:30</span></p>

                    <div className="mt-8 flex gap-4">
                        <button className="bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-wider hover:bg-indigo-600 active:scale-95 transition-all shadow-xl flex items-center gap-2">
                            <Save size={20} /> Zaxira Yaratish
                        </button>
                        <button className="bg-gray-100 text-gray-500 px-8 py-4 rounded-2xl font-black uppercase tracking-wider hover:bg-gray-200 transition-all flex items-center gap-2">
                            Yuklab Olish
                        </button>
                    </div>
                </div>
            )}

            {settingsTab === 'HEALTH' && (
                <div className="grid grid-cols-3 gap-6 animate-in fade-in">
                    <div className="bg-emerald-500 text-white p-6 rounded-[2.5rem] shadow-xl shadow-emerald-200">
                        <div className="flex items-center gap-3 mb-4">
                            <Activity size={24} />
                            <span className="font-black uppercase text-xs tracking-widest">API Status</span>
                        </div>
                        <h3 className="text-3xl font-black mb-1">Operational</h3>
                        <p className="opacity-80 text-xs font-bold">100% Uptime</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-gray-400">
                            <HardDrive size={24} />
                            <span className="font-black uppercase text-xs tracking-widest">Disk Space</span>
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 mb-1">45%</h3>
                        <div className="h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                            <div className="h-full w-[45%] bg-indigo-500 rounded-full"></div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-gray-400">
                            <Cpu size={24} />
                            <span className="font-black uppercase text-xs tracking-widest">CPU Load</span>
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 mb-1">12%</h3>
                        <div className="h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                            <div className="h-full w-[12%] bg-emerald-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
            )}

            {settingsTab === 'GENERAL' && (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 animate-in fade-in">
                    <h3 className="text-xl font-black text-gray-900 mb-6">General Settings</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                            <span className="font-bold text-gray-600">Maintenance Mode</span>
                            <div className="w-12 h-6 bg-gray-200 rounded-full p-1 cursor-pointer"><div className="w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                            <span className="font-bold text-gray-600">Debug Logging</span>
                            <div className="w-12 h-6 bg-emerald-500 rounded-full p-1 cursor-pointer flex justify-end"><div className="w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SystemSettings;
