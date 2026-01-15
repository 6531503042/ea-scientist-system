import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Calendar, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

export function CreateReportModal({ isOpen, onClose, onSubmit }: CreateReportModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'executive-summary',
        dateFrom: '',
        dateTo: '',
        description: '',
        format: 'pdf'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        onSubmit(formData);
        setLoading(false);
        onClose();
        setFormData({ name: '', type: 'executive-summary', dateFrom: '', dateTo: '', description: '', format: 'pdf' });
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
                            <h2 className="text-xl font-bold">สร้างรายงานใหม่</h2>
                            <p className="text-sm text-muted-foreground">กำหนดค่าและสร้างรายงาน</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">ชื่อรายงาน</Label>
                            <Input
                                id="name"
                                placeholder="e.g. รายงานประจำเดือน มกราคม 2567"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>ประเภทรายงาน</Label>
                            <Select value={formData.type} onValueChange={(val) => handleChange('type', val)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="executive-summary">รายงานสรุปผู้บริหาร</SelectItem>
                                    <SelectItem value="risk-assessment">รายงานการประเมินความเสี่ยง</SelectItem>
                                    <SelectItem value="coverage-analysis">รายงานความครอบคลุมภารกิจ</SelectItem>
                                    <SelectItem value="dependency-map">รายงานความสัมพันธ์ระบบ</SelectItem>
                                    <SelectItem value="change-log">รายงานการเปลี่ยนแปลง</SelectItem>
                                    <SelectItem value="compliance-report">รายงานการปฏิบัติตามมาตรฐาน</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dateFrom">ตั้งแต่วันที่</Label>
                                <Input
                                    id="dateFrom"
                                    type="date"
                                    value={formData.dateFrom}
                                    onChange={(e) => handleChange('dateFrom', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dateTo">ถึงวันที่</Label>
                                <Input
                                    id="dateTo"
                                    type="date"
                                    value={formData.dateTo}
                                    onChange={(e) => handleChange('dateTo', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">รายละเอียดเพิ่มเติม</Label>
                            <Textarea
                                id="description"
                                placeholder="หมายเหตุหรือคำอธิบายเพิ่มเติม..."
                                className="h-20 resize-none"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>รูปแบบไฟล์</Label>
                            <Select value={formData.format} onValueChange={(val) => handleChange('format', val)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pdf">PDF</SelectItem>
                                    <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                                    <SelectItem value="docx">Word (DOCX)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-3 pt-4 border-t">
                            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                                ยกเลิก
                            </Button>
                            <Button type="submit" className="flex-1" disabled={loading}>
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                                        กำลังสร้าง...
                                    </>
                                ) : (
                                    'สร้างรายงาน'
                                )}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
