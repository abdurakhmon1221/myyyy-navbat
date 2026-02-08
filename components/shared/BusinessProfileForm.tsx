import React, { useState, useEffect, useRef } from 'react';
import {
    Building2, Phone, Globe, MapPin, Send, Instagram,
    Camera, Save, Loader2, Tag, Clock, Link2, Locate,
    Mail, Hash, Users, CheckCircle, Image as ImageIcon
} from 'lucide-react';

export interface BusinessProfile {
    id: string;
    name: string;
    slug?: string;
    phone: string;
    email?: string;
    website?: string;
    address: string;
    telegram?: string;
    instagram?: string;
    category: string;
    description?: string;
    workingHours?: {
        start: string;
        end: string;
        days: string[];
    };
    image?: string;
    avgServiceTime?: number;
    maxQueueSize?: number;
    location?: { lat: number, lng: number };
}

export const BUSINESS_CATEGORIES = [
    { id: 'MEDICAL', label: 'Tibbiyot', icon: '🏥' },
    { id: 'BANK', label: 'Bank', icon: '🏦' },
    { id: 'GOVERNMENT', label: 'Davlat xizmatlari', icon: '🏛️' },
    { id: 'BEAUTY', label: 'Go\'zallik saloni', icon: '💅' },
    { id: 'RESTAURANT', label: 'Restoran/Kafe', icon: '🍽️' },
    { id: 'EDUCATION', label: 'Ta\'lim', icon: '🎓' },
    { id: 'REPAIR', label: 'Ta\'mirlash', icon: '🔧' },
    { id: 'LEGAL', label: 'Huquqiy xizmatlar', icon: '⚖️' },
    { id: 'CAR', label: 'Avto xizmatlar', icon: '🚗' },
    { id: 'OTHER', label: 'Boshqa', icon: '📦' }
];

interface BusinessProfileFormProps {
    profile: Partial<BusinessProfile>;
    onSave: (profile: BusinessProfile) => Promise<void>;
    isLoading?: boolean;
}

const BusinessProfileForm: React.FC<BusinessProfileFormProps> = ({
    profile,
    onSave,
    isLoading = false
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<Partial<BusinessProfile>>({
        name: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        telegram: '',
        instagram: '',
        category: 'OTHER',
        description: '',
        avgServiceTime: 15,
        maxQueueSize: 50,
        ...profile
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormData(prev => ({ ...prev, ...profile }));
        }
    }, [profile]);

    const handleChange = (field: keyof BusinessProfile, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleChange('image', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGetLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    handleChange('location', { lat: latitude, lng: longitude });
                    if (!formData.address) {
                        handleChange('address', `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
                    }
                    alert("Joylashuv aniqlandi!");
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Joylashuvni aniqlab bo'lmadi. Iltimos, ruxsat bering.");
                }
            );
        } else {
            alert("Sizning brauzeringiz joylashuvni qo'llab-quvvatlamaydi.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Enhanced validation
        const errors: string[] = [];

        // Name validation
        if (!formData.name || formData.name.trim().length < 3) {
            errors.push("Tashkilot nomi kamida 3 ta belgidan iborat bo'lishi kerak");
        }

        // Address validation
        if (!formData.address || formData.address.trim().length < 5) {
            errors.push("Manzil kamida 5 ta belgidan iborat bo'lishi kerak");
        }

        // Phone validation (if provided)
        if (formData.phone) {
            const cleanPhone = formData.phone.replace(/\D/g, '');
            if (cleanPhone.length > 0 && (cleanPhone.length < 9 || cleanPhone.length > 12)) {
                errors.push("Telefon raqami noto'g'ri formatda (9-12 raqam)");
            }
        }

        // Email validation (if provided)
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.push("Email formati noto'g'ri");
        }

        // Category validation
        if (!formData.category || formData.category === '') {
            errors.push("Kategoriya tanlanishi shart");
        }

        // If there are errors, show them
        if (errors.length > 0) {
            alert("⚠️ Ma'lumotlarni to'g'rilang:\n\n• " + errors.join('\n• '));
            return;
        }

        setSaving(true);
        try {
            const slug = formData.name
                ?.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .substring(0, 50);

            await onSave({
                ...formData,
                id: formData.id || `ORG${Date.now()}`,
                slug,
                name: formData.name!.trim(),
                phone: formData.phone || '',
                address: formData.address!.trim(),
                category: formData.category || 'OTHER'
            } as BusinessProfile);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Save failed:', error);
            alert('Saqlashda xatolik yuz berdi');
        } finally {
            setSaving(false);
        }
    };

    const inputClass = "w-full bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-2xl p-4 font-medium text-gray-900 dark:text-white outline-none transition-all";
    const labelClass = "text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2";

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in pb-32">
            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
            />

            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                    Biznes Profili
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tashkilotingiz ma'lumotlarini to'ldiring
                </p>
            </div>

            {/* Logo Upload */}
            <section className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden border-4 border-emerald-100 dark:border-emerald-900/30 shadow-xl bg-gradient-to-br from-emerald-400 to-teal-600">
                            {formData.image ? (
                                <img src={formData.image} className="w-full h-full object-cover" alt="Logo" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white text-3xl font-black">
                                    {formData.name?.charAt(0) || '?'}
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-2 -right-2 p-3 bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 rounded-xl shadow-lg border border-gray-100 dark:border-slate-600 hover:scale-110 transition-transform"
                        >
                            <Camera size={18} />
                        </button>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-black text-gray-900 dark:text-white text-lg">
                            {formData.name || 'Tashkilot nomi'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formData.category ? BUSINESS_CATEGORIES.find(c => c.id === formData.category)?.label : 'Kategoriya tanlanmagan'}
                        </p>
                        {formData.image && (
                            <button
                                type="button"
                                onClick={() => handleChange('image', '')}
                                className="text-xs text-red-500 mt-1 hover:underline"
                            >
                                Rasmni o'chirish
                            </button>
                        )}
                    </div>
                </div>

            </section>

            {/* Basic Info */}
            <section className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm space-y-5">
                <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Building2 size={20} className="text-emerald-500" />
                    Asosiy ma'lumotlar
                </h3>

                <div>
                    <label className={labelClass}>
                        <Building2 size={14} /> Tashkilot nomi *
                    </label>
                    <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Masalan: Shavkat Sartaroshxonasi"
                        className={inputClass}
                        required
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Bu nom barcha joylarda ko'rinadi (Google, Mijozlar ro'yxati, Dashboard)
                    </p>
                </div>

                <div>
                    <label className={labelClass}>
                        <Tag size={14} /> Kategoriya
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {BUSINESS_CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => handleChange('category', cat.id)}
                                className={`p-3 rounded-xl border-2 text-left transition-all flex items-center gap-2 ${formData.category === cat.id
                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                                    : 'border-gray-100 dark:border-slate-700 hover:border-gray-200'
                                    }`}
                            >
                                <span className="text-xl">{cat.icon}</span>
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className={labelClass}>
                        <Hash size={14} /> Qisqacha tavsif
                    </label>
                    <textarea
                        value={formData.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Tashkilotingiz haqida qisqacha... (ixtiyoriy)"
                        rows={3}
                        className={inputClass + " resize-none"}
                    />
                </div>
            </section>

            {/* Contact Info */}
            <section className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm space-y-5">
                <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Phone size={20} className="text-blue-500" />
                    Aloqa ma'lumotlari
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>
                            <Phone size={14} /> Telefon raqam
                        </label>
                        <input
                            type="tel"
                            value={formData.phone || ''}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            placeholder="+998 90 123 45 67 (ixtiyoriy)"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
                            <Mail size={14} /> Email
                        </label>
                        <input
                            type="email"
                            value={formData.email || ''}
                            onChange={(e) => handleChange('email', e.target.value)}
                            placeholder="info@example.com (ixtiyoriy)"
                            className={inputClass}
                        />
                    </div>
                </div>

                <div>
                    <label className={labelClass}>
                        <MapPin size={14} /> Manzil *
                    </label>

                    {/* Auto-detect button */}
                    <button
                        type="button"
                        onClick={async () => {
                            if ('geolocation' in navigator) {
                                navigator.geolocation.getCurrentPosition(
                                    async (position) => {
                                        const { latitude, longitude } = position.coords;
                                        handleChange('location', { lat: latitude, lng: longitude });

                                        // Reverse geocoding via Nominatim
                                        try {
                                            const res = await fetch(
                                                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=uz`
                                            );
                                            const data = await res.json();
                                            if (data.address) {
                                                const city = data.address.city || data.address.town || data.address.village || data.address.county || '';
                                                const district = data.address.suburb || data.address.neighbourhood || data.address.district || '';
                                                const road = data.address.road || '';
                                                const autoAddress = [city, district, road].filter(Boolean).join(', ');
                                                handleChange('address', autoAddress);
                                            }
                                        } catch (err) {
                                            console.log('Geocoding failed:', err);
                                            handleChange('address', `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
                                        }
                                    },
                                    (error) => {
                                        console.error("Error getting location:", error);
                                        alert("Joylashuvni aniqlab bo'lmadi. Iltimos, ruxsat bering.");
                                    }
                                );
                            } else {
                                alert("Sizning brauzeringiz joylashuvni qo'llab-quvvatlamaydi.");
                            }
                        }}
                        className="w-full mb-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-3 rounded-2xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors font-bold text-sm flex items-center justify-center gap-2"
                    >
                        <Locate size={18} /> Joylashuvni avtomatik aniqlash
                    </button>

                    {/* Main address field (auto-filled, editable) */}
                    <input
                        type="text"
                        value={formData.address || ''}
                        onChange={(e) => handleChange('address', e.target.value)}
                        placeholder="Shahar, tuman, ko'cha (avtomatik aniqlanadi)"
                        className={`${inputClass} mb-3`}
                        required
                    />

                    {/* Building/Apartment - manual entry */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] text-gray-400 font-bold mb-1 block">Uy/Bino raqami</label>
                            <input
                                type="text"
                                placeholder="Masalan: 15A"
                                className={inputClass}
                                onChange={(e) => {
                                    const building = e.target.value;
                                    if (building && formData.address && !formData.address.includes(building)) {
                                        // Append to address if not already there
                                    }
                                }}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-400 font-bold mb-1 block">Xona/Ofis raqami</label>
                            <input
                                type="text"
                                placeholder="Masalan: 203"
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {formData.location && (
                        <p className="text-xs text-emerald-500 mt-3 font-bold flex items-center gap-1">
                            <CheckCircle size={12} /> Koordinatalar saqlandi: {formData.location.lat.toFixed(4)}, {formData.location.lng.toFixed(4)}
                        </p>
                    )}
                </div>

                <div>
                    <label className={labelClass}>
                        <Globe size={14} /> Veb-sayt
                    </label>
                    <input
                        type="text"
                        value={formData.website || ''}
                        onChange={(e) => handleChange('website', e.target.value)}
                        placeholder="https://example.com yoki example.com (ixtiyoriy)"
                        className={inputClass}
                    />
                </div>
            </section>

            {/* Social Media */}
            <section className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm space-y-5">
                <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Link2 size={20} className="text-sky-500" />
                    Ijtimoiy tarmoqlar
                </h3>
                <p className="text-xs text-gray-400 -mt-3">Username yoki to'liq link kiritishingiz mumkin</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>
                            <Send size={14} /> Telegram
                        </label>
                        <input
                            type="text"
                            value={formData.telegram || ''}
                            onChange={(e) => handleChange('telegram', e.target.value)}
                            placeholder="@username yoki t.me/username (ixtiyoriy)"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
                            <Instagram size={14} /> Instagram
                        </label>
                        <input
                            type="text"
                            value={formData.instagram || ''}
                            onChange={(e) => handleChange('instagram', e.target.value)}
                            placeholder="@username yoki instagram.com/username (ixtiyoriy)"
                            className={inputClass}
                        />
                    </div>
                </div>
            </section>

            {/* Queue Settings */}
            <section className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm space-y-5">
                <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Clock size={20} className="text-amber-500" />
                    Navbat sozlamalari
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>
                            <Clock size={14} /> O'rtacha xizmat vaqti (daqiqa)
                        </label>
                        <input
                            type="number"
                            value={formData.avgServiceTime || 15}
                            onChange={(e) => handleChange('avgServiceTime', parseInt(e.target.value) || 15)}
                            min={1}
                            max={180}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
                            <Users size={14} /> Maksimum navbat soni
                        </label>
                        <input
                            type="number"
                            value={formData.maxQueueSize || 50}
                            onChange={(e) => handleChange('maxQueueSize', parseInt(e.target.value) || 50)}
                            min={1}
                            max={500}
                            className={inputClass}
                        />
                    </div>
                </div>
            </section>

            {/* Save Button */}
            <button
                type="submit"
                disabled={saving || isLoading}
                className={`w-full py-5 rounded-2xl font-black text-white shadow-xl transition-all flex items-center justify-center gap-3 ${saved
                    ? 'bg-emerald-500'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'
                    } disabled:opacity-50`}
            >
                {saving ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        Saqlanmoqda...
                    </>
                ) : saved ? (
                    <>
                        <CheckCircle size={20} />
                        Saqlandi!
                    </>
                ) : (
                    <>
                        <Save size={20} />
                        SAQLASH
                    </>
                )}
            </button>
        </form>
    );
};

export default BusinessProfileForm;
