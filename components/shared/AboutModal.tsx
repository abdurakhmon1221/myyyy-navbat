import React from 'react';
import { ArrowLeft, AlertTriangle, ShieldCheck, Clock, Bell } from 'lucide-react';

interface AboutModalProps {
    onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] border border-[var(--border-main)] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative">

                {/* Header Image/Gradient */}
                <div className="h-32 bg-gradient-to-br from-emerald-500 to-teal-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mixed-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <button onClick={onClose} className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="absolute bottom-4 left-6 text-white">
                        <h3 className="text-2xl font-black tracking-tight">Biz haqimizda</h3>
                        <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Nega aynan Navbat?</p>
                    </div>
                </div>

                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">

                    {/* The Problem */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-rose-500">
                            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                                <AlertTriangle size={18} />
                            </div>
                            <h4 className="font-black text-sm uppercase tracking-wider">Muammo (Og'riqlar)</h4>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pl-11">
                            Har kuni insonlar navbatlarda qimmatli vaqtlarini yo'qotishadi.
                            Rejalashtirilmagan kutishlar, asabbuzarlik va noaniqlik — bularning barchasi hayot sifatiga ta'sir qiladi.
                        </p>
                    </div>

                    {/* The Solution */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-emerald-500">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                                <ShieldCheck size={18} />
                            </div>
                            <h4 className="font-black text-sm uppercase tracking-wider">Yechim</h4>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pl-11">
                            NAVBAT ilovasi orqali siz masofadan turib navbat olishingiz, o'z vaqtingizni to'g'ri rejalashtirishingiz mumkin.
                            Biz sizga tinchlik va qulaylik ulashamiz.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-xl text-center space-y-1">
                            <Clock size={20} className="mx-auto text-blue-500 mb-1" />
                            <p className="text-[10px] font-bold text-gray-600 dark:text-gray-300">Vaqtni tejash</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-xl text-center space-y-1">
                            <Bell size={20} className="mx-auto text-amber-500 mb-1" />
                            <p className="text-[10px] font-bold text-gray-600 dark:text-gray-300">Xabarnoma</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-[var(--border-main)] bg-gray-50 dark:bg-slate-800/50">
                    <button onClick={onClose} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-200 dark:shadow-none hover:bg-emerald-700 active:scale-95 transition-all">
                        Tushunarli
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AboutModal;
