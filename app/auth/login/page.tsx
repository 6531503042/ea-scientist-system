'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, User, Eye, EyeOff, Copy, Check, Network } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Image from 'next/image';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const { login } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const searchParams = useSearchParams();

    const redirectPath = searchParams.get('redirect') || '/dashboard';

    const testAccounts = [
        { role: 'Admin', email: 'admin@example.com', pass: 'admin123', desc: 'Full system access' },
        { role: 'Manager', email: 'manager@example.com', pass: 'manager123', desc: 'Department management' },
        { role: 'User', email: 'user@example.com', pass: 'user123', desc: 'Standard access' },
    ];

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);

            toast({
                title: "เข้าสู่ระบบสำเร็จ",
                description: "กำลังพาท่านไปยังหน้าหลัก...",
                className: "bg-emerald-50 border-emerald-200 text-emerald-800",
            });

            // Simple delay for UX
            setTimeout(() => {
                router.push(redirectPath);
            }, 500);

        } catch (error: any) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "เข้าสู่ระบบไม่สำเร็จ",
                description: error.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
            });
            setLoading(false);
        }
    };

    const handleTestLogin = (acc: typeof testAccounts[0]) => {
        setEmail(acc.email);
        setPassword(acc.pass);
        toast({
            title: "Auto-filled credentials",
            description: `Selected ${acc.role} account`,
        });
    };

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-900 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-90" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />

                <div className="relative z-10 flex flex-col justify-between h-full p-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-3"
                    >
                        <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
                            <Network className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Enterprise Architecture</span>
                    </motion.div>

                    <div className="space-y-6 max-w-lg">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-5xl font-bold leading-tight"
                        >
                            Analyze. Design. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-pink-200">
                                Transform.
                            </span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="text-lg text-slate-200 leading-relaxed"
                        >
                            A comprehensive platform for managing enterprise architecture artifacts,
                            visualizing relationships, and driving digital transformation.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex items-center gap-4 text-sm text-slate-400"
                    >
                        <span>© 2024 Your Organization</span>
                        <div className="w-1 h-1 rounded-full bg-slate-500" />
                        <span>v2.0.0</span>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 -z-10" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-8 lg:hidden">
                        <div className="inline-flex p-3 bg-indigo-600 rounded-xl shadow-lg mb-4">
                            <Network className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Enterprise Architecture</h1>
                    </div>

                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                        <CardHeader className="space-y-1 pb-6">
                            <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
                            <CardDescription className="text-center">
                                Enter your credentials to access your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10 h-11 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                                            Forgot password?
                                        </a>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-3 pr-10 h-11 bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg shadow-indigo-500/20 transition-all duration-200"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        "Sign in"
                                    )}
                                </Button>
                            </form>

                            {/* Test Account Helper */}
                            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="w-full text-xs text-muted-foreground hover:text-indigo-600 hover:border-indigo-200 dark:hover:border-indigo-900 border-dashed">
                                            Need a test account?
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Test Accounts</DialogTitle>
                                            <DialogDescription>
                                                Click to copy credentials or auto-fill the login form.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            {testAccounts.map((acc, index) => (
                                                <div key={acc.email} className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-900 hover:border-indigo-200 transition-colors flex items-center justify-between group">
                                                    <div
                                                        className="space-y-1 cursor-pointer flex-1"
                                                        onClick={() => handleTestLogin(acc)}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-sm">{acc.role}</span>
                                                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                                {acc.pass}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">{acc.desc}</p>
                                                        <p className="text-xs text-slate-400">{acc.email}</p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => copyToClipboard(acc.email, index)}
                                                    >
                                                        {copiedIndex === index ? (
                                                            <Check className="h-4 w-4 text-emerald-500" />
                                                        ) : (
                                                            <Copy className="h-4 w-4 text-slate-400" />
                                                        )}
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>

                        </CardContent>
                    </Card>

                    <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                        Don't have an account?{" "}
                        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors">
                            Contact Administrator
                        </a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
