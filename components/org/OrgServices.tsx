
import React from 'react';
import { Plus, ListTree, Settings, Trash2 } from 'lucide-react';
import { Service } from '../../types';

interface OrgServicesProps {
    services: Service[];
    onUpdate?: (services: Service[]) => void;
}

const OrgServices: React.FC<OrgServicesProps> = ({ services: initialServices, onUpdate }) => {
    const [services, setServices] = React.useState<Service[]>(initialServices || []);
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [newService, setNewService] = React.useState<{ name: string, docs: string[] }>({ name: '', docs: [] });
    const [tempDoc, setTempDoc] = React.useState('');

    React.useEffect(() => {
        setServices(initialServices || []);
    }, [initialServices]);

    const handleAdd = () => {
        if (!newService.name) return;
        const srv: Service = {
            id: 's-' + Date.now(),
            name: newService.name,
            requiredDocuments: newService.docs
        };
        const updated = [...services, srv];
        setServices(updated);
        if (onUpdate) onUpdate(updated);

        setNewService({ name: '', docs: [] });
        setShowAddModal(false);
    };

    const handleDelete = (id: string) => {
        if (confirm("Xizmatni o'chirmoqchimisiz?")) {
            const updated = services.filter(s => s.id !== id);
            setServices(updated);
            if (onUpdate) onUpdate(updated);
        }
    };

    const addDoc = () => {
        if (tempDoc) {
            setNewService({ ...newService, docs: [...newService.docs, tempDoc] });
            setTempDoc('');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in pb-24 relative">
            <div className="flex justify-between items-center mb-4 px-1">
                <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Xizmatlar</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Hujjatlar nazorati</p>
                </div>
                <button onClick={() => setShowAddModal(true)} className="bg-indigo-600 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                    <Plus size={18} /> Yangi xizmat
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {services.map(srv => (
                    <div key={srv.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm group hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <ListTree size={28} />
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-900 dark:text-white text-base">{srv.name}</h4>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {srv.requiredDocuments?.map((doc, i) => (
                                            <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-slate-800 text-[10px] font-bold uppercase text-gray-500 rounded-lg">{doc}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-3 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"><Settings size={18} /></button>
                                <button onClick={() => handleDelete(srv.id)} className="p-3 text-gray-400 hover:text-rose-500"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    </div>
                ))}
                {services.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-slate-700">
                        <p className="text-sm text-gray-400 font-black uppercase">Xizmatlar mavjud emas</p>
                    </div>
                )}
            </div>

            {/* Add Service Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl space-y-6">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">Yangi Xizmat</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Nomi</label>
                                <input
                                    type="text"
                                    value={newService.name}
                                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    placeholder="Masalan: Pasport olish"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Kerakli hujjatlar</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={tempDoc}
                                        onChange={(e) => setTempDoc(e.target.value)}
                                        className="flex-1 bg-gray-50 dark:bg-slate-800 p-3 rounded-2xl font-bold text-xs"
                                        placeholder="Hujjat nomi..."
                                    />
                                    <button onClick={addDoc} className="bg-gray-100 dark:bg-slate-800 p-3 rounded-2xl font-black text-xs hover:bg-gray-200">+</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {newService.docs.map((d, i) => (
                                        <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold flex items-center gap-1">
                                            {d} <button onClick={() => setNewService({ ...newService, docs: newService.docs.filter((_, idx) => idx !== i) })} className="hover:text-red-500">×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black uppercase text-xs">Bekor qilish</button>
                            <button onClick={handleAdd} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase text-xs shadow-lg">Saqlash</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrgServices;
