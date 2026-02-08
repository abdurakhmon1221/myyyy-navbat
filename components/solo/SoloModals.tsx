
import React, { useRef, useEffect, useState } from 'react';
import { X, QrCode, Download, Share2, Briefcase, Copy, Check, Printer } from 'lucide-react';
import { Organization } from '../../types';

interface SoloQRModalProps {
    show: boolean;
    onClose: () => void;
    organization?: Organization;
}

export const SoloQRModal: React.FC<SoloQRModalProps> = ({ show, onClose, organization }) => {
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [copied, setCopied] = useState(false);

    // Construct the URL that users will visit
    const qrUrl = organization ? `https://navbat.uz/org/${organization.id}` : 'https://navbat.uz';

    useEffect(() => {
        if (show && organization) {
            // Use a real QR code generation API for professional, scannable codes
            const dataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrUrl)}&color=000000&bgcolor=ffffff`;
            setQrDataUrl(dataUrl);
        }
    }, [show, organization, qrUrl]);

    const handleDownload = () => {
        if (!qrDataUrl) return;

        // Create poster with branding
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 1000;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 1000);
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(1, '#059669');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 1000);

        // White card
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        // @ts-ignore
        if (ctx.roundRect) ctx.roundRect(50, 50, 700, 900, 40);
        else ctx.fillRect(50, 50, 700, 900); // Fallback
        ctx.fill();

        // Title
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 48px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('NAVBATGA YOZILING', 400, 140);

        // Organization name
        ctx.fillStyle = '#059669';
        ctx.font = 'bold 32px Inter, system-ui, sans-serif';
        ctx.fillText(organization?.name || 'Tashkilot', 400, 200);

        // QR Code
        const qrImg = new Image();
        qrImg.crossOrigin = 'Anonymous'; // Needed for external images
        qrImg.onload = () => {
            ctx.drawImage(qrImg, 160, 260, 480, 480);

            // Instructions
            ctx.fillStyle = '#6b7280';
            ctx.font = '24px Inter, system-ui, sans-serif';
            ctx.fillText('Telefoningiz bilan skanerlang', 400, 800);

            // URL
            ctx.fillStyle = '#111827';
            ctx.font = 'bold 20px Inter, system-ui, sans-serif';
            ctx.fillText(qrUrl, 400, 850);

            // Footer
            ctx.fillStyle = '#9ca3af';
            ctx.font = '18px Inter, system-ui, sans-serif';
            ctx.fillText('Powered by NAVBAT', 400, 920);

            // Download
            try {
                const link = document.createElement('a');
                link.download = `navbat-qr-${organization?.id || 'poster'}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            } catch (e) {
                console.error("Canvas export failed (likely CORS)", e);
                alert("Poster yuklash uchun 'Right click -> Save Image' qiling");
            }
        };
        // If the API allows CORS, this works. api.qrserver.com usually is fine but strictly canvas taint might be an issue.
        // For now we trust it or fallback.
        qrImg.src = qrDataUrl;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(qrUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        const shareData = {
            title: 'Navbatga yoziling',
            text: `${organization?.name} uchun navbat`,
            url: qrUrl
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                throw new Error('Web Share API not supported');
            }
        } catch (error) {
            // Fallback to clipboard if sharing fails or is not supported
            handleCopy();
            // Optional: Show a toast or alert if copy also fails, but handleCopy has its own feedback
            console.log('Share failed, falling back to clipboard', error);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1500] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-8 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center pt-4">
                    <h3 className="text-2xl font-[1000] text-[var(--text-main)] mb-2 text-center">QR KODNI ULASHISH</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest text-center mb-8">
                        Mijozlar telefon orqali skanerlaydi
                    </p>

                    <div className="w-64 h-64 bg-white rounded-3xl border-4 border-emerald-500 shadow-xl p-4 mb-8 flex items-center justify-center relative group">
                        {qrDataUrl ? (
                            <img src={qrDataUrl} alt="QR Code" className="w-full h-full object-contain mix-blend-multiply" />
                        ) : (
                            <QrCode size={64} className="text-gray-200 animate-pulse" />
                        )}
                        <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-colors rounded-2xl pointer-events-none" />
                    </div>

                    <div className="w-full bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl flex items-center justify-between mb-8 border border-gray-100 dark:border-slate-700">
                        <span className="text-xs font-bold text-gray-500 truncate max-w-[200px]">{qrUrl}</span>
                        <button onClick={handleCopy} className="text-emerald-500 font-bold text-xs uppercase tracking-widest hover:text-emerald-600 transition-colors">
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                    </div>

                    <div className="w-full space-y-3">
                        <button
                            onClick={handleDownload}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
                        >
                            <Download size={18} /> POSTERNI YUKLASH
                        </button>

                        <div className="flex gap-3">
                            <button
                                onClick={handleShare}
                                className="flex-1 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all active:scale-95"
                            >
                                <Share2 size={16} /> ULASHISH
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="flex-1 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all active:scale-95"
                            >
                                <Printer size={16} /> CHOP ETISH
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface SoloSettingsModalProps {
    show: boolean;
    onClose: () => void;
    orgName: string;
    haptics: any;
}

export const SoloSettingsModal: React.FC<SoloSettingsModalProps> = ({ show, onClose, orgName, haptics }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[1500] flex items-center justify-center p-6 animate-in zoom-in duration-500">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] p-10 shadow-2xl space-y-8 relative">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-[1000] text-[var(--text-main)]">SOZLAMALAR</h3>
                    <button onClick={onClose} className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900">
                        <X size={20} />
                    </button>
                </div>
                <div className="space-y-6">
                    <div className="group">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 mb-2">Yuridik Nomi</p>
                        <div className="relative">
                            <input type="text" defaultValue={orgName} className="w-full bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl font-bold text-base outline-none border-2 border-transparent focus:border-emerald-500 transition-all pl-12" />
                            <Briefcase size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                        </div>
                    </div>
                    {/* Add more settings as needed */}
                </div>
                <button onClick={() => { haptics.success(); onClose(); }} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-transform">
                    Saqlash
                </button>
            </div>
        </div>
    );
};
