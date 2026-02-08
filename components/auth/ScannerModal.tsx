
import React from 'react';
import { X, Camera, MapPin, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

interface ScannerModalProps {
    show: boolean;
    onClose: () => void;
    videoRef: React.RefObject<HTMLVideoElement>;
    cameraError: string | null;
    detectedOrg: { name: string, address: string } | null;
    onSimulate: () => void;
    onLogin: () => void;
    stream?: MediaStream | null;
    onSwitchCamera?: () => void;
}

const ScannerModal: React.FC<ScannerModalProps> = ({
    show, onClose, videoRef, cameraError, detectedOrg, onSimulate, onLogin, stream, onSwitchCamera
}) => {
    React.useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, videoRef]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black z-[1000] flex flex-col animate-in fade-in duration-300">
            <div className="p-6 flex justify-between items-center text-white z-10 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center"><Camera size={20} /></div>
                    <div><h3 className="font-black uppercase text-xs tracking-widest">QR Skaner</h3><p className="text-[10px] opacity-60">Logotipni skanerlang</p></div>
                </div>
                <div className="flex gap-2">
                    {onSwitchCamera && <button onClick={onSwitchCamera} className="p-4 bg-white/10 rounded-full backdrop-blur-md active:scale-95"><RefreshCw size={24} /></button>}
                    <button onClick={onClose} className="p-4 bg-white/10 rounded-full backdrop-blur-md active:scale-95"><X size={24} /></button>
                </div>
            </div>

            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                {!cameraError && <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />}

                {/* Standard Scan Overlay (visible when no error) */}
                {!cameraError && (
                    <div className="relative w-64 h-64 border-2 border-white/50 rounded-[3rem] overflow-hidden flex items-center justify-center shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent animate-scan-line"></div>
                        <QrCodeIcon size={48} className="text-white/20" />
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-3xl"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-3xl"></div>
                    </div>
                )}

                {/* Error Overlay with Manual Simulation Button */}
                {cameraError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-8 text-center space-y-6">
                        <div className="w-16 h-16 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mb-2">
                            <AlertTriangle size={32} />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg mb-2">Kamera ishlamadi</h3>
                            <p className="text-white/60 text-sm leading-relaxed">{cameraError}</p>
                        </div>
                        <button
                            onClick={onSimulate}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-95 transition-all w-full max-w-xs"
                        >
                            Simulyatsiya (QR Test)
                        </button>
                        <p className="text-white/30 text-[10px]">Test rejimida davom eting</p>
                    </div>
                )}
            </div>

            {detectedOrg && (
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-black/90 backdrop-blur-3xl border-t border-white/10 animate-in slide-in-from-bottom duration-500 z-20">
                    <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 mb-8">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white"><MapPin size={24} /></div>
                            <div><h4 className="font-black text-white text-lg leading-tight">{detectedOrg.name}</h4><p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-1">{detectedOrg.address}</p></div>
                        </div>
                    </div>
                    <button onClick={onLogin} className="w-full bg-emerald-500 text-white py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all">KIRISH</button>
                    {/* Reset logic handled by parent via close or specific reset prop if needed, for now close modal serves as reset */}
                </div>
            )}
        </div>
    );
};

const QrCodeIcon = ({ size, className }: { size: number, className?: string }) => (
    <div className={className}><Camera size={size} /></div>
);

export default ScannerModal;
