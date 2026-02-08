
import React from 'react';
import { X, Smartphone, UserIcon, CheckCircle2, Calendar, Clock, List, Zap } from 'lucide-react';
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
    onBack?: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
    show, onClose, regStep, regName, setRegName, regPhone, setRegPhone, regOtp, setRegOtp, onVerify, onBack
}) => {
    const formatPhone = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 9);
        if (digits.length <= 2) return digits;
        if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
        if (digits.length <= 7) return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
        return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
    };

    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[2000] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-md p-10 shadow-2xl relative overflow-hidden">
                <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 dark:hover:text-white"><X /></button>
                {regStep === 'INFO' ? (
                    <div className="space-y-6">
                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-2"><UserIcon size={32} /></div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">Ro'yxatdan o'ting</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase">Navbatga yozilish uchun ma'lumotlarni kiriting</p>
                        <div className="space-y-4">
                            <div className="relative">
                                <input type="text" placeholder="Ismingiz" value={regName} onChange={(e) => setRegName(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-2xl p-5 font-bold text-sm text-gray-900 dark:text-white outline-none ring-2 ring-transparent focus:ring-emerald-500/20 transition-all" />
                            </div>

                            {/* Standard Phone Input */}
                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus-within:border-emerald-500/20 rounded-2xl p-4 transition-all">
                                <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm">
                                    <span className="text-lg">🇺🇿</span>
                                    <span className="text-gray-900 dark:text-white font-bold text-sm">+998</span>
                                </div>
                                <input
                                    type="tel"
                                    value={formatPhone(regPhone)}
                                    onChange={(e) => {
                                        const digits = e.target.value.replace(/\D/g, '');
                                        if (digits.length <= 9) setRegPhone(digits);
                                    }}
                                    placeholder="90 123 45 67"
                                    className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white font-bold text-lg tracking-wider placeholder:text-gray-300 dark:placeholder:text-slate-500"
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Back Button for OTP Step */}
                        <button onClick={onBack} className="absolute top-8 left-8 text-gray-400 hover:text-gray-900 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"><X className="rotate-45" size={16} /> Bekor qilish</button>

                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-2 mt-8"><Smartphone size={32} /></div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">Kodni kiriting</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase">Telefoningizga (+998 {formatPhone(regPhone)}) yuborilgan 5 xonali kod</p>
                        <input type="text" maxLength={5} placeholder="00000" value={regOtp} onChange={(e) => setRegOtp(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-2xl p-6 font-black text-3xl tracking-[0.5em] text-center text-gray-900 dark:text-white outline-none ring-2 ring-emerald-500/20" />
                    </div>
                )}
                <button onClick={onVerify} className="w-full mt-10 bg-gray-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">{regStep === 'OTP' ? 'Tasdiqlash' : 'Davom etish'}</button>
            </div>
        </div>
    );

};

const VirtualWalkthrough: React.FC<{ documents: string[] }> = ({ documents }) => {
    const [checked, setChecked] = React.useState<Record<number, boolean>>({});

    const toggle = (idx: number) => {
        setChecked(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    const allChecked = documents.length > 0 && documents.every((_, i) => checked[i]);

    return (
        <section className={`rounded-3xl p-6 border transition-all duration-500 relative overflow-hidden ${allChecked ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 shadow-xl shadow-emerald-200/50 dark:shadow-emerald-900/30' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}>
            {allChecked && <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent animate-pulse"></div>}
            <div className="flex justify-between items-center mb-4 relative z-10">
                <p className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${allChecked ? 'text-emerald-600' : 'text-slate-400'}`}>
                    <CheckCircle2 size={12} /> {allChecked ? 'Hamma hujjatlar tayyor' : 'Kerakli hujjatlar'}
                </p>
                <div className="flex gap-1">
                    {documents.map((_, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${checked[i] ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-600'}`}></div>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                {documents.map((doc, idx) => (
                    <div
                        key={idx}
                        onClick={() => toggle(idx)}
                        className={`flex items-center gap-3 cursor-pointer p-2 -mx-2 rounded-xl transition-all ${checked[idx] ? 'bg-white/50' : 'hover:bg-white/30'}`}
                    >
                        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${checked[idx] ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600'}`}>
                            {checked[idx] && <CheckCircle2 size={12} />}
                        </div>
                        <span className={`text-xs font-bold transition-all ${checked[idx] ? 'text-emerald-900 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}`}>{doc}</span>
                    </div>
                ))}
            </div>

            {!allChecked && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl flex gap-3">
                    <div className="text-amber-500 pt-0.5"><Zap size={14} className="fill-current" /></div>
                    <p className="text-[9px] font-bold text-amber-900 dark:text-amber-200 leading-normal">
                        Ushbu hujjatlar asl nusxasini o'zingiz bilan olishni unutmang. Aks holda xizmat ko'rsatish rad etilishi mumkin.
                    </p>
                </div>
            )}
        </section>
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
    const [bookingMode, setBookingMode] = React.useState<'LIVE' | 'SCHEDULED' | null>(null);

    // Generate next 7 days for date selection
    const getAvailableDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 1; i <= 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            // Skip Sundays (day 0)
            if (date.getDay() !== 0) {
                dates.push({
                    value: date.toISOString().split('T')[0],
                    label: date.toLocaleDateString('uz-UZ', { weekday: 'short', day: 'numeric', month: 'short' })
                });
            }
        }
        return dates;
    };

    // Available time slots
    const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

    const handleBooking = () => {
        if (!org) return;
        if (bookingMode === 'LIVE') {
            onFinalize(org, true);
        } else if (bookingMode === 'SCHEDULED' && selectedDate && selectedTime) {
            // For scheduled booking, we pass isLive=false
            onFinalize(org, false);
        }
    };

    if (!show || !org) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[2000] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-sm p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-hide">
                <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 dark:hover:text-white"><X /></button>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-8 italic">Navbatga yozilish</h3>

                <div className="space-y-8">
                    {/* Service Selection */}
                    <section>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><List size={12} /> Xizmat turi</p>
                        <div className="space-y-2">
                            {org.services.map(s => (
                                <button key={s.id} onClick={() => setSelectedService(s)} className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${selectedService?.id === s.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-400' : 'border-gray-50 dark:border-slate-700 text-gray-600 dark:text-slate-300'}`}>
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold text-sm">{s.name}</p>
                                        <p className="text-[10px] font-black opacity-50">{org.estimatedServiceTime || 15} min</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Service Virtualization: Requirements Walkthrough (Checklist UI) */}
                    {selectedService && selectedService.requiredDocuments && selectedService.requiredDocuments.length > 0 && (
                        <VirtualWalkthrough documents={selectedService.requiredDocuments} />
                    )}

                    {/* Type Choice */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setBookingMode('LIVE')}
                            className={`p-6 rounded-[2rem] flex flex-col items-center gap-2 group active:scale-95 transition-all ${bookingMode === 'LIVE' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-100' : 'bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'}`}
                        >
                            <Zap size={24} className={bookingMode === 'LIVE' ? 'fill-current' : ''} />
                            <span className="text-[10px] font-black uppercase">Hozirgi navbat</span>
                            <span className="text-[8px] font-bold opacity-70 text-center">Jonli navbatga qo'shilish</span>
                        </button>
                        <button
                            onClick={() => setBookingMode('SCHEDULED')}
                            className={`p-6 rounded-[2rem] flex flex-col items-center gap-2 group active:scale-95 transition-all ${bookingMode === 'SCHEDULED' ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-100' : 'bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400'}`}
                        >
                            <Calendar size={24} />
                            <span className="text-[10px] font-black uppercase">Bron qilish</span>
                            <span className="text-[8px] font-bold opacity-70 text-center">Vaqtni oldindan tanlash</span>
                        </button>
                    </div>

                    {/* Date/Time Selection for Scheduled Booking */}
                    {bookingMode === 'SCHEDULED' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom duration-300">
                            {/* Date Selection */}
                            <section>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Calendar size={12} /> Kunni tanlang
                                </p>
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {getAvailableDates().map(date => (
                                        <button
                                            key={date.value}
                                            onClick={() => setSelectedDate(date.value)}
                                            className={`flex-shrink-0 px-4 py-3 rounded-2xl text-center transition-all ${selectedDate === date.value ? 'bg-indigo-500 text-white shadow-lg' : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'}`}
                                        >
                                            <p className="text-[10px] font-black uppercase">{date.label}</p>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Time Selection */}
                            {selectedDate && (
                                <section className="animate-in fade-in duration-300">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Clock size={12} /> Vaqtni tanlang
                                    </p>
                                    <div className="grid grid-cols-4 gap-2">
                                        {timeSlots.map(time => (
                                            <button
                                                key={time}
                                                onClick={() => setSelectedTime(time)}
                                                className={`py-3 rounded-xl text-center text-xs font-black transition-all ${selectedTime === time ? 'bg-indigo-500 text-white shadow-lg' : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'}`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}

                    {/* Confirm Button */}
                    {bookingMode && (
                        <button
                            onClick={handleBooking}
                            disabled={bookingMode === 'SCHEDULED' && (!selectedDate || !selectedTime)}
                            className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all ${bookingMode === 'SCHEDULED' && (!selectedDate || !selectedTime) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'}`}
                        >
                            {bookingMode === 'LIVE' ? "Navbatga qo'shilish" : `${selectedDate && selectedTime ? `${selectedDate} ${selectedTime} ga bron qilish` : 'Sana va vaqtni tanlang'}`}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
