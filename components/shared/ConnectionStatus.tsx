/**
 * NAVBAT - Connection Status Indicator
 * 
 * A small visual component to show WebSocket connection health.
 * Shows different states:
 * 🟢 Connected (Real-time)
 * 🟡 Connecting...
 * 🔴 Disconnected (Polling fallback)
 * ⚡ Reconnecting...
 */

import React from 'react';
import { Wifi, WifiOff, Loader2, AlertCircle } from 'lucide-react';
import { useWebSocket } from '../../hooks/useWebSocket';

interface ConnectionStatusProps {
    className?: string;
    showLabel?: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ className = '', showLabel = false }) => {
    const { connectionState } = useWebSocket();

    const getStatusConfig = () => {
        switch (connectionState) {
            case 'CONNECTED':
                return {
                    icon: Wifi,
                    color: 'text-emerald-500',
                    bg: 'bg-emerald-500/10',
                    label: 'Online',
                    animate: false
                };
            case 'CONNECTING':
            case 'RECONNECTING':
                return {
                    icon: Loader2,
                    color: 'text-amber-500',
                    bg: 'bg-amber-500/10',
                    label: connectionState === 'RECONNECTING' ? 'Reconnecting...' : 'Connecting...',
                    animate: true
                };
            case 'ERROR':
                return {
                    icon: AlertCircle,
                    color: 'text-red-500',
                    bg: 'bg-red-500/10',
                    label: 'Connection Error',
                    animate: false
                };
            case 'DISCONNECTED':
            default:
                return {
                    icon: WifiOff,
                    color: 'text-slate-400',
                    bg: 'bg-slate-500/10',
                    label: 'Offline',
                    animate: false
                };
        }
    };

    const config = getStatusConfig();
    const Icon = config.icon;

    return (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} ${className}`} title={config.label}>
            <Icon
                size={16}
                className={`${config.color} ${config.animate ? 'animate-spin' : ''}`}
            />
            {showLabel && (
                <span className={`text-xs font-medium ${config.color}`}>
                    {config.label}
                </span>
            )}
        </div>
    );
};

export default ConnectionStatus;
