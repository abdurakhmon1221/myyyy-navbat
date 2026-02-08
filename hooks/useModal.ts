
import { useState, useCallback } from 'react';

export const useModal = <T extends string>(initialModals: T[]) => {
    const [modals, setModals] = useState<Record<T, boolean>>(
        initialModals.reduce((acc, modal) => ({ ...acc, [modal]: false }), {} as Record<T, boolean>)
    );

    const openModal = useCallback((modal: T) => {
        setModals(prev => ({ ...prev, [modal]: true }));
    }, []);

    const closeModal = useCallback((modal: T) => {
        setModals(prev => ({ ...prev, [modal]: false }));
    }, []);

    const toggleModal = useCallback((modal: T) => {
        setModals(prev => ({ ...prev, [modal]: !prev[modal] }));
    }, []);

    return {
        modals,
        openModal,
        closeModal,
        toggleModal
    };
};
