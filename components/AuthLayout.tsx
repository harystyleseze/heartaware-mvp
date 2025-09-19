
import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
    title: string;
    children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
    return (
        <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-auto text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{title}</h2>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                    {children}
                </div>
            </div>
        </div>
    );
};
