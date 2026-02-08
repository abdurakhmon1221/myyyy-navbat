
import React, { useState, useEffect } from 'react';
import { UserPlus, MoreVertical, Users, Trash2, Edit2, Check, X, Send, Clock, Phone, Loader2, Mail, AlertCircle } from 'lucide-react';
import { Employee } from '../../types';
import { employeeService, EmployeeInvite } from '../../services/employeeService';

interface OrgEmployeesProps {
    employees: Employee[];
    onUpdate?: (employees: Employee[]) => void;
    organizationId?: string;
    organizationName?: string;
}

const OrgEmployees: React.FC<OrgEmployeesProps> = ({
    employees: initialEmployees,
    onUpdate,
    organizationId = 'org1',
    organizationName = 'Tashkilot'
}) => {
    const [employees, setEmployees] = useState<Employee[]>(initialEmployees || []);
    const [pendingInvites, setPendingInvites] = useState<EmployeeInvite[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newEmp, setNewEmp] = useState({ name: '', role: 'Master', phone: '', services: [] as string[] });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Load pending invites on mount
    useEffect(() => {
        loadPendingInvites();
    }, [organizationId]);

    useEffect(() => {
        setEmployees(initialEmployees || []);
    }, [initialEmployees]);

    const loadPendingInvites = () => {
        const invites = employeeService.getPendingInvites(organizationId);
        setPendingInvites(invites);
    };

    const handleInvite = async () => {
        if (!newEmp.name || !newEmp.phone) {
            setError("Ism va telefon raqam kiritilishi shart");
            return;
        }

        // Basic phone validation
        const phoneDigits = newEmp.phone.replace(/\D/g, '');
        if (phoneDigits.length < 9) {
            setError("Telefon raqam noto'g'ri");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await employeeService.inviteEmployee({
                name: newEmp.name,
                phone: newEmp.phone,
                role: newEmp.role,
                organizationId,
                organizationName
            });

            if (result.success) {
                setSuccess(result.message);
                setNewEmp({ name: '', role: 'Master', phone: '', services: [] });
                loadPendingInvites();

                // Clear success after 3 seconds
                setTimeout(() => {
                    setSuccess(null);
                    setShowAddModal(false);
                }, 2000);
            } else {
                setError(result.message);
            }
        } catch (err: any) {
            setError(err.message || "Xatolik yuz berdi");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelInvite = (inviteId: string) => {
        if (confirm("Taklifni bekor qilmoqchimisiz?")) {
            employeeService.cancelInvite(inviteId);
            loadPendingInvites();
        }
    };

    const handleDelete = (id: string) => {
        if (confirm("Haqiqatan ham o'chirmoqchimisiz?")) {
            employeeService.deleteEmployee(id);
            const updatedList = employees.filter(e => e.id !== id);
            setEmployees(updatedList);
            if (onUpdate) onUpdate(updatedList);
        }
    };

    // Format phone for display
    const formatPhone = (phone: string) => {
        if (!phone) return '';
        const p = phone.replace(/\D/g, '');
        if (p.length === 12) {
            return `+${p.slice(0, 3)} ${p.slice(3, 5)} ${p.slice(5, 8)} ${p.slice(8, 10)} ${p.slice(10)}`;
        }
        return `+998 ${p.slice(0, 2)} ${p.slice(2, 5)} ${p.slice(5, 7)} ${p.slice(7)}`;
    };

    return (
        <div className="space-y-8 animate-in fade-in pb-24 relative">
            <div className="flex justify-between items-center mb-4 px-1">
                <div>
                    <h3 className="text-2xl font-black text-[var(--text-main)] tracking-tight">Xodimlar</h3>
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">Samaradorlik nazorati</p>
                </div>
                <button onClick={() => { setShowAddModal(true); setError(null); setSuccess(null); }} className="bg-indigo-600 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all">
                    <UserPlus size={18} /> Taklif qilish
                </button>
            </div>

            {/* Pending Invites Section */}
            {pendingInvites.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-sm font-black text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2">
                        <Clock size={16} /> Kutilmoqda ({pendingInvites.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {pendingInvites.map(invite => (
                            <div key={invite.id} className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl border border-amber-200 dark:border-amber-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                                        <Mail size={18} className="text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[var(--text-main)] text-sm">{invite.name}</p>
                                        <p className="text-[10px] text-gray-500">{formatPhone(invite.phone)} • {invite.role}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleCancelInvite(invite.id)}
                                    className="p-2 text-amber-600 hover:text-rose-600 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Active Employees Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {employees.map(emp => (
                    <div key={emp.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-[var(--border-main)] shadow-sm group hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden border-4 border-gray-50 dark:border-slate-800 shadow-md">
                                    <img src={emp.imageUrl} className="w-full h-full object-cover" alt={emp.name} />
                                </div>
                                <div>
                                    <h4 className="font-black text-[var(--text-main)] text-base">{emp.name}</h4>
                                    <p className="text-xs text-gray-500 font-bold">{emp.role}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`w-2 h-2 rounded-full ${emp.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-gray-300'}`}></span>
                                        <span className="text-[9px] text-gray-400 font-black uppercase">{emp.status === 'ACTIVE' ? 'Ishda' : emp.status === 'BUSY' ? 'Band' : 'O\'chirilgan'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-3 text-gray-400 hover:text-indigo-600 transition-colors"><Edit2 size={16} /></button>
                                <button onClick={() => handleDelete(emp.id)} className="p-3 text-gray-400 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl">
                                <p className="text-[8px] font-black text-gray-400 uppercase">Vaqt</p>
                                <h6 className="text-sm font-black text-indigo-600 dark:text-indigo-400">{emp.performance?.avgWaitTime || '0'}m</h6>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl">
                                <p className="text-[8px] font-black text-gray-400 uppercase">Mijozlar</p>
                                <h6 className="text-sm font-black text-emerald-600 dark:text-emerald-400">{emp.performance?.servedCount || '0'}</h6>
                            </div>
                        </div>
                    </div>
                ))}
                {employees.length === 0 && pendingInvites.length === 0 && (
                    <div className="col-span-2 text-center py-20 bg-gray-50 dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-slate-700">
                        <Users size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <p className="text-sm text-gray-400 font-black uppercase">Xodimlar yo'q</p>
                        <p className="text-xs text-gray-400 mt-2">Yangi xodim taklif qilish uchun yuqoridagi tugmani bosing</p>
                    </div>
                )}
            </div>

            {/* Add/Invite Employee Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-black text-[var(--text-main)]">Xodim Taklif Qilish</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-900"><X size={24} /></button>
                        </div>

                        {error && (
                            <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 p-4 rounded-2xl text-sm font-bold flex items-center gap-2">
                                <AlertCircle size={18} /> {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 p-4 rounded-2xl text-sm font-bold flex items-center gap-2">
                                <Check size={18} /> {success}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Ism Familiya *</label>
                                <input
                                    type="text"
                                    value={newEmp.name}
                                    onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 text-[var(--text-main)]"
                                    placeholder="Ism kiriting"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Telefon Raqam *</label>
                                <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 p-2 rounded-2xl">
                                    <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm">
                                        <span className="text-lg">🇺🇿</span>
                                        <span className="text-[var(--text-main)] font-bold text-sm">+998</span>
                                    </div>
                                    <input
                                        type="tel"
                                        value={newEmp.phone}
                                        onChange={(e) => {
                                            const digits = e.target.value.replace(/\D/g, '').slice(0, 9);
                                            setNewEmp({ ...newEmp, phone: digits });
                                        }}
                                        className="flex-1 bg-transparent p-2 font-bold outline-none text-[var(--text-main)] placeholder:text-gray-400"
                                        placeholder="90 123 45 67"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Lavozim</label>
                                <input
                                    type="text"
                                    value={newEmp.role}
                                    onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-500 transition-all placeholder:font-medium text-[var(--text-main)]"
                                    placeholder="Masalan: Master, Administrator"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Xizmatlar</label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {['Soch olish', 'Soqol olish', 'Kompleks', 'Manikur'].map(service => (
                                        <button
                                            key={service}
                                            type="button"
                                            onClick={() => {
                                                const current = newEmp.services || [];
                                                if (current.includes(service)) {
                                                    setNewEmp({ ...newEmp, services: current.filter(s => s !== service) });
                                                } else {
                                                    setNewEmp({ ...newEmp, services: [...current, service] });
                                                }
                                            }}
                                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${(newEmp.services || []).includes(service) ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300'}`}
                                        >
                                            {service}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleInvite}
                                disabled={isLoading || !newEmp.name || !newEmp.phone}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white py-4 rounded-2xl font-black uppercase text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <><Loader2 size={18} className="animate-spin" /> Yuborilmoqda...</>
                                ) : (
                                    <><Send size={18} /> SMS</>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    // Generate QR invite link
                                    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                                    const qrData = `navbat://invite/${organizationId}/${inviteCode}`;
                                    setSuccess(`QR Kod: ${inviteCode}\n\nXodim ushbu koddan foydalanib ilovaga kirishi mumkin.`);
                                    // In production, show actual QR code modal
                                }}
                                disabled={isLoading || !newEmp.name}
                                className="px-6 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-2xl font-black uppercase text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="7" height="7" />
                                    <rect x="14" y="3" width="7" height="7" />
                                    <rect x="3" y="14" width="7" height="7" />
                                    <rect x="14" y="14" width="7" height="7" />
                                </svg>
                                QR
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrgEmployees;
