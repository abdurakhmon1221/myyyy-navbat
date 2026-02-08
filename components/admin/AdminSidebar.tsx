import React from 'react';
import {
    LayoutGrid, Building, Users, ListTree, PieChart, MessageSquare,
    Megaphone, FileText, ShieldCheck, Terminal, Settings, LogOut,
    User as UserIcon, ChevronLeft, ChevronRight, Bell, Search
} from 'lucide-react';
import { AdminSection, UserRole } from '../../types';

interface AdminSidebarProps {
    activeSection: AdminSection;
    setActiveSection: (section: AdminSection) => void;
    onLogout?: () => void;
    profileName: string;
    profileRole: UserRole;
    profileImage?: string;
    collapsed?: boolean;
    onToggleCollapse?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
    activeSection,
    setActiveSection,
    onLogout,
    profileName,
    profileRole,
    profileImage,
    collapsed = false,
    onToggleCollapse
}) => {
    const sidebarItems: { id: AdminSection; label: string; icon: React.ElementType; badge?: number }[] = [
        { id: 'DASHBOARD', label: 'Boshqaruv', icon: LayoutGrid },
        { id: 'COMPANIES', label: 'Tashkilotlar', icon: Building, badge: 12 },
        { id: 'CLIENTS', label: 'Mijozlar', icon: Users, badge: 1240 },
        { id: 'QUEUES', label: 'Navbatlar', icon: ListTree, badge: 84 },
        { id: 'ANALYTICS', label: 'Statistika', icon: PieChart },
        { id: 'AI_CONSOLE', label: 'AI Console', icon: MessageSquare },
        { id: 'CRM', label: 'Smart CRM', icon: Megaphone },
        { id: 'CMS', label: 'Global CMS', icon: FileText },
        { id: 'ROLES', label: 'Rollar', icon: ShieldCheck },
        { id: 'LOGS', label: 'Audit', icon: Terminal },
        { id: 'SETTINGS', label: 'Sozlamalar', icon: Settings },
    ];

    return (
        <div className={`h-full bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-gray-800 flex flex-col justify-between shadow-2xl shadow-gray-100/50 dark:shadow-black/20 transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'}`}>
            {/* Header */}
            <div className={`p-6 ${collapsed ? 'px-4' : ''}`}>
                <div className={`flex items-center gap-3 mb-8 ${collapsed ? 'justify-center' : 'px-2'}`}>
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 flex-shrink-0">
                        N
                    </div>
                    {!collapsed && (
                        <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
                            Navbat<span className="text-indigo-600">.pro</span>
                        </span>
                    )}
                </div>

                {/* Search - only when expanded */}
                {!collapsed && (
                    <div className="relative mb-6">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Qidirish..."
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm font-bold outline-none border-2 border-transparent focus:border-indigo-500 transition-colors"
                        />
                    </div>
                )}

                {/* Navigation */}
                <nav className="space-y-1">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                title={collapsed ? item.label : undefined}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActive
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                                    } ${collapsed ? 'justify-center' : ''}`}
                            >
                                <Icon size={20} className={`flex-shrink-0 transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`} />
                                {!collapsed && (
                                    <>
                                        <span className="font-bold text-sm flex-1 text-left">{item.label}</span>
                                        {item.badge && (
                                            <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${isActive
                                                    ? 'bg-white/20'
                                                    : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400'
                                                }`}>
                                                {item.badge > 999 ? '999+' : item.badge}
                                            </span>
                                        )}
                                    </>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Footer */}
            <div className={`p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-800/30 ${collapsed ? 'px-3' : ''}`}>
                {/* Collapse toggle */}
                {onToggleCollapse && (
                    <button
                        onClick={onToggleCollapse}
                        className={`w-full flex items-center justify-center gap-2 py-2 mb-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors ${collapsed ? '' : 'justify-end pr-2'}`}
                    >
                        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                        {!collapsed && <span className="text-xs font-bold">Yopish</span>}
                    </button>
                )}

                {/* Profile */}
                <div className={`flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm mb-3 cursor-pointer hover:shadow-md transition-all group ${collapsed ? 'justify-center' : ''}`}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm flex-shrink-0">
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <UserIcon size={20} />
                            </div>
                        )}
                    </div>
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <h4 className="font-black text-gray-900 dark:text-white text-sm truncate">{profileName}</h4>
                            <p className="text-xs text-gray-400 font-bold truncate">{profileRole}</p>
                        </div>
                    )}
                </div>

                {/* Logout */}
                <button
                    onClick={onLogout}
                    className={`w-full flex items-center justify-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-wider hover:bg-rose-50 dark:hover:bg-rose-900/20 py-3 rounded-xl transition-colors ${collapsed ? '' : ''}`}
                >
                    <LogOut size={16} />
                    {!collapsed && <span>Chiqish</span>}
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
