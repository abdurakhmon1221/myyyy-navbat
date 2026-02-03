import React from 'react';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface LazyLoadingProps {
    size?: 'sm' | 'md' | 'lg';
    message?: string;
    fullScreen?: boolean;
}

const LazyLoading: React.FC<LazyLoadingProps> = ({
    size = 'md',
    message,
    fullScreen = false
}) => {
    const { t } = useLanguage();

    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16'
    };

    const containerClasses = fullScreen
        ? 'min-h-screen flex items-center justify-center bg-[var(--bg-app)]'
        : 'h-[60vh] flex items-center justify-center';

    return (
        <div className={containerClasses}>
            <div className="flex flex-col items-center gap-4 animate-fade-in-up">
                {/* Premium Loading Animation */}
                <div className="relative">
                    {/* Outer glow ring */}
                    <div className={`absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse ${sizeClasses[size]}`}></div>

                    {/* Main spinner */}
                    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
                        <Loader2
                            className="text-emerald-500 animate-spin"
                            size={size === 'sm' ? 24 : size === 'md' ? 40 : 64}
                        />
                    </div>

                    {/* Decorative dots */}
                    <div className="absolute -top-2 -right-2 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                    <div className="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-teal-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                </div>

                {/* Loading text */}
                {message !== undefined ? (
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] animate-pulse">
                        {message}
                    </p>
                ) : (
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] animate-pulse">
                        {t('loading')}
                    </p>
                )}
            </div>
        </div>
    );
};

// Skeleton variants for different content types
export const CardSkeleton: React.FC = () => (
    <div className="bg-[var(--bg-card)] rounded-[2.5rem] p-8 border border-[var(--border-main)] relative overflow-hidden group">
        <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl skeleton-premium relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent"></div>
            </div>
            <div className="flex-1 space-y-3">
                <div className="h-4 w-3/4 skeleton-premium rounded-lg"></div>
                <div className="h-3 w-1/2 skeleton-premium rounded-lg opacity-60"></div>
            </div>
        </div>
        <div className="mt-8 space-y-4">
            <div className="h-20 w-full skeleton-premium rounded-[2rem]"></div>
            <div className="flex gap-3">
                <div className="h-12 flex-1 skeleton-premium rounded-xl"></div>
                <div className="h-12 flex-1 skeleton-premium rounded-xl"></div>
            </div>
        </div>
    </div>
);

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
    <div className="space-y-4">
        {Array(count).fill(0).map((_, i) => (
            <CardSkeleton key={i} />
        ))}
    </div>
);

export const DashboardSkeleton: React.FC = () => (
    <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex justify-between items-center">
            <div className="space-y-2">
                <div className="h-8 w-48 skeleton-premium"></div>
                <div className="h-3 w-32 skeleton-premium"></div>
            </div>
            <div className="w-12 h-12 rounded-xl skeleton-premium"></div>
        </div>

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-2 gap-4">
            {Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-[var(--bg-card)] rounded-2xl p-4 border border-[var(--border-main)]">
                    <div className="w-8 h-8 rounded-xl skeleton-premium mb-3"></div>
                    <div className="h-6 w-16 skeleton-premium mb-2"></div>
                    <div className="h-3 w-24 skeleton-premium"></div>
                </div>
            ))}
        </div>

        {/* List skeleton */}
        <ListSkeleton count={2} />
    </div>
);

export default LazyLoading;
