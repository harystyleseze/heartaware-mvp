
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: string;
    children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ label, id, error, children, className, ...props }) => {
    return (
        <div className="w-full">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <select
                id={id}
                className={`block w-full pl-3 pr-10 py-2 text-base border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
                {...props}
            >
                {children}
            </select>
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
};
