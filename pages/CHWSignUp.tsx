
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AuthLayout } from '../components/AuthLayout';
import { useAuth } from '../hooks/useAuth';
import { chwSignUp } from '../services/apiService';
import { PHONE_REGEX } from '../constants';

const CHWSignUp: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('+234');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!PHONE_REGEX.test(phone)) {
            setError("Please enter a valid Nigerian phone number (e.g., +2348012345678).");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await chwSignUp({ fullName, email, phone, password });
            login(response.token); // Log in immediately after sign up
        } catch (err: any) {
            setError(err.message || "Failed to sign up. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Create CHW Account">
            <form className="space-y-4" onSubmit={handleSubmit}>
                 <Input
                    id="fullName"
                    label="Full Name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    autoComplete="name"
                />
                <Input
                    id="email"
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                />
                <Input
                    id="phone"
                    label="Phone Number"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    autoComplete="tel"
                />
                <Input
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                />

                {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}

                <div className="pt-2">
                    <Button type="submit" fullWidth isLoading={isLoading}>
                        Create Account
                    </Button>
                </div>
                <p className="text-center text-sm text-gray-600 dark:text-slate-400">
                    Already have an account?{' '}
                    <Link to="/chw/login" className="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300">
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default CHWSignUp;