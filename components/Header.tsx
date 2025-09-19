
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Header: React.FC = () => {
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    
    return (
        <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 border-b border-slate-200">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xl font-bold text-slate-800">HeartAware NG</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link 
                            to="/" 
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:bg-slate-100'}`}
                        >
                            Patient Form
                        </Link>
                        {isAuthenticated ? (
                             <Link 
                                to="/chw"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname.startsWith('/chw') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                                CHW Dashboard
                            </Link>
                        ) : (
                             <Link 
                                to="/chw/login"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname.startsWith('/chw') ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                                CHW Portal
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};
