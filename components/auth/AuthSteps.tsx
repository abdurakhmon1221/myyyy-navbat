import React from 'react';
import { User, Building2, ChevronRight, Users, UserSquare2, ArrowLeft, Send, UserCircle2, ArrowRight, ShieldCheck, Smartphone, Clock, Bell, MapPin, Eye } from 'lucide-react';
import { UserRole } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

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
            <h2 className="text-lg font-black text-white/90 tracking-tight mb-3">{t('app_tagline')}</h2>
            <p className="text-[11px] text-white/50 leading-relaxed max-w-[280px] mx-auto">{t('app_description')}</p>

            {/* Feature highlights */}
            <div className="flex justify-center gap-6 mt-6">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <Clock size={18} className="text-emerald-300" />
                    </div>
                    <span className="text-[8px] text-white/40 font-bold uppercase tracking-wide">Vaqt tejash</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <Bell size={18} className="text-emerald-300" />
                    </div>
                    <span className="text-[8px] text-white/40 font-bold uppercase tracking-wide">Xabarnoma</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <MapPin size={18} className="text-emerald-300" />
                    </div>
                    <span className="text-[8px] text-white/40 font-bold uppercase tracking-wide">Yaqin joylar</span>
                </div>
            </div>
        </div>
    );
};

// Entry Step - Choose between Client and Organization
export const EntryStep: React.FC<StepProps & { setSelectedRole: (r: UserRole) => void }> = ({ onNavigate, setSelectedRole }) => {
    const { t } = useLanguage();

    return (
        <div className="space-y-6 animate-slide-up">
            <AppIntro />

            {/* Client Button */}
            <button
                onClick={() => { setSelectedRole(UserRole.CLIENT); onNavigate('CLIENT_METHOD'); }}
                className="w-full group relative overflow-hidden bg-gradient-to-br from-white/20 to-white/5 hover:from-white/30 hover:to-white/10 border border-white/20 hover:border-white/40 p-5 rounded-[2rem] transition-all duration-300 active:scale-95"
            >
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-400/30 to-emerald-600/20 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg border border-emerald-400/30">
                        <User size={28} className="group-hover:rotate-6 transition-transform" />
                    </div>
                    <div className="text-left flex-1">
                        <h3 className="font-black text-white text-lg tracking-tight leading-none">{t('login_client')}</h3>
                        <p className="text-[10px] text-white/50 font-medium mt-1.5 leading-relaxed">{t('login_client_desc')}</p>
                    </div>
                    <ChevronRight className="text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all" size={24} />
                </div>
            </button>

            {/* Organization Button */}
            <button
                onClick={() => onNavigate('BUSINESS_TYPE')}
                className="w-full group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border border-white/20 hover:border-white/40 p-5 rounded-[2rem] transition-all duration-300 active:scale-95"
            >
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-400/30 to-indigo-600/20 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg border border-indigo-400/30">
                        <Building2 size={28} className="group-hover:rotate-6 transition-transform" />
                    </div>
                    <div className="text-left flex-1">
                        <h3 className="font-black text-white text-lg tracking-tight leading-none">{t('login_business')}</h3>
                        <p className="text-[10px] text-white/50 font-medium mt-1.5 leading-relaxed">{t('login_business_desc')}</p>
                    </div>
                    <ChevronRight className="text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all" size={24} />
                </div>
            </button>
        </div>
    );
};

// Client Method Step - Phone, Telegram, Google, Guest
export const ClientMethodStep: React.FC<StepProps & { onStartScanner: () => void, onGuestLogin: () => void, countryCode: string }> = ({ onNavigate, onBack, onStartScanner, onGuestLogin, countryCode }) => {
    const { t } = useLanguage();

    return (
        <div className="space-y-5 animate-slide-up">
            <button onClick={onBack} className="text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-2 group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> {t('back')}
            </button>

            <h3 className="font-black text-white text-xl tracking-tight text-center mb-6">{t('choose_login_method')}</h3>

            {/* Login Methods Grid */}
            <div className="grid grid-cols-2 gap-3">
                {/* Phone */}
                <button
                    onClick={() => onNavigate('OTP_VERIFY')}
                    className="bg-white/10 hover:bg-white/20 p-5 rounded-[1.5rem] border border-white/20 hover:border-white/40 flex flex-col items-center gap-3 transition-all active:scale-95 group"
                >
                    <div className="w-14 h-14 bg-gradient-to-br from-green-400/30 to-green-600/20 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform border border-green-400/30">
                        <Smartphone size={26} className="group-hover:rotate-6 transition-transform" />
                    </div>
                    <div className="text-center">
                        <span className="text-xs font-black text-white block">{t('phone_login')}</span>
                        <span className="text-[8px] text-white/40 font-medium mt-0.5 block">{countryCode}</span>
                    </div>
                </button>

                {/* Telegram */}
                <button
                    onClick={() => onNavigate('OTP_VERIFY')}
                    className="bg-white/10 hover:bg-white/20 p-5 rounded-[1.5rem] border border-white/20 hover:border-white/40 flex flex-col items-center gap-3 transition-all active:scale-95 group"
                >
                    <div className="w-14 h-14 bg-gradient-to-br from-sky-400/30 to-sky-600/20 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform border border-sky-400/30">
                        <Send size={26} className="group-hover:rotate-6 transition-transform" />
                    </div>
                    <div className="text-center">
                        <span className="text-xs font-black text-white block">{t('telegram_login')}</span>
                        <span className="text-[8px] text-white/40 font-medium mt-0.5 block">{t('telegram_login_desc')}</span>
                    </div>
                </button>

                {/* Google */}
                <button
                    onClick={() => onNavigate('OTP_VERIFY')}
                    className="bg-white/10 hover:bg-white/20 p-5 rounded-[1.5rem] border border-white/20 hover:border-white/40 flex flex-col items-center gap-3 transition-all active:scale-95 group"
                >
                    <div className="w-14 h-14 bg-gradient-to-br from-red-400/30 to-orange-600/20 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform border border-red-400/30">
                        <svg className="w-6 h-6 group-hover:rotate-6 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <span className="text-xs font-black text-white block">{t('google_login')}</span>
                        <span className="text-[8px] text-white/40 font-medium mt-0.5 block">{t('google_login_desc')}</span>
                    </div>
                </button>

                {/* Guest */}
                <button
                    onClick={onGuestLogin}
                    className="bg-white/5 hover:bg-white/10 p-5 rounded-[1.5rem] border border-white/10 hover:border-white/20 flex flex-col items-center gap-3 transition-all active:scale-95 group"
                >
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white/60 group-hover:scale-110 transition-transform border border-white/10">
                        <Eye size={26} className="group-hover:rotate-6 transition-transform" />
                    </div>
                    <div className="text-center">
                        <span className="text-xs font-black text-white/70 block">{t('guest_login')}</span>
                        <span className="text-[8px] text-white/30 font-medium mt-0.5 block">{t('guest_login_desc')}</span>
                    </div>
                </button>
            </div>
        </div>
    );
};

// Business Type Step - Organization or Solo
export const BusinessTypeStep: React.FC<StepProps & { setBusinessType: (t: any) => void }> = ({ onNavigate, onBack, setBusinessType }) => {
    const { t } = useLanguage();

    return (
        <div className="space-y-5 animate-slide-up">
            <button onClick={onBack} className="text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-4 group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> {t('back')}
            </button>

            <div className="space-y-4">
                {/* Organization */}
                <button
                    onClick={() => { setBusinessType('CORPORATE'); onNavigate('CORP_ROLE'); }}
                    className="w-full bg-gradient-to-br from-white/15 to-white/5 hover:from-white/25 hover:to-white/10 p-6 rounded-[2rem] border border-white/20 hover:border-white/40 text-left transition-all flex items-center gap-5 group"
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-400/30 to-indigo-600/20 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg border border-indigo-400/30">
                        <Building2 size={32} className="group-hover:rotate-6 transition-transform" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-black text-white text-lg">{t('business_corporate')}</h4>
                        <p className="text-[10px] text-white/50 font-medium mt-1 leading-relaxed">{t('business_corporate_desc')}</p>
                    </div>
                    <ChevronRight className="text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all" size={22} />
                </button>

                {/* Solo Entrepreneur */}
                <button
                    onClick={() => { setBusinessType('SOLO'); onNavigate('PASSWORD_ENTRY'); }}
                    className="w-full bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 p-6 rounded-[2rem] border border-white/20 hover:border-white/40 text-left transition-all flex items-center gap-5 group"
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400/30 to-amber-600/20 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg border border-amber-400/30">
                        <UserSquare2 size={32} className="group-hover:rotate-6 transition-transform" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-black text-white text-lg">{t('business_solo')}</h4>
                        <p className="text-[10px] text-white/50 font-medium mt-1 leading-relaxed">{t('business_solo_desc')}</p>
                    </div>
                    <ChevronRight className="text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all" size={22} />
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
            <button onClick={onBack} className="text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-4 group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> {t('back')}
            </button>

            <div className="space-y-4">
                {/* Admin */}
                <button
                    onClick={() => { setSelectedRole(UserRole.COMPANY); onNavigate('PASSWORD_ENTRY'); }}
                    className="w-full bg-gradient-to-br from-white/15 to-white/5 hover:from-white/25 hover:to-white/10 p-6 rounded-[2rem] border border-white/20 hover:border-white/40 text-left transition-all flex items-center gap-5 group"
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-violet-400/30 to-violet-600/20 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg border border-violet-400/30">
                        <ShieldCheck size={32} className="group-hover:rotate-6 transition-transform" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-black text-white text-lg">{t('role_org_admin')}</h4>
                        <p className="text-[10px] text-white/50 font-medium mt-1 leading-relaxed">{t('role_org_admin_desc')}</p>
                    </div>
                    <ChevronRight className="text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all" size={22} />
                </button>

                {/* Employee */}
                <button
                    onClick={() => { setSelectedRole(UserRole.EMPLOYEE); onNavigate('PASSWORD_ENTRY'); }}
                    className="w-full bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 p-6 rounded-[2rem] border border-white/20 hover:border-white/40 text-left transition-all flex items-center gap-5 group"
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-400/30 to-cyan-600/20 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg border border-cyan-400/30">
                        <Users size={32} className="group-hover:rotate-6 transition-transform" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-black text-white text-lg">{t('role_employee')}</h4>
                        <p className="text-[10px] text-white/50 font-medium mt-1 leading-relaxed">{t('role_employee_desc')}</p>
                    </div>
                    <ChevronRight className="text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all" size={22} />
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
            <button onClick={onBack} className="text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> {t('back')}
            </button>

            {!showOtp ? (
                <>
                    <div className="text-center space-y-2">
                        <h3 className="font-black text-white text-2xl tracking-tight">{t('enter_phone')}</h3>
                        <p className="text-[11px] text-white/50 font-medium">{t('otp_sent')}</p>
                    </div>

                    <div className="space-y-4">
                        {/* Phone Input with Country Code */}
                        <div className="flex items-center gap-3 bg-white/10 border-2 border-white/20 focus-within:border-white/40 rounded-2xl p-4 transition-all">
                            <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-xl">
                                <span className="text-lg">{countryConfig.flag}</span>
                                <span className="text-white font-bold text-sm">{countryConfig.code}</span>
                            </div>
                            <input
                                type="tel"
                                value={formatPhone(phone)}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                placeholder="90 123 45 67"
                                className="flex-1 bg-transparent border-none outline-none text-white font-bold text-lg tracking-wider placeholder:text-white/20"
                            />
                        </div>

                        <button
                            onClick={onNext}
                            disabled={phone.replace(/\D/g, '').length < countryConfig.length || isLoading}
                            className="w-full bg-white hover:bg-emerald-50 disabled:bg-white/20 disabled:text-white/40 text-emerald-600 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl active:scale-95 transition-all disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : t('get_code')}
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="text-center space-y-2">
                        <h3 className="font-black text-white text-2xl tracking-tight">{t('verification')}</h3>
                        <p className="text-[11px] text-white/50 font-medium">
                            {countryConfig.code} {formatPhone(phone)} {t('code_sent_to')}
                        </p>
                    </div>

                    <div className="space-y-4">
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
                                    className="w-12 h-14 bg-white/10 border-2 border-white/20 focus:border-white/50 rounded-xl text-white font-black text-2xl text-center outline-none transition-all"
                                />
                            ))}
                        </div>

                        <button
                            onClick={onVerify}
                            disabled={otp.length < 5}
                            className="w-full bg-white hover:bg-emerald-50 disabled:bg-white/20 disabled:text-white/40 text-emerald-600 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl active:scale-95 transition-all disabled:cursor-not-allowed"
                        >
                            {t('verify')}
                        </button>

                        <div className="flex items-center justify-center gap-3">
                            <button className="text-[10px] font-bold text-white/40 hover:text-white/70 transition-colors">
                                {t('resend_code')}
                            </button>
                        </div>

                        <p className="text-center text-[9px] font-bold text-white/30 uppercase tracking-widest">{t('test_code')}</p>
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
            <button onClick={onBack} className="text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> {t('back')}
            </button>

            <div className="text-center space-y-2">
                <h3 className="font-black text-white text-2xl tracking-tight">{displayTitle}</h3>
                <p className="text-[11px] text-white/50 font-medium">{t('enter_password_desc')}</p>
            </div>

            <div className="space-y-4">
                <div className="relative group">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white/10 border-2 border-white/20 focus:border-white/40 rounded-2xl p-5 text-white font-bold text-xl tracking-[0.2em] outline-none transition-all placeholder:text-white/10"
                    />
                </div>

                <button
                    onClick={onLogin}
                    disabled={password.length < 4}
                    className="w-full bg-white hover:bg-emerald-50 disabled:bg-white/20 disabled:text-white/40 text-emerald-600 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl active:scale-95 transition-all disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                    Kirish <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};
