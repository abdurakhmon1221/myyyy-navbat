import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'rectangular' | 'circular' | 'text';
    width?: string | number;
    height?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'rectangular',
    width,
    height
}) => {
    const baseStyles = "animate-pulse bg-gray-200 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent";

    const variantStyles = {
        rectangular: 'rounded-2xl',
        circular: 'rounded-full',
        text: 'rounded-md h-4 w-full'
    };

    const style: React.CSSProperties = {
        width: width,
        height: height
    };

    return (
        <div
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            style={style}
        />
    );
};

export const OrgCardSkeleton = () => (
    <div className="glass rounded-[2.5rem] p-6 shadow-sm border border-gray-100 space-y-5">
        <div className="flex items-center gap-5">
            <Skeleton variant="rectangular" width={64} height={64} className="rounded-[1.5rem]" />
            <div className="flex-1 space-y-2">
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="40%" height={12} />
            </div>
        </div>
        <div className="flex gap-2">
            <Skeleton variant="rectangular" height={48} className="flex-[2] rounded-2xl" />
            <Skeleton variant="rectangular" height={48} className="flex-1 rounded-2xl" />
        </div>
    </div>
);

export const CategorySkeleton = () => (
    <div className="flex flex-col items-center justify-center p-4 aspect-square rounded-[2rem] border-2 border-gray-100 bg-white space-y-2">
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="text" width="80%" height={10} />
    </div>
);

export default Skeleton;
