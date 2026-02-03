
import React from 'react';
import { X, Smartphone, UserIcon, CheckCircle2, Calendar, Clock, List } from 'lucide-react';
import { Organization, Service } from '../../types';

interface RegistrationModalProps {
    show: boolean;
    onClose: () => void;
    regStep: 'INFO' | 'OTP';
    regName: string;
    setRegName: (v: string) => void;
    regPhone: string;
    setRegPhone: (v: string) => void;
    regOtp: string;
    setRegOtp: (v: string) => void;
    onVerify: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
    show, onClose, regStep, regName, setRegName, regPhone, setRegPhone, regOtp, setRegOtp, onVerify
}) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[2000] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] w-full max-w-sm p-10 shadow-2xl relative overflow-hidden">
                <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900"><X /></button>
                {regStep === 'INFO' ? (
                    <div className="space-y-6">
                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-2"><UserIcon size={32} /></div>
                        <h3 className="text-2xl font-black text-gray-900 leading-tight">Ro'yxatdan o'ting</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase">Navbatga yozilish uchun ma'lumotlarni kiriting</p>
                        <div className="space-y-4">
                            <div className="relative">
                                <input type="text" placeholder="Ismingiz" value={regName} onChange={(e) => setRegName(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold text-sm outline-none ring-2 ring-transparent focus:ring-emerald-500/10 transition-all" />
                            </div>
                            <div className="relative">
                                <input type="tel" placeholder="901234567" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold text-sm outline-none ring-2 ring-transparent focus:ring-emerald-500/10 transition-all" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-2"><Smartphone size={32} /></div>
                        <h3 className="text-2xl font-black text-gray-900 leading-tight">Kodni kiriting</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase">Telefoningizga yuborilgan 5 xonali kod</p>
                        <input type="text" maxLength={5} placeholder="00000" value={regOtp} onChange={(e) => setRegOtp(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl p-6 font-black text-3xl tracking-[0.5em] text-center outline-none" />
                    </div>
                )}
                <button onClick={onVerify} className="w-full mt-10 bg-gray-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">Davom etish</button>
            </div>
        </div>
    );
};

interface ScheduleModalProps {
    show: boolean;
    onClose: () => void;
    org: Organization | null;
    selectedService: Service | null;
    setSelectedService: (s: Service) => void;
    selectedDate: string;
    setSelectedDate: (d: string) => void;
    selectedTime: string;
    setSelectedTime: (t: string) => void;
    onFinalize: (org: Organization, isLive: boolean) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
    show, onClose, org, selectedService, setSelectedService, selectedDate, setSelectedDate, selectedTime, setSelectedTime, onFinalize
}) => {
    if (!show || !org) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[2000] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] w-full max-w-sm p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-hide">
                <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900"><X /></button>
                <h3 className="text-2xl font-black text-gray-900 leading-tight mb-8">Navbatga yozilish</h3>

                <div className="space-y-8">
                    {/* Service Selection */}
                    <section>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><List size={12} /> Xizmat turi</p>
                        <div className="space-y-2">
                            {org.services.map(s => (
                                <button key={s.id} onClick={() => setSelectedService(s)} className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${selectedService?.id === s.id ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-gray-50 text-gray-600'}`}>
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold text-sm">{s.name}</p>
                                        <p className="text-[10px] font-black opacity-50">{s.price} UZS</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Type Choice */}
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => onFinalize(org, true)} className="p-6 rounded-[2rem] bg-emerald-500 text-white shadow-xl shadow-emerald-100 flex flex-col items-center gap-2 group active:scale-95 transition-all">
                            <Zap size={24} className="fill-current" />
                            <span className="text-[10px] font-black uppercase">Hozirgi navbat</span>
                            <span className="text-[8px] font-bold opacity-70">Jonli navbatga qo'shilish</span>
                        </button>
                        <button className="p-6 rounded-[2rem] bg-indigo-50 border-2 border-indigo-100 text-indigo-600 flex flex-col items-center gap-2 group active:scale-95 transition-all opacity-40 cursor-not-allowed">
                            <Calendar size={24} />
                            <span className="text-[10px] font-black uppercase">Bron qilish</span>
                            <span className="text-[8px] font-bold opacity-70">Yaqinda yoqiladi</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
