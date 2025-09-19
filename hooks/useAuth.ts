
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AUTH_KEY = 'chwAuthToken';

export const useAuth = () => {
    // Initialize state from localStorage
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem(AUTH_KEY));
    const navigate = useNavigate();

    // Effect to listen for storage changes from other tabs
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === AUTH_KEY) {
                setIsAuthenticated(!!event.newValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const login = useCallback((token: string) => {
        localStorage.setItem(AUTH_KEY, token);
        setIsAuthenticated(true);
        navigate('/chw');
    }, [navigate]);

    const logout = useCallback(() => {
        localStorage.removeItem(AUTH_KEY);
        setIsAuthenticated(false);
        navigate('/chw/login');
    }, [navigate]);

    return { isAuthenticated, login, logout };
};