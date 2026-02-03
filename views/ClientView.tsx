
import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { MOCK_ORGANIZATIONS, CATEGORY_LIST } from '../constants';
import {
  Clock, Search, ChevronRight, User as UserIcon, X, List,
  Calendar, MapPin, ListTodo, Navigation2, Zap,
  History, Award, Star, ShieldCheck, Heart, Mic, MicOff, WifiOff, Users as UsersIcon, AlertTriangle, Loader2
} from 'lucide-react';
import { QueueItem, Organization, Service, Language } from '../types';
import { CountryConfig } from '../App';
import { useLanguage } from '../contexts/LanguageContext';
import { OrgCardSkeleton } from '../components/Skeleton';
import { haptics } from '../services/haptics';
import { startListening, speakAnnouncement } from '../services/voiceService';

// Extracted Components
import OrganizationCard from '../components/client/OrganizationCard';
import QueueTicket from '../components/client/QueueTicket';
import BentoDashboard from '../components/client/BentoDashboard';
import { RegistrationModal, ScheduleModal } from '../components/client/ClientModals';
import { RatingModal, ChatSheet } from '../components/client/Feedbacks';
import ProfilePage from '../components/shared/ProfilePage';
import SuccessAnimation from '../components/shared/SuccessAnimation';



const MapComponent = React.lazy(() => import('../components/MapComponent'));

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

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Data States
  const [activeQueues, setActiveQueues] = useState<QueueItem[]>([]);
  const [queueHistory, setQueueHistory] = useState<QueueItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // UI States
  const [viewingCategory, setViewingCategory] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'NEARBY' | 'POPULAR'>('ALL');
  const [recentlyVisited, setRecentlyVisited] = useState<string[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedOrgForQueue, setSelectedOrgForQueue] = useState<Organization | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Registration States
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [regStep, setRegStep] = useState<'INFO' | 'OTP'>('INFO');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regOtp, setRegOtp] = useState('');

  // Scheduling States
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Chat States
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<{ text: string, sender: 'user' | 'bot' }[]>([
    { text: "Assalomu alaykum! Senga qanday yordam bera olaman?", sender: 'bot' }
  ]);

  // Feedback/Rating
  const [notification, setNotification] = useState<{ title: string, body: string } | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingQueue, setRatingQueue] = useState<QueueItem | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);


  // Sync Data Effect
  useEffect(() => {
    const sync = () => {
      const saved = localStorage.getItem('navbat_active_queues');
      const history = localStorage.getItem('navbat_queue_history');
      if (saved) {
        const parsed: QueueItem[] = JSON.parse(saved);
        const userQueues = parsed.filter(q => q.userPhone === profile.phone || (profile.phone === 'Guest' && q.userPhone === 'Guest'));
        setActiveQueues(userQueues);
      }
      if (history) {
        const parsedHistory = JSON.parse(history);
        const userHistory = parsedHistory.filter((q: any) => q.userPhone === profile.phone || (profile.phone === 'Guest' && q.userPhone === 'Guest'));
        setQueueHistory(userHistory);
      }
      const favs = localStorage.getItem('navbat_favorites');
      if (favs) setFavorites(JSON.parse(favs));
      const recent = localStorage.getItem('navbat_recent');
      if (recent) setRecentlyVisited(JSON.parse(recent));
    };
    sync();

    const notifyCheck = setInterval(() => {
      activeQueues.forEach(q => {
        if (q.status === 'CALLED' && !notification) {
          const orgName = MOCK_ORGANIZATIONS.find(o => o.id === q.organizationId)?.name;
          setNotification({ title: "Sizning navbatingiz keldi!", body: `${orgName} muassasasiga kiring.` });
          haptics.success();
          speakAnnouncement(`Navbatingiz keldi. Markazga kiring.`, Language.UZ);
        }
      });
    }, 5000);

    const interval = setInterval(sync, 4000);
    const timer = setTimeout(() => setIsLoading(false), 1500);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      clearInterval(notifyCheck);
      clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [profile.phone, activeQueues.length]);

  // Handlers
  const saveToStorage = (queues: QueueItem[]) => {
    const globalQueues = JSON.parse(localStorage.getItem('navbat_active_queues') || '[]');
    const otherQueues = globalQueues.filter((q: QueueItem) => q.userPhone !== profile.phone && !(profile.phone === 'Guest' && q.userPhone === 'Guest'));
    localStorage.setItem('navbat_active_queues', JSON.stringify([...otherQueues, ...queues]));
    setActiveQueues(queues);
  };

  const cancelQueue = (id: string) => {
    if (confirm(t('cancel_confirm') || "Navbatni bekor qilmoqchimisiz?")) {
      const queue = activeQueues.find(q => q.id === id);
      if (queue) {
        haptics.heavy();
        const updatedHistory = [{ ...queue, status: 'CANCELLED' as const }, ...queueHistory].slice(0, 15);
        setQueueHistory(updatedHistory);
        localStorage.setItem('navbat_queue_history', JSON.stringify(updatedHistory));
        saveToStorage(activeQueues.filter(q => q.id !== id));
      }
    }
  };

  const markAsComing = (id: string) => {
    const updated = activeQueues.map(q => {
      if (q.id === id) {
        return { ...q, logs: [...q.logs, { timestamp: Date.now(), action: 'COMING' as const, actorId: profile.phone }] };
      }
      return q;
    });
    haptics.success();
    saveToStorage(updated);
  };

  const swapToNext = (id: string) => {
    const updated = activeQueues.map(q => {
      if (q.id === id) {
        return { ...q, position: q.position + 1, logs: [...q.logs, { timestamp: Date.now(), action: 'SWAPPED' as const, actorId: profile.phone }] };
      }
      return q;
    });
    haptics.medium();
    saveToStorage(updated);
  };

  const handleJoinQueueRequest = (org: Organization) => {
    onOrgSelect?.(org);
    haptics.light();
    setSelectedOrgForQueue(org);
    if (profile.phone === 'Guest' || isGuest) {
      setShowRegistrationModal(true);
      return;
    }
    const newRecent = [org.id, ...recentlyVisited.filter(id => id !== org.id)].slice(0, 5);
    setRecentlyVisited(newRecent);
    localStorage.setItem('navbat_recent', JSON.stringify(newRecent));
    setSelectedService(org.services[0]);
    setShowScheduleModal(true);
  };

  const finalizeJoinQueue = (org: Organization, isLive: boolean) => {
    const phone = profile.phone;
    if (activeQueues.find(q => q.organizationId === org.id)) {
      alert(t('already_in_queue') || "Sizda ushbu muassasada faol navbat bor.");
      return;
    }
    const newQueue: QueueItem = {
      id: Math.random().toString(36).substr(2, 9),
      userId: phone,
      userPhone: phone,
      organizationId: org.id,
      serviceId: selectedService?.id || org.services[0].id,
      position: isLive ? Math.floor(Math.random() * 5) + 2 : 0,
      number: `${isLive ? 'A' : 'B'}-${Math.floor(Math.random() * 90) + 10}`,
      status: 'WAITING',
      entryTime: Date.now(),
      estimatedStartTime: isLive ? Date.now() + 15 * 60000 : 0,
      appointmentTime: !isLive && selectedDate ? new Date(`${selectedDate} ${selectedTime}`).getTime() : undefined,
      logs: [{ timestamp: Date.now(), action: 'JOINED', actorId: phone }]
    };
    saveToStorage([...activeQueues, newQueue]);
    haptics.success();
    setShowScheduleModal(false);

    // Show success animation
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setActiveTab('my-queues');
    }, 2000);
  };

  const toggleFavorite = (orgId: string) => {
    haptics.light();
    const newFavs = favorites.includes(orgId) ? favorites.filter(id => id !== orgId) : [...favorites, orgId];
    setFavorites(newFavs);
    localStorage.setItem('navbat_favorites', JSON.stringify(newFavs));
  };

  const handleVoiceSearch = () => {
    if (isListening) return;
    haptics.medium();
    setIsListening(true);
    startListening((text) => { setSearchQuery(text); setIsListening(false); haptics.success(); }, () => setIsListening(false));
  };

  const shareTicket = (queue: QueueItem, org: Organization) => {
    haptics.light();
    const text = `NAVBAT: ${org.name}\nChipta: ${queue.number}\nHolati: ${queue.status}\nJoylashuv: ${org.address}`;
    if (navigator.share) { navigator.share({ title: 'Navbat Chiptasi', text, url: window.location.href }).catch(() => { }); }
    else { navigator.clipboard.writeText(text); alert("Nusxa olindi!"); }
  };

  const filteredOrgs = useMemo(() => {
    let list = [...MOCK_ORGANIZATIONS];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(o => o.name.toLowerCase().includes(q) || o.address.toLowerCase().includes(q));
    }
    if (activeFilter === 'NEARBY') list.sort((a, b) => (a.id > b.id ? 1 : -1));
    else if (activeFilter === 'POPULAR') list = list.filter(o => o.earnedBadges?.includes('trusted_org'));
    return list;
  }, [searchQuery, activeFilter]);

  // Render Functions
  const renderHome = () => (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {!isOnline && (
        <div className="bg-rose-500 text-white px-6 py-3 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top duration-500 shadow-lg">
          <WifiOff size={20} className="animate-pulse" />
          <div><p className="text-xs font-black uppercase leading-none">{t('offline_mode')}</p><p className="text-[10px] font-medium opacity-80">{t('data_from_cache')}</p></div>
        </div>
      )}

      {/* Search */}
      <div className="bg-[var(--bg-card)] rounded-[2rem] p-2 shadow-sm border border-[var(--border-main)] flex items-center gap-3 focus-within:ring-2 ring-emerald-100 transition-all">
        <Search size={20} className="ml-4 text-gray-400" />
        <input type="text" placeholder={t('search_placeholder')} className="flex-1 bg-transparent border-none outline-none text-sm font-bold py-3 text-[var(--text-main)]" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <button onClick={handleVoiceSearch} className={`mr-2 p-2.5 rounded-xl transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-gray-50 dark:bg-slate-800 text-gray-400 hover:text-emerald-600'}`}>{isListening ? <MicOff size={18} /> : <Mic size={18} />}</button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 scrollbar-hide">
        {['ALL', 'NEARBY', 'POPULAR'].map(f => (
          <button key={f} onClick={() => { haptics.light(); setActiveFilter(f as any); }} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border group ${activeFilter === f ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-gray-400 border-[var(--border-main)] hover:border-emerald-200 hover:text-emerald-500'}`}>{f === 'ALL' ? t('filter_all') : f === 'NEARBY' ? t('filter_nearby') : t('filter_popular')}</button>
        ))}
      </div>

      <BentoDashboard recentlyVisited={recentlyVisited} searchQuery={searchQuery} organizations={MOCK_ORGANIZATIONS} isLoading={isLoading} onJoinQueue={handleJoinQueueRequest} onCategorySelect={setViewingCategory} onTabChange={setActiveTab} haptics={haptics} />

      <section className="space-y-4">
        <div className="flex justify-between items-center px-1"><h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{searchQuery ? t('search_results') : t('recommendations')}</h2></div>
        <div className="space-y-4">{isLoading ? Array(3).fill(0).map((_, i) => <OrgCardSkeleton key={i} />) : filteredOrgs.map(org => <OrganizationCard key={org.id} org={org} isFav={favorites.includes(org.id)} onToggleFavorite={toggleFavorite} onJoinQueue={handleJoinQueueRequest} onStartDirection={(o) => window.open(`https://www.google.com/maps/dir/?api=1&destination=${o.location.lat},${o.location.lng}`)} t={t} />)}</div>
      </section>
    </div>
  );

  const renderMyQueues = () => (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-end px-1">
        <div><h2 className="text-3xl font-black text-[var(--text-main)] tracking-tighter">{t('my_queues')}</h2><p className="text-xs text-gray-400 font-bold uppercase mt-1">{t('active_tickets')}</p></div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 px-4 py-2 rounded-2xl border border-emerald-100 dark:border-emerald-800 font-black text-xs shadow-sm">{activeQueues.length} {t('status_active').toLowerCase()}</div>
      </div>

      {activeQueues.length > 0 ? (
        <div className="space-y-6">
          {activeQueues.map(queue => (
            <QueueTicket key={queue.id} queue={queue} org={MOCK_ORGANIZATIONS.find(o => o.id === queue.organizationId) || MOCK_ORGANIZATIONS[0]} onMarkAsComing={markAsComing} onStartDirection={(o) => window.open(`https://www.google.com/maps/dir/?api=1&destination=${o.location.lat},${o.location.lng}`)} onSwapToNext={swapToNext} onCancel={cancelQueue} onEmergencyRequest={() => alert("Yordam so'rovi yuborildi!")} onShare={shareTicket} profilePhone={profile.phone} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[var(--bg-card)] rounded-[3rem] border-2 border-dashed border-[var(--border-main)]"><ListTodo size={48} className="mx-auto text-gray-200 dark:text-gray-600 mb-4" /><p className="text-gray-400 font-black uppercase text-xs">{t('no_queues')}</p></div>
      )}

      {/* History */}
      <section className="bg-[var(--bg-card)] rounded-[2.5rem] p-8 border border-[var(--border-main)] shadow-sm pb-12">
        <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-6"><History size={14} className="text-indigo-500" /> {t('history')}</h4>
        <div className="space-y-4">
          {queueHistory.map(h => (
            <div key={h.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-3xl border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm"><Building2 size={18} /></div>
                <div><span className="text-sm font-black text-gray-800 block truncate max-w-[150px]">{MOCK_ORGANIZATIONS.find(o => o.id === h.organizationId)?.name}</span><span className="text-[9px] font-bold text-gray-400 uppercase">#{h.number} • {new Date(h.entryTime).toLocaleDateString()}</span></div>
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg ${h.status === 'SERVED' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>{h.status === 'SERVED' ? t('status_served') : t('status_cancelled')}</span>
                {h.status === 'SERVED' && !h.evaluated && <button onClick={() => { setRatingQueue(h); setShowRatingModal(true); }} className="mt-2 text-[8px] font-black text-emerald-600 uppercase underline hover:text-emerald-700 transition-colors">{t('rate')}</button>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderSettings = () => (
    <ProfilePage
      profile={profile}
      onUpdateProfile={onUpdateProfile}
      onLogout={() => {
        localStorage.removeItem('navbat_auth_session');
        window.location.reload();
      }}
      role="CLIENT"
    />
  );


  return (
    <div className="min-h-screen bg-[var(--bg-app)] pb-24">
      <div className="max-w-xl mx-auto px-6 py-8">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'my-queues' && renderMyQueues()}
        {activeTab === 'settings' && renderSettings()}
        {activeTab === 'map' && (
          <Suspense fallback={<div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>}>
            <div className="h-[80vh] rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl relative"><MapComponent /></div>
          </Suspense>
        )}
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-[var(--border-main)] p-4">
            <SuccessAnimation />
          </div>
        </div>
      )}


      <RegistrationModal show={showRegistrationModal} onClose={() => setShowRegistrationModal(false)} regStep={regStep} regName={regName} setRegName={setRegName} regPhone={regPhone} setRegPhone={setRegPhone} regOtp={regOtp} setRegOtp={setRegOtp} onVerify={() => { if (regOtp === '12345') { onUpdateProfile({ name: regName, phone: regPhone, trustScore: 36.5 }); setShowRegistrationModal(false); if (selectedOrgForQueue) { setSelectedService(selectedOrgForQueue.services[0]); setShowScheduleModal(true); } } else alert("Xato!"); }} />
      <ScheduleModal show={showScheduleModal} onClose={() => setShowScheduleModal(false)} org={selectedOrgForQueue} selectedService={selectedService} setSelectedService={setSelectedService} selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedTime={selectedTime} setSelectedTime={setSelectedTime} onFinalize={finalizeJoinQueue} />
      <RatingModal show={showRatingModal} onClose={() => setShowRatingModal(false)} queue={ratingQueue} onRate={(pos) => { handleRating(pos); setShowRatingModal(false); }} />
      <ChatSheet show={showChat} onClose={() => setShowChat(false)} messages={messages} message={chatMessage} setMessage={setChatMessage} onSend={() => { if (!chatMessage.trim()) return; setMessages([...messages, { text: chatMessage, sender: 'user' }]); setChatMessage(''); setTimeout(() => setMessages(prev => [...prev, { text: "Javob yaqin!", sender: 'bot' }]), 1500); }} />

      <button onClick={() => setShowChat(true)} className="fixed bottom-24 right-6 w-16 h-16 bg-white rounded-[1.75rem] shadow-2xl flex items-center justify-center text-indigo-600 border border-indigo-50 active:scale-90 transition-all z-[100]"><MessageCircle size={32} /></button>
    </div>
  );
};

// Placeholder for missing icons/types
const Building2 = ({ size }: { size: number }) => <Building2Icon size={size} />;
import { Building2 as Building2Icon } from 'lucide-react';

export default ClientView;