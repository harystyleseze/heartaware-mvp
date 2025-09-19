
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import PatientForm from './pages/PatientForm';
import CHWDashboard from './pages/CHWDashboard';
import CHWLogin from './pages/CHWLogin';
import CHWSignUp from './pages/CHWSignUp';
import { Header } from './components/Header';
import { ProtectedRoute } from './components/ProtectedRoute';

const App: React.FC = () => {
    return (
        <HashRouter>
            <div className="min-h-screen bg-gray-50 text-gray-800">
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
