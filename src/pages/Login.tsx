import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, User, Eye, EyeOff, Copy, Check, Network } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from 'framer-motion';

const API_BASE = '/api/v1';

const testAccounts = {
    admin: [
        { name: 'ผู้ดูแลระบบ', email: 'admin@dss.go.th', password: 'password123', role: 'admin' },
    ],
    architect: [
        { name: 'Somchai A.', email: 'somchai@dss.go.th', password: 'password123', role: 'architect' },
    ],
    executive: [
        { name: 'Director N.', email: 'director@dss.go.th', password: 'password123', role: 'executive' },
    ],
};

interface TestAccountRowProps {
    name: string;
    email: string;
    password: string;
    onUse: (email: string, password: string) => void;
}

function TestAccountRow({ name, email, password, onUse }: TestAccountRowProps) {
    const [copied, setCopied] = useState<'email' | 'password' | null>(null);

    const copyToClipboard = (text: string, type: 'email' | 'password') => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="flex items-center justify-between py-3 px-4 hover:bg-muted/50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <p className="font-medium text-sm">{name}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>{email}</span>
                        <button
                            onClick={() => copyToClipboard(email, 'email')}
                            className="p-0.5 hover:bg-muted rounded"
                        >
                            {copied === 'email' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                    <span>{password}</span>
                    <button
                        onClick={() => copyToClipboard(password, 'password')}
                        className="p-0.5 hover:bg-background rounded"
                    >
                        {copied === 'password' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                </div>
                <Button size="sm" onClick={() => onUse(email, password)}>
                    ใช้บัญชีนี้
                </Button>
            </div>
        </div>
    );
}

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState<'admin' | 'architect' | 'executive'>('architect');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [testAccountsOpen, setTestAccountsOpen] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    // Mock login handler
    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!email || !password) return;

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            // Mock successful login with selected role
            const mockUser = {
                id: 'user-1',
                email: email,
                name: email.split('@')[0],
                role: selectedRole
            };

            login('mock-jwt-token', mockUser);

            toast({
                title: "เข้าสู่ระบบสำเร็จ",
                description: `ยินดีต้อนรับกลับเข้าสู่ระบบในฐานะ ${selectedRole}`,
            });

            navigate('/');
            setLoading(false);
        }, 800);
    };

    const useTestAccount = (testEmail: string, testPassword: string, role: string) => {
        setEmail(testEmail);
        setPassword(testPassword);
        setSelectedRole(role as any);
        setTestAccountsOpen(false);
        toast({
            title: "เลือกบัญชีทดสอบแล้ว",
            description: `กรุณากดเข้าสู่ระบบเพื่อดำเนินการต่อในฐานะ ${role}`,
        });
    };

    return (
        <div className="flex min-h-screen">
            {/* Left side - Branding */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex-col items-center justify-center p-12 relative overflow-hidden"
            >
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 text-center text-primary-foreground">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Network className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">EA Management System</h1>
                    <p className="text-primary-foreground/80 max-w-md">
                        ระบบจัดการสถาปัตยกรรมองค์กร
                        <br />
                        กรมวิทยาศาสตร์บริการ
                    </p>
                </div>
            </motion.div>

            {/* Right side - Login Form */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 flex items-center justify-center p-8 bg-background"
            >
                <Card className="w-full max-w-md border-0 shadow-lg">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl">เข้าสู่ระบบ</CardTitle>
                        <CardDescription>
                            กรอกอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบ
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            {/* Role Selection */}


                            <div className="space-y-2">
                                <Label htmlFor="email">อีเมล</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@dss.go.th"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">รหัสผ่าน</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-11 pr-10"
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

                            <Button type="submit" className="w-full h-11" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                เข้าสู่ระบบ
                            </Button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">หรือ</span>
                            </div>
                        </div>

                        {/* Test Accounts Button */}
                        <Dialog open={testAccountsOpen} onOpenChange={setTestAccountsOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full h-11">
                                    <User className="mr-2 h-4 w-4" />
                                    ดูบัญชีทดสอบ
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>บัญชีผู้ใช้งานทดสอบ</DialogTitle>
                                    <DialogDescription>
                                        รายการบัญชีทั้งหมด {Object.values(testAccounts).flat().length} บัญชี - คลิกเพื่อใช้งานหรือคัดลอกข้อมูล
                                    </DialogDescription>
                                </DialogHeader>

                                <Tabs defaultValue="admin" className="mt-4">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="architect" className="text-xs">
                                            Architect <span className="ml-1 text-muted-foreground">{testAccounts.architect.length}</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="executive" className="text-xs">
                                            Executive <span className="ml-1 text-muted-foreground">{testAccounts.executive.length}</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="admin" className="text-xs">
                                            Admin <span className="ml-1 text-muted-foreground">{testAccounts.admin.length}</span>
                                        </TabsTrigger>
                                    </TabsList>

                                    {Object.entries(testAccounts).map(([role, accounts]) => (
                                        <TabsContent key={role} value={role}>
                                            <ScrollArea className="h-[300px] pr-4">
                                                <div className="space-y-1">
                                                    {accounts.map((acc) => (
                                                        <TestAccountRow
                                                            key={acc.email}
                                                            name={acc.name}
                                                            email={acc.email}
                                                            password={acc.password}
                                                            onUse={(e, p) => useTestAccount(e, p, acc.role)}
                                                        />
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </TabsContent>
                                    ))}
                                </Tabs>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
