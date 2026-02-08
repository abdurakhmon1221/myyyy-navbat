import React from 'react';
import { User, Building2, ChevronRight, Users, UserSquare2, ArrowLeft, Send, UserCircle2, ArrowRight, ShieldCheck, Smartphone, Clock, Bell, MapPin, Eye, Loader2, Info } from 'lucide-react';
import { UserRole } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import AboutModal from '../shared/AboutModal';

interface StepProps {
    onNavigate: (step: any) => void;
    onBack?: () => void;
    onLogin?: any;
}

// App intro/description component shown at the top of entry step
const AppIntro: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="text-center mb-8 animate-fade-in-up">
            <h2 className="text-lg font-black text-[var(--text-main)] tracking-tight mb-3">{t('app_tagline')}</h2>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed max-w-[280px] mx-auto font-bold">{t('app_description')}</p>

            {/* Feature highlights */}
            <div className="flex justify-center gap-6 mt-6">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                        <Clock size={18} className="text-emerald-500" />
                    </div>
                    <span className="text-[8px] text-[var(--text-muted)] font-black uppercase tracking-wide">Vaqt tejash</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                        <Bell size={18} className="text-indigo-500" />
                    </div>
                    <span className="text-[8px] text-[var(--text-muted)] font-black uppercase tracking-wide">Xabarnoma</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                        <MapPin size={18} className="text-amber-500" />
                    </div>
                    <span className="text-[8px] text-[var(--text-muted)] font-black uppercase tracking-wide">Yaqin joylar</span>
                </div>
            </div>
        </div>
    );
};

// Entry Step - Choose between Client and Organization
export const EntryStep: React.FC<StepProps & { setSelectedRole: (r: UserRole) => void }> = ({ onNavigate, setSelectedRole }) => {
    const { t } = useLanguage();
    const [showAbout, setShowAbout] = React.useState(false);

    return (
        <div className="space-y-6 animate-slide-up">
            <AppIntro />

            {/* Client Button */}
            <button
                onClick={() => { setSelectedRole(UserRole.CLIENT); onNavigate('CLIENT_METHOD'); }}
                className="w-full group relative overflow-hidden bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-[var(--border-main)] shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
            >
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-emerald-200 dark:shadow-none">
                        <User size={28} className="group-hover:rotate-6 transition-transform" />
                    </div>
                    <div className="text-left flex-1">
                        <h3 className="font-black text-[var(--text-main)] text-lg tracking-tight leading-none">{t('login_client')}</h3>
                        <p className="text-[10px] text-[var(--text-muted)] font-bold mt-1.5 leading-relaxed">{t('login_client_desc')}</p>
                    </div>
                    <ChevronRight className="text-gray-300 dark:text-gray-600 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" size={24} />
                </div>
            </button>

            {/* Organization Button */}
            <button
                onClick={() => onNavigate('BUSINESS_TYPE')}
                className="w-full group relative overflow-hidden bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-[var(--border-main)] shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
            >
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-indigo-200 dark:shadow-none">
                        <Building2 size={28} className="group-hover:rotate-6 transition-transform" />
                    </div>
                    <div className="text-left flex-1">
                        <h3 className="font-black text-[var(--text-main)] text-lg tracking-tight leading-none">{t('login_business')}</h3>
                        <p className="text-[10px] text-[var(--text-muted)] font-bold mt-1.5 leading-relaxed">{t('login_business_desc')}</p>
                    </div>
                    <ChevronRight className="text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" size={24} />
                </div>
            </button>

            {/* About Us Button */}
            <button
                onClick={() => setShowAbout(true)}
                className="w-full py-2 flex items-center justify-center gap-2 text-[var(--text-muted)] hover:text-emerald-500 transition-colors group"
            >
                <Info size={14} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Biz haqimizda</span>
            </button>

            {/* About Modal */}
            {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
        </div>
    );
};

// Client Method Step - Phone, Telegram, Google, Guest
export const ClientMethodStep: React.FC<StepProps & { onStartScanner: () => void, onGuestLogin: () => void, countryCode: string }> = ({ onNavigate, onBack, onStartScanner, onGuestLogin, countryCode }) => {
    const { t } = useLanguage();

    return (
        <div className="space-y-5 animate-slide-up">
            <button onClick={onBack} className="text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-2 group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> {t('back')}
            </button>

            <h3 className="font-black text-[var(--text-main)] text-xl tracking-tight text-center mb-6">{t('choose_login_method')}</h3>

            {/* Login Methods Grid */}
            <div className="grid grid-cols-2 gap-3">
                {/* Phone */}
                <button
                    onClick={() => onNavigate('OTP_VERIFY')}
                    className="bg-white dark:bg-slate-800 hover:scale-[1.02] p-5 rounded-[1.5rem] border border-[var(--border-main)] shadow-xl hover:shadow-2xl flex flex-col items-center gap-3 transition-all active:scale-95 group"
                >
                    <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-green-200 dark:shadow-none">
                        <Smartphone size={26} className="group-hover:rotate-6 transition-transform" />
                    </div>
                    <div className="text-center">
                        <span className="text-xs font-black text-[var(--text-main)] block">{t('phone_login')}</span>
                        <span className="text-[8px] text-[var(--text-muted)] font-bold mt-0.5 block">{countryCode}</span>
                    </div>
                </button>

                {/* Telegram */}
                <button
                    onClick={() => window.open('https://oauth.telegram.org/auth?bot_id=navbat_bot&origin=' + encodeURIComponent(window.location.origin), '_blank')}
                    className="bg-white dark:bg-slate-800 hover:scale-[1.02] p-5 rounded-[1.5rem] border border-[var(--border-main)] shadow-xl hover:shadow-2xl flex flex-col items-center gap-3 transition-all active:scale-95 group"
                >
                    <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-sky-200 dark:shadow-none">
                        <Send size={26} className="group-hover:rotate-6 transition-transform" />
                    </div>
                    <div className="text-center">
                        <span className="text-xs font-black text-[var(--text-main)] block">{t('telegram_login')}</span>
                        <span className="text-[8px] text-[var(--text-muted)] font-bold mt-0.5 block">{t('telegram_login_desc')}</span>
                    </div>
                </button>

                {/* Google */}
                <button
                    onClick={() => window.open('https://accounts.google.com/o/oauth2/auth?client_id=navbat-app&redirect_uri=' + encodeURIComponent(window.location.origin) + '&response_type=token&scope=email%20profile', '_blank')}
                    className="bg-white dark:bg-slate-800 hover:scale-[1.02] p-5 rounded-[1.5rem] border border-[var(--border-main)] shadow-xl hover:shadow-2xl flex flex-col items-center gap-3 transition-all active:scale-95 group"
                >
                    <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-orange-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-red-200 dark:shadow-none">
                        <svg className="w-6 h-6 group-hover:rotate-6 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <span className="text-xs font-black text-[var(--text-main)] block">{t('google_login')}</span>
                        <span className="text-[8px] text-[var(--text-muted)] font-bold mt-0.5 block">{t('google_login_desc')}</span>
                    </div>
                </button>

                {/* Guest */}
                <button
                    onClick={onGuestLogin}
                    className="bg-white dark:bg-slate-800 hover:scale-[1.02] p-5 rounded-[1.5rem] border border-[var(--border-main)] shadow-xl hover:shadow-2xl flex flex-col items-center gap-3 transition-all active:scale-95 group"
                >
                    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-slate-500 mb-3 group-hover:scale-110 transition-transform">
                        <Eye size={26} className="group-hover:rotate-6 transition-transform" />
                    </div>
                    <div className="text-center">
                        <span className="text-xs font-black text-[var(--text-main)] block">{t('guest_login')}</span>
                        <span className="text-[8px] text-[var(--text-muted)] font-bold mt-0.5 block">{t('guest_login_desc')}</span>
                    </div>
                </button>
            </div>
        </div>
    );
};

// Business Type Step - Organization or Solo
export const BusinessTypeStep: React.FC<StepProps & { setBusinessType: (t: any) => void, setSelectedRole?: (r: UserRole) => void }> = ({ onNavigate, onBack, setBusinessType, setSelectedRole }) => {
    const { t } = useLanguage();

    return (
        <div className="space-y-5 animate-slide-up">
            <button onClick={onBack} className="text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-4 group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> {t('back')}
            </button>

            <div className="space-y-4">
                {/* Organization */}
                <button
                    onClick={() => { setBusinessType('CORPORATE'); onNavigate('CORP_ROLE'); }}
                    className="w-full bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-[var(--border-main)] shadow-xl hover:shadow-2xl hover:scale-[1.02] text-left transition-all flex items-center gap-5 group"
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-indigo-200 dark:shadow-none">
                        <Building2 size={32} className="group-hover:rotate-6 transition-transform" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-black text-[var(--text-main)] text-lg">{t('business_corporate')}</h4>
                        <p className="text-[10px] text-[var(--text-muted)] font-bold mt-1 leading-relaxed">{t('business_corporate_desc')}</p>
                    </div>
                    <ChevronRight className="text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" size={22} />
                </button>

                {/* Solo Entrepreneur */}
                <button
                    onClick={() => { setBusinessType('SOLO'); setSelectedRole?.(UserRole.COMPANY); onNavigate('BUSINESS_OTP'); }}
                    className="w-full bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-[var(--border-main)] shadow-xl hover:shadow-2xl hover:scale-[1.02] text-left transition-all flex items-center gap-5 group"
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-amber-200 dark:shadow-none">
                        <UserSquare2 size={32} className="group-hover:rotate-6 transition-transform" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-black text-[var(--text-main)] text-lg">{t('business_solo')}</h4>
                        <p className="text-[10px] text-[var(--text-muted)] font-bold mt-1 leading-relaxed">{t('business_solo_desc')}</p>
                    </div>
                    <ChevronRight className="text-gray-300 dark:text-gray-600 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" size={22} />
                </button>
            </div>
        </div>
    );
};

// Corp Role Step - Admin or Employee
export const CorpRoleStep: React.FC<StepProps & { setSelectedRole: (r: UserRole) => void }> = ({ onNavigate, onBack, setSelectedRole }) => {
    const { t } = useLanguage();

    return (
        <div className="space-y-5 animate-slide-up">
            <button onClick={onBack} className="text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-4 group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> {t('back')}
            </button>

            <div className="space-y-4">
                {/* Admin */}
                <button
                    onClick={() => { setSelectedRole(UserRole.COMPANY); onNavigate('BUSINESS_OTP'); }}
                    className="w-full bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-[var(--border-main)] shadow-xl hover:shadow-2xl hover:scale-[1.02] text-left transition-all flex items-center gap-5 group"
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-violet-400 to-violet-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-violet-200 dark:shadow-none">
                        <ShieldCheck size={32} className="group-hover:rotate-6 transition-transform" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-black text-[var(--text-main)] text-lg">{t('role_org_admin')}</h4>
                        <p className="text-[10px] text-[var(--text-muted)] font-bold mt-1 leading-relaxed">{t('role_org_admin_desc')}</p>
                    </div>
                    <ChevronRight className="text-gray-300 dark:text-gray-600 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" size={22} />
                </button>

                {/* Employee with invite code */}
                <button
                    onClick={() => { setSelectedRole(UserRole.EMPLOYEE); onNavigate('EMPLOYEE_INVITE'); }}
                    className="w-full bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-[var(--border-main)] shadow-xl hover:shadow-2xl hover:scale-[1.02] text-left transition-all flex items-center gap-5 group"
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-cyan-200 dark:shadow-none">
                        <Users size={32} className="group-hover:rotate-6 transition-transform" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-black text-[var(--text-main)] text-lg">{t('role_employee')}</h4>
                        <p className="text-[10px] text-[var(--text-muted)] font-bold mt-1 leading-relaxed">Taklif kodi orqali kirish</p>
                    </div>
                    <ChevronRight className="text-gray-300 dark:text-gray-600 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" size={22} />
                </button>
            </div>
        </div>
    );
};

// Employee Invite Code Step
export const EmployeeInviteStep: React.FC<StepProps & { onVerifyCode: (code: string) => void }> = ({ onBack, onVerifyCode }) => {
    const [inviteCode, setInviteCode] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleVerify = async () => {
        if (inviteCode.length < 4) {
            setError("Kodni to'liq kiriting");
            return;
        }
        setIsLoading(true);
        setError(null);

        // Simulate verification - in production this would call API
        setTimeout(() => {
            // For demo, accept any 6-char code
            if (inviteCode.length >= 4) {
                onVerifyCode(inviteCode);
            } else {
                setError("Noto'g'ri kod");
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="space-y-6 animate-slide-up">
            <button onClick={onBack} className="text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Orqaga
            </button>

            <div className="text-center space-y-2 mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-cyan-200 dark:shadow-none mb-4">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                    </svg>
                </div>
                <h3 className="font-black text-[var(--text-main)] text-2xl tracking-tight">Taklif Kodi</h3>
                <p className="text-[11px] text-[var(--text-muted)] font-bold">Administrator sizga bergan kodni kiriting</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-xl border border-[var(--border-main)] space-y-5">
                {error && (
                    <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 p-4 rounded-2xl text-sm font-bold text-center">
                        {error}
                    </div>
                )}

                <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase().slice(0, 8))}
                    placeholder="ABCD12"
                    className="w-full text-center text-3xl font-[1000] tracking-[0.5em] bg-gray-50 dark:bg-slate-900 p-6 rounded-2xl outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all text-[var(--text-main)] placeholder:text-gray-300 placeholder:tracking-[0.3em]"
                    autoFocus
                />

                <button
                    onClick={handleVerify}
                    disabled={inviteCode.length < 4 || isLoading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 disabled:from-gray-200 disabled:to-gray-300 text-white disabled:text-gray-400 py-5 rounded-2xl font-black uppercase text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <><Loader2 size={18} className="animate-spin" /> Tekshirilmoqda...</>
                    ) : (
                        <><ArrowRight size={18} /> Kirish</>
                    )}
                </button>
            </div>
        </div>
    );
};

// OTP Verify Step with auto country code
export const OtpVerifyStep: React.FC<StepProps & {
    phone: string,
    setPhone: (v: string) => void,
    otp: string,
    setOtp: (v: string) => void,
    showOtp: boolean,
    onNext: () => void,
    onVerify: () => void,
    countryConfig: { code: string, flag: string, length: number },
    isLoading?: boolean
}> = ({ onBack, phone, setPhone, otp, setOtp, showOtp, onNext, onVerify, countryConfig, isLoading }) => {
    const { t } = useLanguage();

    const formatPhone = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, countryConfig.length);
        if (digits.length <= 2) return digits;
        if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
        if (digits.length <= 7) return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
        return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
    };

    return (
        <div className="space-y-6 animate-slide-up">
            <button onClick={onBack} className="text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> {t('back')}
            </button>

            {!showOtp ? (
                <>
                    <div className="text-center space-y-2 mb-8">
                        <h3 className="font-black text-[var(--text-main)] text-2xl tracking-tight">{t('enter_phone')}</h3>
                        <p className="text-[11px] text-[var(--text-muted)] font-bold">{t('otp_sent')}</p>
                    </div>

                    <div className="space-y-6 bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-xl border border-[var(--border-main)]">
                        {/* Phone Input with Country Code */}
                        <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus-within:border-emerald-500/20 rounded-2xl p-4 transition-all">
                            <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-[var(--border-main)]">
                                <span className="text-lg">{countryConfig.flag}</span>
                                <span className="text-[var(--text-main)] font-bold text-sm">{countryConfig.code}</span>
                            </div>
                            <input
                                type="tel"
                                value={formatPhone(phone)}
                                onChange={(e) => {
                                    const digits = e.target.value.replace(/\D/g, '');
                                    if (digits.length <= countryConfig.length) {
                                        setPhone(digits);
                                    }
                                }}
                                placeholder="90 123 45 67"
                                maxLength={countryConfig.length + 3}
                                className="flex-1 bg-transparent border-none outline-none text-[var(--text-main)] font-black text-lg tracking-wider placeholder:text-gray-300"
                            />
                        </div>

                        <button
                            onClick={onNext}
                            disabled={phone.replace(/\D/g, '').length < countryConfig.length || isLoading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-100 disabled:text-gray-400 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-200/50 dark:shadow-none active:scale-95 transition-all disabled:cursor-not-allowed flex items-center justify-center gap-3 disabled:shadow-none"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : t('get_code')}
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="text-center space-y-2 mb-8">
                        <h3 className="font-black text-[var(--text-main)] text-2xl tracking-tight">{t('verification')}</h3>
                        <p className="text-[11px] text-[var(--text-muted)] font-bold">
                            {countryConfig.code} {formatPhone(phone)} {t('code_sent_to')}
                        </p>
                    </div>

                    <div className="space-y-6 bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-xl border border-[var(--border-main)]">
                        {/* OTP Input */}
                        <div className="flex justify-center gap-2">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <input
                                    key={i}
                                    type="text"
                                    maxLength={1}
                                    value={otp[i] || ''}
                                    onChange={(e) => {
                                        const newOtp = otp.split('');
                                        newOtp[i] = e.target.value;
                                        setOtp(newOtp.join(''));
                                        if (e.target.value && e.target.nextElementSibling) {
                                            (e.target.nextElementSibling as HTMLInputElement).focus();
                                        }
                                    }}
                                    className="w-12 h-14 bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-emerald-500/50 rounded-xl text-[var(--text-main)] font-black text-2xl text-center outline-none transition-all ring-4 ring-transparent focus:ring-emerald-500/10"
                                />
                            ))}
                        </div>

                        <button
                            onClick={onVerify}
                            disabled={otp.length < 5}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-100 disabled:text-gray-400 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-200/50 dark:shadow-none active:scale-95 transition-all disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            {t('verify')}
                        </button>

                        <div className="flex items-center justify-center gap-3">
                            <button className="text-[10px] font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                                {t('resend_code')}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

// Password Step
export const PasswordStep: React.FC<StepProps & { password: string, setPassword: (p: string) => void, onLogin: () => void, title?: string }> = ({ onBack, password, setPassword, onLogin, title }) => {
    const { t } = useLanguage();
    const displayTitle = title || t('personal_password');

    return (
        <div className="space-y-6 animate-slide-up">
            <button onClick={onBack} className="text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-2 text-[10px] font-black uppercase tracking-widest group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> {t('back')}
            </button>

            <div className="text-center space-y-2 mb-8">
                <h3 className="font-black text-[var(--text-main)] text-2xl tracking-tight">{displayTitle}</h3>
                <p className="text-[11px] text-[var(--text-muted)] font-bold">{t('enter_password_desc')}</p>
            </div>

            <div className="space-y-6 bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-xl border border-[var(--border-main)]">
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                        <ShieldCheck size={20} />
                    </div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-emerald-500/20 rounded-2xl py-4 pl-12 pr-4 text-[var(--text-main)] font-black text-xl tracking-[0.2em] outline-none transition-all placeholder:text-gray-300"
                    />
                </div>

                <button
                    onClick={onLogin}
                    disabled={password.length < 4}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-100 disabled:text-gray-400 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-200/50 dark:shadow-none active:scale-95 transition-all disabled:cursor-not-allowed flex items-center justify-center gap-3 disabled:shadow-none"
                >
                    Kirish <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};
