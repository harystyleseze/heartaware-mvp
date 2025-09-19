import React from 'react';
import { Link } from 'react-router-dom';

const SocialIcon: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-500 transition-colors">
        {children}
    </a>
);

export const Footer: React.FC = () => {
    return (
        <footer className="bg-white dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1 space-y-4">
                         <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto text-teal-600 dark:text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 3.5a1.5 1.5 0 011.5 1.5v2.879a1.5 1.5 0 01-.44 1.06l-1.62 1.62a.5.5 0 000 .707l1.62 1.62a1.5 1.5 0 01.44 1.06V15a1.5 1.5 0 01-3 0v-1.121a1.5 1.5 0 01.44-1.06l1.62-1.62a.5.5 0 000-.707L8.56 8.94A1.5 1.5 0 018.12 7.88V5A1.5 1.5 0 0110 3.5z" />
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            <span className="font-bold text-xl text-slate-800 dark:text-slate-100">HeartAware</span>
                        </Link>
                        <p className="text-sm text-slate-500 dark:text-slate-400">AI-powered cardiac triage connecting communities with life-saving care.</p>
                        <div className="flex space-x-4">
                            <SocialIcon href="#">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                            </SocialIcon>
                            <SocialIcon href="#">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                            </SocialIcon>
                        </div>
                    </div>
                    <div className="md:col-span-1"></div>
                     <div className="md:col-span-1">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 tracking-wider uppercase">Navigate</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link to="/" className="text-base text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400">Home</Link></li>
                            <li><Link to="/symptom-checker" className="text-base text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400">Symptom Checker</Link></li>
                            <li><Link to="/chw/login" className="text-base text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400">CHW Portal</Link></li>
                        </ul>
                    </div>
                     <div className="md:col-span-1">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 tracking-wider uppercase">Legal</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400">Privacy Policy</a></li>
                            <li><a href="#" className="text-base text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700/50 text-center text-sm text-slate-500 dark:text-slate-400">
                    <p>&copy; {new Date().getFullYear()} HeartAware NG. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};
