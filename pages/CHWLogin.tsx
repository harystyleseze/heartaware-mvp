
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AuthLayout } from '../components/AuthLayout';
import { useAuth } from '../hooks/useAuth';
import { chwLogin } from '../services/apiService';

const CHWLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError("Both fields are required.");
            return;
        }
        setIsLoading(true);
        try {
            const response = await chwLogin(email, password);
            login(response.token);
        } catch (err: any) {
            setError(err.message || "Failed to log in. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="CHW Portal Login">
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                />
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                <Button type="submit" fullWidth isLoading={isLoading}>
                    Sign In
                </Button>
                <p className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/chw/signup" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign up
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default CHWLogin;
