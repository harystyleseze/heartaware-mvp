
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: string;
    children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ label, id, error, children, className, ...props }) => {
    return (
        <div className="w-full">
            <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
            <select
                id={id}
                className={`block w-full pl-3 pr-10 py-2.5 text-base border rounded-lg focus:outline-none focus:ring-2 sm:text-sm bg-white dark:bg-slate-800
                 ${error 
                    ? 'border-red-500 dark:border-red-500/80 focus:ring-red-500/50 focus:border-red-500' 
                    : 'border-slate-300 dark:border-slate-600 focus:ring-teal-500/50 focus:border-teal-500 dark:focus:border-teal-400'} 
                 ${className}`}
                {...props}
            >
                {children}
            </select>
            {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
};