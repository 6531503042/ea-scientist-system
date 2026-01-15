import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, AlertTriangle, Layers, Database, Cpu, Link, Shield, Briefcase, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArtefactType, RiskLevel } from '@/data/mockData';

interface CreateArtefactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

const typeIcons: Record<ArtefactType, React.ElementType> = {
    business: Briefcase,
    data: Database,
    application: Layers,
    technology: Cpu,
    integration: Link,
    security: Shield,
};

export function CreateArtefactModal({ isOpen, onClose, onSubmit }: CreateArtefactModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        nameTh: '',
        type: 'application' as ArtefactType,
        description: '',
        owner: '',
        department: '',
        riskLevel: 'low' as RiskLevel,
        version: '1.0',
        status: 'draft'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        onSubmit(formData);
        setLoading(false);
        onClose();
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-background rounded-xl border shadow-xl p-6 overflow-y-auto max-h-[90vh]"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold">เพิ่ม Artefact ใหม่</h2>
                            <p className="text-sm text-muted-foreground">กรอกข้อมูลเพื่อสร้าง Artefact ในระบบ</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">ชื่อ (English)</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. HR System"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nameTh">ชื่อ (ไทย)</Label>
                                    <Input
                                        id="nameTh"
                                        placeholder="e.g. ระบบทรัพยากรบุคคล"
                                        value={formData.nameTh}
                                        onChange={(e) => handleChange('nameTh', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>ประเภท</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(val) => handleChange('type', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="business">Business Process</SelectItem>
                                        <SelectItem value="application">Application</SelectItem>
                                        <SelectItem value="data">Data Asset</SelectItem>
                                        <SelectItem value="technology">Technology</SelectItem>
                                        <SelectItem value="security">Security</SelectItem>
                                        <SelectItem value="integration">Integration</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">รายละเอียด</Label>
                                <Textarea
                                    id="description"
                                    placeholder="คำอธิบายเกี่ยวกับ Artefact นี้..."
                                    className="h-24 resize-none"
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="owner">ผู้รับผิดชอบ (Owner)</Label>
                                    <Input
                                        id="owner"
                                        placeholder="ชื่อผู้รับผิดชอบ"
                                        value={formData.owner}
                                        onChange={(e) => handleChange('owner', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department">หน่วยงาน</Label>
                                    <Input
                                        id="department"
                                        placeholder="สังกัดหน่วยงาน"
                                        value={formData.department}
                                        onChange={(e) => handleChange('department', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>ความเสี่ยง</Label>
                                    <Select
                                        value={formData.riskLevel}
                                        onValueChange={(val) => handleChange('riskLevel', val)}
                                    >
                                        <SelectTrigger className={cn(
                                            formData.riskLevel === 'high' && "text-destructive font-medium",
                                            formData.riskLevel === 'medium' && "text-warning font-medium",
                                            formData.riskLevel === 'low' && "text-success font-medium"
                                        )}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">ต่ำ</SelectItem>
                                            <SelectItem value="medium">ปานกลาง</SelectItem>
                                            <SelectItem value="high">สูง</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="version">Version</Label>
                                    <Input
                                        id="version"
                                        placeholder="1.0"
                                        value={formData.version}
                                        onChange={(e) => handleChange('version', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>สถานะ</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(val) => handleChange('status', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="deprecated">Deprecated</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t">
                            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                                ยกเลิก
                            </Button>
                            <Button type="submit" className="flex-1" disabled={loading}>
                                {loading ? 'กำลังสร้าง...' : 'สร้าง Artefact'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
