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
      {/* Dark overlay - clicking closes panel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
      />

      {/* Right-side floating panel (Photoshop-style) */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md md:max-w-lg lg:max-w-xl bg-card border-l border-border shadow-2xl overflow-hidden flex flex-col"
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
          <div className="grid grid-cols-2 gap-3 mt-4">
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
          {/* Context Summary */}
          <div className="mb-6 bg-muted/40 p-4 rounded-xl border border-border">
            <p className="text-sm text-foreground">
              การเปลี่ยนแปลง <span className="font-semibold">{artefact.name}</span> จะส่งผลโดยตรงต่อ <span className="font-semibold text-foreground">{directImpact.length} รายการ</span> และส่งผลต่อเนื่องไปยังอีก <span className="font-semibold text-muted-foreground">{indirectImpact.length} รายการ</span>
            </p>
          </div>

          {/* Action Selection */}
          <div className="mb-8">
            <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider text-muted-foreground">เลือกเป้าหมายการวิเคราะห์</h3>
            <div className="flex p-1 bg-muted rounded-xl mb-4">
              <button
                onClick={() => setSelectedAction('modify')}
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                  selectedAction === 'modify'
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Simulation Modication
              </button>
              <button
                onClick={() => setSelectedAction('break')}
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                  selectedAction === 'break'
                    ? "bg-background text-destructive shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Simulation Deletion
              </button>
            </div>
          </div>

          {/* Impact Details - Stacked for narrower panel */}
          <div className="space-y-6">
            <div className="space-y-6">
              {/* Dependencies (Upstream) */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                  <ArrowDown className="w-4 h-4 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">สิ่งที่ต้องใช้ (Inputs)</h3>
                    <p className="text-xs text-muted-foreground">ระบบ/ข้อมูลที่จำเป็นต้องมี</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {upstreamNodes.length > 0 ? upstreamNodes.map((node) => {
                    const Icon = typeIcons[node.artefact.type];
                    const risk = riskColors[node.artefact.riskLevel];
                    const isDirect = node.impactType === 'direct';

                    return (
                      <motion.div
                        key={node.artefact.id}
                        layout
                        className={cn(
                          "relative p-3 rounded-xl border transition-all hover:shadow-md",
                          selectedNodes.has(node.artefact.id)
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border bg-card"
                        )}
                        onClick={() => toggleNode(node.artefact.id)}
                      >
                        {!isDirect && (
                          <div className="absolute left-0 top-1/2 -ml-3 w-3 h-px bg-border border-t border-dashed" />
                        )}
                        <div className="flex items-start gap-3">
                          <div className={cn("w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center", risk.bg)}>
                            <Icon className={cn("w-4 h-4", risk.text)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">{node.artefact.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-1.5 rounded">
                                {node.artefact.type}
                              </span>
                              {node.artefact.riskLevel === 'high' && (
                                <span className="flex items-center gap-1 text-[10px] text-destructive font-medium">
                                  <AlertTriangle className="w-3 h-3" />
                                  High Risk
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }) : (
                    <div className="text-center py-8 bg-muted/20 rounded-xl border border-dashed">
                      <p className="text-sm text-muted-foreground">ไม่มีสิ่งที่ต้องใช้ (Independent)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Impacted (Downstream) */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                  <ArrowUp className="w-4 h-4 text-destructive" />
                  <div>
                    <h3 className="font-semibold text-foreground">ผลกระทบ (Impacts)</h3>
                    <p className="text-xs text-muted-foreground">ระบบที่จะเสียหาย/หยุดชะงัก</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {downstreamNodes.length > 0 ? downstreamNodes.map((node) => {
                    const Icon = typeIcons[node.artefact.type];
                    const risk = riskColors[node.artefact.riskLevel];
                    const isDirect = node.impactType === 'direct';

                    return (
                      <motion.div
                        key={node.artefact.id}
                        layout
                        className={cn(
                          "relative p-3 rounded-xl border transition-all hover:shadow-md",
                          selectedNodes.has(node.artefact.id)
                            ? "border-destructive bg-destructive/5 shadow-sm"
                            : "border-border bg-card"
                        )}
                        onClick={() => toggleNode(node.artefact.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn("w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center", risk.bg)}>
                            <Icon className={cn("w-4 h-4", risk.text)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">{node.artefact.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={cn(
                                "text-[10px] px-1.5 rounded border",
                                isDirect
                                  ? "bg-destructive/10 text-destructive border-destructive/20"
                                  : "bg-muted text-muted-foreground border-transparent"
                              )}>
                                {isDirect ? 'Direct' : 'Indirect'}
                              </span>
                              {node.artefact.riskLevel === 'high' && (
                                <span className="flex items-center gap-1 text-[10px] text-destructive font-medium ml-auto">
                                  <AlertTriangle className="w-3 h-3" />
                                  Critical
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }) : (
                    <div className="text-center py-8 bg-muted/20 rounded-xl border border-dashed">
                      <p className="text-sm text-muted-foreground">ไม่มีผลกระทบ (Safe to change)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Warning Box */}
          <AnimatePresence>
            {selectedAction && highRiskCount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 overflow-hidden"
              >
                <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-xl flex items-start gap-4">
                  <div className="p-2 bg-destructive/10 rounded-full">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-destructive mb-1">Critical Warning</h4>
                    <p className="text-sm text-muted-foreground">
                      การดำเนินการนี้มีความเสี่ยงสูงเนื่องจากส่งผลกระทบต่อ <span className="text-destructive font-medium">{highRiskCount} critical systems</span>.
                      กรุณาติดต่อผู้อนุมัติหรือตรวจสอบ Impact Assessment Document ก่อนดำเนินการ
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
    </AnimatePresence>
  );
}
