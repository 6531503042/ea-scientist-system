import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Download,
    Upload,
    FileSpreadsheet,
    FileText,
    Check,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { artefacts, ArtefactType, Status, Artefact } from '@/data/mockData';

interface ExportImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'export' | 'import';
}

const typeOptions: { value: ArtefactType | 'all'; label: string }[] = [
    { value: 'all', label: 'ทั้งหมด' },
    { value: 'business', label: 'Business Architecture' },
    { value: 'application', label: 'Application Architecture' },
    { value: 'data', label: 'Data Architecture' },
    { value: 'technology', label: 'Technology Architecture' },
    { value: 'security', label: 'Security Architecture' },
    { value: 'integration', label: 'Integration Architecture' },
];

const statusOptions: { value: Status | 'all'; label: string }[] = [
    { value: 'all', label: 'ทุกสถานะ' },
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'planned', label: 'Planned' },
    { value: 'deprecated', label: 'Deprecated' },
];

const formatOptions = [
    { value: 'csv', label: 'CSV', icon: FileText },
    { value: 'xlsx', label: 'Excel (XLSX)', icon: FileSpreadsheet },
];

export function ExportImportModal({ isOpen, onClose, mode }: ExportImportModalProps) {
    const [selectedType, setSelectedType] = useState<ArtefactType | 'all'>('all');
    const [selectedStatus, setSelectedStatus] = useState<Status | 'all'>('all');
    const [selectedFormat, setSelectedFormat] = useState<'csv' | 'xlsx'>('csv');
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
    const [dragOver, setDragOver] = useState(false);

    const handleExport = () => {
        setIsProcessing(true);
        setResult(null);

        // Filter artefacts
        let filtered = [...artefacts];
        if (selectedType !== 'all') {
            filtered = filtered.filter(a => a.type === selectedType);
        }
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(a => a.status === selectedStatus);
        }

        // Simulate export delay
        setTimeout(() => {
            // Generate CSV content
            const headers = ['ID', 'Name', 'Name (TH)', 'Type', 'Description', 'Owner', 'Department', 'Status', 'Risk Level', 'Version', 'Last Updated'];
            const rows = filtered.map(a => [
                a.id,
                a.name,
                a.nameTh,
                a.type,
                a.description,
                a.owner,
                a.department,
                a.status,
                a.riskLevel,
                a.version,
                a.lastUpdated
            ]);

            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
            ].join('\n');

            // Create and download file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `artefacts_export_${new Date().toISOString().split('T')[0]}.${selectedFormat}`;
            link.click();
            URL.revokeObjectURL(url);

            setIsProcessing(false);
            setResult({
                success: true,
                message: `ส่งออก ${filtered.length} รายการเรียบร้อยแล้ว`
            });
        }, 1500);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processImport(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            processImport(file);
        }
    };

    const processImport = (file: File) => {
        setIsProcessing(true);
        setResult(null);

        // Simulate import processing
        setTimeout(() => {
            setIsProcessing(false);
            setResult({
                success: true,
                message: `นำเข้าไฟล์ ${file.name} สำเร็จ (Demo Mode)`
            });
        }, 2000);
    };

    const handleClose = () => {
        setResult(null);
        setIsProcessing(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-lg bg-card border border-border rounded-xl shadow-xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${mode === 'export' ? 'bg-success/10' : 'bg-primary/10'
                                }`}>
                                {mode === 'export' ? (
                                    <Download className="w-5 h-5 text-success" />
                                ) : (
                                    <Upload className="w-5 h-5 text-primary" />
                                )}
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">
                                    {mode === 'export' ? 'ส่งออกข้อมูล' : 'นำเข้าข้อมูล'}
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    {mode === 'export' ? 'Export Artefacts เป็น CSV หรือ Excel' : 'Import Artefacts จากไฟล์ CSV หรือ Excel'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                        {mode === 'export' ? (
                            <>
                                {/* Type Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        ประเภท Artefact
                                    </label>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value as ArtefactType | 'all')}
                                        className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        {typeOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Status Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        สถานะ
                                    </label>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value as Status | 'all')}
                                        className="w-full px-3 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        {statusOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Format Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        รูปแบบไฟล์
                                    </label>
                                    <div className="flex gap-3">
                                        {formatOptions.map(opt => {
                                            const Icon = opt.icon;
                                            return (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setSelectedFormat(opt.value as 'csv' | 'xlsx')}
                                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${selectedFormat === opt.value
                                                            ? 'border-primary bg-primary/10 text-primary'
                                                            : 'border-border hover:bg-muted'
                                                        }`}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                    <span className="text-sm font-medium">{opt.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Preview Count */}
                                <div className="p-4 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground">
                                        จำนวนรายการที่จะส่งออก: <span className="font-semibold text-foreground">
                                            {artefacts.filter(a =>
                                                (selectedType === 'all' || a.type === selectedType) &&
                                                (selectedStatus === 'all' || a.status === selectedStatus)
                                            ).length}
                                        </span> รายการ
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Drop Zone */}
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={handleDrop}
                                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragOver ? 'border-primary bg-primary/5' : 'border-border'
                                        }`}
                                >
                                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-foreground font-medium mb-2">
                                        ลากไฟล์มาวางที่นี่
                                    </p>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        หรือ
                                    </p>
                                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:bg-primary/90 transition-colors">
                                        <FileSpreadsheet className="w-4 h-4" />
                                        <span className="text-sm font-medium">เลือกไฟล์</span>
                                        <input
                                            type="file"
                                            accept=".csv,.xlsx,.xls"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="text-xs text-muted-foreground mt-4">
                                        รองรับไฟล์ CSV, XLS, XLSX
                                    </p>
                                </div>
                            </>
                        )}

                        {/* Result Message */}
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex items-center gap-3 p-4 rounded-lg ${result.success ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                                    }`}
                            >
                                {result.success ? (
                                    <Check className="w-5 h-5 flex-shrink-0" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                )}
                                <span className="text-sm">{result.message}</span>
                            </motion.div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            ยกเลิก
                        </button>
                        {mode === 'export' && (
                            <button
                                onClick={handleExport}
                                disabled={isProcessing}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        กำลังส่งออก...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        ส่งออก
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
