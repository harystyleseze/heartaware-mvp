
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import PatientForm from './pages/PatientForm';
import CHWDashboard from './pages/CHWDashboard';
import CHWLogin from './pages/CHWLogin';
import CHWSignUp from './pages/CHWSignUp';
import { Header } from './components/Header';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useTheme } from './hooks/useTheme';

const App: React.FC = () => {
    useTheme(); // Initialize theme

    return (
        <HashRouter>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300">
                <Header />
                <main className="p-4 sm:p-6 md:p-8">
                    <Routes>
                        <Route path="/" element={<PatientForm />} />
                        <Route path="/chw/login" element={<CHWLogin />} />
                        <Route path="/chw/signup" element={<CHWSignUp />} />
                        
                        <Route element={<ProtectedRoute />}>
                            <Route path="/chw" element={<CHWDashboard />} />
                        </Route>
                    </Routes>
                </main>
            </div>
        </HashRouter>
    );
};

export default App;