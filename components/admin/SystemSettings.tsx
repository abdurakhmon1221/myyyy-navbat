
import React, { useState } from 'react';
import { Save, Lock, Bell, Globe, Database, Mail, Shield } from 'lucide-react';

const SystemSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'GENERAL' | 'SECURITY' | 'NOTIFICATIONS' | 'API'>('GENERAL');
    const [settings, setSettings] = useState({
        platformName: 'Navbat.pro',
        language: "O'zbekcha",
        timezone: 'Asia/Tashkent (GMT+5)',
        maintenance: false,
        minPasswordLength: 8,
        enable2FA: true,
        deviceCheck: true,
        publicApiKey: 'pk_live_51Msz...234sfd',
        webhookUrl: '',
        // Notification settings
        pushEnabled: true,
        smsEnabled: true,
        emailEnabled: false,
        voiceEnabled: true
    });

    const handleSave = () => {
        // In a real app, this would make an API call
        console.log('Saving settings:', settings);
        // Simulate success
        const btn = document.getElementById('save-btn');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = `<span class="flex items-center gap-2"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Saqlandi</span>`;
            btn.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
            btn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700');
                btn.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
            }, 2000);
        }
        alert("Sozlamalar muvaffaqiyatli saqlandi!");
    };

    return (
        <div className="space-y-6 animate-in fade-in max-w-5xl mx-auto pb-24">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tizim Sozlamalari</h1>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Global platforma konfiguratsiyasi</p>
            </header>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 space-y-2">
                    {[
                        { id: 'GENERAL', label: 'Umumiy', icon: Globe },
                        { id: 'SECURITY', label: 'Xavfsizlik', icon: Lock },
                        { id: 'NOTIFICATIONS', label: 'Bildirishnomalar', icon: Bell },
                        { id: 'API', label: 'API & Integratsiya', icon: Database },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === tab.id
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                : 'bg-white text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    {activeTab === 'GENERAL' && (
                        <div className="space-y-6 animate-in fade-in">
                            <h3 className="text-xl font-black text-gray-900 mb-6">Umumiy Sozlamalar</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Platforma Nomi</label>
                                    <input
                                        type="text"
                                        value={settings.platformName}
                                        onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                                        className="w-full bg-gray-50 p-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-500/20"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Asosiy Til</label>
                                        <select
                                            value={settings.language}
                                            onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                                            className="w-full bg-gray-50 p-4 rounded-2xl font-bold outline-none"
                                        >
                                            <option>O'zbekcha</option>
                                            <option>Русский</option>
                                            <option>English</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Vaqt Zonasi</label>
                                        <select
                                            value={settings.timezone}
                                            onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                                            className="w-full bg-gray-50 p-4 rounded-2xl font-bold outline-none"
                                        >
                                            <option>Asia/Tashkent (GMT+5)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <label className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded-lg text-indigo-600 accent-indigo-600"
                                            checked={settings.maintenance}
                                            onChange={(e) => setSettings({ ...settings, maintenance: e.target.checked })}
                                        />
                                        <span className="font-bold text-gray-700 text-sm">Texnik xizmat ko'rsatish rejimi</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'SECURITY' && (
                        <div className="space-y-6 animate-in fade-in">
                            <h3 className="text-xl font-black text-gray-900 mb-6">Xavfsizlik</h3>
                            <div className="bg-rose-50 p-4 rounded-2xl flex items-start gap-3 border border-rose-100 mb-6">
                                <Shield className="text-rose-600 mt-1" size={20} />
                                <div>
                                    <h4 className="font-black text-rose-700 text-sm">Administrator Huquqlari</h4>
                                    <p className="text-xs text-rose-600 mt-1 font-medium">Ushbu sozlamalar barcha tashkilotlar xavfsizligiga ta'sir qiladi.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Minimal Parol Uzunligi</label>
                                    <input
                                        type="number"
                                        value={settings.minPasswordLength}
                                        onChange={(e) => setSettings({ ...settings, minPasswordLength: parseInt(e.target.value) })}
                                        className="w-full bg-gray-50 p-4 rounded-2xl font-bold outline-none"
                                    />
                                </div>
                                <div className="pt-2">
                                    <label className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl cursor-pointer mb-2">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded-lg text-indigo-600 accent-indigo-600"
                                            checked={settings.enable2FA}
                                            onChange={(e) => setSettings({ ...settings, enable2FA: e.target.checked })}
                                        />
                                        <span className="font-bold text-gray-700 text-sm">2-Bosqichli Tasdiqlash (2FA)</span>
                                    </label>
                                    <label className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded-lg text-indigo-600 accent-indigo-600"
                                            checked={settings.deviceCheck}
                                            onChange={(e) => setSettings({ ...settings, deviceCheck: e.target.checked })}
                                        />
                                        <span className="font-bold text-gray-700 text-sm">Yangi qurilmalarni tekshirish</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'API' && (
                        <div className="space-y-6 animate-in fade-in">
                            <h3 className="text-xl font-black text-gray-900 mb-6">API Konfiguratsiyasi</h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-900 rounded-2xl overflow-hidden relative group">
                                    <div className="absolute top-2 right-2 px-2 py-1 bg-white/20 rounded text-[10px] text-white font-mono">READ-ONLY</div>
                                    <p className="text-gray-400 text-xs font-mono mb-2">Public API Key</p>
                                    <code className="text-emerald-400 font-mono text-sm block break-all">{settings.publicApiKey}</code>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Webhook URL</label>
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        value={settings.webhookUrl}
                                        onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
                                        className="w-full bg-gray-50 p-4 rounded-2xl font-bold outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'NOTIFICATIONS' && (
                        <div className="space-y-6 animate-in fade-in">
                            <h3 className="text-xl font-black text-gray-900 mb-6">Bildirishnomalar</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
                                    <div>
                                        <h4 className="font-bold text-gray-700 text-sm">Push Bildirishnomalar</h4>
                                        <p className="text-xs text-gray-400 mt-1">Brauzer orqali bildirishnomalar</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.pushEnabled ?? true}
                                            onChange={(e) => setSettings({ ...settings, pushEnabled: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
                                    <div>
                                        <h4 className="font-bold text-gray-700 text-sm">SMS Bildirishnomalar</h4>
                                        <p className="text-xs text-gray-400 mt-1">Telefon orqali xabarlar</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.smsEnabled ?? true}
                                            onChange={(e) => setSettings({ ...settings, smsEnabled: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
                                    <div>
                                        <h4 className="font-bold text-gray-700 text-sm">Email Bildirishnomalar</h4>
                                        <p className="text-xs text-gray-400 mt-1">Elektron pochta orqali xabarlar</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.emailEnabled ?? false}
                                            onChange={(e) => setSettings({ ...settings, emailEnabled: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
                                    <div>
                                        <h4 className="font-bold text-gray-700 text-sm">Ovozli Chaqiriq</h4>
                                        <p className="text-xs text-gray-400 mt-1">Navbat chaqirilganda ovozli xabar</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.voiceEnabled ?? true}
                                            onChange={(e) => setSettings({ ...settings, voiceEnabled: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-8 mt-8 border-t border-gray-100 flex justify-end">
                        <button
                            id="save-btn"
                            onClick={handleSave}
                            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs shadow-xl hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <Save size={18} /> Saqlash
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemSettings;
