'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Loader2, RefreshCcw } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock Login Logic
        // In a real app, this would call an API
        if (email && password) {
            // Determine role based on email for demo purposes
            let role = 'user';
            if (email.includes('admin')) role = 'admin';
            if (email.includes('architect')) role = 'architect';
            if (email.includes('exec')) role = 'executive';

            const mockUser = {
                id: '1',
                name: email.split('@')[0],
                email,
                role,
                avatar: 'https://github.com/shadcn.png'
            };

            login('mock-jwt-token', mockUser);
            router.push('/dashboard');
        } else {
            setError('Please enter email and password');
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <div className="w-full max-w-sm lg:max-w-4xl grid lg:grid-cols-2 gap-4 bg-background rounded-2xl shadow-xl overflow-hidden border border-border">

                {/* Left Side - Visual */}
                <div className="hidden lg:flex flex-col justify-between p-10 bg-zinc-900 text-white relative">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-lg font-bold">
                            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur">
                                <RefreshCcw className="w-5 h-5" />
                            </div>
                            The Insight Compass
                        </div>
                    </div>
                    <div className="relative z-10 space-y-4">
                        <blockquote className="space-y-2">
                            <p className="text-lg font-medium leading-relaxed">
                                &ldquo;This platform has completely transformed how we visualize and manage our enterprise architecture. The insight map is a game changer.&rdquo;
                            </p>
                            <footer className="text-sm text-white/80">
                                Sofia Davis, Lead Architect
                            </footer>
                        </blockquote>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                    <div className="flex flex-col space-y-2 text-center mb-8">
                        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-destructive font-medium bg-destructive/10 p-3 rounded-md"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-full"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Sign In
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        <p>Demo Credentials:</p>
                        <div className="mt-2 text-xs bg-muted/50 p-3 rounded-lg border border-border">
                            <p><code className="font-mono">admin@example.com</code> (Admin)</p>
                            <p><code className="font-mono">architect@example.com</code> (Architect)</p>
                            <p><code className="font-mono">user@example.com</code> (User)</p>
                            <p className="mt-1">Pass: any</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
