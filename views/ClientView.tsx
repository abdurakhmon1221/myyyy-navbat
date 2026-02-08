
import React, { useState, useEffect, useMemo, Suspense, useCallback, useRef } from 'react';
import { useOrganizations } from '../hooks/useOrganizations';
import {
  Clock, Search, ChevronRight, User as UserIcon, X, List,
  Calendar, MapPin, ListTodo, Navigation2, Zap,
  History, Award, Star, ShieldCheck, Heart, Mic, MicOff, WifiOff, Users as UsersIcon, AlertTriangle, Loader2
} from 'lucide-react';
import { QueueItem, Organization, Service, Language } from '../types';
import { CountryConfig } from '../App';
import { useLanguage } from '../contexts/LanguageContext';
import { haptics } from '../services/haptics';
import { startListening, speakAnnouncement, stopListening } from '../services/voiceService';
import LazyLoading from '../components/shared/LazyLoading';

// @ts-ignore
import jsQR from '../services/jsQR.js';

// Custom Hooks
import { useQueue } from '../hooks/useQueue';
import { useModal } from '../hooks/useModal';
import { useClientState } from '../hooks/useClientState';
import { useClientSearch } from '../hooks/useClientSearch';
import { useClientRegistration } from '../hooks/useClientRegistration';
import { useClientScheduling } from '../hooks/useClientScheduling';

// Static Imports (Core)
import HomeTab from '../components/client/HomeTab';
import MyQueuesTab from '../components/client/MyQueuesTab';

// Lazy Load Modals & Sub-pages
const ProfilePage = React.lazy(() => import('../components/shared/ProfilePage'));
const WalletPage = React.lazy(() => import('../components/client/WalletPage'));
const ScannerModal = React.lazy(() => import('../components/auth/ScannerModal'));
const RegistrationModal = React.lazy(() => import('../components/client/ClientModals').then(m => ({ default: m.RegistrationModal })));
const ScheduleModal = React.lazy(() => import('../components/client/ClientModals').then(m => ({ default: m.ScheduleModal })));
const RatingModal = React.lazy(() => import('../components/client/Feedbacks').then(m => ({ default: m.RatingModal })));

import MapComponent from '../components/MapComponent';

const SuccessAnimation = React.lazy(() => import('../components/shared/SuccessAnimation'));
// const MapComponent = React.lazy(() => import('../components/MapComponent'));


interface ClientViewProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isGuest?: boolean;
  profile: any;
  onUpdateProfile: (data: any) => void;
  countryConfig: CountryConfig;
  onOrgSelect?: (org: Organization) => void;
}

const ClientView: React.FC<ClientViewProps> = ({ activeTab, setActiveTab, isGuest, profile, onUpdateProfile, countryConfig, onOrgSelect }) => {
  const { t } = useLanguage();
  const { organizations } = useOrganizations();
  const {
    activeQueues,
    queueHistory,
    joinQueue,
    cancelQueue,
    isLoading: isQueueLoading
  } = useQueue(profile.phone);

  const { modals, openModal, closeModal } = useModal([
    'scanner', 'registration', 'schedule', 'rating', 'success', 'wallet'
  ]);

  // Refactored Hooks
  const { favorites, recentlyVisited, toggleFavorite, addRecent } = useClientState();
  const { searchQuery, setSearchQuery, activeFilter, setActiveFilter, isListening, setIsListening } = useClientSearch();
  const {
    regStep, setRegStep, regName, setRegName, regPhone, setRegPhone, regOtp, setRegOtp, handleVerifyOtp, submitInfo
  } = useClientRegistration((data) => {
    onUpdateProfile({ ...data, trustScore: 36.5 });
    closeModal('registration');
    if (selectedOrgForQueue) {
      setSelectedService(selectedOrgForQueue.services[0]);
      openModal('schedule');
    }
  });
  const {
    selectedOrgForQueue, setSelectedOrgForQueue, selectedService, setSelectedService,
    selectedDate, setSelectedDate, selectedTime, setSelectedTime
  } = useClientScheduling();

  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [ratingQueue, setRatingQueue] = useState<QueueItem | null>(null);
  const [notification, setNotification] = useState<{ title: string, body: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Video Ref & Scaling
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const isScanning = useRef(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [detectedOrg, setDetectedOrg] = useState<{ name: string, address: string } | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [capturedOrg, setCapturedOrg] = useState<Organization | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Notification Effect
  useEffect(() => {
    activeQueues.forEach(q => {
      if (q.status === 'CALLED' && !notification) {
        const orgName = organizations.find(o => o.id === q.organizationId)?.name;
        setNotification({ title: t('your_turn'), body: `${orgName} ${t('enter_org')}` });
        haptics.success();
        speakAnnouncement(`${t('your_turn')} ${t('enter_org')}`, Language.UZ);
      }
    });
  }, [activeQueues, notification, organizations]);

  // Scanner Handlers
  const scanTick = () => {
    if (!isScanning.current) return;

    const video = videoRef.current;
    if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
      if (!canvasRef.current) canvasRef.current = document.createElement('canvas');
      const canvas = canvasRef.current;

      if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
      if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Robust jsQR call handling ESM/UMD mismatch
        let code = null;
        try {
          const qrFn = (jsQR as any).default || jsQR;
          if (typeof qrFn === 'function') {
            code = qrFn(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "dontInvert",
            });
          }
        } catch (e) {
          console.warn("QR Decode Error:", e);
        }

        if (code) {
          // Attempt to find organization by ID or Name
          const rawData = code.data;
          console.log("QR Detected:", rawData);

          let foundOrg = organizations.find(o => o.id === rawData || o.name === rawData);

          // If not found, try to parse JSON
          if (!foundOrg) {
            try {
              const parsed = JSON.parse(rawData);
              foundOrg = organizations.find(o => o.id === parsed.id);
            } catch (e) {
              // Not JSON
            }
          }

          if (foundOrg) {
            isScanning.current = false; // Pause scanning
            setDetectedOrg({ name: foundOrg.name, address: foundOrg.address });
            setCapturedOrg(foundOrg);
            haptics.success();
            return; // Stop loop
          }
        }
      }
    }
    requestAnimationFrame(scanTick);
  };

  const startScanner = async () => {
    setCameraError(null);
    setCameraError(null);
    setDetectedOrg(null);
    setCapturedOrg(null);
    openModal('scanner');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Secure Context Required (HTTPS or localhost)");
      }

      let stream;
      try {
        // First try requesting the back camera (ideal for scanning)
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      } catch (e) {
        console.warn("Back camera unavailable, trying any camera...", e);
        // Fallback to any available video source (e.g. webcam)
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      setMediaStream(stream);
      isScanning.current = true;
      requestAnimationFrame(scanTick);
    } catch (err: any) {
      console.error(err);
      let msg = t('error_camera') || "Kamerani ishga tushirib bo'lmadi.";

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = "Kamera ruxsati berilmadi. Brauzer sozlamalarini tekshiring.";
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = "Kamera qurilmasi topilmadi.";
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        msg = "Kamera boshqa dastur tomonidan band yoki ishlamayapti.";
      } else if (err.message && err.message.includes("Secure Context")) {
        msg = "Xavfsiz aloqa (HTTPS) talab qilinadi.";
      }

      setCameraError(msg);
    }
  };

  const stopScanner = useCallback(() => {
    isScanning.current = false;
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    closeModal('scanner');
    setDetectedOrg(null);
    if (activeTab === 'scan') setActiveTab('home');
  }, [activeTab, setActiveTab, closeModal]);

  useEffect(() => {
    if (activeTab === 'scan') startScanner();
    else stopScanner();
  }, [activeTab]);

  const handleJoinQueueRequest = (org: Organization) => {
    onOrgSelect?.(org);
    haptics.light();
    setSelectedOrgForQueue(org);
    if (profile.phone === 'Guest' || isGuest) {
      openModal('registration');
      return;
    }
    addRecent(org.id);
    setSelectedService(org.services[0]);
    openModal('schedule');
  };

  const finalizeJoinQueue = async (org: Organization, isLive: boolean) => {
    if (activeQueues.find(q => q.organizationId === org.id)) {
      alert(t('already_in_queue'));
      return;
    }

    // Use the new API method
    const serviceId = selectedService?.id || org.services[0].id;
    const result = await joinQueue(org.id, serviceId);

    if (result) {
      haptics.success();
      closeModal('schedule');
      openModal('success');
      setTimeout(() => {
        closeModal('success');
        setActiveTab('my-queues');
      }, 2000);
    } else {
      alert(t('error_joining_queue'));
    }
  };

  const handleVoiceSearch = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
      haptics.light();
      return;
    }
    haptics.medium();
    setIsListening(true);
    startListening((text) => { setSearchQuery(text); setIsListening(false); haptics.success(); }, () => setIsListening(false));
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] pb-24">
      <div className="max-w-xl mx-auto px-6 py-8">
        <Suspense fallback={<LazyLoading size="md" />}>
          {activeTab === 'home' && (
            <HomeTab
              t={t}
              isOnline={isOnline}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isListening={isListening}
              handleVoiceSearch={handleVoiceSearch}
              activeQueuesCount={activeQueues.length}
              setActiveTab={setActiveTab}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              recentlyVisited={recentlyVisited}
              isLoading={isLoading}
              handleJoinQueueRequest={handleJoinQueueRequest}
              setViewingCategory={setSelectedCategory}
              selectedCategory={selectedCategory}
              favorites={favorites}
              toggleFavorite={toggleFavorite}

            />
          )}

          {activeTab === 'my-queues' && (
            <MyQueuesTab
              t={t}
              activeQueues={activeQueues}
              queueHistory={queueHistory}
              profilePhone={profile.phone}
              onCancel={cancelQueue}
              onShare={(q, o) => {
                const text = `NAVBAT: ${o.name}\nChipta: ${q.number}\nHolati: ${q.status}`;
                if (navigator.share) navigator.share({ text }).catch(() => { });
                else { navigator.clipboard.writeText(text); alert("Nusxa olindi!"); }
              }}
              setRatingQueue={(q) => { setRatingQueue(q); openModal('rating'); }}
            />
          )}

          {activeTab === 'settings' && (
            modals.wallet ? (
              <WalletPage onBack={() => closeModal('wallet')} />
            ) : (
              <ProfilePage
                profile={profile}
                onUpdateProfile={onUpdateProfile}
                onLogout={() => { localStorage.removeItem('navbat_auth_session'); window.location.reload(); }}
                role="CLIENT"
                favoritesCount={favorites.length}
                onWalletClick={() => openModal('wallet')}
              />
            )
          )}

          {activeTab === 'map' && (
            <div className="fixed inset-0 z-10 bg-[var(--bg-app)]" style={{ height: '100vh', width: '100vw' }}>
              <MapComponent organizations={organizations} onSelectOrg={handleJoinQueueRequest} t={t} />
            </div>
          )}
        </Suspense>
      </div>

      {/* Modals */}
      <Suspense fallback={null}>
        {/* ... */}

        <ScannerModal
          show={modals.scanner}
          onClose={stopScanner}
          videoRef={videoRef}
          stream={mediaStream}
          cameraError={cameraError}
          detectedOrg={detectedOrg}
          onSimulate={() => {
            // Simulating first org
            const o = organizations[0];
            if (o) {
              setDetectedOrg({ name: o.name, address: o.address });
              setCapturedOrg(o);
              isScanning.current = false;
            }
          }}
          onLogin={() => {
            stopScanner();
            if (capturedOrg) handleJoinQueueRequest(capturedOrg);
            else if (detectedOrg) handleJoinQueueRequest(organizations[0]); // Fallback for simulation
          }}
        />

        <RegistrationModal
          show={modals.registration}
          onClose={() => closeModal('registration')}
          onBack={() => setRegStep('INFO')}
          regStep={regStep}
          regName={regName}
          setRegName={setRegName}
          regPhone={regPhone}
          setRegPhone={setRegPhone}
          regOtp={regOtp}
          setRegOtp={setRegOtp}
          onVerify={() => {
            if (regStep === 'INFO') {
              if (!submitInfo()) alert("Ma'lumotlarni to'liq kiriting!");
            } else {
              if (!handleVerifyOtp()) alert("Kod noto'g'ri!");
            }
          }}
        />

        <ScheduleModal
          show={modals.schedule}
          onClose={() => closeModal('schedule')}
          org={selectedOrgForQueue}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          onFinalize={finalizeJoinQueue}
        />

        <RatingModal
          show={modals.rating}
          onClose={() => closeModal('rating')}
          queue={ratingQueue}
          onRate={() => { haptics.success(); closeModal('rating'); setRatingQueue(null); }}
        />

      </Suspense>

      {/* Floating Buttons */}

    </div>
  );
};

export default ClientView;