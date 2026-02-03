
import React from 'react';
import { X, CheckCircle2, ThumbsUp, ThumbsDown, Star, MessageCircle, Send } from 'lucide-react';
import { QueueItem } from '../../types';

interface RatingModalProps {
    show: boolean;
    onClose: () => void;
    onRate: (isPositive: boolean) => void;
    queue: QueueItem | null;
}

export const RatingModal: React.FC<RatingModalProps> = ({ show, onClose, onRate, queue }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[2000] flex items-center justify-center p-6 animate-in zoom-in duration-300">
            <div className="bg-white rounded-[3rem] w-full max-w-sm p-10 shadow-2xl text-center">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-6"><Star size={40} fill="currentColor" /></div>
                <h3 className="text-2xl font-black text-gray-900 leading-tight mb-2">Xizmat qanday bo'ldi?</h3>
                <p className="text-xs text-gray-400 font-bold uppercase mb-8">Sizning fikringiz biz uchun muhim</p>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => onRate(true)} className="flex flex-col items-center gap-3 p-6 rounded-[2rem] bg-emerald-50 text-emerald-600 border-2 border-emerald-100 hover:bg-emerald-500 hover:text-white transition-all group">
                        <ThumbsUp size={32} />
                        <span className="text-[10px] font-black uppercase">A'lo</span>
                    </button>
                    <button onClick={() => onRate(false)} className="flex flex-col items-center gap-3 p-6 rounded-[2rem] bg-rose-50 text-rose-600 border-2 border-rose-100 hover:bg-rose-500 hover:text-white transition-all group">
                        <ThumbsDown size={32} />
                        <span className="text-[10px] font-black uppercase">Yomon</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

interface ChatSheetProps {
    show: boolean;
    onClose: () => void;
    messages: { text: string, sender: 'user' | 'bot' }[];
    message: string;
    setMessage: (v: string) => void;
    onSend: () => void;
}

export const ChatSheet: React.FC<ChatSheetProps> = ({ show, onClose, messages, message, setMessage, onSend }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[2000] flex items-end justify-center animate-in slide-in-from-bottom duration-500">
            <div className="bg-white w-full max-w-lg h-[80vh] rounded-t-[3rem] shadow-2xl flex flex-col overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center text-indigo-600">
                    <div className="flex items-center gap-3">
                        <MessageCircle size={24} />
                        <h4 className="font-black uppercase text-xs tracking-widest">Yordam Markazi</h4>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-50 rounded-xl text-gray-400"><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-4">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-bold ${m.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
                                {m.text}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-2">
                    <input
                        type="text"
                        placeholder="Xabar yozing..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1 bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 font-bold text-sm outline-none focus:border-indigo-500 transition-all"
                        onKeyPress={(e) => e.key === 'Enter' && onSend()}
                    />
                    <button onClick={onSend} className="bg-indigo-600 text-white p-5 rounded-2xl shadow-xl active:scale-95"><Send size={20} /></button>
                </div>
            </div>
        </div>
    );
};
