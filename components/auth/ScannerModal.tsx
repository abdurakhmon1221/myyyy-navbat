
import React from 'react';
import { X, Camera, MapPin, Loader2 } from 'lucide-react';

interface ScannerModalProps {
    show: boolean;
    onClose: () => void;
    videoRef: React.RefObject<HTMLVideoElement>;
    cameraError: string | null;
    detectedOrg: { name: string, address: string } | null;
    onSimulate: () => void;
    onLogin: () => void;
}

const ScannerModal: React.FC<ScannerModalProps> = ({
    show, onClose, videoRef, cameraError, detectedOrg, onSimulate, onLogin
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black z-[1000] flex flex-col animate-in fade-in duration-300">
            <div className="p-6 flex justify-between items-center text-white z-10 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center"><Camera size={20} /></div>
                    <div><h3 className="font-black uppercase text-xs tracking-widest">QR Skaner</h3><p className="text-[10px] opacity-60">Logotipni skanerlang</p></div>
                </div>
                <button onClick={onClose} className="p-4 bg-white/10 rounded-full backdrop-blur-md active:scale-95"><X size={24} /></button>
            </div>

            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                {!cameraError && <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover grayscale opacity-40" />}
                <div className="relative w-64 h-64 border-2 border-white/20 rounded-[3rem] overflow-hidden flex items-center justify-center bg-white/5 backdrop-blur-[2px]">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent animate-scan-line"></div>
                    <QrCodeIcon size={48} className="text-white/20" />
                </div>
                <button onClick={onSimulate} className="absolute bottom-12 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl backdrop-blur-xl border border-white/20 font-black text-[10px] uppercase tracking-widest transition-all">Simulyatsiya (QR topildi)</button>
            </div>

            {detectedOrg && (
                <div className="p-8 bg-black/90 backdrop-blur-3xl border-t border-white/10 animate-in slide-in-from-bottom duration-500">
                    <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 mb-8">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white"><MapPin size={24} /></div>
                            <div><h4 className="font-black text-white text-lg leading-tight">{detectedOrg.name}</h4><p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-1">{detectedOrg.address}</p></div>
                        </div>
                    </div>
                    <button onClick={onLogin} className="w-full bg-emerald-500 text-white py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all">KIRISH / JOIN</button>
                </div>
            )}
        </div>
    );
};

const QrCodeIcon = ({ size, className }: { size: number, className?: string }) => (
    <div className={className}><Camera size={size} /></div>
);

export default ScannerModal;
