
import React from 'react';

interface AuthLayoutProps {
    title: string;
    children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
    return (
        <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="flex justify-center">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-auto text-teal-600 dark:text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 3.5a1.5 1.5 0 011.5 1.5v2.879a1.5 1.5 0 01-.44 1.06l-1.62 1.62a.5.5 0 000 .707l1.62 1.62a1.5 1.5 0 01.44 1.06V15a1.5 1.5 0 01-3 0v-1.121a1.5 1.5 0 01.44-1.06l1.62-1.62a.5.5 0 000-.707L8.56 8.94A1.5 1.5 0 018.12 7.88V5A1.5 1.5 0 0110 3.5z" />
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-slate-100">{title}</h2>
                </div>
                <div className="bg-white dark:bg-slate-800/50 p-8 rounded-2xl shadow-2xl shadow-slate-500/10 dark:shadow-black/20">
                    {children}
                </div>
            </div>
        </div>
    );
};