
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import Logo from '../components/Logo';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { UserRole } from '../types';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';

// Extracted Components
import ScannerModal from '../components/auth/ScannerModal';
import { EntryStep, BusinessTypeStep, CorpRoleStep, ClientMethodStep, PasswordStep, OtpVerifyStep } from '../components/auth/AuthSteps';
import { smsService } from '../services/smsService';

interface AuthViewProps {
    onLogin: (role: UserRole, isGuest?: boolean, profile?: any, businessType?: 'CORPORATE' | 'SOLO') => void;
    onUpdateProfile: (data: any) => void;
    userProfile: any;
    countryConfig: any;
}

type AuthStep = 'ENTRY' | 'BUSINESS_TYPE' | 'CORP_ROLE' | 'CLIENT_METHOD' | 'OTP_VERIFY' | 'PASSWORD_ENTRY' | 'SYSTEM_ADMIN';

const AuthViewContent: React.FC<AuthViewProps> = ({
    onLogin,
    onUpdateProfile,
    userProfile,
    countryConfig
}) => {
    const { t } = useLanguage();
    const [step, setStep] = useState<AuthStep>('ENTRY');
    const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CLIENT);
    const [businessType, setBusinessType] = useState<'CORPORATE' | 'SOLO'>('CORPORATE');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSendingSms, setIsSendingSms] = useState(false);
    const [adminClickCount, setAdminClickCount] = useState(0);

    // Scanner States
    const [showScanner, setShowScanner] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [detectedOrg, setDetectedOrg] = useState<{ name: string, address: string } | null>(null);

    const navigateTo = (nextStep: AuthStep) => {
        setError(null);
        setStep(nextStep);
    };

    const startScanner = async () => {
        setCameraError(null);
        setShowScanner(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
            setCameraError(t('error_camera'));
        }
    };

    const stopScanner = () => {
        if (videoRef.current?.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(t => t.stop());
        }
        setShowScanner(false);
        setDetectedOrg(null);
    };

    const handleLogoClick = () => {
        const newCount = adminClickCount + 1;
        setAdminClickCount(newCount);
        const timer = setTimeout(() => setAdminClickCount(0), 3000);
        if (newCount === 7) {
            clearTimeout(timer);
            setStep('SYSTEM_ADMIN');
            setAdminClickCount(0);
        }
    };

    const handleNextWithPhone = async () => {
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length < countryConfig.length) {
            setError(t('error_phone_short'));
            return;
        }

        setIsSendingSms(true);
        setError(null);

        try {
            // Using a hardcoded test code for now, in production this would be generated randomly
            const testCode = '12345';
            const response = await smsService.sendOTP(`${countryConfig.code}${cleanPhone}`, testCode);

            if (response.success) {
                setShowOtp(true);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('SMS yuborishda xatolik yuz berdi');
        } finally {
            setIsSendingSms(false);
        }
    };

    const verifyOtp = () => {
        if (otp === '12345') {
            onLogin(UserRole.CLIENT, false);
        } else {
            setError(t('error_wrong_code'));
        }
    };

    const handleBusinessLogin = () => {
        if (password === 'admin123' || password === 'staff123' || password === 'admin777') {
            onLogin(selectedRole, false, undefined, businessType);
        } else {
            setError(t('error_wrong_password'));
        }
    };

    const renderStep = () => {
        switch (step) {
            case 'ENTRY':
                return <EntryStep onNavigate={navigateTo} setSelectedRole={setSelectedRole} />;
            case 'BUSINESS_TYPE':
                return <BusinessTypeStep onNavigate={navigateTo} onBack={() => navigateTo('ENTRY')} setBusinessType={setBusinessType} />;
            case 'CORP_ROLE':
                return <CorpRoleStep onNavigate={navigateTo} onBack={() => navigateTo('BUSINESS_TYPE')} setSelectedRole={setSelectedRole} />;
            case 'CLIENT_METHOD':
                return <ClientMethodStep onNavigate={navigateTo} onBack={() => navigateTo('ENTRY')} onStartScanner={startScanner} onGuestLogin={() => onLogin(UserRole.CLIENT, true)} countryCode={`${countryConfig.flag} ${countryConfig.code}`} />;
            case 'OTP_VERIFY':
                return <OtpVerifyStep onBack={() => navigateTo('CLIENT_METHOD')} phone={phone} setPhone={setPhone} otp={otp} setOtp={setOtp} showOtp={showOtp} onNext={handleNextWithPhone} onVerify={verifyOtp} countryConfig={countryConfig} />;
            case 'PASSWORD_ENTRY':
                return <PasswordStep onBack={() => businessType === 'SOLO' ? navigateTo('BUSINESS_TYPE') : navigateTo('CORP_ROLE')} password={password} setPassword={setPassword} onLogin={handleBusinessLogin} title={businessType === 'SOLO' ? t('business_solo') : undefined} />;
            case 'SYSTEM_ADMIN':
                return <PasswordStep onBack={() => navigateTo('ENTRY')} password={password} setPassword={setPassword} onLogin={() => { if (password === 'admin777') onLogin(UserRole.ADMIN); else setError(t('error_wrong_password')); }} title={t('system_root')} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-emerald-600 relative overflow-hidden flex flex-col items-center justify-center p-6 selection:bg-white/30">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-400 rounded-full blur-[120px] opacity-50 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px] opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-[20%] right-[10%] w-[10%] h-[10%] bg-white/10 rounded-full blur-[60px] animate-bounce-slow"></div>



            <div className="w-full max-w-md relative z-10">
                <div onClick={handleLogoClick} className="flex flex-col items-center mb-8 cursor-pointer active:scale-95 transition-transform group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full group-hover:bg-white/40 transition-all scale-150"></div>
                        <Logo size={80} variant="neon" primaryColor="#ffffff" secondaryColor="#a7f3d0" className="relative drop-shadow-2xl animate-float" />
                    </div>
                    <div className="mt-3 text-center">
                        <h1 className="text-3xl font-[1000] text-white tracking-tighter italic leading-none flex items-center gap-2">{t('app_name')} <Sparkles size={16} className="text-emerald-300 animate-pulse" /></h1>
                        <p className="text-[9px] text-white/50 font-black uppercase tracking-[0.3em] mt-1">{t('slogan')}</p>
                    </div>
                </div>

                <div className="w-full relative">
                    {error && (
                        <div className="absolute -top-16 left-0 right-0 bg-rose-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest py-3 px-6 rounded-2xl text-center border border-white/20 shadow-2xl animate-in slide-in-from-top duration-300 z-20">
                            {error}
                        </div>
                    )}

                    <div className="backdrop-blur-3xl bg-white/10 border border-white/20 rounded-[3.5rem] shadow-2xl overflow-hidden min-h-[460px] flex flex-col">
                        <div className="flex-1 p-8 flex flex-col justify-center">
                            {renderStep()}
                        </div>
                    </div>
                </div>

                <p className="mt-12 text-[9px] font-black text-white/30 uppercase tracking-[0.4em] text-center">
                    {t('powered_by')} • v2.1.0
                </p>
            </div>

            <ScannerModal
                show={showScanner}
                onClose={stopScanner}
                videoRef={videoRef}
                cameraError={cameraError}
                detectedOrg={detectedOrg}
                onSimulate={() => setDetectedOrg({ name: "Toshkent City Bank", address: "Amir Temur ko'chasi, 12" })}
                onLogin={() => { stopScanner(); onLogin(UserRole.CLIENT, true); }}
            />

            <style>{`
                @keyframes scan-line {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                .animate-scan-line {
                    animation: scan-line 2s linear infinite;
                }
                .animate-bounce-slow {
                    animation: bounce 6s infinite ease-in-out;
                }
                .animate-slide-up {
                    animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

// Wrap with LanguageProvider since AuthView is shown before the main app's provider
const AuthView: React.FC<AuthViewProps> = (props) => (
    <LanguageProvider>
        <AuthViewContent {...props} />
    </LanguageProvider>
);

export default AuthView;
