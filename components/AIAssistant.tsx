
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { getHelpResponse } from '../services/geminiService';

interface Message {
  text: string;
  isBot: boolean;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { text: "Assalomu alaykum! Men NAVBAT yordamchisiman. Navbatlar yoki tizim qoidalari bo'yicha savollaringiz bormi?", isBot: true }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!query.trim() || loading) return;
    
    const userMessage = query;
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setQuery('');
    setLoading(true);

    // Provide context based on the current app state (mocked context for demo)
    const context = "User is currently browsing queues in the 'Home' tab. They have a trust score of 36.5. One organization nearby is Tashkent Central Clinic.";
    
    const response = await getHelpResponse(userMessage, context);
    setMessages(prev => [...prev, { text: response || 'Uzr, javob bera olmadim.', isBot: true }]);
    setLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 w-16 h-16 bg-emerald-600 rounded-[2rem] shadow-2xl shadow-emerald-200 flex items-center justify-center text-white z-40 transition-all hover:scale-105 active:scale-95 group"
      >
        <MessageCircle size={30} className="group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white"></div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[75vh] animate-in slide-in-from-bottom-10">
            {/* Header */}
            <div className="bg-emerald-600 p-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Sparkles size={20} />
                </div>
                <div>
                  <span className="font-black text-lg block leading-none">NAVBAT Yordamchisi</span>
                  <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest flex items-center gap-1 mt-1">
                    <ShieldCheck size={10} /> Odil va Shaffof
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Chat Body */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-gray-50/50"
            >
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] p-4 rounded-3xl ${
                    m.isBot 
                      ? 'bg-white text-gray-800 rounded-tl-none shadow-sm border border-gray-100' 
                      : 'bg-emerald-600 text-white rounded-tr-none shadow-lg shadow-emerald-100'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-3xl rounded-tl-none shadow-sm border border-gray-100 flex items-center gap-3">
                    <Loader2 size={16} className="animate-spin text-emerald-600" />
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Yozilmoqda...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-gray-100">
              <div className="flex gap-2 items-center bg-gray-50 p-2 rounded-[2rem] border border-gray-200 focus-within:border-emerald-500 transition-colors">
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Qanday yordam bera olaman?"
                  className="flex-1 bg-transparent border-none px-4 py-3 text-sm font-medium outline-none"
                />
                <button 
                  onClick={handleSend}
                  disabled={loading || !query.trim()}
                  className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white disabled:opacity-50 transition-all active:scale-90"
                >
                  <Send size={20} />
                </button>
              </div>
              <p className="text-[9px] text-gray-400 text-center mt-3 font-bold uppercase tracking-widest">
                AI javoblari har doim ham 100% aniq bo'lmasligi mumkin.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
