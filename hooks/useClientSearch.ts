
import { useState } from 'react';

export const useClientSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'ALL' | 'NEARBY' | 'POPULAR'>('ALL');
    const [isListening, setIsListening] = useState(false);

    return {
        searchQuery, setSearchQuery,
        activeFilter, setActiveFilter,
        isListening, setIsListening
    };
};
