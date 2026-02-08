
import React, { useState, useEffect } from 'react';
import {
    Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock,
    User, Plus, X, Check, AlertCircle, Coffee, Edit, Trash2
} from 'lucide-react';

interface Appointment {
    id: string;
    clientName: string;
    service: string;
    time: string;
    duration: number;
    status: 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED';
    phone: string;
}

const DEFAULT_APPOINTMENTS: Record<string, Appointment[]> = {
    '2024-02-04': [
        { id: '1', clientName: 'Alisher Karimov', service: 'Soch olish', time: '10:00', duration: 30, status: 'CONFIRMED', phone: '+998901234567' },
        { id: '2', clientName: 'Malika Toshmatova', service: 'Manikur', time: '11:30', duration: 45, status: 'CONFIRMED', phone: '+998907654321' },
        { id: '3', clientName: 'Tanaffus', service: 'Coffee Break', time: '13:00', duration: 30, status: 'COMPLETED', phone: '' },
        { id: '4', clientName: 'Sardor Azimov', service: 'Soqol olish', time: '14:00', duration: 20, status: 'PENDING', phone: '+998909876543' },
    ],
    '2024-02-05': [
        { id: '5', clientName: 'Dilnoza Rahimova', service: 'Pedikur', time: '09:00', duration: 60, status: 'CONFIRMED', phone: '+998901111111' },
    ],
};

const TIME_SLOTS = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8; // 8:00 to 20:00
    return `${hour.toString().padStart(2, '0')}:00`;
});

interface CalendarViewProps {
    onClose: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ onClose }) => {
    const [appointmentsByDate, setAppointmentsByDate] = useState<Record<string, Appointment[]>>({});
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
    const [view, setView] = useState<'DAY' | 'WEEK' | 'MONTH'>('DAY');
    const [showAddAppointment, setShowAddAppointment] = useState(false);

    // Form State
    const [formClient, setFormClient] = useState('');
    const [formPhone, setFormPhone] = useState('');
    const [formService, setFormService] = useState('');
    const [formTime, setFormTime] = useState('');
    const [formDuration, setFormDuration] = useState('30');

    useEffect(() => {
        const saved = localStorage.getItem('solo_appointments');
        if (saved) {
            setAppointmentsByDate(JSON.parse(saved));
        } else {
            setAppointmentsByDate(DEFAULT_APPOINTMENTS);
            // If default is used, ensure we are viewing a date with data for demo purposes if today has none
            if (!DEFAULT_APPOINTMENTS[new Date().toISOString().split('T')[0]]) {
                setSelectedDate('2024-02-04');
            }
        }
    }, []);

    const saveToStorage = (updatedAppointments: Record<string, Appointment[]>) => {
        setAppointmentsByDate(updatedAppointments);
        localStorage.setItem('solo_appointments', JSON.stringify(updatedAppointments));
    };

    const appointments = appointmentsByDate[selectedDate] || [];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
            case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-300';
            case 'COMPLETED': return 'bg-gray-100 text-gray-600 border-gray-300';
            case 'CANCELLED': return 'bg-rose-100 text-rose-700 border-rose-300';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const isTimeSlotBooked = (time: string) => {
        return appointments.some(apt => apt.time === time && apt.status !== 'CANCELLED');
    };

    const handleSave = () => {
        if (!formClient || !formService || !formTime) return;

        const newApt: Appointment = {
            id: 'apt-' + Date.now(),
            clientName: formClient,
            phone: formPhone,
            service: formService,
            time: formTime,
            duration: parseInt(formDuration) || 30,
            status: 'PENDING'
        };

        const currentDayAppointments = appointmentsByDate[selectedDate] || [];
        const updatedAppointments = {
            ...appointmentsByDate,
            [selectedDate]: [...currentDayAppointments, newApt]
        };

        saveToStorage(updatedAppointments);
        setShowAddAppointment(false);
        resetForm();
    };

    const handleDelete = (id: string) => {
        if (confirm("Uchrashuvni o'chirmoqchimisiz?")) {
            const updatedList = appointments.filter(a => a.id !== id);
            const updatedAppointments = {
                ...appointmentsByDate,
                [selectedDate]: updatedList
            };
            saveToStorage(updatedAppointments);
        }
    };

    const handleStatusChange = (id: string, newStatus: Appointment['status']) => {
        const updatedList = appointments.map(a => a.id === id ? { ...a, status: newStatus } : a);
        const updatedAppointments = {
            ...appointmentsByDate,
            [selectedDate]: updatedList
        };
        saveToStorage(updatedAppointments);
    };

    const resetForm = () => {
        setFormClient('');
        setFormPhone('');
        setFormService('');
        setFormTime('');
        setFormDuration('30');
    };

    const changeDate = (days: number) => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + days);
        setSelectedDate(date.toISOString().split('T')[0]);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-6xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-8 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex-none">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Kalendar & Bronya</h2>
                            <p className="text-sm font-bold text-gray-500 mt-1">Uchrashuvlarni boshqarish</p>
                        </div>
                        <button onClick={onClose} className="p-3 bg-white dark:bg-slate-800 rounded-2xl hover:bg-gray-50">
                            <X size={24} />
                        </button>
                    </div>

                    {/* View Switcher & Date Navigator */}
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            {['DAY', 'WEEK', 'MONTH'].map(v => (
                                <button
                                    key={v}
                                    onClick={() => setView(v as any)}
                                    className={`px-6 py-3 rounded-2xl text-xs font-black uppercase ${view === v
                                        ? 'bg-indigo-600 text-white shadow-lg'
                                        : 'bg-white dark:bg-slate-800 text-gray-500'
                                        }`}
                                >
                                    {v === 'DAY' ? 'Kun' : v === 'WEEK' ? 'Hafta' : 'Oy'}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <button onClick={() => changeDate(-1)} className="p-3 bg-white dark:bg-slate-800 rounded-2xl hover:bg-gray-50">
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-xl font-black text-gray-900 dark:text-white min-w-[200px] text-center">
                                {selectedDate}
                            </span>
                            <button onClick={() => changeDate(1)} className="p-3 bg-white dark:bg-slate-800 rounded-2xl hover:bg-gray-50">
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                resetForm();
                                setShowAddAppointment(true);
                            }}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase flex items-center gap-2 hover:bg-indigo-700"
                        >
                            <Plus size={18} /> Yangi Uchrashuv
                        </button>
                    </div>
                </div>

                {/* Calendar Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {view === 'DAY' && (
                        <div className="space-y-3">
                            {TIME_SLOTS.map(time => {
                                const appointment = appointments.find(apt => apt.time === time && apt.status !== 'CANCELLED');
                                const isBooked = isTimeSlotBooked(time);

                                return (
                                    <div key={time} className="flex gap-4">
                                        {/* Time Label */}
                                        <div className="w-24 flex-shrink-0">
                                            <span className="text-sm font-black text-gray-400">{time}</span>
                                        </div>

                                        {/* Slot */}
                                        {appointment ? (
                                            <div className={`flex-1 p-6 rounded-3xl border-2 ${getStatusColor(appointment.status)} flex items-center justify-between group hover:shadow-lg transition-all cursor-pointer`}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${appointment.service === 'Coffee Break'
                                                        ? 'bg-orange-100 text-orange-600'
                                                        : 'bg-white dark:bg-slate-800'
                                                        }`}>
                                                        {appointment.service === 'Coffee Break' ? <Coffee size={24} /> : <User size={24} />}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-lg text-gray-900 dark:text-white">{appointment.clientName}</h4>
                                                        <p className="text-sm font-bold opacity-70 text-gray-600 dark:text-gray-300">{appointment.service} • {appointment.duration} min</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase ${getStatusColor(appointment.status)}`}>
                                                        {appointment.status}
                                                    </span>
                                                    {appointment.status === 'PENDING' && (
                                                        <button onClick={() => handleStatusChange(appointment.id, 'CONFIRMED')} className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600" title="Tasdiqlash">
                                                            <Check size={18} />
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleDelete(appointment.id)} className="p-2 bg-rose-100 text-rose-500 rounded-xl hover:bg-rose-200" title="O'chirish">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setFormTime(time);
                                                    setShowAddAppointment(true);
                                                }}
                                                className="flex-1 p-6 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all flex items-center justify-center gap-2 text-gray-400 hover:text-indigo-600 group"
                                            >
                                                <Plus size={20} className="group-hover:scale-110 transition-transform" />
                                                <span className="text-sm font-bold">Bo'sh vaqt</span>
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {view === 'WEEK' && (
                        <div className="text-center py-20">
                            <CalendarIcon size={64} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Haftalik Ko'rinish</h3>
                            <p className="text-sm text-gray-500">Tez orada qo'shiladi</p>
                        </div>
                    )}

                    {view === 'MONTH' && (
                        <div className="text-center py-20">
                            <CalendarIcon size={64} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Oylik Ko'rinish</h3>
                            <p className="text-sm text-gray-500">Tez orada qo'shiladi</p>
                        </div>
                    )}
                </div>

                {/* Add Appointment Modal */}
                {showAddAppointment && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 rounded-[3rem] z-10 transition-all">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-6 animate-in zoom-in-95 duration-200">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Yangi Uchrashuv</h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Mijoz ismi"
                                    value={formClient}
                                    onChange={e => setFormClient(e.target.value)}
                                    className="w-full p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-500 transition-all text-gray-900 dark:text-white"
                                />
                                <input
                                    type="tel"
                                    placeholder="Telefon raqami"
                                    value={formPhone}
                                    onChange={e => setFormPhone(e.target.value)}
                                    className="w-full p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-500 transition-all text-gray-900 dark:text-white"
                                />
                                <input
                                    type="text"
                                    placeholder="Xizmat turi"
                                    value={formService}
                                    onChange={e => setFormService(e.target.value)}
                                    className="w-full p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-500 transition-all text-gray-900 dark:text-white"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="time"
                                        value={formTime}
                                        onChange={e => setFormTime(e.target.value)}
                                        className="w-full p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-500 transition-all text-gray-900 dark:text-white"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Davomiyligi (min)"
                                        value={formDuration}
                                        onChange={e => setFormDuration(e.target.value)}
                                        className="w-full p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-500 transition-all text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setShowAddAppointment(false)} className="flex-1 p-4 bg-gray-100 dark:bg-slate-700 rounded-2xl font-bold text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                                    Bekor qilish
                                </button>
                                <button onClick={handleSave} className="flex-1 p-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                                    Saqlash
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarView;
