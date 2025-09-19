
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Button } from './Button';

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707.707M6.343 6.343l-.707-.707m12.728 0l-.707-.707M6.343 17.657l-.707.707M12 12a5 5 0 100-10 5 5 0 000 10z" />
    </svg>
);
const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);
const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


export const Header: React.FC = () => {
    const { isAuthenticated, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isLandingPage = location.pathname === '/';

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const handleAnchorLink = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setIsMenuOpen(false);
    };

    const landingPageLinks = [
        { path: '#features', text: 'Features' },
        { path: '#how-it-works', text: 'How It Works' },
        { path: '#faq', text: 'FAQ' },
    ];

    const appLinks = [
        { path: '/', text: 'Home' },
        { path: '/symptom-checker', text: 'Symptom Checker' },
        isAuthenticated ? { path: '/chw', text: 'Dashboard' } : null,
        !isAuthenticated ? { path: '/chw/login', text: 'CHW Login' } : null,
    ].filter(Boolean);

    const navLinks = isLandingPage ? landingPageLinks : appLinks;

    return (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40 shadow-md shadow-slate-500/5 dark:shadow-black/10">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto text-teal-600 dark:text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 3.5a1.5 1.5 0 011.5 1.5v2.879a1.5 1.5 0 01-.44 1.06l-1.62 1.62a.5.5 0 000 .707l1.62 1.62a1.5 1.5 0 01.44 1.06V15a1.5 1.5 0 01-3 0v-1.121a1.5 1.5 0 01.44-1.06l1.62-1.62a.5.5 0 000-.707L8.56 8.94A1.5 1.5 0 018.12 7.88V5A1.5 1.5 0 0110 3.5z" />
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            <span className="font-bold text-xl text-slate-800 dark:text-slate-100">HeartAware</span>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-2">
                        {navLinks.map(link => (
                           isLandingPage ? (
                                <a key={link!.path} href={link!.path} onClick={(e) => handleAnchorLink(e, link!.path)} className="text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    {link!.text}
                                </a>
                           ) : (
                                <Link key={link!.path} to={link!.path} className="text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    {link!.text}
                                </Link>
                           )
                        ))}
                         {isAuthenticated && (
                            <button onClick={logout} className="text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Logout
                            </button>
                        )}
                        <div className="pl-2">
                            <Link to="/symptom-checker">
                                <Button variant="primary" className="!py-2 !px-4 !text-sm">Get Help Now</Button>
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <button onClick={toggleTheme} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                        </button>
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700" aria-controls="mobile-menu" aria-expanded={isMenuOpen}>
                                <span className="sr-only">Open main menu</span>
                                {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                            </button>
                        </div>
                    </div>
                </div>
                 {isMenuOpen && (
                    <div className="md:hidden" id="mobile-menu">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map(link => (
                               isLandingPage ? (
                                    <a key={link!.path} href={link!.path} onClick={(e) => handleAnchorLink(e, link!.path)} className="text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 block px-3 py-2 rounded-md text-base font-medium">
                                        {link!.text}
                                    </a>
                               ) : (
                                    <Link key={link!.path} to={link!.path} className="text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 block px-3 py-2 rounded-md text-base font-medium">
                                        {link!.text}
                                    </Link>
                               )
                            ))}
                             {isAuthenticated && (
                                <button onClick={logout} className="text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 block w-full text-left px-3 py-2 rounded-md text-base font-medium">
                                    Logout
                                </button>
                            )}
                            <div className="pt-2">
                                <Link to="/symptom-checker">
                                    <Button fullWidth variant="primary">Get Help Now</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};