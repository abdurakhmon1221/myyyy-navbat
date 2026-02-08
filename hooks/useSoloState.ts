
import { useState, useEffect } from 'react';
import { QueueItem } from '../types';

/** Strict interface for Solo operator dashboard state */
interface SoloState {
    servingTicket: QueueItem | null;
    isPaused: boolean;
    isBusy: boolean;
    serviceTimer: number;
    breakTimer: number;
    currentNote: string;
    lastUpdated: number;
}

const getDefaultState = (): SoloState => ({
    servingTicket: null,
    isPaused: false,
    isBusy: false,
    serviceTimer: 0,
    breakTimer: 0,
    currentNote: "",
    lastUpdated: Date.now()
});

export const useSoloState = (organizationId: string) => {
    const storageKey = `navbat_solo_state_${organizationId}`;

    // Initialize state from localStorage
    const [state, setState] = useState<SoloState>(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                return JSON.parse(saved) as SoloState;
            } catch (e) {
                console.error("Failed to parse solo state", e);
            }
        }
        return getDefaultState();
    });

    // Sync state to localStorage
    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(state));
    }, [state, storageKey]);

    // Timers
    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | undefined;
        if (state.servingTicket && !state.isPaused) {
            timer = setInterval(() => {
                setState((prev: SoloState) => ({ ...prev, serviceTimer: prev.serviceTimer + 1, lastUpdated: Date.now() }));
            }, 1000);
        } else if (state.isPaused) {
            timer = setInterval(() => {
                setState((prev: SoloState) => ({ ...prev, breakTimer: prev.breakTimer + 1, lastUpdated: Date.now() }));
            }, 1000);
        }
        return () => { if (timer) clearInterval(timer); };
    }, [state.servingTicket, state.isPaused]);

    const setServingTicket = (ticket: QueueItem | null) => {
        setState((prev: SoloState) => ({ ...prev, servingTicket: ticket, serviceTimer: 0 }));
    };

    const setIsPaused = (paused: boolean) => {
        setState((prev: SoloState) => ({ ...prev, isPaused: paused }));
    };

    const setIsBusy = (busy: boolean) => {
        setState((prev: SoloState) => ({ ...prev, isBusy: busy }));
    };

    const setCurrentNote = (note: string) => {
        setState((prev: SoloState) => ({ ...prev, currentNote: note }));
    };

    const resetTimers = () => {
        setState((prev: SoloState) => ({ ...prev, serviceTimer: 0, breakTimer: 0 }));
    };

    return {
        servingTicket: state.servingTicket,
        isPaused: state.isPaused,
        isBusy: state.isBusy,
        serviceTimer: state.serviceTimer,
        breakTimer: state.breakTimer,
        currentNote: state.currentNote,
        setServingTicket,
        setIsPaused,
        setIsBusy,
        setCurrentNote,
        resetTimers
    };
};
