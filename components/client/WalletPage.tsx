
import React, { useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, History, CreditCard, ChevronRight, Plus, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { haptics } from '../../services/haptics';

const MOCK_TRANSACTIONS = [
    { id: 1, title: 'Click orqali to\'ldirish', amount: 50000, type: 'INCOME', date: 'Bugun, 14:30', status: 'SUCCESS' },
    { id: 2, title: 'Navbat bron qilish', amount: -2000, type: 'EXPENSE', date: 'Kecha, 09:15', status: 'SUCCESS' },
    { id: 3, title: 'Payme orqali to\'ldirish', amount: 100000, type: 'INCOME', date: '01.02.2024', status: 'SUCCESS' },
    { id: 4, title: 'SMS xabarnoma xizmati', amount: -5000, type: 'EXPENSE', date: '28.01.2024', status: 'SUCCESS' },
];

interface WalletPageProps {
    onBack?: () => void;
}

const WalletPage: React.FC<WalletPageProps> = ({ onBack }) => {
    const { t } = useLanguage();
    const [balance, setBalance] = useState(143000);
    const [showTopUp, setShowTopUp] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('uz-UZ').format(Math.abs(amount)) + " UZS";
    };

    const handleTopUp = () => {
        if (!selectedAmount) return;
        haptics.success();
        setBalance(prev => prev + selectedAmount);
        setShowTopUp(false);
        setSelectedAmount(null);
        alert("Hisob muvaffaqiyatli to'ldirildi!");
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500 pb-24">
            {/* Card Header */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 text-white shadow-2xl">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-indigo-500/30 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-indigo-200 font-bold text-xs uppercase tracking-widest mb-1">Joriy Balans</p>
                            <h2 className="text-4xl font-black tracking-tight">{formatCurrency(balance).replace(" UZS", "")} <span className="text-xl opacity-60">UZS</span></h2>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                            <Wallet size={24} className="text-white" />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowTopUp(true)}
                            className="flex-1 bg-white text-indigo-600 py-4 rounded-2xl font-black text-xs uppercase tracking-wide shadow-lg hover:bg-indigo-50 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={18} strokeWidth={3} /> Hisobni to'ldirish
                        </button>
                        <button className="w-14 bg-indigo-500/40 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-indigo-500/60 transition-colors">
                            <History size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Top Up Section (Conditional) */}
            {showTopUp && (
                <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-gray-100 dark:border-gray-800 shadow-xl animate-in zoom-in-95 duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black text-lg">Summani tanlang</h3>
                        <button onClick={() => setShowTopUp(false)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200"><ChevronRight size={20} className="rotate-90" /></button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {[10000, 50000, 100000, 200000].map(amount => (
                            <button
                                key={amount}
                                onClick={() => { haptics.light(); setSelectedAmount(amount); }}
                                className={`p-4 rounded-2xl font-bold text-sm border-2 transition-all ${selectedAmount === amount ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'}`}
                            >
                                {formatCurrency(amount)}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleTopUp}
                        disabled={!selectedAmount}
                        className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 active:scale-95 transition-all"
                    >
                        To'ldirish
                    </button>
                </div>
            )}

            {/* Transactions */}
            <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2 mb-4">Oxirgi harakatlar</h3>
                <div className="space-y-3">
                    {MOCK_TRANSACTIONS.map(tx => (
                        <div key={tx.id} className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center justify-between group active:scale-[0.98] transition-all">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'INCOME' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30'}`}>
                                    {tx.type === 'INCOME' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{tx.title}</h4>
                                    <p className="text-[10px] font-bold text-gray-400 mt-1">{tx.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`block font-black text-sm ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-gray-900 dark:text-white'}`}>
                                    {tx.type === 'INCOME' ? '+' : ''} {formatCurrency(tx.amount).replace(" UZS", "")}
                                </span>
                                <span className="text-[9px] font-bold text-emerald-500 flex justify-end items-center gap-1 mt-1">
                                    Muvaffaqiyatli <Check size={10} strokeWidth={4} />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WalletPage;
