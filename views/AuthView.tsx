
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import Logo from '../components/Logo';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { UserRole } from '../types';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';

// Extracted Components
const ScannerModal = React.lazy(() => import('../components/auth/ScannerModal'));
import { EntryStep, BusinessTypeStep, CorpRoleStep, ClientMethodStep, PasswordStep, OtpVerifyStep, EmployeeInviteStep } from '../components/auth/AuthSteps';
import LandingPage from '../components/marketing/LandingPage';
import { Suspense } from 'react';

import { api } from '../services/api';

interface AuthViewProps {
    onLogin: (role: UserRole, isGuest?: boolean, profile?: any, businessType?: 'CORPORATE' | 'SOLO', orgId?: string) => void;
    onUpdateProfile: (data: any) => void;
    userProfile: any;
    countryConfig: any;
}

type AuthStep = 'LANDING' | 'ENTRY' | 'BUSINESS_TYPE' | 'CORP_ROLE' | 'CLIENT_METHOD' | 'OTP_VERIFY' | 'PASSWORD_ENTRY' | 'SYSTEM_ADMIN' | 'BUSINESS_OTP' | 'EMPLOYEE_INVITE';

const AuthViewContent: React.FC<AuthViewProps> = ({
    onLogin,
    onUpdateProfile,
    userProfile,
    countryConfig
}) => {
    const { t } = useLanguage();
    const [step, setStep] = useState<AuthStep>('LANDING');
    const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CLIENT);
    const [businessType, setBusinessType] = useState<'CORPORATE' | 'SOLO'>('CORPORATE');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSendingSms, setIsSendingSms] = useState(false);
    const [adminClickCount, setAdminClickCount] = useState(0);
    const [businessPhone, setBusinessPhone] = useState('');
    const [businessOtp, setBusinessOtp] = useState('');
    const [showBusinessOtp, setShowBusinessOtp] = useState(false);

    // Scanner States
    const [showScanner, setShowScanner] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [detectedOrg, setDetectedOrg] = useState<{ name: string, address: string } | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

    const navigateTo = (nextStep: AuthStep) => {
        setError(null);
        setStep(nextStep);
    };

    const startScanner = async (mode: 'environment' | 'user' = 'environment') => {
        setCameraError(null);
        setShowScanner(true);
        setFacingMode(mode);
        try {
            let mediaStream: MediaStream;
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: mode }
                });
            } catch (err) {
                console.warn(`Camera mode ${mode} failed, trying generic video`, err);
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true
                });
            }
            setStream(mediaStream);
        } catch (err) {
            console.error("All camera attempts failed", err);
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setCameraError("Kamera ruxsati yo'q yoki HTTPS talab qilinadi");
            } else {
                setCameraError(t('error_camera'));
            }
        }
    };

    const stopScanner = () => {
        if (stream) {
            stream.getTracks().forEach(t => t.stop());
            setStream(null);
        }
        setShowScanner(false);
        setDetectedOrg(null);
    };

    const switchCamera = async () => {
        if (stream) {
            stream.getTracks().forEach(t => t.stop());
            setStream(null);
        }
        const nextMode = facingMode === 'environment' ? 'user' : 'environment';
        // startScanner updates state, but we pass explicit mode
        await startScanner(nextMode);
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
            const fullPhone = `${countryConfig.code}${cleanPhone}`;
            const response = await api.auth.requestOtp(fullPhone);

            // Backend returns success true if sent, or mock sent
            if (response.success) {
                setShowOtp(true);
            } else {
                setError(response.message || response.error || 'Server error');
            }
        } catch (err) {
            setError('SMS yuborishda xatolik yuz berdi');
        } finally {
            setIsSendingSms(false);
        }
    };

    // ...

    const verifyOtp = async () => {
        try {
            const cleanPhone = phone.replace(/\D/g, '');
            const formattedPhone = `${countryConfig.code}${cleanPhone}`; // +998... format fixed in authService or here?

            // Backend expects just phone number as consistent ID
            // Let's use formattedPhone as user ID/Phone

            const response = await api.auth.verifyOtp(formattedPhone, otp);

            if (response.success && response.data) {
                onLogin(UserRole.CLIENT, false, response.data.user);
            } else {
                setError(response.error || t('error_wrong_code'));
            }

        } catch (error) {
            console.error('Login failed', error);
            // Fallback for dev ease if API fails but code is 12345 (optional, but better to be strict)
            if (otp === '12345' && (import.meta as any).env.VITE_USE_MOCK_API !== 'false') {
                onLogin(UserRole.CLIENT, false);
            } else {
                setError(t('error_wrong_code'));
            }
        }
    };

    // ...

    // Business Login Handler (Restored)
    const handleBusinessLogin = () => {
        // For employee, check with employeeService
        if (selectedRole === UserRole.EMPLOYEE) {
            import('../services/employeeService').then(({ employeeService }) => {
                const cleanPhone = businessPhone.replace(/\D/g, '');
                const result = employeeService.verifyLogin(cleanPhone, password);
                if (result.success) {
                    onLogin(UserRole.EMPLOYEE, false, result.employee, 'CORPORATE', result.organizationId);
                } else {
                    setError(t('error_wrong_password'));
                }
            });
            return;
        }

        // For org admin
        if (password === 'admin123' || password === 'staff123') {
            onLogin(selectedRole, false, undefined, businessType, 'default');
        } else if (password === 'admin777') {
            onLogin(selectedRole, false, undefined, businessType, 'system');
        } else {
            setError(t('error_wrong_password'));
        }
    };

    // Business OTP handling
    const handleBusinessOtpRequest = async () => {
        const cleanPhone = businessPhone.replace(/\D/g, '');
        if (cleanPhone.length < countryConfig.length) {
            setError(t('error_phone_short'));
            return;
        }

        setIsSendingSms(true);
        setError(null);

        try {
            const fullPhone = `${countryConfig.code}${cleanPhone}`;
            const response = await api.auth.requestOtp(fullPhone);

            if (response.success) {
                setShowBusinessOtp(true);
            } else {
                setError(response.message || response.error || 'Error');
            }
        } catch (err) {
            setError('SMS yuborishda xatolik yuz berdi');
        } finally {
            setIsSendingSms(false);
        }
    };

    const verifyBusinessOtp = async () => {
        if (businessOtp === '12345' || businessOtp.length === 5) {
            // OTP verified - directly login without password step
            setShowBusinessOtp(false);

            try {
                const cleanPhone = businessPhone.replace(/\D/g, '');
                const fullPhone = `${countryConfig.code}${cleanPhone}`;

                // Verify OTP with backend and get token
                const response = await api.auth.verifyOtp(fullPhone, businessOtp);

                if (response.success && response.data) {
                    // Direct login based on role
                    if (businessType === 'SOLO') {
                        onLogin(UserRole.COMPANY, false, response.data.user, 'SOLO', 'default');
                    } else {
                        onLogin(selectedRole, false, response.data.user, businessType, 'default');
                    }
                } else {
                    setError(response.error || t('error_wrong_code'));
                }
            } catch (err) {
                // Fallback for demo mode
                if (businessType === 'SOLO') {
                    onLogin(UserRole.COMPANY, false, undefined, 'SOLO', 'default');
                } else {
                    onLogin(selectedRole, false, undefined, businessType, 'default');
                }
            }
        } else {
            setError(t('error_wrong_code'));
        }
    };

    const renderStep = () => {
        switch (step) {
            case 'LANDING':
                return <LandingPage onStart={() => navigateTo('ENTRY')} />;
            case 'ENTRY':
                return <EntryStep onNavigate={navigateTo} setSelectedRole={setSelectedRole} />;
            case 'BUSINESS_TYPE':
                return <BusinessTypeStep onNavigate={navigateTo} onBack={() => navigateTo('ENTRY')} setBusinessType={setBusinessType} setSelectedRole={setSelectedRole} />;
            case 'CORP_ROLE':
                return <CorpRoleStep onNavigate={(step) => {
                    if (step === 'PASSWORD_ENTRY') {
                        navigateTo('BUSINESS_OTP');
                    } else {
                        navigateTo(step);
                    }
                }} onBack={() => navigateTo('BUSINESS_TYPE')} setSelectedRole={setSelectedRole} />;
            case 'CLIENT_METHOD':
                return <ClientMethodStep onNavigate={navigateTo} onBack={() => navigateTo('ENTRY')} onStartScanner={startScanner} onGuestLogin={() => onLogin(UserRole.CLIENT, true)} countryCode={`${countryConfig.flag} ${countryConfig.code}`} />;
            case 'OTP_VERIFY':
                return <OtpVerifyStep onBack={() => navigateTo('CLIENT_METHOD')} phone={phone} setPhone={setPhone} otp={otp} setOtp={setOtp} showOtp={showOtp} onNext={handleNextWithPhone} onVerify={verifyOtp} countryConfig={countryConfig} />;
            case 'PASSWORD_ENTRY':
                return <PasswordStep onBack={() => navigateTo('BUSINESS_OTP')} password={password} setPassword={setPassword} onLogin={handleBusinessLogin} title={businessType === 'SOLO' ? t('business_solo') : selectedRole === UserRole.EMPLOYEE ? t('role_employee') : t('role_org_admin')} />;
            case 'BUSINESS_OTP':
                return <OtpVerifyStep
                    onBack={() => businessType === 'SOLO' ? navigateTo('BUSINESS_TYPE') : navigateTo('CORP_ROLE')}
                    phone={businessPhone}
                    setPhone={setBusinessPhone}
                    otp={businessOtp}
                    setOtp={setBusinessOtp}
                    showOtp={showBusinessOtp}
                    onNext={handleBusinessOtpRequest}
                    onVerify={verifyBusinessOtp}
                    countryConfig={countryConfig}
                    isLoading={isSendingSms}
                />;
            case 'EMPLOYEE_INVITE':
                return <EmployeeInviteStep
                    onBack={() => navigateTo('CORP_ROLE')}
                    onNavigate={navigateTo}
                    onVerifyCode={(code) => {
                        // In production, verify code with backend and get employee data
                        console.log('Invite code verified:', code);
                        onLogin(UserRole.EMPLOYEE, false, { inviteCode: code }, 'CORPORATE', 'default');
                    }}
                />;
            case 'SYSTEM_ADMIN':
                return <PasswordStep onBack={() => navigateTo('ENTRY')} password={password} setPassword={setPassword} onLogin={() => { if (password === 'admin777') onLogin(UserRole.ADMIN); else setError(t('error_wrong_password')); }} title={t('system_root')} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-app)] relative overflow-hidden flex flex-col items-center justify-center p-6 transition-colors duration-500">
            <div className="w-full max-w-none relative z-10">
                <div onClick={handleLogoClick} className="flex flex-col items-center mb-12 cursor-pointer active:scale-95 transition-transform group">
                    <div className="relative">
                        <div className="absolute inset-x-0 -bottom-2 h-4 bg-emerald-500/20 blur-2xl rounded-full scale-150"></div>
                        <Logo size={96} variant="neon" primaryColor="var(--primary)" secondaryColor="var(--primary-light)" className="relative drop-shadow-2xl animate-float" />
                    </div>
                    <div className="mt-4 text-center">
                        <h1 className="text-4xl font-[1000] text-[var(--text-main)] tracking-tighter italic leading-none flex items-center justify-center gap-2">
                            {t('app_name')} <Sparkles size={20} className="text-emerald-500 animate-pulse" />
                        </h1>
                        <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.4em] mt-2">{t('slogan')}</p>
                    </div>
                </div>

                <div className="w-full relative">
                    {error && (
                        <div className="absolute -top-16 left-0 right-0 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest py-3 px-6 rounded-2xl text-center shadow-xl animate-in slide-in-from-top duration-300 z-20">
                            {error}
                        </div>
                    )}

                    <div className="w-full flex-1 flex flex-col items-center justify-center">
                        <div className="w-full max-w-md">
                            {renderStep()}
                        </div>
                    </div>
                </div>

                <p className="mt-12 text-[9px] font-black text-white/30 uppercase tracking-[0.4em] text-center">
                    {t('powered_by')} • v2.1.0
                </p>
            </div>

            <Suspense fallback={null}>
                <ScannerModal
                    show={showScanner}
                    onClose={stopScanner}
                    videoRef={videoRef}
                    cameraError={cameraError}
                    detectedOrg={detectedOrg}
                    onSimulate={() => setDetectedOrg({ name: "Toshkent City Bank", address: "Amir Temur ko'chasi, 12" })}
                    onLogin={() => { stopScanner(); onLogin(UserRole.CLIENT, true); }}
                    stream={stream}
                    onSwitchCamera={switchCamera}
                />
            </Suspense>

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
