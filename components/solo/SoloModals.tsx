
import React from 'react';
import { X, QrCode, Printer, Briefcase, LayoutGrid, Volume2, Palette } from 'lucide-react';

interface SoloQRModalProps {
    show: boolean;
    onClose: () => void;
}

export const SoloQRModal: React.FC<SoloQRModalProps> = ({ show, onClose }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-2xl z-[1500] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[4rem] p-12 text-center shadow-2xl relative">
                <button onClick={onClose} className="absolute top-10 right-10 text-gray-300 hover:text-gray-900"><X size={24} /></button>
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-8"><QrCode size={40} /></div>
                    <h3 className="text-3xl font-[1000] italic mb-10 tracking-tighter">PERSONAL QR-KOD</h3>
                    <div className="w-full aspect-square bg-white border-12 border-indigo-50 rounded-[4rem] p-10 flex items-center justify-center mb-10 shadow-inner group">
                        <QrCode size={220} className="text-gray-900 group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <button className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-[1000] uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 shadow-2xl shadow-indigo-200 active:scale-95 transition-all"><Printer size={20} /> POSTERNI YUKLASH</button>
                </div>
            </div>
        </div>
    );
};

interface SoloSettingsModalProps {
    show: boolean;
    onClose: () => void;
    orgName: string;
    haptics: any;
}

export const SoloSettingsModal: React.FC<SoloSettingsModalProps> = ({ show, onClose, orgName, haptics }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[1500] flex items-center justify-center p-6 animate-in zoom-in duration-500">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[4rem] p-12 shadow-2xl space-y-10 relative">
                <div className="flex justify-between items-center"><h3 className="text-3xl font-[1000] italic tracking-tighter">SOZLAMALAR</h3><button onClick={onClose} className="text-gray-300"><X size={24} /></button></div>
                <div className="space-y-6">
                    <div className="group">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1 mb-2">Yuridik Nomi</p>
                        <div className="relative">
                            <input type="text" defaultValue={orgName} className="w-full bg-gray-50 dark:bg-slate-800 p-5 rounded-[1.75rem] font-black italic text-lg outline-none border-4 border-transparent focus:border-indigo-600 transition-all pl-14" />
                            <Briefcase size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                        </div>
                    </div>
                </div>
                <button onClick={() => { haptics.success(); onClose(); }} className="w-full bg-gray-900 text-white py-7 rounded-[2rem] font-[1000] uppercase tracking-[0.3em] text-xs shadow-2xl active:scale-95 transition-all">ASOSIY SAQLASH</button>
            </div>
        </div>
    );
};
