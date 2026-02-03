
import React from 'react';

const SuccessAnimation: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-500">
            <div className="relative w-24 h-24 mb-6">
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl animate-pulse"></div>

                {/* Main Circle */}
                <svg viewBox="0 0 100 100" className="relative w-full h-full">
                    <circle
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="283"
                        strokeDashoffset="283"
                        className="animate-[draw_0.6s_ease-out_forwards]"
                    />
                    <path
                        d="M30 52 L45 67 L70 35"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="60"
                        strokeDashoffset="60"
                        className="animate-[draw_0.4s_ease-out_0.5s_forwards]"
                    />
                </svg>
            </div>
            <h3 className="text-2xl font-black text-emerald-600 tracking-tight text-center">Muvaffaqiyatli!</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Amal bajarildi</p>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes draw {
                    to { stroke-dashoffset: 0; }
                }
            `}} />
        </div>
    );
};

export default SuccessAnimation;
