import React, { useState, useEffect } from 'react';
import {
    Package, Plus, Minus, AlertTriangle, TrendingDown, Search,
    Edit, Trash2, X, BarChart3, ShoppingCart
} from 'lucide-react';

interface InventoryItem {
    id: string;
    name: string;
    category: string;
    quantity: number;
    minStock: number;
    unit: string;
    lastRestocked: string;
    cost: number;
}

const DEFAULT_INVENTORY: InventoryItem[] = [];

const DEFAULT_CATEGORIES = ['General', 'Supplies', 'Tools'];

interface InventoryManagerProps {
    onClose: () => void;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({ onClose }) => {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showAddItem, setShowAddItem] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

    // Form State
    const [formName, setFormName] = useState('');
    const [formCategory, setFormCategory] = useState('General');
    const [formQuantity, setFormQuantity] = useState('');
    const [formUnit, setFormUnit] = useState('dona');
    const [formMinStock, setFormMinStock] = useState('');
    const [formCost, setFormCost] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('solo_inventory');
        if (saved) {
            setInventory(JSON.parse(saved));
        } else {
            setInventory(DEFAULT_INVENTORY);
        }
    }, []);

    const saveToStorage = (items: InventoryItem[]) => {
        setInventory(items);
        localStorage.setItem('solo_inventory', JSON.stringify(items));
    };

    // Derive categories from existing items + defaults
    const availableCategories = Array.from(new Set([
        ...DEFAULT_CATEGORIES,
        ...inventory.map(i => i.category || 'General')
    ])).sort();

    // Used for filter bar
    const filterCategories = ['All', ...availableCategories];

    const lowStockItems = inventory.filter(item => item.quantity <= item.minStock);
    const filteredItems = inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const totalValue = inventory.reduce((sum, item) => sum + (item.cost * item.quantity), 0);

    const handleStockUpdate = (id: string, delta: number) => {
        const updated = inventory.map(item => {
            if (item.id === id) {
                const newQty = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQty, lastRestocked: delta > 0 ? new Date().toISOString().split('T')[0] : item.lastRestocked };
            }
            return item;
        });
        saveToStorage(updated);
    };

    const handleDelete = (id: string) => {
        if (confirm("Mahsulotni o'chirmoqchimisiz?")) {
            saveToStorage(inventory.filter(i => i.id !== id));
        }
    };

    const handleEdit = (item: InventoryItem) => {
        setEditingItem(item);
        setFormName(item.name);
        setFormCategory(item.category);
        setFormQuantity(item.quantity.toString());
        setFormUnit(item.unit);
        setFormMinStock(item.minStock.toString());
        setFormCost(item.cost.toString());
        setShowAddItem(true);
    };

    const handleSave = () => {
        if (!formName) return;

        const newItem: InventoryItem = {
            id: editingItem ? editingItem.id : 'i-' + Date.now(),
            name: formName,
            category: formCategory || 'General',
            quantity: Number(formQuantity) || 0,
            unit: formUnit,
            minStock: Number(formMinStock) || 0,
            cost: Number(formCost) || 0,
            lastRestocked: editingItem ? editingItem.lastRestocked : new Date().toISOString().split('T')[0]
        };

        if (editingItem) {
            saveToStorage(inventory.map(i => i.id === editingItem.id ? newItem : i));
        } else {
            saveToStorage([...inventory, newItem]);
        }
        resetForm();
    };

    const resetForm = () => {
        setFormName('');
        setFormCategory('General');
        setFormQuantity('');
        setFormUnit('dona');
        setFormMinStock('');
        setFormCost('');
        setEditingItem(null);
        setShowAddItem(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-8 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Ombor Boshqaruvi</h2>
                            <p className="text-sm font-bold text-gray-500 mt-1">Mahsulotlar va ehtiyotlar</p>
                        </div>
                        <button onClick={onClose} className="p-3 bg-white dark:bg-slate-800 rounded-2xl hover:bg-gray-50">
                            <X size={24} />
                        </button>

                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl">
                            <div className="flex items-center gap-3 mb-2">
                                <Package size={20} className="text-indigo-600" />
                                <span className="text-xs font-black text-gray-400 uppercase">Jami mahsulotlar</span>
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white">{inventory.length}</h3>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl">
                            <div className="flex items-center gap-3 mb-2">
                                <AlertTriangle size={20} className="text-rose-600" />
                                <span className="text-xs font-black text-gray-400 uppercase">Kam qolgan</span>
                            </div>
                            <h3 className="text-3xl font-black text-rose-600">{lowStockItems.length}</h3>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl">
                            <div className="flex items-center gap-3 mb-2">
                                <BarChart3 size={20} className="text-emerald-600" />
                                <span className="text-xs font-black text-gray-400 uppercase">Jami qiymati</span>
                            </div>
                            <h3 className="text-2xl font-black text-emerald-600">{totalValue.toLocaleString()} so'm</h3>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide max-w-2xl">
                        {filterCategories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase whitespace-nowrap ${selectedCategory === cat
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-gray-100 dark:bg-slate-800 text-gray-500'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        <div className="relative">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Mahsulot qidirish..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-2xl text-sm font-bold outline-none w-64"
                            />
                        </div>
                        <button
                            onClick={() => setShowAddItem(true)}
                            className="px-6 py-3 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase flex items-center gap-2 hover:bg-orange-700"
                        >
                            <Plus size={18} /> Yangi
                        </button>
                    </div>
                </div>

                {/* Low Stock Alert */}
                {lowStockItems.length > 0 && (
                    <div className="px-6 pt-4">
                        <div className="bg-rose-50 dark:bg-rose-900/20 border-2 border-rose-200 dark:border-rose-800 p-4 rounded-2xl flex items-center gap-3">
                            <AlertTriangle size={24} className="text-rose-600" />
                            <div>
                                <h4 className="font-black text-sm text-rose-900 dark:text-rose-100">Diqqat! Kam qolgan mahsulotlar</h4>
                                <p className="text-xs font-bold text-rose-600 mt-1">
                                    {lowStockItems.map(item => item.name).join(', ')} - zaxirasini to'ldiring
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Inventory List */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-3">
                        {filteredItems.map(item => {
                            const isLowStock = item.quantity <= item.minStock;

                            return (
                                <div key={item.id} className={`p-6 rounded-3xl border-2 transition-all ${isLowStock
                                    ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800'
                                    : 'bg-gray-50 dark:bg-slate-800 border-gray-100 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700'
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isLowStock
                                                ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/40'
                                                : 'bg-orange-100 text-orange-600 dark:bg-orange-900/40'
                                                }`}>
                                                <Package size={28} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="font-black text-lg text-gray-900 dark:text-white">{item.name}</h4>
                                                    <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300">
                                                        {item.category}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-6 text-xs font-bold text-gray-500">
                                                    <span>Zaxira: <span className={isLowStock ? 'text-rose-600 font-black' : 'text-gray-900 dark:text-white font-black'}>{item.quantity} {item.unit}</span></span>
                                                    <span>Min: {item.minStock} {item.unit}</span>
                                                    <span>Narxi: {item.cost.toLocaleString()} so'm</span>
                                                    <span>Oxirgi: {item.lastRestocked}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleStockUpdate(item.id, 1)} className="p-3 bg-white dark:bg-slate-700 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                                                <Plus size={20} className="text-emerald-600" />
                                            </button>
                                            <button onClick={() => handleStockUpdate(item.id, -1)} className="p-3 bg-white dark:bg-slate-700 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
                                                <Minus size={20} className="text-rose-600" />
                                            </button>
                                            <button onClick={() => handleEdit(item)} className="p-3 bg-white dark:bg-slate-700 rounded-xl hover:bg-gray-100 transition-colors">
                                                <Edit size={20} className="text-gray-600" />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="p-3 bg-white dark:bg-slate-700 rounded-xl hover:bg-rose-100 transition-colors">
                                                <Trash2 size={20} className="text-rose-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Add Item Modal */}
                {showAddItem && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 rounded-[3rem] z-10">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-6">
                            <h3 className="text-2xl font-black">{editingItem ? 'Tahrirlash' : 'Yangi Mahsulot'}</h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Mahsulot nomi"
                                    value={formName}
                                    onChange={e => setFormName(e.target.value)}
                                    className="w-full p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none"
                                />

                                <input
                                    list="category-options"
                                    placeholder="Kategoriya (yoki tanlang)"
                                    value={formCategory}
                                    onChange={e => setFormCategory(e.target.value)}
                                    className="w-full p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none"
                                />
                                <datalist id="category-options">
                                    {availableCategories.map(c => <option key={c} value={c} />)}
                                </datalist>

                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="number"
                                        placeholder="Miqdori"
                                        value={formQuantity}
                                        onChange={e => setFormQuantity(e.target.value)}
                                        className="w-full p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Birlik (dona)"
                                        value={formUnit}
                                        onChange={e => setFormUnit(e.target.value)}
                                        className="w-full p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none"
                                    />
                                </div>
                                <input
                                    type="number"
                                    placeholder="Min. zaxira"
                                    value={formMinStock}
                                    onChange={e => setFormMinStock(e.target.value)}
                                    className="w-full p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none"
                                />
                                <input
                                    type="number"
                                    placeholder="Narxi"
                                    value={formCost}
                                    onChange={e => setFormCost(e.target.value)}
                                    className="w-full p-4 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={resetForm} className="flex-1 p-4 bg-gray-100 dark:bg-slate-700 rounded-2xl font-bold">Bekor qilish</button>
                                <button onClick={handleSave} className="flex-1 p-4 bg-orange-600 text-white rounded-2xl font-bold">Saqlash</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryManager;
