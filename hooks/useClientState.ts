
import { useState, useEffect } from 'react';

export const useClientState = () => {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [recentlyVisited, setRecentlyVisited] = useState<string[]>([]);

    useEffect(() => {
        const favs = localStorage.getItem('navbat_favorites');
        if (favs) setFavorites(JSON.parse(favs));

        const recent = localStorage.getItem('navbat_recent');
        if (recent) setRecentlyVisited(JSON.parse(recent));
    }, []);

    const toggleFavorite = (orgId: string) => {
        const newFavs = favorites.includes(orgId)
            ? favorites.filter(id => id !== orgId)
            : [...favorites, orgId];
        setFavorites(newFavs);
        localStorage.setItem('navbat_favorites', JSON.stringify(newFavs));
    };

    const addRecent = (orgId: string) => {
        const newRecent = [orgId, ...recentlyVisited.filter(id => id !== orgId)].slice(0, 5);
        setRecentlyVisited(newRecent);
        localStorage.setItem('navbat_recent', JSON.stringify(newRecent));
    };

    return {
        favorites,
        recentlyVisited,
        toggleFavorite,
        addRecent
    };
};
