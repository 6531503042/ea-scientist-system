import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Clock,
    User,
    GitCommit,
    ChevronRight,
    FileText,
    ArrowLeft
} from 'lucide-react';
import { artefactVersions, ArtefactVersion } from '@/data/mockData';

interface VersionHistoryDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    artefactId: string;
    artefactName: string;
}

export function VersionHistoryDrawer({ isOpen, onClose, artefactId, artefactName }: VersionHistoryDrawerProps) {
    const versions = artefactVersions.filter(v => v.artefactId === artefactId);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border shadow-xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={onClose}
                                    className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                                </button>
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">ประวัติเวอร์ชัน</h2>
                                    <p className="text-xs text-muted-foreground">{artefactName}</p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {versions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                                    <p className="text-foreground font-medium mb-1">ไม่พบประวัติเวอร์ชัน</p>
                                    <p className="text-sm text-muted-foreground">ยังไม่มีการบันทึกประวัติสำหรับ Artefact นี้</p>
                                </div>
                            ) : (
                                <div className="relative">
                                    {/* Timeline Line */}
                                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

                                    {/* Version Items */}
                                    <div className="space-y-6">
                                        {versions.map((version, index) => (
                                            <motion.div
                                                key={version.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="relative pl-10"
                                            >
                                                {/* Timeline Dot */}
                                                <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 ${index === 0
                                                        ? 'bg-primary border-primary'
                                                        : 'bg-card border-muted-foreground/30'
                                                    }`} />

                                                {/* Version Card */}
                                                <div className={`p-4 rounded-xl border ${index === 0
                                                        ? 'border-primary/30 bg-primary/5'
                                                        : 'border-border bg-muted/30'
                                                    }`}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${index === 0
                                                                ? 'bg-primary/20 text-primary'
                                                                : 'bg-muted text-muted-foreground'
                                                            }`}>
                                                            v{version.version}
                                                        </span>
                                                        {index === 0 && (
                                                            <span className="text-xs text-primary font-medium">ปัจจุบัน</span>
                                                        )}
                                                    </div>

                                                    <p className="text-sm text-foreground mb-3">{version.changes}</p>

                                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <User className="w-3 h-3" />
                                                            {version.changedBy}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {version.changedAt}
                                                        </span>
                                                    </div>

                                                    {version.previousVersion && (
                                                        <div className="mt-3 pt-3 border-t border-border">
                                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <GitCommit className="w-3 h-3" />
                                                                อัปเดตจาก v{version.previousVersion}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-border">
                            <p className="text-xs text-muted-foreground text-center">
                                ระบบจะเก็บประวัติทุกครั้งที่มีการแก้ไข Artefact
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
