import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

const getInitialTheme = (): Theme => {
    // This function runs only on the client, so window should be available.
    // We check for `window` to avoid errors during server-side rendering.
    if (typeof window === 'undefined') {
        return 'light';
    }
    
    // The logic mirrors the inline script in `index.html` to prevent FOUC (Flash of Unstyled Content).
    // 1. Check for a theme saved in localStorage.
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
    }

    // 2. If no theme is stored, check the user's OS-level preference.
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    
    // 3. Default to 'light' theme.
    return 'light';
};


export const useTheme = () => {
    // Initialize state synchronously with the correct theme to avoid a flicker.
    // The function `getInitialTheme` is only called once on the initial render.
    const [theme, setTheme] = useState<Theme>(getInitialTheme);
    
    // This effect applies the theme class to the <html> element
    // and persists the theme choice in localStorage whenever the `theme` state changes.
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    }, []);

    return { theme, toggleTheme };
};
