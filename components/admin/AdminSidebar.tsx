import React from 'react';
import {
    LayoutGrid, Building, Users, ListTree, PieChart, MessageSquare,
    Megaphone, FileText, ShieldCheck, Terminal, Settings, LogOut,
    User as UserIcon
} from 'lucide-react';
import { AdminSection, UserRole } from '../../types';

interface AdminSidebarProps {
    activeSection: AdminSection;
    setActiveSection: (section: AdminSection) => void;
    onLogout?: () => void;
    profileName: string;
    profileRole: UserRole;
    profileImage?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
    activeSection,
    setActiveSection,
    onLogout,
    profileName,
    profileRole,
    profileImage
}) => {
    const sidebarItems: { id: AdminSection; label: string; icon: React.ElementType }[] = [
        { id: 'DASHBOARD', label: 'Boshqaruv', icon: LayoutGrid },
        { id: 'COMPANIES', label: 'Tashkilotlar', icon: Building },
        { id: 'CLIENTS', label: 'Mijozlar', icon: Users },
        { id: 'QUEUES', label: 'Navbatlar', icon: ListTree },
        { id: 'ANALYTICS', label: 'Statistika', icon: PieChart },
        { id: 'AI_CONSOLE', label: 'AI God Mode', icon: MessageSquare },
        { id: 'CRM', label: 'Smart CRM', icon: Megaphone },
        { id: 'CMS', label: 'Global CMS', icon: FileText },
        { id: 'ROLES', label: 'Rollar', icon: ShieldCheck },
        { id: 'LOGS', label: 'Audit', icon: Terminal },
        { id: 'SETTINGS', label: 'Sozlamalar', icon: Settings },
    ];

    return (
        <div className="w-80 bg-white border-r border-gray-100 flex flex-col justify-between shadow-2xl shadow-gray-100/50 z-20">
            <div className="p-8">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200">
                        N
                    </div>
                    <span className="text-2xl font-black text-gray-900 tracking-tighter">Navbat<span className="text-indigo-600">.pro</span></span>
                </div>

                <nav className="space-y-2">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${isActive
                                        ? 'bg-gray-900 text-white shadow-xl shadow-gray-200 scale-100'
                                        : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon size={20} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span className="font-bold text-sm tracking-wide">{item.label}</span>
                                {isActive && <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>}
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="p-8 border-t border-gray-50 bg-gray-50/30">
                <div className="flex items-center gap-4 p-4 bg-white rounded-[2rem] border border-gray-100 shadow-sm mb-4 cursor-pointer hover:shadow-md transition-all group">
                    <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <UserIcon size={24} />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-black text-gray-900 text-sm truncate">{profileName}</h4>
                        <p className="text-xs text-gray-400 font-bold truncate">{profileRole}</p>
                    </div>
                </div>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 text-rose-500 font-black text-xs uppercase tracking-widest hover:bg-rose-50 py-4 rounded-xl transition-colors"
                >
                    <LogOut size={16} /> Chiqish
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
