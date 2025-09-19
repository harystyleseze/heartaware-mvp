
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

export const Header: React.FC = () => {
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const { theme, toggleTheme } = useTheme();
    
    return (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg sticky top-0 z-40 border-b border-slate-200 dark:border-slate-700/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600 dark:text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 3.5a1.5 1.5 0 011.5 1.5v2.879a1.5 1.5 0 01-.44 1.06l-1.62 1.62a.5.5 0 000 .707l1.62 1.62a1.5 1.5 0 01.44 1.06V15a1.5 1.5 0 01-3 0v-1.121a1.5 1.5 0 01.44-1.06l1.62-1.62a.5.5 0 000-.707L8.56 8.94A1.5 1.5 0 018.12 7.88V5A1.5 1.5 0 0110 3.5z" />
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xl font-bold text-slate-800 dark:text-slate-100">HeartAware NG</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link 
                            to="/" 
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-teal-600 bg-teal-50 dark:bg-slate-800 dark:text-teal-400' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
                        >
                            Patient Form
                        </Link>
                        {isAuthenticated ? (
                             <Link 
                                to="/chw"
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname.startsWith('/chw') ? 'text-teal-600 bg-teal-50 dark:bg-slate-800 dark:text-teal-400' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
                            >
                                CHW Dashboard
                            </Link>
                        ) : (
                             <Link 
                                to="/chw/login"
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname.startsWith('/chw') ? 'text-teal-600 bg-teal-50 dark:bg-slate-800 dark:text-teal-400' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
                            >
                                CHW Portal
                            </Link>
                        )}
                        <button onClick={toggleTheme} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
                            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};