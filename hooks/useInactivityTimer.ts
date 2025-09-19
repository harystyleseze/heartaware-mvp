
import { useEffect, useCallback, useRef } from 'react';

export const useInactivityTimer = (callback: () => void, timeout = 60000) => {
    const timerRef = useRef<number | null>(null);

    const resetTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = window.setTimeout(callback, timeout);
    }, [callback, timeout]);

    useEffect(() => {
        const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

        const handleActivity = () => {
            resetTimer();
        };

        events.forEach(event => window.addEventListener(event, handleActivity));
        resetTimer(); // Start the timer on mount

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            events.forEach(event => window.removeEventListener(event, handleActivity));
        };
    }, [resetTimer]);

    const stopTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    }, []);

    return { resetTimer, stopTimer };
};
