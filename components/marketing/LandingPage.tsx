import React from 'react';
import { Sparkles, ArrowRight, Shield, Zap, Globe, Smartphone, Heart, Star, Users } from 'lucide-react';
import Logo from '../Logo';
import AboutModal from '../shared/AboutModal';

interface LandingPageProps {
    onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
    const [showAbout, setShowAbout] = React.useState(false);

    return (
        <div className="fixed inset-0 z-[500] bg-white dark:bg-slate-950 overflow-y-auto selection:bg-emerald-500 selection:text-white">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Logo size={32} primaryColor="#059669" />
                    <span className="text-xl font-black tracking-tighter text-emerald-600 italic">Navbat</span>
                </div>
                <button
                    onClick={onStart}
                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-200 dark:shadow-none"
                >
                    Kirish
                </button>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-6 overflow-hidden">
                <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest animate-bounce-slow">
                        <Sparkles size={14} /> Kelajak navbatlari shu yerda
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-[1000] text-slate-900 dark:text-white leading-[0.9] tracking-tighter">
                        Vaqtingizni <span className="text-emerald-600">tejang</span>,<br />navbatda turmang.
                    </h1>

                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium leading-relaxed">
                        Navbat — bu shunchaki ilova emas, bu vaqtni boshqarishning yangi darajasi. Bank, shifoxona va har qanday xizmatlar uchun masofadan navbat oling.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <button
                            onClick={onStart}
                            className="w-full sm:w-auto px-8 py-5 bg-emerald-600 text-white rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-emerald-700 active:scale-95 transition-all shadow-2xl shadow-emerald-200 dark:shadow-none flex items-center justify-center gap-3 group"
                        >
                            Hozir boshlash <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => setShowAbout(true)}
                            className="w-full sm:w-auto px-8 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                        >
                            Biz haqimizda
                        </button>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-40 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-10 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>

                {/* Mockup Preview */}
                <div className="mt-24 relative max-w-5xl mx-auto px-6">
                    <div className="relative aspect-[16/9] bg-slate-900 rounded-[3rem] shadow-2xl border-8 border-slate-800 dark:border-slate-700 overflow-hidden transform hover:scale-[1.02] transition-transform duration-700 group">
                        {/* Video Player */}
                        <video
                            className="w-full h-full object-cover"
                            controls
                            playsInline
                            poster="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
                        >
                            <source src="/videos/veo3.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>

                        {/* Overlay Gradient (fade out on play potentially, but for now aesthetic overlay) */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            </section>

            {/* Features section */}
            <section className="py-32 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-6xl mx-auto px-6 space-y-20">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl sm:text-5xl font-[1000] text-slate-900 dark:text-white tracking-tight italic">Nega aynan Navbat?</h2>
                        <p className="text-slate-500 uppercase text-[10px] font-black tracking-[0.4em]">Afzalliklarimiz haqida qisqacha</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {[
                            { icon: <Zap className="text-emerald-500" />, title: "Tezkor", desc: "Bir lahzada navbat oling va holatni jonli kuzatib boring." },
                            { icon: <Shield className="text-blue-500" />, title: "Ishonchli", desc: "Xavfsiz va ishonchli xizmat ko'rsatish tizimi." },
                            { icon: <Globe className="text-purple-500" />, title: "Qulay", desc: "Hamma xizmatlar bitta ilovada va istalgan joyda." }
                        ].map((f, i) => (
                            <div key={i} className="p-10 bg-white dark:bg-slate-900 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 space-y-4 hover:shadow-xl transition-all hover:-translate-y-2">
                                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6">
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white italic">{f.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8">
                    {[
                        { icon: <Users />, label: "Foydalanuvchilar", value: "50K+" },
                        { icon: <Smartphone />, label: "Filiallar", value: "800+" },
                        { icon: <Star />, label: "Reyting", value: "4.9" },
                        { icon: <Heart />, label: "Xursand mijozlar", value: "100K+" }
                    ].map((s, i) => (
                        <div key={i} className="text-center space-y-2">
                            <div className="text-3xl font-[1000] text-emerald-600 tracking-tighter">{s.value}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-6">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-2">
                        <Logo size={24} primaryColor="#059669" />
                        <span className="text-lg font-black tracking-tighter text-emerald-600 italic">Navbat</span>
                    </div>
                    <div className="flex gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <a href="#" className="hover:text-emerald-500 transition-colors">Maxfiylik</a>
                        <a href="#" className="hover:text-emerald-500 transition-colors">Qoidalar</a>
                        <a href="#" className="hover:text-emerald-500 transition-colors">Yordam</a>
                    </div>
                    <p className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">
                        © 2026 Abdurahmon Yuldoshev
                    </p>
                </div>
            </footer>

            {/* About Modal */}
            {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
        </div>
    );
};

export default LandingPage;

const ArrowRightIcon = ({ size, className }: { size: number, className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M5 12h14m-7-7 7 7-7 7" />
    </svg>
);
