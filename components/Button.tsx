import React from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', isLoading = false, leftIcon, fullWidth = false, className, ...props }) => {
    const baseClasses = "inline-flex items-center justify-center font-semibold py-2.5 px-5 rounded-xl focus:outline-none focus:ring-4 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-sm";

    const variantClasses = {
        primary: 'bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500/50 dark:focus:ring-teal-400/50',
        secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-500/50 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:focus:ring-slate-600/50',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50 dark:focus:ring-red-400/50',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <Spinner size="sm" />
            ) : (
                <>
                    {leftIcon && <span className="mr-2 -ml-1 h-5 w-5">{leftIcon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};