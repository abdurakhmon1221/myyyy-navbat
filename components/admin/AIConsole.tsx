import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Sparkles } from 'lucide-react';

const AIConsole: React.FC = () => {
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
        { role: 'ai', content: "Salom! Men Navbat.pro AI yordamchisiman. Tizim bo'yicha qanday savolingiz bor?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setIsTyping(true);

        // Simulate AI thinking
        setTimeout(() => {
            let aiResponse = "Tushunarli. Hozirda bu funksiya ustida ishlayapmiz.";

            if (userMsg.toLowerCase().includes('navbat')) {
                aiResponse = "Navbatlarni boshqarish uchun 'Navbatlar' bo'limiga o'ting. U yerda yangi navbat yaratish yoki mavjudlarini tahrirlash mumkin.";
            } else if (userMsg.toLowerCase().includes('statistika') || userMsg.toLowerCase().includes('hisobot')) {
                aiResponse = "Bugungi statistika: 1240 ta faol mijoz, 84 ta jonli navbat. O'sish tendensiyasi ijobiy (+12.5%).";
            } else if (userMsg.toLowerCase().includes('muammo') || userMsg.toLowerCase().includes('xato')) {
                aiResponse = "Tizim loglarini tekshirib chiqdim. Hozirda jiddiy xatoliklar aniqlanmadi. Barcha xizmatlar barqaror ishlamoqda.";
            }

            setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="h-full flex flex-col bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h3 className="font-black text-gray-900 leading-tight">AI Console</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase">System Architect v2.0</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        Online
                    </span>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'}`}>
                            {msg.role === 'ai' ? <Bot size={18} /> : <User size={18} />}
                        </div>
                        <div className={`max-w-[70%] p-4 rounded-2xl text-sm font-medium leading-relaxed ${msg.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-200'
                                : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none shadow-sm'
                            }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                            <Bot size={18} />
                        </div>
                        <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></span>
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Buyruq yoki savol yozing..."
                        className="flex-1 bg-gray-50 border-2 border-transparent focus:border-indigo-500/20 rounded-xl px-4 py-3 font-bold text-sm outline-none transition-all"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="bg-indigo-600 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIConsole;
