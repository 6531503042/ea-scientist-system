import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  AlertTriangle, 
  ArrowRight, 
  ArrowDown, 
  ArrowUp,
  CheckCircle,
  XCircle,
  Save,
  RotateCcw,
  Trash2,
  Info,
  Zap,
  Link2,
  Database,
  Server,
  Shield,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Artefact, ArtefactType, RiskLevel } from '@/data/mockData';
import { relationships, artefacts } from '@/data/mockData';

interface ImpactAnalysisModalProps {
  artefact: Artefact;
  onClose: () => void;
  onSave: (action: 'break' | 'modify', affectedIds: string[]) => void;
}

interface ImpactNode {
  artefact: Artefact;
  depth: number;
  impactType: 'direct' | 'indirect';
  direction: 'upstream' | 'downstream';
}

const typeIcons: Record<ArtefactType, React.ElementType> = {
  business: Briefcase,
  data: Database,
  application: Server,
  technology: Server,
  integration: Link2,
  security: Shield,
};

const riskColors: Record<RiskLevel, { bg: string; text: string; border: string }> = {
  high: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/30' },
  medium: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30' },
  low: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/30' },
  none: { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border' },
};

export function ImpactAnalysisModal({ artefact, onClose, onSave }: ImpactAnalysisModalProps) {
  const [selectedAction, setSelectedAction] = useState<'break' | 'modify' | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());

  // Calculate all affected nodes
  const impactAnalysis = useMemo(() => {
    const visited = new Set<string>();
    const impactNodes: ImpactNode[] = [];

    // Find downstream (things that depend on this artefact)
    const findDownstream = (id: string, depth: number) => {
      const rels = relationships.filter(r => r.source === id);
      rels.forEach(rel => {
        if (!visited.has(rel.target)) {
          visited.add(rel.target);
          const target = artefacts.find(a => a.id === rel.target);
          if (target) {
            impactNodes.push({
              artefact: target,
              depth,
              impactType: depth === 1 ? 'direct' : 'indirect',
              direction: 'downstream'
            });
            findDownstream(rel.target, depth + 1);
          }
        }
      });
    };

    // Find upstream (things this artefact depends on)
    const findUpstream = (id: string, depth: number) => {
      const rels = relationships.filter(r => r.target === id);
      rels.forEach(rel => {
        if (!visited.has(rel.source)) {
          visited.add(rel.source);
          const source = artefacts.find(a => a.id === rel.source);
          if (source) {
            impactNodes.push({
              artefact: source,
              depth,
              impactType: depth === 1 ? 'direct' : 'indirect',
              direction: 'upstream'
            });
            findUpstream(rel.source, depth + 1);
          }
        }
      });
    };

    visited.add(artefact.id);
    findDownstream(artefact.id, 1);
    findUpstream(artefact.id, 1);

    return impactNodes;
  }, [artefact]);

  const downstreamNodes = impactAnalysis.filter(n => n.direction === 'downstream');
  const upstreamNodes = impactAnalysis.filter(n => n.direction === 'upstream');
  const directImpact = impactAnalysis.filter(n => n.impactType === 'direct');
  const indirectImpact = impactAnalysis.filter(n => n.impactType === 'indirect');
  
  const highRiskCount = impactAnalysis.filter(n => n.artefact.riskLevel === 'high').length;
  const totalAffected = impactAnalysis.length;

  const toggleNode = (id: string) => {
    const newSet = new Set(selectedNodes);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedNodes(newSet);
  };

  const handleProceed = () => {
    if (selectedAction) {
      setShowConfirm(true);
    }
  };

  const handleConfirm = () => {
    if (selectedAction) {
      onSave(selectedAction, Array.from(selectedNodes));
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-4xl max-h-[90vh] bg-card rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-warning/10">
                    <Zap className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">วิเคราะห์ผลกระทบ</h2>
                    <p className="text-sm text-muted-foreground">Impact Analysis สำหรับ "{artefact.name}"</p>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="p-3 bg-card rounded-xl border border-border">
                <p className="text-2xl font-bold text-foreground">{totalAffected}</p>
                <p className="text-xs text-muted-foreground">ผลกระทบทั้งหมด</p>
              </div>
              <div className="p-3 bg-card rounded-xl border border-border">
                <p className="text-2xl font-bold text-info">{directImpact.length}</p>
                <p className="text-xs text-muted-foreground">ผลกระทบโดยตรง</p>
              </div>
              <div className="p-3 bg-card rounded-xl border border-border">
                <p className="text-2xl font-bold text-warning">{indirectImpact.length}</p>
                <p className="text-xs text-muted-foreground">ผลกระทบทางอ้อม</p>
              </div>
              <div className="p-3 bg-card rounded-xl border border-destructive/30">
                <p className="text-2xl font-bold text-destructive">{highRiskCount}</p>
                <p className="text-xs text-muted-foreground">ความเสี่ยงสูง</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Action Selection */}
            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-3">เลือกการดำเนินการ</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedAction('break')}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all",
                    selectedAction === 'break'
                      ? "border-destructive bg-destructive/5"
                      : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      selectedAction === 'break' ? "bg-destructive/10" : "bg-muted"
                    )}>
                      <Trash2 className={cn(
                        "w-5 h-5",
                        selectedAction === 'break' ? "text-destructive" : "text-muted-foreground"
                      )} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">ตัด/ลบ Artefact</p>
                      <p className="text-xs text-muted-foreground">ลบ Artefact และความสัมพันธ์ทั้งหมด</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setSelectedAction('modify')}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all",
                    selectedAction === 'modify'
                      ? "border-warning bg-warning/5"
                      : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      selectedAction === 'modify' ? "bg-warning/10" : "bg-muted"
                    )}>
                      <RotateCcw className={cn(
                        "w-5 h-5",
                        selectedAction === 'modify' ? "text-warning" : "text-muted-foreground"
                      )} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">แก้ไข/ปรับเปลี่ยน</p>
                      <p className="text-xs text-muted-foreground">ดูผลกระทบก่อนทำการแก้ไข</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Impact Visualization */}
            <div className="grid grid-cols-2 gap-6">
              {/* Upstream */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ArrowDown className="w-4 h-4 text-info" />
                  <h3 className="font-semibold text-foreground">Upstream Dependencies ({upstreamNodes.length})</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-3">สิ่งที่ Artefact นี้พึ่งพา</p>
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {upstreamNodes.length > 0 ? upstreamNodes.map((node) => {
                    const Icon = typeIcons[node.artefact.type];
                    const risk = riskColors[node.artefact.riskLevel];
                    return (
                      <motion.div
                        key={node.artefact.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => toggleNode(node.artefact.id)}
                        className={cn(
                          "p-3 rounded-lg border cursor-pointer transition-all",
                          selectedNodes.has(node.artefact.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground/30"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", risk.bg)}>
                            <Icon className={cn("w-4 h-4", risk.text)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">{node.artefact.name}</p>
                            <div className="flex items-center gap-2">
                              <span className={cn("text-xs px-1.5 py-0.5 rounded", risk.bg, risk.text)}>
                                {node.impactType === 'direct' ? 'โดยตรง' : 'ทางอ้อม'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }) : (
                    <p className="text-sm text-muted-foreground italic py-4 text-center">ไม่มี dependency</p>
                  )}
                </div>
              </div>

              {/* Downstream */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ArrowUp className="w-4 h-4 text-accent" />
                  <h3 className="font-semibold text-foreground">Downstream Impact ({downstreamNodes.length})</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-3">สิ่งที่พึ่งพา Artefact นี้</p>
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {downstreamNodes.length > 0 ? downstreamNodes.map((node) => {
                    const Icon = typeIcons[node.artefact.type];
                    const risk = riskColors[node.artefact.riskLevel];
                    return (
                      <motion.div
                        key={node.artefact.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => toggleNode(node.artefact.id)}
                        className={cn(
                          "p-3 rounded-lg border cursor-pointer transition-all",
                          selectedNodes.has(node.artefact.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground/30"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", risk.bg)}>
                            <Icon className={cn("w-4 h-4", risk.text)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">{node.artefact.name}</p>
                            <div className="flex items-center gap-2">
                              <span className={cn("text-xs px-1.5 py-0.5 rounded", risk.bg, risk.text)}>
                                {node.impactType === 'direct' ? 'โดยตรง' : 'ทางอ้อม'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }) : (
                    <p className="text-sm text-muted-foreground italic py-4 text-center">ไม่มี dependent</p>
                  )}
                </div>
              </div>
            </div>

            {/* Warning */}
            {selectedAction && highRiskCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-destructive/10 border border-destructive/30 rounded-xl"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">คำเตือน: มีความเสี่ยงสูง</p>
                    <p className="text-sm text-destructive/80 mt-1">
                      การดำเนินการนี้จะส่งผลกระทบต่อ {highRiskCount} Artefacts ที่มีความเสี่ยงสูง 
                      กรุณาตรวจสอบให้แน่ใจก่อนดำเนินการ
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border bg-muted/30">
            {!showConfirm ? (
              <div className="flex items-center justify-between">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ยกเลิก
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {selectedNodes.size > 0 && `เลือก ${selectedNodes.size} รายการ`}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleProceed}
                    disabled={!selectedAction}
                    className={cn(
                      "flex items-center gap-2 px-6 py-2.5 font-medium rounded-lg transition-colors",
                      selectedAction
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    <ArrowRight className="w-4 h-4" />
                    ดำเนินการต่อ
                  </motion.button>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="p-4 bg-warning/10 border border-warning/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-warning" />
                    <div>
                      <p className="font-medium text-warning">ยืนยันการดำเนินการ</p>
                      <p className="text-sm text-warning/80">
                        คุณกำลังจะ{selectedAction === 'break' ? 'ลบ' : 'แก้ไข'} "{artefact.name}" 
                        ซึ่งจะส่งผลกระทบต่อ {totalAffected} Artefacts
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← กลับ
                  </button>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={onClose}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      ยกเลิก
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleConfirm}
                      className={cn(
                        "flex items-center gap-2 px-6 py-2.5 font-medium rounded-lg",
                        selectedAction === 'break'
                          ? "bg-destructive text-white hover:bg-destructive/90"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                    >
                      <Save className="w-4 h-4" />
                      {selectedAction === 'break' ? 'ยืนยันการลบ' : 'ยืนยันการแก้ไข'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
