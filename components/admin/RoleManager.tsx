
import React, { useState } from 'react';
import {
    ShieldCheck, Key, Users, CheckCircle2, Save, X
} from 'lucide-react';
import { Permission } from '../../types';
import { useMobile } from '../../hooks/useMobile';

const RoleManager: React.FC = () => {
    const isMobile = useMobile();
    // Mock Roles Data
    const [roles, setRoles] = useState([
        { id: '1', name: 'Super Admin', description: 'Tizimning to\'liq boshqaruvi', permissions: ['VIEW_DASHBOARD', 'MANAGE_COMPANIES', 'VIEW_CLIENTS', 'MANAGE_QUEUES', 'MANAGE_CMS', 'MANAGE_ROLES', 'VIEW_LOGS', 'AI_ACCESS'] as Permission[], usersCount: 1 },
        { id: '2', name: 'Moderator', description: 'Faqat tashkilot va navbatlarni nazorat qilish', permissions: ['VIEW_DASHBOARD', 'MANAGE_COMPANIES', 'MANAGE_QUEUES'] as Permission[], usersCount: 3 },
        { id: '3', name: 'Content Manager', description: 'Matn va tarjimalarni tahrirlash', permissions: ['MANAGE_CMS'] as Permission[], usersCount: 2 },
    ]);

    // Role Editor State
    const [editingRole, setEditingRole] = useState<{ id: string | null, name: string, permissions: Permission[] } | null>(null);

    const togglePermission = (perm: Permission) => {
        if (!editingRole) return;
        if (editingRole.permissions.includes(perm)) {
            setEditingRole({ ...editingRole, permissions: editingRole.permissions.filter(p => p !== perm) });
        } else {
            setEditingRole({ ...editingRole, permissions: [...editingRole.permissions, perm] });
        }
    };

    const saveRole = () => {
        if (!editingRole) return;
        if (editingRole.id) {
            // Edit existing
            setRoles(roles.map(r => r.id === editingRole.id ? { ...r, name: editingRole.name, permissions: editingRole.permissions } : r));
        } else {
            // Create new
            const newRole = {
                id: Date.now().toString(),
                name: editingRole.name,
                description: 'Custom Role',
                permissions: editingRole.permissions,
                usersCount: 0
            };
            setRoles([...roles, newRole]);
        }
        setEditingRole(null);
    };

    const ALL_PERMISSIONS: Permission[] = [
        'VIEW_DASHBOARD', 'MANAGE_COMPANIES', 'VIEW_CLIENTS', 'MANAGE_QUEUES',
        'MANAGE_CMS', 'MANAGE_ROLES', 'VIEW_LOGS', 'AI_ACCESS'
    ];

    return (
        <div className={`space-y-6 animate-in fade-in max-w-5xl mx-auto pb-24 ${isMobile ? 'p-0' : ''}`}>
            <header className={`flex justify-between items-center ${isMobile ? 'px-4 mb-4' : 'mb-8'}`}>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Rollar va Ruxsatlar</h1>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Yangi lavozimlar yarating</p>
                </div>
                {!isMobile && (
                    <button
                        onClick={() => setEditingRole({ id: null, name: '', permissions: [] })}
                        className="bg-gray-900 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2"
                    >
                        <Key size={16} /> Yangi Rol
                    </button>
                )}
            </header>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 ${isMobile ? 'px-4' : ''}`}>
                {roles.map(role => (
                    <div key={role.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                    {role.name}
                                    {role.id === '1' && <ShieldCheck size={18} className="text-emerald-500" />}
                                </h3>
                                <p className="text-xs text-gray-400 font-bold mt-1 line-clamp-1">{role.description}</p>
                            </div>
                            <span className="bg-gray-50 text-gray-500 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1">
                                <Users size={12} /> {role.usersCount}
                            </span>
                        </div>

                        <div className="space-y-2 mb-6">
                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Ruxsatlar:</p>
                            <div className="flex flex-wrap gap-2">
                                {role.permissions.map(perm => (
                                    <span key={perm} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-bold uppercase tracking-tight">
                                        {perm.replace('MANAGE_', '').replace('VIEW_', '').replace('_', ' ')}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setEditingRole({ id: role.id, name: role.name, permissions: role.permissions })}
                                className="flex-1 py-3 bg-gray-50 rounded-xl text-xs font-black uppercase tracking-wide text-gray-400 hover:bg-gray-900 hover:text-white transition-colors"
                            >Tahrirlash</button>
                        </div>
                    </div>
                ))}

                {/* Create New Placeholder */}
                <div
                    onClick={() => setEditingRole({ id: null, name: '', permissions: [] })}
                    className="bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group min-h-[200px]"
                >
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform text-gray-300 group-hover:text-emerald-500">
                        <Key size={32} />
                    </div>
                    <h3 className="text-gray-400 font-black uppercase text-xs tracking-widest group-hover:text-emerald-600">Maxsus Rol Yaratish</h3>
                </div>
            </div>

            {/* Role Editor Modal */}
            {editingRole && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[250] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
                    <div className={`bg-white w-full max-w-2xl rounded-[2.5rem] p-6 md:p-8 shadow-2xl space-y-6 ${isMobile ? 'h-full overflow-y-auto rounded-none' : ''}`}>
                        <div className="flex justify-between items-center sticky top-0 bg-white z-10 pb-4 border-b border-gray-100">
                            <h3 className="text-2xl font-black text-gray-900">{editingRole.id ? 'Rolni Tahrirlash' : 'Yangi Rol Yaratish'}</h3>
                            <button onClick={() => setEditingRole(null)} className="p-2 text-gray-400 bg-gray-50 rounded-full hover:bg-gray-100"><X size={24} /></button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rol Nomi</label>
                                <input
                                    type="text"
                                    value={editingRole.name}
                                    onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold outline-none focus:border-emerald-500"
                                    placeholder="Masalan: Katta Menejer"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ruxsatlar (Permissions)</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {ALL_PERMISSIONS.map(perm => (
                                        <div
                                            key={perm}
                                            onClick={() => togglePermission(perm)}
                                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${editingRole.permissions.includes(perm) ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                                        >
                                            <span className={`text-xs font-bold uppercase ${editingRole.permissions.includes(perm) ? 'text-emerald-700' : 'text-gray-500'}`}>
                                                {perm.replace('MANAGE_', '').replace('VIEW_', '').replace('_', ' ')}
                                            </span>
                                            {editingRole.permissions.includes(perm) && <CheckCircle2 size={16} className="text-emerald-500" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button onClick={saveRole} className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform sticky bottom-0">
                            <Save size={20} /> Saqlash
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoleManager;
