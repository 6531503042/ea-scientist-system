import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, Mail, Building, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from '@/context/LanguageContext';

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

export function CreateUserModal({ isOpen, onClose, onSubmit }: CreateUserModalProps) {
    const { t, language } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'viewer',
        department: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert(language === 'th' ? 'รหัสผ่านไม่ตรงกัน' : 'Passwords do not match');
            return;
        }
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        onSubmit(formData);
        setLoading(false);
        onClose();
        setFormData({ name: '', email: '', role: 'viewer', department: '', password: '', confirmPassword: '' });
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-background rounded-xl border shadow-xl p-6 overflow-y-auto max-h-[90vh]"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold">{t('admin.addNewUser')}</h2>
                            <p className="text-sm text-muted-foreground">{t('admin.fillUserParams')}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">{t('admin.fullName')}</Label>
                            <Input
                                id="name"
                                placeholder={language === 'th' ? "e.g. สมชาย ใจดี" : "e.g. John Doe"}
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">{t('admin.email')}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="e.g. somchai@dss.go.th"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>{t('admin.role')}</Label>
                            <Select value={formData.role} onValueChange={(val) => handleChange('role', val)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">{language === 'th' ? 'ผู้ดูแลระบบ (Admin)' : 'Admin'}</SelectItem>
                                    <SelectItem value="architect">{language === 'th' ? 'Enterprise Architect' : 'Enterprise Architect'}</SelectItem>
                                    <SelectItem value="business_owner">{language === 'th' ? 'เจ้าของกระบวนการ' : 'Business Owner'}</SelectItem>
                                    <SelectItem value="auditor">{language === 'th' ? 'ผู้ตรวจสอบ' : 'Auditor'}</SelectItem>
                                    <SelectItem value="viewer">{language === 'th' ? 'ผู้ดู (Viewer)' : 'Viewer'}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="department">{t('detail.department')}</Label>
                            <Input
                                id="department"
                                placeholder={language === 'th' ? "e.g. ศูนย์เทคโนโลยีสารสนเทศ" : "e.g. IT Center"}
                                value={formData.department}
                                onChange={(e) => handleChange('department', e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">{t('admin.password')}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">{t('admin.confirmPassword')}</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t">
                            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                                {t('detail.cancel')}
                            </Button>
                            <Button type="submit" className="flex-1" disabled={loading}>
                                {loading ? (language === 'th' ? 'กำลังสร้าง...' : 'Creating...') : (language === 'th' ? 'สร้างบัญชี' : 'Create Account')}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
