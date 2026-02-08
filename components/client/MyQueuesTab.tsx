import React from 'react';
import { ListTodo, History, Building2 } from 'lucide-react';
import { QueueItem, Organization } from '../../types';
import QueueTicket from './QueueTicket';
import { MOCK_ORGANIZATIONS } from '../../constants';

interface MyQueuesTabProps {
    t: (key: string) => string;
    activeQueues: QueueItem[];
    queueHistory: QueueItem[];
    profilePhone: string;
    onMarkAsComing: (id: string) => void;
    onSwapToNext: (id: string) => void;
    onCancel: (id: string) => void;
    onShare: (queue: QueueItem, org: Organization) => void;
    setRatingQueue: (queue: QueueItem | null) => void;
    setShowRatingModal: (show: boolean) => void;
}

const MyQueuesTab: React.FC<MyQueuesTabProps> = ({
    t, activeQueues, queueHistory, profilePhone,
    onMarkAsComing, onSwapToNext, onCancel, onShare,
    setRatingQueue, setShowRatingModal
}) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex justify-between items-end px-1">
                <div>
                    <h2 className="text-3xl font-black text-[var(--text-main)] tracking-tighter">{t('my_queues')}</h2>
                    <p className="text-xs text-gray-400 font-bold uppercase mt-1">{t('active_tickets')}</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 px-4 py-2 rounded-2xl border border-emerald-100 dark:border-emerald-800 font-black text-xs shadow-sm">
                    {activeQueues.length} {t('status_active').toLowerCase()}
                </div>
            </div>

            {activeQueues.length > 0 ? (
                <div className="space-y-6">
                    {activeQueues.map(queue => (
                        <QueueTicket
                            key={queue.id}
                            queue={queue}
                            org={MOCK_ORGANIZATIONS.find(o => o.id === queue.organizationId) || MOCK_ORGANIZATIONS[0]}
                            onMarkAsComing={onMarkAsComing}
                            onStartDirection={(o) => window.open(`https://www.google.com/maps/dir/?api=1&destination=${o.location.lat},${o.location.lng}`)}
                            onSwapToNext={onSwapToNext}
                            onCancel={onCancel}
                            onEmergencyRequest={() => alert(t('help_sent'))}
                            onShare={onShare}
                            profilePhone={profilePhone}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-[var(--bg-card)] rounded-[3rem] border-2 border-dashed border-[var(--border-main)]">
                    <ListTodo size={48} className="mx-auto text-gray-200 dark:text-gray-600 mb-4" />
                    <p className="text-gray-400 font-black uppercase text-xs">{t('no_queues')}</p>
                </div>
            )}

            {/* History */}
            <section className="bg-[var(--bg-card)] rounded-[2.5rem] p-8 border border-[var(--border-main)] shadow-sm pb-12">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
                    <History size={14} className="text-indigo-500" /> {t('history')}
                </h4>
                <div className="space-y-4">
                    {queueHistory.map(h => (
                        <div key={h.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-3xl border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                                    <Building2 size={18} />
                                </div>
                                <div>
                                    <span className="text-sm font-black text-gray-800 block truncate max-w-[150px]">
                                        {MOCK_ORGANIZATIONS.find(o => o.id === h.organizationId)?.name}
                                    </span>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase">
                                        #{h.number} • {new Date(h.entryTime).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg ${h.status === 'SERVED' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                    {h.status === 'SERVED' ? t('status_served') : t('status_cancelled')}
                                </span>
                                {h.status === 'SERVED' && !h.evaluated && (
                                    <button
                                        onClick={() => { setRatingQueue(h); setShowRatingModal(true); }}
                                        className="mt-2 text-[8px] font-black text-emerald-600 uppercase underline hover:text-emerald-700 transition-colors"
                                    >
                                        {t('rate')}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default MyQueuesTab;
