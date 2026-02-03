
import React from 'react';
import { CATEGORY_LIST } from '../../constants';
import { CategorySkeleton } from '../Skeleton';

interface CategoryGridProps {
    isLoading: boolean;
    onSelect: (id: string) => void;
    haptics: any;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ isLoading, onSelect, haptics }) => {
    return (
        <div className="grid grid-cols-4 gap-3">
            {isLoading ? (
                Array(4).fill(0).map((_, i) => <CategorySkeleton key={i} />)
            ) : (
                CATEGORY_LIST.slice(0, 4).map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => { haptics.light(); onSelect(cat.id); }}
                        className="flex flex-col items-center justify-center p-3 aspect-square rounded-[1.75rem] bg-[var(--bg-card)] border border-[var(--border-main)] shadow-sm active:scale-90 transition-all group"
                    >
                        <div className="text-emerald-600 transition-transform group-hover:scale-110 mb-1">{cat.icon}</div>
                        <span className="text-[7px] font-black uppercase text-center leading-tight text-[var(--text-muted)]">{cat.label.split(' ')[0]}</span>
                    </button>
                ))
            )}
        </div>
    );
};

export default CategoryGrid;
