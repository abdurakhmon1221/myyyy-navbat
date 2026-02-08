
import React from 'react';
import { X, QrCode, Image as ImageIcon, ChevronRight, Zap } from 'lucide-react';

export const SkipModal: React.FC<{ show: boolean, onClose: () => void, onSkip: (reason: string) => void }> = ({ show, onClose, onSkip }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[1100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] p-8 shadow-2xl space-y-6">
                <h3 className="text-xl font-black text-center text-[var(--text-main)]">O'chirish sababi</h3>
                <div className="grid grid-cols-1 gap-2">
                    {["Mijoz kelmadi", "Xato raqam", "Vaqti o'tib ketdi"].map(r => (
                        <button key={r} onClick={() => onSkip(r)} className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl text-xs font-bold text-left hover:bg-rose-50 hover:text-rose-500 transition-all">{r}</button>
                    ))}
                </div>
                <button onClick={onClose} className="w-full text-center text-xs font-black text-gray-400 uppercase">Yopish</button>
            </div>
        </div>
    );
};

export const TransferModal: React.FC<{ show: boolean, onClose: () => void, onTransfer: (target: string) => void }> = ({ show, onClose, onTransfer }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[1100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] p-8 shadow-2xl space-y-6">
                <h3 className="text-xl font-black text-center text-[var(--text-main)]">Yo'naltirish</h3>
                <div className="grid grid-cols-1 gap-2">
                    {["Kassaga", "Menejerga", "Boshqa mutaxassisga"].map(r => (
                        <button key={r} onClick={() => onTransfer(r)} className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl text-xs font-bold text-left hover:bg-indigo-50 hover:text-indigo-500 transition-all">{r}</button>
                    ))}
                </div>
                <button onClick={onClose} className="w-full text-center text-xs font-black text-gray-400 uppercase">Yopish</button>
            </div>
        </div>
    );
};

export const SummaryModal: React.FC<{ show: boolean, onClose: () => void, dailyStats: any }> = ({ show, onClose, dailyStats }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[1100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] p-8 shadow-2xl space-y-8 animate-in zoom-in">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4"><Zap size={32} className="fill-current" /></div>
                    <h3 className="text-2xl font-black text-[var(--text-main)]">Smena yakuni</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest italic">{new Date().toLocaleDateString('uz-UZ')}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-2xl text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Mijozlar</p>
                        <h5 className="text-2xl font-[1000] text-gray-900 dark:text-white">24 / 50</h5>
                    </div>
                </div>
                <button className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">HISOBOTNI TOPSHIRISH</button>
                <button onClick={onClose} className="w-full text-center text-xs font-black text-gray-400 uppercase">Yana ishlash</button>
            </div>
        </div>
    );
};

export const GuideModal: React.FC<{ show: boolean, onClose: () => void }> = ({ show, onClose }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[1100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] p-8 shadow-2xl space-y-6 animate-in zoom-in">
                <div className="text-center">
                    <h3 className="text-xl font-black text-[var(--text-main)]">Qo'llanma</h3>
                    <p className="text-xs text-[var(--text-muted)]">Qisqacha yo'riqnoma</p>
                </div>
                <div className="space-y-4 text-xs font-medium text-[var(--text-main)]">
                    <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">1</div>
                        <p>Mijozni chaqirish uchun katta yashil tugmani bosing.</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">2</div>
                        <p>Agar mijoz kelmasa, "Kelmadi" tugmasi orqali o'tkazib yuboring.</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">3</div>
                        <p>Boshqa bo'limga o'tkazish uchun "Yo'naltirish" tugmasidan foydalaning.</p>
                    </div>
                </div>
                <button onClick={onClose} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase">Tushunarli</button>
            </div>
        </div>
    );
};
