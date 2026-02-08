import React, { useState, useEffect } from 'react';
import {
    Megaphone, Send, Users, Gift, Share2, Instagram,
    MessageSquare, TrendingUp, Calendar, Clock, Edit,
    Trash2, Plus, X, Check, Eye, BarChart3
} from 'lucide-react';

interface Campaign {
    id: string;
    title: string;
    type: 'SMS' | 'PROMOTION' | 'REFERRAL';
    status: 'ACTIVE' | 'SCHEDULED' | 'COMPLETED';
    audience: number;
    sent: number;
    opened: number;
    conversions: number;
    startDate: string;
    endDate?: string;
}

const DEFAULT_CAMPAIGNS: Campaign[] = [
    { id: '1', title: '20% chegirma - Yangi yil', type: 'PROMOTION', status: 'ACTIVE', audience: 150, sent: 120, opened: 85, conversions: 24, startDate: '2024-02-01', endDate: '2024-02-15' },
    { id: '2', title: 'VIP mijozlarga maxsus', type: 'SMS', status: 'COMPLETED', audience: 45, sent: 45, opened: 38, conversions: 12, startDate: '2024-01-15' },
    { id: '3', title: 'Do\'st taklif qilish', type: 'REFERRAL', status: 'ACTIVE', audience: 200, sent: 0, opened: 0, conversions: 8, startDate: '2024-01-01' },
];

const SMS_TEMPLATES = [
    { id: '1', name: 'Eslatma', text: 'Hurmatli mijoz, ertaga soat {vaqt}da sizni kutamiz! - {biznes_nomi}' },
    { id: '2', name: 'Tug\'ilgan kun', text: 'Tug\'ilgan kuningiz muborak! Bugun sizga 15% chegirma taqdim etamiz! 🎂' },
    { id: '3', name: 'Qaytib keling', text: 'Sizni sog\'indik! Keyingi tashrifingizda 10% chegirma sizni kutmoqda.' },
];

interface MarketingHubProps {
    onClose: () => void;
}

const MarketingHub: React.FC<MarketingHubProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<'CAMPAIGNS' | 'SMS' | 'REFERRAL' | 'SOCIAL'>('CAMPAIGNS');
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [showCreateCampaign, setShowCreateCampaign] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    // Form State
    const [formTitle, setFormTitle] = useState('');
    const [formType, setFormType] = useState<Campaign['type']>('PROMOTION');
    const [formAudience, setFormAudience] = useState('');
    const [formStartDate, setFormStartDate] = useState('');
    const [formEndDate, setFormEndDate] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('solo_campaigns');
        if (saved) {
            setCampaigns(JSON.parse(saved));
        } else {
            setCampaigns(DEFAULT_CAMPAIGNS);
        }
    }, []);

    const saveToStorage = (newCampaigns: Campaign[]) => {
        setCampaigns(newCampaigns);
        localStorage.setItem('solo_campaigns', JSON.stringify(newCampaigns));
    };

    const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE').length;
    const totalReach = campaigns.reduce((sum, c) => sum + c.audience, 0);
    const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-emerald-100 text-emerald-700';
            case 'SCHEDULED': return 'bg-amber-100 text-amber-700';
            case 'COMPLETED': return 'bg-gray-100 text-gray-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'SMS': return <MessageSquare size={20} />;
            case 'PROMOTION': return <Gift size={20} />;
            case 'REFERRAL': return <Users size={20} />;
            default: return <Megaphone size={20} />;
        }
    };

    const handleCreate = () => {
        if (!formTitle || !formAudience || !formStartDate) return;

        const newCampaign: Campaign = {
            id: 'cmp-' + Date.now(),
            title: formTitle,
            type: formType,
            status: 'SCHEDULED', // Default to scheduled
            audience: parseInt(formAudience) || 0,
            sent: 0,
            opened: 0,
            conversions: 0,
            startDate: formStartDate,
            endDate: formEndDate
        };

        saveToStorage([...campaigns, newCampaign]);
        setShowCreateCampaign(false);
        resetForm();
    };

    const handleDelete = (id: string) => {
        if (confirm("Kampaniyani o'chirmoqchimisiz?")) {
            saveToStorage(campaigns.filter(c => c.id !== id));
        }
    };

    const resetForm = () => {
        setFormTitle('');
        setFormType('PROMOTION');
        setFormAudience('');
        setFormStartDate('');
        setFormEndDate('');
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-8 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 flex-none">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Marketing Markazi</h2>
                            <p className="text-sm font-bold text-gray-500 mt-1">Reklama va targ'ibot boshqaruvi</p>
                        </div>
                        <button onClick={onClose} className="p-3 bg-white dark:bg-slate-800 rounded-2xl hover:bg-gray-50">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl">
                            <div className="flex items-center gap-3 mb-2">
                                <Megaphone size={20} className="text-purple-600" />
                                <span className="text-xs font-black text-gray-400 uppercase">Faol kampaniyalar</span>
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white">{activeCampaigns}</h3>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl">
                            <div className="flex items-center gap-3 mb-2">
                                <Users size={20} className="text-indigo-600" />
                                <span className="text-xs font-black text-gray-400 uppercase">Jami auditoriya</span>
                            </div>
                            <h3 className="text-3xl font-black text-indigo-600">{totalReach}</h3>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl">
                            <div className="flex items-center gap-3 mb-2">
                                <TrendingUp size={20} className="text-emerald-600" />
                                <span className="text-xs font-black text-gray-400 uppercase">Konversiya</span>
                            </div>
                            <h3 className="text-3xl font-black text-emerald-600">{totalConversions}</h3>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 flex-none">
                    {[
                        { id: 'CAMPAIGNS', label: 'Kampaniyalar', icon: <Megaphone size={18} /> },
                        { id: 'SMS', label: 'SMS Marketing', icon: <MessageSquare size={18} /> },
                        { id: 'REFERRAL', label: 'Referal', icon: <Users size={18} /> },
                        { id: 'SOCIAL', label: 'Ijtimoiy', icon: <Share2 size={18} /> },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase flex items-center gap-2 transition-all ${activeTab === tab.id
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'bg-white dark:bg-slate-700 text-gray-500 hover:text-purple-600'
                                }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {activeTab === 'CAMPAIGNS' && (
                        <div className="space-y-4">
                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={() => setShowCreateCampaign(true)}
                                    className="px-6 py-3 bg-purple-600 text-white rounded-2xl font-black text-xs uppercase flex items-center gap-2 hover:bg-purple-700"
                                >
                                    <Plus size={18} /> Yangi Kampaniya
                                </button>
                            </div>

                            {campaigns.map(campaign => (
                                <div key={campaign.id} className="bg-gray-50 dark:bg-slate-800 p-6 rounded-3xl border-2 border-gray-100 dark:border-gray-700 hover:border-purple-300 transition-all group">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${campaign.type === 'PROMOTION' ? 'bg-pink-100 text-pink-600' :
                                                campaign.type === 'SMS' ? 'bg-indigo-100 text-indigo-600' :
                                                    'bg-amber-100 text-amber-600'
                                                }`}>
                                                {getTypeIcon(campaign.type)}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-lg text-gray-900 dark:text-white">{campaign.title}</h4>
                                                <p className="text-xs font-bold text-gray-400 mt-1">{campaign.startDate} {campaign.endDate ? `- ${campaign.endDate}` : ''}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase ${getStatusColor(campaign.status)}`}>
                                                {campaign.status}
                                            </span>
                                            <button onClick={() => handleDelete(campaign.id)} className="p-2 text-rose-500 bg-rose-50 rounded-xl hover:bg-rose-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="text-center p-3 bg-white dark:bg-slate-700 rounded-2xl">
                                            <p className="text-2xl font-black text-gray-900 dark:text-white">{campaign.audience}</p>
                                            <p className="text-xs font-bold text-gray-400">Auditoriya</p>
                                        </div>
                                        <div className="text-center p-3 bg-white dark:bg-slate-700 rounded-2xl">
                                            <p className="text-2xl font-black text-indigo-600">{campaign.sent}</p>
                                            <p className="text-xs font-bold text-gray-400">Yuborildi</p>
                                        </div>
                                        <div className="text-center p-3 bg-white dark:bg-slate-700 rounded-2xl">
                                            <p className="text-2xl font-black text-purple-600">{campaign.opened}</p>
                                            <p className="text-xs font-bold text-gray-400">O'qildi</p>
                                        </div>
                                        <div className="text-center p-3 bg-white dark:bg-slate-700 rounded-2xl">
                                            <p className="text-2xl font-black text-emerald-600">{campaign.conversions}</p>
                                            <p className="text-xs font-bold text-gray-400">Konversiya</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'SMS' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">SMS Shablonlar</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {SMS_TEMPLATES.map(template => (
                                    <div
                                        key={template.id}
                                        onClick={() => setSelectedTemplate(template.id)}
                                        className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${selectedTemplate === template.id
                                            ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-500'
                                            : 'bg-gray-50 dark:bg-slate-800 border-gray-100 dark:border-gray-700 hover:border-purple-300'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-black text-gray-900 dark:text-white">{template.name}</h4>
                                            {selectedTemplate === template.id && (
                                                <Check size={20} className="text-purple-600" />
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{template.text}</p>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full p-5 bg-purple-600 text-white rounded-3xl font-black uppercase text-sm flex items-center justify-center gap-3 hover:bg-purple-700 transition-colors">
                                <Send size={20} /> SMS Yuborish
                            </button>
                        </div>
                    )}

                    {activeTab === 'REFERRAL' && (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-8 rounded-3xl border-2 border-amber-200 dark:border-amber-800 text-center">
                                <Gift size={48} className="mx-auto text-amber-600 mb-4" />
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Do'st Taklif Qilish</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Har bir yangi mijoz uchun 10,000 so'm bonus oling!</p>

                                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl inline-block">
                                    <p className="text-xs font-bold text-gray-400 mb-2">Sizning referral kodingiz</p>
                                    <p className="text-3xl font-black text-amber-600 tracking-widest">SOLO2024</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-3xl text-center">
                                    <p className="text-4xl font-black text-emerald-600">8</p>
                                    <p className="text-sm font-bold text-gray-400 mt-2">Taklif qilingan</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-3xl text-center">
                                    <p className="text-4xl font-black text-purple-600">80,000</p>
                                    <p className="text-sm font-bold text-gray-400 mt-2">Yig'ilgan bonus (so'm)</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'SOCIAL' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <button className="p-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl text-white flex flex-col items-center gap-3 hover:scale-105 transition-transform">
                                    <Instagram size={48} />
                                    <span className="font-black text-lg">Instagram</span>
                                    <span className="text-sm opacity-80">1,240 obunachilar</span>
                                </button>

                                <button className="p-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl text-white flex flex-col items-center gap-3 hover:scale-105 transition-transform">
                                    <MessageSquare size={48} />
                                    <span className="font-black text-lg">Telegram</span>
                                    <span className="text-sm opacity-80">856 obunachilar</span>
                                </button>
                            </div>

                            <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-3xl">
                                <h4 className="font-black text-gray-900 dark:text-white mb-4">Ulashish</h4>
                                <div className="flex gap-3">
                                    <button className="flex-1 p-4 bg-white dark:bg-slate-700 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-colors">
                                        Ko'rib chiqish so'rash
                                    </button>
                                    <button className="flex-1 p-4 bg-white dark:bg-slate-700 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-colors">
                                        Story ulashish
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Create Campaign Modal */}
                {showCreateCampaign && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-6 z-50 animate-in fade-in">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md space-y-6">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white text-center">Yangi Kampaniya</h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Kampaniya nomi"
                                    value={formTitle}
                                    onChange={e => setFormTitle(e.target.value)}
                                    className="w-full p-5 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-purple-500 transition-all text-lg"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        value={formType}
                                        onChange={e => setFormType(e.target.value as any)}
                                        className="w-full p-5 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none text-gray-900 dark:text-white"
                                    >
                                        <option value="PROMOTION">Aksiya</option>
                                        <option value="SMS">SMS</option>
                                        <option value="REFERRAL">Referal</option>
                                    </select>
                                    <input
                                        type="number"
                                        placeholder="Auditoriya"
                                        value={formAudience}
                                        onChange={e => setFormAudience(e.target.value)}
                                        className="w-full p-5 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-purple-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="date"
                                        value={formStartDate}
                                        onChange={e => setFormStartDate(e.target.value)}
                                        className="w-full p-5 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-purple-500"
                                    />
                                    <input
                                        type="date"
                                        value={formEndDate}
                                        onChange={e => setFormEndDate(e.target.value)}
                                        className="w-full p-5 bg-gray-50 dark:bg-slate-700 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-purple-500"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setShowCreateCampaign(false)} className="flex-1 p-4 bg-gray-100 dark:bg-slate-700 rounded-2xl font-black text-xs uppercase tracking-wider text-gray-500 hover:bg-gray-200 transition-colors">Bekor qilish</button>
                                <button onClick={handleCreate} className="flex-1 p-4 bg-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200">Yaratish</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketingHub;
