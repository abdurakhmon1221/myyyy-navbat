import React, { useState } from 'react';
import {
    Zap, UserPlus, ShieldCheck, Megaphone
} from 'lucide-react';

const SmartCRM: React.FC = () => {
    // CRM State
    const [crmActiveTab, setCrmActiveTab] = useState<'CAMPAIGNS' | 'REVIEWS'>('CAMPAIGNS');
    const [campaigns, setCampaigns] = useState({
        winBack: true,
        referral: false
    });

    const toggleCampaign = (camp: 'winBack' | 'referral') => {
        const newState = !campaigns[camp];
        setCampaigns(prev => ({ ...prev, [camp]: newState }));
        alert(`${camp === 'winBack' ? 'Win-Back' : 'Referral'} kampaniyasi ${newState ? 'faollashtirildi' : 'to\'xtatildi'}!`);
    };

    return (
        <div className="space-y-6 animate-in fade-in max-w-6xl mx-auto pb-24">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Smart CRM</h1>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Marketing va Mijozlar sodiqligi</p>
                </div>
                <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
                    <button
                        onClick={() => setCrmActiveTab('CAMPAIGNS')}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${crmActiveTab === 'CAMPAIGNS' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
                    >
                        Avto-Kampaniyalar
                    </button>
                    <button
                        onClick={() => setCrmActiveTab('REVIEWS')}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${crmActiveTab === 'REVIEWS' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
                    >
                        Review Booster
                    </button>
                </div>
            </header>

            {crmActiveTab === 'CAMPAIGNS' && (
                <div className="grid grid-cols-2 gap-6">
                    <div className={`bg-white p-8 rounded-[2.5rem] border transition-all shadow-sm relative overflow-hidden group ${campaigns.winBack ? 'border-emerald-200 shadow-emerald-100' : 'border-gray-100'}`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100%] z-0"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                                <Zap size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 leading-tight">Win-Back: "Qaytib Keling"</h3>
                            <p className="text-sm text-gray-500 mt-2 font-medium">60 kun davomida tashrif buyurmagan mijozlarga avtomatik SMS yuborish.</p>

                            <div className="mt-8 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                <p className="text-xs font-mono text-gray-600">"Hurmatli mijoz! Sizni sog'indik. Navbatsiz kirish uchun maxsus kod: <span className="font-bold text-gray-900">VIP-{new Date().getFullYear()}</span>"</p>
                            </div>

                            <div className="mt-8 flex items-center justify-between">
                                <div
                                    onClick={() => toggleCampaign('winBack')}
                                    className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${campaigns.winBack ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${campaigns.winBack ? 'ml-auto' : ''}`}></div>
                                    </div>
                                    <span className={`text-xs font-black uppercase ${campaigns.winBack ? 'text-emerald-600' : 'text-gray-400'}`}>
                                        {campaigns.winBack ? 'Faol' : 'O\'chirilgan'}
                                    </span>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">3402 ta SMS yuborildi</span>
                            </div>
                        </div>
                    </div>

                    <div className={`bg-white p-8 rounded-[2.5rem] border transition-all shadow-sm relative overflow-hidden group ${campaigns.referral ? 'border-indigo-200 shadow-indigo-100' : 'border-gray-100'}`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[100%] z-0"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                                <UserPlus size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 leading-tight">Referral: "Do'stingni olib kel"</h3>
                            <p className="text-sm text-gray-500 mt-2 font-medium">Yangi mijoz olib kelganlarga navbatda ustunlik berish.</p>

                            <div className="mt-8 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                <p className="text-xs font-mono text-gray-600">"Do'stingizni taklif qiling va keyingi safar <span className="font-bold text-gray-900">VIP navbat</span>ga ega bo'ling!"</p>
                            </div>

                            <div className="mt-8 flex items-center justify-between">
                                <div
                                    onClick={() => toggleCampaign('referral')}
                                    className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${campaigns.referral ? 'bg-indigo-500' : 'bg-gray-200'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${campaigns.referral ? 'ml-auto' : ''}`}></div>
                                    </div>
                                    <span className={`text-xs font-black uppercase ${campaigns.referral ? 'text-indigo-600' : 'text-gray-400'}`}>
                                        {campaigns.referral ? 'Faol' : 'O\'chirilgan'}
                                    </span>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Beta versiya</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {crmActiveTab === 'REVIEWS' && (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 flex flex-col items-center text-center animate-in fade-in">
                    <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl shadow-amber-200 mb-6">
                        <ShieldCheck size={48} className="text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-gray-900">Review Booster</h3>
                    <p className="text-gray-400 font-medium max-w-md mx-auto mt-2">Agar mijoz 5 baho qo'ysa, uni Google Maps ga yo'naltiramiz. Agar 3 dan past bo'lsa, Telegram botga shikoyat yozdiramiz.</p>

                    <div className="mt-8 flex gap-4">
                        <div className="flex flex-col items-center bg-gray-50 p-4 rounded-3xl w-40">
                            <span className="text-3xl font-black text-gray-900">4.9</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase mt-1">Google Rating</span>
                        </div>
                        <div className="flex flex-col items-center bg-gray-50 p-4 rounded-3xl w-40">
                            <span className="text-3xl font-black text-gray-900">128</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase mt-1">Yangi Sharhlar</span>
                        </div>
                    </div>

                    <button onClick={() => alert("Sozlamalar saqlandi!")} className="mt-8 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-wider hover:scale-105 transition-transform shadow-xl">
                        Sozlamalarni O'zgartirish
                    </button>
                </div>
            )}
        </div>
    );
};

export default SmartCRM;
