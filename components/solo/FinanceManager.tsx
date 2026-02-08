import React, { useState, useEffect } from 'react';
import {
    DollarSign, TrendingUp, TrendingDown, Calendar, CreditCard,
    Wallet, FileText, Download, Filter, Search, ArrowUpRight, ArrowDownLeft,
    Plus, X, ChevronDown, PieChart, Eye, MoreVertical, Trash2
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useMobile } from '../../hooks/useMobile';

// Transaction Interface
interface Transaction {
    id: number;
    date: string;
    client?: string;
    service?: string; // For Income
    category?: string; // For Expense
    description?: string;
    amount: number;
    method: string;
    type: 'INCOME' | 'EXPENSE';
}

const DEFAULT_TRANSACTIONS: Transaction[] = [
    { id: 1, date: '2024-02-04', client: 'Alisher Karimov', service: 'Soch olish', amount: 50000, method: 'CASH', type: 'INCOME' },
    { id: 2, date: '2024-02-04', client: 'Malika Toshmatova', service: 'Manikur', amount: 80000, method: 'CLICK', type: 'INCOME' },
    { id: 3, date: '2024-02-04', description: 'Asboblar xaridi', amount: -120000, method: 'CASH', type: 'EXPENSE', category: 'Equipment' },
    { id: 4, date: '2024-02-03', client: 'Sardor Azimov', service: 'Soqol olish', amount: 35000, method: 'PAYME', type: 'INCOME' },
    { id: 5, date: '2024-02-03', description: 'Ijara to\'lovi', amount: -500000, method: 'TRANSFER', type: 'EXPENSE', category: 'Rent' },
];

const EXPENSE_CATEGORIES = ['Equipment', 'Rent', 'Supplies', 'Marketing', 'Other'];

interface FinanceManagerProps {
    onClose: () => void;
}

const FinanceManager: React.FC<FinanceManagerProps> = ({ onClose }) => {
    const { t } = useLanguage();
    const isMobile = useMobile();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TRANSACTIONS' | 'EXPENSES' | 'REPORTS'>('OVERVIEW');
    const [filterMethod, setFilterMethod] = useState<string>('ALL');
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [showAddIncome, setShowAddIncome] = useState(false);

    // Dynamic Services
    const [incomeServices, setIncomeServices] = useState<string[]>(['Soch olish', 'Soqol olish', 'Manikur', 'Pedikur', 'Boshqa']);

    // Form states
    const [formAmount, setFormAmount] = useState('');
    const [formCategory, setFormCategory] = useState(EXPENSE_CATEGORIES[0]);
    const [formService, setFormService] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formClient, setFormClient] = useState('');
    const [formMethod, setFormMethod] = useState('CASH');

    useEffect(() => {
        const saved = localStorage.getItem('solo_finance_transactions');
        if (saved) {
            setTransactions(JSON.parse(saved));
        } else {
            setTransactions(DEFAULT_TRANSACTIONS);
        }

        // Load services from Solo Service Menu
        const savedServices = localStorage.getItem('solo_services');
        if (savedServices) {
            try {
                const parsed = JSON.parse(savedServices);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    const names = parsed.map((s: any) => s.name);
                    setIncomeServices([...names, 'Boshqa']);
                    setFormService(names[0]);
                } else {
                    setFormService('Soch olish');
                }
            } catch (e) {
                console.error("Error parsing solo_services", e);
                setFormService('Soch olish');
            }
        } else {
            setFormService('Soch olish');
        }
    }, []);

    const saveToStorage = (newTransactions: Transaction[]) => {
        setTransactions(newTransactions);
        localStorage.setItem('solo_finance_transactions', JSON.stringify(newTransactions));
    };

    // Calculate stats
    const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = Math.abs(transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0));
    const netProfit = totalIncome - totalExpense;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('uz-UZ').format(Math.abs(amount)) + ' so\'m';
    };

    const filteredTransactions = filterMethod === 'ALL'
        ? transactions
        : transactions.filter(t => t.method === filterMethod);

    const handleSaveTransaction = (type: 'INCOME' | 'EXPENSE') => {
        if (!formAmount) return;

        const amountVal = Number(formAmount);
        const finalAmount = type === 'INCOME' ? amountVal : -amountVal;

        const newTx: Transaction = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            amount: finalAmount,
            type: type,
            method: formMethod,
            description: formDescription,
            client: type === 'INCOME' ? formClient : undefined,
            service: type === 'INCOME' ? formService : undefined,
            category: type === 'EXPENSE' ? formCategory : undefined
        };

        saveToStorage([newTx, ...transactions]);
        resetForm();
    };

    const handleDelete = (id: number) => {
        if (confirm("Tranzaksiyani o'chirmoqchimisiz?")) {
            saveToStorage(transactions.filter(t => t.id !== id));
        }
    };

    const resetForm = () => {
        setFormAmount('');
        setFormCategory(EXPENSE_CATEGORIES[0]);
        // Don't reset service to hardcoded, keep current or first
        if (incomeServices.length > 0) setFormService(incomeServices[0]);
        setFormDescription('');
        setFormClient('');
        setFormMethod('CASH');
        setShowAddExpense(false);
        setShowAddIncome(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[200] flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
            <div className={`bg-white dark:bg-slate-900 w-full md:max-w-5xl h-full md:h-[90vh] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col ${isMobile ? 'rounded-none' : ''}`}>
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 flex-none">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Moliyaviy Boshqaruv</h2>
                        <p className="text-sm font-bold text-gray-500 mt-1">Daromad va xarajatlarni kuzatish</p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white dark:bg-slate-800 rounded-2xl hover:bg-gray-50 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 p-4 md:p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 flex-none overflow-x-auto scrollbar-hide">
                    {['OVERVIEW', 'TRANSACTIONS', 'EXPENSES', 'REPORTS'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-2 md:px-6 md:py-3 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === tab
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                                : 'bg-white dark:bg-slate-700 text-gray-500 hover:text-emerald-600'
                                }`}
                        >
                            {tab === 'OVERVIEW' ? 'Umumiy' : tab === 'TRANSACTIONS' ? 'Tranzaksiyalar' : tab === 'EXPENSES' ? 'Xarajatlar' : 'Hisobotlar'}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-slate-950/50 p-4 md:p-8 pb-24 md:pb-8">
                    {activeTab === 'OVERVIEW' && (
                        <div className="space-y-6">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                            <ArrowDownLeft size={24} />
                                        </div>
                                        <TrendingUp size={48} className="opacity-20 absolute top-4 right-4" />
                                    </div>
                                    <p className="text-xs font-black opacity-80 uppercase tracking-wider mb-2">Daromad</p>
                                    <h3 className="text-3xl md:text-4xl font-black">{formatCurrency(totalIncome)}</h3>
                                </div>

                                <div className="bg-gradient-to-br from-rose-500 to-rose-700 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                            <ArrowUpRight size={24} />
                                        </div>
                                        <TrendingDown size={48} className="opacity-20 absolute top-4 right-4" />
                                    </div>
                                    <p className="text-xs font-black opacity-80 uppercase tracking-wider mb-2">Xarajat</p>
                                    <h3 className="text-3xl md:text-4xl font-black">{formatCurrency(totalExpense)}</h3>
                                </div>

                                <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                            <Wallet size={24} />
                                        </div>
                                        <DollarSign size={48} className="opacity-20 absolute top-4 right-4" />
                                    </div>
                                    <p className="text-xs font-black opacity-80 uppercase tracking-wider mb-2">Sof Foyda</p>
                                    <h3 className="text-3xl md:text-4xl font-black">{formatCurrency(netProfit)}</h3>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowAddIncome(true)}
                                    className="flex-1 bg-white dark:bg-slate-900 border-2 border-emerald-100 dark:border-emerald-900/50 p-4 md:p-6 rounded-3xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all flex items-center justify-center gap-2 md:gap-3 group shadow-sm hover:shadow-lg"
                                >
                                    <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl group-hover:scale-110 transition-transform"><Plus size={20} /></div>
                                    <span className="text-xs md:text-sm font-black text-gray-900 dark:text-emerald-400 uppercase">Daromad</span>
                                </button>

                                <button
                                    onClick={() => setShowAddExpense(true)}
                                    className="flex-1 bg-white dark:bg-slate-900 border-2 border-rose-100 dark:border-rose-900/50 p-4 md:p-6 rounded-3xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all flex items-center justify-center gap-2 md:gap-3 group shadow-sm hover:shadow-lg"
                                >
                                    <div className="bg-rose-100 text-rose-600 p-2 rounded-xl group-hover:scale-110 transition-transform"><Plus size={20} /></div>
                                    <span className="text-xs md:text-sm font-black text-gray-900 dark:text-rose-400 uppercase">Xarajat</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'TRANSACTIONS' && (
                        <div className="space-y-6">
                            {/* Filter */}
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {['ALL', 'CASH', 'CLICK', 'PAYME', 'TRANSFER'].map(method => (
                                    <button
                                        key={method}
                                        onClick={() => setFilterMethod(method)}
                                        className={`px-4 py-2 md:px-6 md:py-2.5 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase transition-all whitespace-nowrap ${filterMethod === method
                                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                                            : 'bg-white dark:bg-slate-800 text-gray-500 border border-gray-100 dark:border-gray-700'
                                            }`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>

                            {/* Transaction List / Table */}
                            {isMobile ? (
                                <div className="space-y-3">
                                    {filteredTransactions.map(tx => (
                                        <div key={tx.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'INCOME'
                                                    ? 'bg-emerald-100 text-emerald-600'
                                                    : 'bg-rose-100 text-rose-600'
                                                    }`}>
                                                    {tx.type === 'INCOME' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-sm text-gray-900 dark:text-white">
                                                        {tx.client || tx.description}
                                                    </h4>
                                                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">
                                                        {tx.service || tx.category || 'General'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`block text-lg font-black ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {tx.type === 'INCOME' ? '+' : '-'} {Math.abs(tx.amount / 1000)}k
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-300">{tx.method}</span>
                                                <button onClick={() => handleDelete(tx.id)} className="ml-2 text-rose-400 hover:text-rose-600"><Trash2 size={12} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-gray-700">
                                                <tr>
                                                    <th className="text-left py-5 px-8 font-black text-[10px] uppercase tracking-widest text-gray-400">Tranzaksiya</th>
                                                    <th className="text-left py-5 px-6 font-black text-[10px] uppercase tracking-widest text-gray-400">Kategoriya</th>
                                                    <th className="text-left py-5 px-6 font-black text-[10px] uppercase tracking-widest text-gray-400">To'lov Turi</th>
                                                    <th className="text-left py-5 px-6 font-black text-[10px] uppercase tracking-widest text-gray-400">Sana</th>
                                                    <th className="text-right py-5 px-8 font-black text-[10px] uppercase tracking-widest text-gray-400">Summa</th>
                                                    <th className="w-10"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                                {filteredTransactions.map(tx => (
                                                    <tr key={tx.id} className="group hover:bg-gray-50/80 dark:hover:bg-slate-800/50 transition-colors">
                                                        <td className="py-4 px-8">
                                                            <div className="flex items-center gap-4">
                                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'INCOME'
                                                                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30'
                                                                    : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30'
                                                                    }`}>
                                                                    {tx.type === 'INCOME' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                                                </div>
                                                                <span className="font-bold text-gray-900 dark:text-white text-sm">
                                                                    {tx.client || tx.description}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                                                                {tx.service || tx.category || 'General'}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-lg uppercase">
                                                                {tx.method}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <span className="text-xs font-medium text-gray-400">
                                                                {tx.date}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-8 text-right">
                                                            <span className={`text-sm font-black ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                                {tx.type === 'INCOME' ? '+' : '-'} {formatCurrency(tx.amount)}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-2">
                                                            <button onClick={() => handleDelete(tx.id)} className="p-2 text-gray-400 hover:text-rose-500"><Trash2 size={16} /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'EXPENSES' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                                {EXPENSE_CATEGORIES.map(cat => {
                                    const catTotal = transactions
                                        .filter(t => t.type === 'EXPENSE' && t.category === cat)
                                        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

                                    return (
                                        <div key={cat} className="bg-white dark:bg-slate-900 p-6 rounded-3xl text-center border border-gray-100 dark:border-gray-800 shadow-sm">
                                            <p className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">{cat}</p>
                                            <h4 className="text-lg md:text-xl font-black text-gray-900 dark:text-white">{formatCurrency(catTotal)}</h4>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="bg-gray-900 text-white p-10 rounded-[2.5rem] relative overflow-hidden">
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <h3 className="text-2xl font-black mb-2">Xarajatlar Tahlili</h3>
                                    <p className="text-sm font-medium opacity-60 mb-8">Joriy oydagi umumiy chiqimlar</p>
                                    <div className="text-4xl md:text-5xl font-black text-rose-500 mb-2">{formatCurrency(totalExpense)}</div>
                                    <div className="text-xs font-bold uppercase tracking-widest opacity-40">Jami Xarajat</div>
                                </div>
                                {/* Abstract BG circles */}
                                <div className="absolute top-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
                                <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'REPORTS' && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800">
                            <div className="w-24 h-24 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                                <FileText size={40} className="text-gray-300" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Hisobotlar Tayyorlanmoqda</h3>
                            <p className="text-sm text-gray-500 font-bold max-w-md text-center">
                                PDF va Excel formatidagi moliyaviy hisobotlar tez orada ushbu bo'limda paydo bo'ladi.
                            </p>
                            <button className="mt-8 px-8 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-indigo-100 transition-colors">
                                Meni ogohlantirish
                            </button>
                        </div>
                    )}
                </div>

                {/* Add Expense Modal */}
                {showAddExpense && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-6 z-50 animate-in fade-in">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md space-y-6">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white text-center">Xarajat Qo'shish</h3>
                            <div className="space-y-4">
                                <input
                                    type="number"
                                    placeholder="Summa (so'm)"
                                    value={formAmount}
                                    onChange={e => setFormAmount(e.target.value)}
                                    className="w-full p-5 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-rose-500 transition-all text-lg"
                                />
                                <select
                                    value={formCategory}
                                    onChange={e => setFormCategory(e.target.value)}
                                    className="w-full p-5 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none text-gray-900 dark:text-white"
                                >
                                    {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                                <select
                                    value={formMethod}
                                    onChange={e => setFormMethod(e.target.value)}
                                    className="w-full p-5 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none text-gray-900 dark:text-white"
                                >
                                    {['CASH', 'CLICK', 'PAYME', 'TRANSFER'].map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <input
                                    type="text"
                                    placeholder="Izoh (ixtiyoriy)"
                                    value={formDescription}
                                    onChange={e => setFormDescription(e.target.value)}
                                    className="w-full p-5 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-rose-500 transition-all"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button onClick={resetForm} className="flex-1 p-4 bg-gray-100 dark:bg-slate-700 rounded-2xl font-black text-xs uppercase tracking-wider text-gray-500 hover:bg-gray-200 transition-colors">Bekor qilish</button>
                                <button onClick={() => handleSaveTransaction('EXPENSE')} className="flex-1 p-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200">Saqlash</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Income Modal */}
                {showAddIncome && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-6 z-50 animate-in fade-in">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md space-y-6">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white text-center">Daromad Qo'shish</h3>
                            <div className="space-y-4">
                                <input
                                    type="number"
                                    placeholder="Summa (so'm)"
                                    value={formAmount}
                                    onChange={e => setFormAmount(e.target.value)}
                                    className="w-full p-5 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-emerald-500 transition-all text-lg"
                                />
                                <input
                                    type="text"
                                    placeholder="Mijoz Ismi"
                                    value={formClient}
                                    onChange={e => setFormClient(e.target.value)}
                                    className="w-full p-5 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-emerald-500 transition-all"
                                />
                                <select
                                    value={formService}
                                    onChange={e => setFormService(e.target.value)}
                                    className="w-full p-5 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none text-gray-900 dark:text-white"
                                >
                                    {incomeServices.map(srv => <option key={srv} value={srv}>{srv}</option>)}
                                </select>
                                <select
                                    value={formMethod}
                                    onChange={e => setFormMethod(e.target.value)}
                                    className="w-full p-5 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none text-gray-900 dark:text-white"
                                >
                                    {['CASH', 'CLICK', 'PAYME', 'TRANSFER'].map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button onClick={resetForm} className="flex-1 p-4 bg-gray-100 dark:bg-slate-700 rounded-2xl font-black text-xs uppercase tracking-wider text-gray-500 hover:bg-gray-200 transition-colors">Bekor qilish</button>
                                <button onClick={() => handleSaveTransaction('INCOME')} className="flex-1 p-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200">Saqlash</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinanceManager;
