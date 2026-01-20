import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ConnectionMode,
  Panel,
  MarkerType,
  addEdge,
  Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Briefcase, User, Network, X, RotateCcw, Trash2, AlertTriangle, Info, FolderTree, ArrowDownToLine, ArrowUpFromLine, Zap, Search, PanelRightOpen, PanelRightClose, ChevronDown, ChevronRight, Expand, Shrink } from 'lucide-react';
import { ArtefactNode } from './ArtefactNode';
import { FilterPanel } from './FilterPanel';
import { ImpactAnalysisModal } from './ImpactAnalysisModal';
import { TransactionHistory } from './TransactionHistory';
import { artefacts, relationships, type Artefact, type ArtefactType, typeLabels } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AppNode = Node<any, string>;

const nodeTypes = {
  artefact: ArtefactNode,
};

// Position nodes in a hierarchical layout
function getNodePosition(type: ArtefactType, index: number): { x: number; y: number } {
  const typeOrder: ArtefactType[] = ['business', 'application', 'data', 'technology', 'security', 'integration'];
  const row = typeOrder.indexOf(type);
  const col = index % 3;

  return {
    x: 100 + col * 320 + (row % 2) * 80,
    y: 80 + row * 180,
  };
}

function createNodes(artefactList: Artefact[]): AppNode[] {
  const typeCount: Record<ArtefactType, number> = {
    business: 0, data: 0, application: 0, technology: 0, security: 0, integration: 0
  };

  return artefactList.map((artefact) => {
    const pos = getNodePosition(artefact.type, typeCount[artefact.type]);
    typeCount[artefact.type]++;

    return {
      id: artefact.id,
      type: 'artefact',
      position: pos,
      data: artefact,
    };
  });
}

function createEdges(): Edge[] {
  return relationships.map((rel) => ({
    id: rel.id,
    source: rel.source,
    target: rel.target,
    label: rel.label,
    type: 'smoothstep',
    animated: rel.type === 'depends_on',
    style: {
      stroke: 'hsl(var(--muted-foreground))',
      strokeWidth: 2,
    },
    labelStyle: {
      fill: 'hsl(var(--foreground))',
      fontSize: 11,
      fontWeight: 500,
    },
    labelBgStyle: {
      fill: 'hsl(var(--card))',
      fillOpacity: 0.9,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: 'hsl(var(--muted-foreground))',
    },
  }));
}

// Type colors matching ArtefactListEnhanced
const typeColors: Record<ArtefactType, string> = {
  business: 'bg-violet-500',
  application: 'bg-sky-500',
  data: 'bg-teal-500',
  technology: 'bg-indigo-500',
  security: 'bg-amber-500',
  integration: 'bg-pink-500',
};

const typeIcons: Record<ArtefactType, React.ReactNode> = {
  business: '📋',
  application: '💻',
  data: '🗃️',
  technology: '⚙️',
  security: '🔒',
  integration: '🔗',
};

// Hierarchy View Component (uses same mockData as Graph)
interface HierarchyViewProps {
  onNodeClick?: (artefact: Artefact) => void;
  searchQuery?: string;
}

function HierarchyView({ onNodeClick, searchQuery = '' }: HierarchyViewProps) {
  const [expandedTypes, setExpandedTypes] = useState<Set<ArtefactType>>(new Set(['business', 'application']));

  // Group artefacts by type (using same mockData)
  const groupedArtefacts = useMemo(() => {
    const groups: Record<ArtefactType, Artefact[]> = {
      business: [],
      application: [],
      data: [],
      technology: [],
      security: [],
      integration: [],
    };

    artefacts.forEach(a => {
      if (!searchQuery ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.nameTh.toLowerCase().includes(searchQuery.toLowerCase())) {
        groups[a.type].push(a);
      }
    });

    return groups;
  }, [searchQuery]);

  const toggleType = (type: ArtefactType) => {
    setExpandedTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedTypes(new Set(['business', 'application', 'data', 'technology', 'security', 'integration']));
  };

  const collapseAll = () => {
    setExpandedTypes(new Set());
  };

  const typeOrder: ArtefactType[] = ['business', 'application', 'data', 'technology', 'security', 'integration'];
  const totalArtefacts = artefacts.filter(a =>
    !searchQuery ||
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.nameTh.toLowerCase().includes(searchQuery.toLowerCase())
  ).length;

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-semibold text-foreground text-sm sm:text-base">โครงสร้างลำดับชั้น</h3>
            <p className="text-xs text-muted-foreground">{totalArtefacts} Artefacts</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={expandAll}
              className="p-1.5 rounded hover:bg-muted transition-colors"
              title="ขยายทั้งหมด"
            >
              <Expand className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={collapseAll}
              className="p-1.5 rounded hover:bg-muted transition-colors"
              title="ยุบทั้งหมด"
            >
              <Shrink className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-3">
        <div className="space-y-1">
          {typeOrder.map((type) => {
            const items = groupedArtefacts[type];
            const isExpanded = expandedTypes.has(type);

            return (
              <div key={type}>
                <motion.button
                  onClick={() => toggleType(type)}
                  className={cn(
                    "w-full flex items-center gap-2 py-2 px-3 rounded-lg transition-all",
                    "hover:bg-muted",
                    isExpanded && "bg-muted/50"
                  )}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className={cn("w-6 h-6 rounded flex items-center justify-center text-sm", typeColors[type])}>
                    <span className="text-white text-xs">{typeIcons[type]}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-sm font-medium text-foreground">{typeLabels[type]?.th || type}</span>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {isExpanded && items.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-6 mt-1 space-y-1 border-l-2 border-border pl-3">
                        {items.map((artefact) => (
                          <motion.div
                            key={artefact.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={cn(
                              "flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all",
                              "hover:bg-muted group"
                            )}
                            onClick={() => onNodeClick?.(artefact)}
                          >
                            <div className={cn("w-2 h-2 rounded-full", typeColors[type])} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{artefact.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{artefact.nameTh}</p>
                            </div>
                            <span className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded-full",
                              artefact.status === 'active' ? "bg-success/10 text-success" :
                                artefact.status === 'draft' ? "bg-warning/10 text-warning" :
                                  "bg-muted text-muted-foreground"
                            )}>
                              {artefact.status}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="p-2 sm:p-3 border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground mb-2">Legend</p>
        <div className="flex flex-wrap gap-2">
          {typeOrder.map((type) => (
            <div key={type} className="flex items-center gap-1">
              <div className={cn("w-2 h-2 rounded-full", typeColors[type])} />
              <span className="text-[10px] text-muted-foreground">{typeLabels[type]?.th}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Floating Insight Panel Component (Right Side - Photoshop style)
interface FloatingInsightPanelProps {
  artefact: Artefact;
  onClose: () => void;
  onImpactAnalysis: () => void;
  // Impact Analysis Props
  impactMode: boolean;
  impactStats: { affected: number; critical: number; upstream: number };
  upstreamList: Artefact[];
  downstreamList: Artefact[];
  simulationAction: 'none' | 'delete' | 'modify';
  setSimulationAction: (action: 'none' | 'delete' | 'modify') => void;
  setImpactMode: (mode: boolean) => void;
}

function FloatingInsightPanel({
  artefact,
  onClose,
  onImpactAnalysis,
  impactMode,
  impactStats,
  upstreamList: impactUpstream,
  downstreamList: impactDownstream,
  simulationAction,
  setSimulationAction,
  setImpactMode
}: FloatingInsightPanelProps) {
  // Find related artefacts (for normal mode)
  const upstreamRels = relationships.filter((r) => r.target === artefact.id);
  const downstreamRels = relationships.filter((r) => r.source === artefact.id);

  const upstream = upstreamRels.map(r => artefacts.find(a => a.id === r.source)).filter(Boolean) as Artefact[];
  const downstream = downstreamRels.map(r => artefacts.find(a => a.id === r.target)).filter(Boolean) as Artefact[];


  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="absolute right-3 top-3 bottom-3 w-72 lg:w-80 bg-card/98 backdrop-blur-xl border border-border rounded-xl shadow-2xl flex flex-col z-40 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-start justify-between p-3 border-b bg-gradient-to-r from-primary/5 to-transparent">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              "px-2 py-0.5 text-[10px] font-medium rounded-full",
              artefact.status === 'active' ? "bg-success/10 text-success" :
                artefact.status === 'draft' ? "bg-warning/10 text-warning" :
                  "bg-muted text-muted-foreground"
            )}>
              {artefact.status}
            </span>
          </div>
          <h3 className="font-bold text-foreground truncate">{artefact.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{artefact.nameTh}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {impactMode ? (
          <>
            {/* Impact Stats Cards - Enhanced */}
            <div className="grid grid-cols-3 gap-2">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-blue-500/15 to-blue-600/5 border border-blue-500/30 shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mb-1.5">
                  <ArrowDownToLine className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-xl font-bold text-blue-600">{impactStats.upstream}</span>
                <span className="text-[10px] font-medium text-blue-500/80">Upstream</span>
              </motion.div>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.05 }}
                className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-600/5 border border-amber-500/30 shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mb-1.5">
                  <ArrowUpFromLine className="w-4 h-4 text-amber-500" />
                </div>
                <span className="text-xl font-bold text-amber-600">{impactStats.affected}</span>
                <span className="text-[10px] font-medium text-amber-500/80">Downstream</span>
              </motion.div>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-red-500/15 to-rose-600/5 border border-red-500/30 shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center mb-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-xl font-bold text-red-600">{impactStats.critical}</span>
                <span className="text-[10px] font-medium text-red-500/80">วิกฤต</span>
              </motion.div>
            </div>

            {/* Upstream Section - Enhanced */}
            <div className="bg-gradient-to-br from-blue-500/5 to-transparent rounded-xl p-3 border border-blue-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                    <ArrowDownToLine className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Upstream</h4>
                    <p className="text-[10px] text-blue-500">ระบบที่ส่งข้อมูลเข้ามา</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-xs font-bold text-blue-600 bg-blue-500/10 rounded-full">{impactUpstream.length}</span>
              </div>
              {impactUpstream.length > 0 ? (
                <div className="space-y-1.5">
                  {impactUpstream.slice(0, 5).map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-2.5 p-2.5 bg-card hover:bg-blue-500/10 border border-border hover:border-blue-500/30 rounded-lg transition-all cursor-pointer group"
                    >
                      <div className={cn("w-2.5 h-2.5 rounded-full ring-2 ring-offset-1 ring-offset-card", typeColors[item.type], "ring-" + typeColors[item.type].replace('bg-', ''))} />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-foreground block truncate group-hover:text-blue-600 transition-colors">{item.name}</span>
                        <span className="text-[10px] text-muted-foreground">{item.nameTh}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  ))}
                  {impactUpstream.length > 5 && (
                    <p className="text-[10px] text-center text-blue-500 font-medium pt-1">+{impactUpstream.length - 5} รายการเพิ่มเติม</p>
                  )}
                </div>
              ) : (
                <div className="py-4 border border-dashed border-blue-500/20 rounded-lg text-center bg-blue-500/5">
                  <ArrowDownToLine className="w-5 h-5 text-blue-400 mx-auto mb-1 opacity-50" />
                  <p className="text-xs text-muted-foreground">ไม่มีระบบที่ส่งข้อมูลเข้ามา</p>
                </div>
              )}
            </div>

            {/* Downstream Section - Enhanced */}
            <div className="bg-gradient-to-br from-amber-500/5 to-transparent rounded-xl p-3 border border-amber-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-sm">
                    <ArrowUpFromLine className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Downstream</h4>
                    <p className="text-[10px] text-amber-500">ได้รับผลกระทบ</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-xs font-bold text-amber-600 bg-amber-500/10 rounded-full">{impactDownstream.length}</span>
              </div>
              {impactDownstream.length > 0 ? (
                <div className="space-y-1.5">
                  {impactDownstream.slice(0, 5).map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-2.5 p-2.5 bg-card hover:bg-amber-500/10 border border-border hover:border-amber-500/30 rounded-lg transition-all cursor-pointer group"
                    >
                      <div className={cn("w-2.5 h-2.5 rounded-full ring-2 ring-offset-1 ring-offset-card", typeColors[item.type])} />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-foreground block truncate group-hover:text-amber-600 transition-colors">{item.name}</span>
                        <span className="text-[10px] text-muted-foreground">{item.nameTh}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  ))}
                  {impactDownstream.length > 5 && (
                    <p className="text-[10px] text-center text-amber-500 font-medium pt-1">+{impactDownstream.length - 5} รายการเพิ่มเติม</p>
                  )}
                </div>
              ) : (
                <div className="py-4 border border-dashed border-amber-500/20 rounded-lg text-center bg-amber-500/5">
                  <ArrowUpFromLine className="w-5 h-5 text-amber-400 mx-auto mb-1 opacity-50" />
                  <p className="text-xs text-muted-foreground">ไม่มีระบบที่ได้รับผลกระทบ</p>
                </div>
              )}
            </div>

            {/* Simulation Actions */}
            <div className="border-t pt-3">
              <p className="text-[10px] font-semibold uppercase text-muted-foreground mb-2">จำลองสถานการณ์</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setSimulationAction(simulationAction === 'modify' ? 'none' : 'modify')}
                  className={cn(
                    "flex-1 py-2 px-2 rounded-lg border-2 transition-all flex items-center justify-center gap-1 text-xs font-medium",
                    simulationAction === 'modify' ? 'border-warning bg-warning/10 text-warning' : 'border-border hover:bg-muted'
                  )}
                >
                  <RotateCcw className="w-3 h-3" />
                  ปรับแก้
                </button>
                <button
                  onClick={() => setSimulationAction(simulationAction === 'delete' ? 'none' : 'delete')}
                  className={cn(
                    "flex-1 py-2 px-2 rounded-lg border-2 transition-all flex items-center justify-center gap-1 text-xs font-medium",
                    simulationAction === 'delete' ? 'border-destructive bg-destructive/10 text-destructive' : 'border-border hover:bg-muted'
                  )}
                >
                  <Trash2 className="w-3 h-3" />
                  ลบ
                </button>
              </div>
              {simulationAction !== 'none' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-xs p-2 rounded-lg border">
                  {simulationAction === 'delete' ? (
                    <p className="text-destructive">⚠️ {impactStats.affected} ระบบจะไม่ทำงาน</p>
                  ) : (
                    <p className="text-warning">📋 ต้องทดสอบ {impactStats.affected} ระบบ</p>
                  )}
                </motion.div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Normal Mode - Description */}
            <div>
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1.5">รายละเอียด</h4>
              <p className="text-sm text-foreground leading-relaxed">{artefact.description}</p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-muted/50 rounded-lg">
                <p className="text-[10px] text-muted-foreground">ผู้รับผิดชอบ</p>
                <p className="text-xs font-medium text-foreground truncate">{artefact.owner}</p>
              </div>
              <div className="p-2 bg-muted/50 rounded-lg">
                <p className="text-[10px] text-muted-foreground">หน่วยงาน</p>
                <p className="text-xs font-medium text-foreground truncate">{artefact.department}</p>
              </div>
              <div className="p-2 bg-muted/50 rounded-lg">
                <p className="text-[10px] text-muted-foreground">เวอร์ชัน</p>
                <p className="text-xs font-medium text-foreground">{artefact.version}</p>
              </div>
              <div className="p-2 bg-muted/50 rounded-lg">
                <p className="text-[10px] text-muted-foreground">อัพเดต</p>
                <p className="text-xs font-medium text-foreground">{artefact.lastUpdated}</p>
              </div>
            </div>

            {/* Upstream Section */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <ArrowDownToLine className="w-3 h-3 text-blue-500" />
                </div>
                <h4 className="text-xs font-semibold text-foreground">Upstream</h4>
                <span className="text-[10px] text-muted-foreground">({upstream.length})</span>
              </div>
              <p className="text-[10px] text-muted-foreground mb-2">ระบบที่ส่งข้อมูลเข้ามา</p>
              {upstream.length > 0 ? (
                <div className="space-y-1">
                  {upstream.slice(0, 4).map(item => (
                    <div key={item.id} className="flex items-center gap-2 p-2 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                      <div className={cn("w-2 h-2 rounded-full", typeColors[item.type])} />
                      <span className="text-xs font-medium flex-1 truncate">{item.name}</span>
                      <span className="text-[9px] text-muted-foreground">{typeLabels[item.type]?.th}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-2 border border-dashed border-border rounded-lg text-center">
                  <p className="text-[10px] text-muted-foreground">ไม่มีระบบที่ส่งข้อมูลเข้ามา</p>
                </div>
              )}
            </div>

            {/* Downstream Section */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <ArrowUpFromLine className="w-3 h-3 text-amber-500" />
                </div>
                <h4 className="text-xs font-semibold text-foreground">Downstream</h4>
                <span className="text-[10px] text-muted-foreground">({downstream.length})</span>
              </div>
              <p className="text-[10px] text-muted-foreground mb-2">ระบบที่รับข้อมูลไป</p>
              {downstream.length > 0 ? (
                <div className="space-y-1">
                  {downstream.slice(0, 4).map(item => (
                    <div key={item.id} className="flex items-center gap-2 p-2 bg-amber-500/5 border border-amber-500/10 rounded-lg">
                      <div className={cn("w-2 h-2 rounded-full", typeColors[item.type])} />
                      <span className="text-xs font-medium flex-1 truncate">{item.name}</span>
                      <span className="text-[9px] text-muted-foreground">{typeLabels[item.type]?.th}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-2 border border-dashed border-border rounded-lg text-center">
                  <p className="text-[10px] text-muted-foreground">ไม่มีระบบที่รับข้อมูลไป</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer Button */}
      <div className="p-3 border-t bg-muted/30">
        {impactMode ? (
          <button
            onClick={() => setImpactMode(false)}
            className="w-full px-4 py-2.5 bg-muted text-foreground font-medium rounded-lg hover:bg-muted/80 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <X className="w-4 h-4" />
            ปิดโหมดวิเคราะห์
          </button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onImpactAnalysis}
            className="w-full px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <AlertTriangle className="w-4 h-4" />
            วิเคราะห์ผลกระทบ
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

function EAGraphInner() {
  const { role } = useAuth();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const [selectedNode, setSelectedNode] = useState<Artefact | null>(null);
  const [filters, setFilters] = useState<ArtefactType[]>([]);
  const [showImpactAnalysis, setShowImpactAnalysis] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [impactArtefact, setImpactArtefact] = useState<Artefact | null>(null);

  // Mode state - only graph and hierarchy
  const [viewMode, setViewMode] = useState<'architect' | 'executive'>(role === 'executive' ? 'executive' : 'architect');
  const [layoutMode, setLayoutMode] = useState<'graph' | 'hierarchy'>('graph');

  // Search and floating panel state
  const [searchQuery, setSearchQuery] = useState('');
  const [showFloatingPanel, setShowFloatingPanel] = useState(true);

  // Initialize nodes and edges
  const initialNodes = useMemo(() => createNodes(artefacts), []);
  const initialEdges = useMemo(() => createEdges(), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update view mode if role changes
  useEffect(() => {
    if (role === 'executive') setViewMode('executive');
    else if (role === 'architect') setViewMode('architect');
  }, [role]);

  // Handle Layout Changes - Graph Layout Only
  useEffect(() => {
    if (layoutMode === 'hierarchy') return;

    setNodes((currentNodes) => {
      const typeGroups = {
        business: currentNodes.filter(n => n.data.type === 'business'),
        application: currentNodes.filter(n => n.data.type === 'application'),
        data: currentNodes.filter(n => n.data.type === 'data'),
        integration: currentNodes.filter(n => n.data.type === 'integration'),
        security: currentNodes.filter(n => n.data.type === 'security'),
        technology: currentNodes.filter(n => n.data.type === 'technology'),
      };

      const levels = [
        typeGroups.business,
        typeGroups.application,
        [...typeGroups.data, ...typeGroups.integration, ...typeGroups.security],
        typeGroups.technology
      ];

      const LEVEL_HEIGHT = 200;
      const NODE_WIDTH = 220;
      const GAP = 60;

      const nodeLevel: Map<string, number> = new Map();
      const nodeIndexInLevel: Map<string, number> = new Map();
      const levelCounts: Map<number, number> = new Map();

      levels.forEach((lvl, levelIdx) => {
        levelCounts.set(levelIdx, lvl.length);
        lvl.forEach((n, idx) => {
          nodeLevel.set(n.id, levelIdx);
          nodeIndexInLevel.set(n.id, idx);
        });
      });

      return currentNodes.map(node => {
        const level = nodeLevel.get(node.id) ?? 3;
        const indexInLevel = nodeIndexInLevel.get(node.id) ?? 0;
        const count = levelCounts.get(level) ?? 1;

        const totalWidth = count * NODE_WIDTH + (count - 1) * GAP;
        const startX = -totalWidth / 2;
        const x = startX + indexInLevel * (NODE_WIDTH + GAP) + NODE_WIDTH / 2;
        const y = level * LEVEL_HEIGHT;

        return { ...node, position: { x, y } };
      });
    });

    setEdges((eds) => eds.map(e => ({
      ...e,
      type: 'smoothstep',
      style: { ...e.style, strokeWidth: 2 }
    })));
  }, [layoutMode, setNodes, setEdges]);

  // Impact Analysis State
  const [impactMode, setImpactMode] = useState(false);
  const [simulationAction, setSimulationAction] = useState<'none' | 'delete' | 'modify'>('none');
  const [impactStats, setImpactStats] = useState({ affected: 0, critical: 0, upstream: 0 });
  const [upstreamList, setUpstreamList] = useState<Artefact[]>([]);
  const [downstreamList, setDownstreamList] = useState<Artefact[]>([]);

  // Reset simulation when mode changes
  useEffect(() => {
    if (!impactMode) {
      setSimulationAction('none');
      setNodes(nds => nds.map(n => ({ ...n, style: undefined, className: undefined })));
      setEdges(eds => eds.map(e => ({ ...e, style: { stroke: 'hsl(var(--muted-foreground))', strokeWidth: 2, opacity: 1 }, animated: e.data?.originalAnimated as boolean })));
    }
  }, [impactMode, setNodes, setEdges]);

  // Handle Impact Calculation & Visualization
  useEffect(() => {
    if (!impactMode || !selectedNode) return;

    const analyzeImpact = () => {
      const upstream = new Set<string>();
      const downstream = new Set<string>();
      const criticalNodes = new Set<string>();

      // Find downstream (Impacts)
      const queueDown = [selectedNode.id];
      const visitedDown = new Set([selectedNode.id]);
      while (queueDown.length > 0) {
        const curr = queueDown.shift()!;
        edges.filter(e => e.source === curr).forEach(e => {
          if (!visitedDown.has(e.target)) {
            visitedDown.add(e.target);
            queueDown.push(e.target);
            downstream.add(e.target);
            const node = nodes.find(n => n.id === e.target);
            if (node?.data.riskLevel === 'high') criticalNodes.add(e.target);
          }
        });
      }

      // Find upstream (Inputs)
      const queueUp = [selectedNode.id];
      const visitedUp = new Set([selectedNode.id]);
      while (queueUp.length > 0) {
        const curr = queueUp.shift()!;
        edges.filter(e => e.target === curr).forEach(e => {
          if (!visitedUp.has(e.source)) {
            visitedUp.add(e.source);
            queueUp.push(e.source);
            upstream.add(e.source);
          }
        });
      }

      // Store lists for display
      const upArtefacts = artefacts.filter(a => upstream.has(a.id));
      const downArtefacts = artefacts.filter(a => downstream.has(a.id));
      setUpstreamList(upArtefacts);
      setDownstreamList(downArtefacts);
      setImpactStats({ affected: downstream.size, critical: criticalNodes.size, upstream: upstream.size });

      // Update Visuals
      setNodes(nds => nds.map(node => {
        const isSelected = node.id === selectedNode.id;
        const isUpstream = upstream.has(node.id);
        const isDownstream = downstream.has(node.id);
        const isRelated = isSelected || isUpstream || isDownstream;

        let style: React.CSSProperties = { opacity: isRelated ? 1 : 0.08, transition: 'all 0.3s ease' };

        if (isSelected) {
          style = { ...style, border: '3px solid #8b5cf6', boxShadow: '0 0 25px rgba(139, 92, 246, 0.4)' };
        } else if (isUpstream) {
          style = { ...style, border: '2px solid #3b82f6', boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)' };
        } else if (isDownstream) {
          if (simulationAction === 'delete') {
            style = { ...style, border: '3px solid #ef4444', background: 'rgba(239, 68, 68, 0.15)', boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)' };
          } else if (simulationAction === 'modify') {
            style = { ...style, border: '3px dashed #f59e0b', background: 'rgba(245, 158, 11, 0.1)', boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)' };
          } else {
            style = { ...style, border: '2px solid #f59e0b', boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)' };
          }
        }

        return { ...node, style };
      }));

      setEdges(eds => eds.map(edge => {
        const isUpstream = upstream.has(edge.source) && (upstream.has(edge.target) || edge.target === selectedNode.id);
        const isDownstream = (downstream.has(edge.source) || edge.source === selectedNode.id) && downstream.has(edge.target);
        const isRelated = isUpstream || isDownstream;

        let strokeColor = 'hsl(var(--muted-foreground))';
        if (isDownstream) {
          strokeColor = simulationAction === 'delete' ? '#ef4444' :
            simulationAction === 'modify' ? '#f59e0b' :
              '#f59e0b';
        } else if (isUpstream) {
          strokeColor = '#3b82f6';
        }

        return {
          ...edge,
          style: {
            ...edge.style,
            opacity: isRelated ? 1 : 0.05,
            stroke: strokeColor,
            strokeWidth: isRelated ? 3 : 1
          },
          animated: isRelated,
        };
      }));
    };

    analyzeImpact();
  }, [impactMode, selectedNode, simulationAction, nodes.length, edges.length]);

  const handleTriggerImpact = useCallback(() => {
    if (selectedNode) {
      setImpactMode(true);
    }
  }, [selectedNode]);

  const filteredNodes = useMemo(() => {
    let result = nodes;

    // View Mode Filter
    if (viewMode === 'executive') {
      result = result.filter(n =>
        n.data.type === 'business' ||
        n.data.type === 'application' ||
        n.data.type === 'data'
      );
    }

    // Type Filter
    if (filters.length > 0) {
      result = result.filter((node) => filters.includes(node.data.type as ArtefactType));
    }

    // Search Filter
    if (searchQuery) {
      result = result.filter((node) =>
        node.data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.data.nameTh.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [nodes, filters, viewMode, searchQuery]);

  const filteredEdges = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    return edges.filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target));
  }, [edges, filteredNodes]);

  const handleNodeClick = useCallback((_: React.MouseEvent, node: AppNode) => {
    setSelectedNode(node.data as unknown as Artefact);
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
    if (impactMode) setImpactMode(false);
  }, [impactMode]);

  // Handle new edge connections
  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
        source: connection.source!,
        target: connection.target!,
        type: 'smoothstep',
        label: 'new relationship',
        style: {
          stroke: 'hsl(var(--muted-foreground))',
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'hsl(var(--muted-foreground))',
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const handleImpactSave = (action: 'break' | 'modify', affectedIds: string[]) => {
    console.log('Impact action:', action, 'Affected:', affectedIds);
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const data = event.dataTransfer.getData('application/reactflow');
      if (!data) return;

      const artefact = JSON.parse(data) as Artefact;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let nodeId = artefact.id;
      let nodeName = artefact.name;
      if (nodes.find((n) => n.id === artefact.id)) {
        const timestamp = Date.now();
        nodeId = `${artefact.id}-copy-${timestamp}`;
        nodeName = `${artefact.name} (Copy)`;
      }

      const newNode: AppNode = {
        id: nodeId,
        type: 'artefact',
        position,
        data: {
          ...artefact,
          id: nodeId,
          name: nodeName,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes, screenToFlowPosition],
  );

  return (
    <div className="relative flex w-full h-full flex-col">
      {/* Top Toolbar - Responsive */}
      <div className="border-b bg-background px-2 sm:px-4 py-2 z-10 space-y-2">
        {/* First Row: Mode toggles */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* View Mode Toggle */}
            <div className="flex items-center h-8 p-0.5 bg-muted rounded-lg">
              <button
                onClick={() => setViewMode('architect')}
                className={cn(
                  "flex items-center gap-1.5 px-3 h-7 rounded-md text-xs font-medium transition-all",
                  viewMode === 'architect'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Architect</span>
              </button>
              <button
                onClick={() => setViewMode('executive')}
                className={cn(
                  "flex items-center gap-1.5 px-3 h-7 rounded-md text-xs font-medium transition-all",
                  viewMode === 'executive'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Executive</span>
              </button>
            </div>

            {/* Layout Toggle - Only Graph and Hierarchy */}
            <div className="flex items-center h-8 p-0.5 bg-muted rounded-lg">
              <button
                onClick={() => setLayoutMode('graph')}
                className={cn(
                  "flex items-center gap-1.5 px-3 h-7 rounded-md text-xs font-medium transition-all",
                  layoutMode === 'graph'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                title="Graph View"
              >
                <Network className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Graph</span>
              </button>
              <button
                onClick={() => setLayoutMode('hierarchy')}
                className={cn(
                  "flex items-center gap-1.5 px-3 h-7 rounded-md text-xs font-medium transition-all",
                  layoutMode === 'hierarchy'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                title="Hierarchy View"
              >
                <FolderTree className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Hierarchy</span>
              </button>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            {layoutMode === 'graph' && (
              <button
                onClick={() => setShowFloatingPanel(!showFloatingPanel)}
                className="flex items-center gap-1.5 px-2 sm:px-3 h-8 rounded-lg bg-muted hover:bg-muted/80 text-xs font-medium transition-all"
                title={showFloatingPanel ? "ซ่อน Artefact Library" : "แสดง Artefact Library"}
              >
                {showFloatingPanel ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
                <span className="hidden lg:inline">{showFloatingPanel ? 'ซ่อน' : 'แสดง'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Second Row: Search */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="ค้นหา Artefact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-sm bg-muted border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/60"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Graph/Hierarchy Canvas */}
        <div ref={reactFlowWrapper} className="flex-1 relative h-full">
          {layoutMode === 'hierarchy' ? (
            <HierarchyView
              onNodeClick={(artefact) => setSelectedNode(artefact)}
              searchQuery={searchQuery}
            />
          ) : (
            <ReactFlow
              nodes={filteredNodes}
              edges={filteredEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={handleNodeClick}
              onPaneClick={handlePaneClick}
              nodeTypes={nodeTypes}
              connectionMode={ConnectionMode.Loose}
              nodesDraggable={true}
              nodesConnectable={true}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              minZoom={0.3}
              maxZoom={1.5}
              className="bg-background"
            >
              <Background color="hsl(var(--border))" gap={24} />
              <Controls
                className="bg-card border border-border rounded-lg shadow-card"
                showInteractive={false}
              />

              <Panel position="top-right" className="m-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center gap-2 px-4 py-2 bg-card/90 backdrop-blur border border-border rounded-lg shadow-card">
                    <span className="text-sm text-muted-foreground">
                      {filteredNodes.length} Artefacts • {filteredEdges.length} Relationships
                    </span>
                  </div>
                  <button
                    onClick={() => setShowHistory(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-card/90 backdrop-blur border border-border rounded-lg shadow-card hover:bg-muted transition-colors"
                  >
                    <History className="w-4 h-4" />
                    <span className="text-sm hidden sm:inline">ประวัติ</span>
                  </button>
                </motion.div>
              </Panel>


            </ReactFlow>
          )}
        </div>

        {/* Right Side Filter Panel (when no node selected) */}
        {!selectedNode && layoutMode === 'graph' && (
          <div className="hidden lg:block border-l border-border bg-card w-64">
            <FilterPanel
              selectedTypes={filters}
              onFilterChange={setFilters}
              relationships={edges}
            />
          </div>
        )}

        {/* Floating Insight Panel - RIGHT Side (Photoshop-style) */}
        <AnimatePresence>
          {selectedNode && (
            <FloatingInsightPanel
              artefact={selectedNode}
              onClose={() => setSelectedNode(null)}
              onImpactAnalysis={handleTriggerImpact}
              impactMode={impactMode}
              impactStats={impactStats}
              upstreamList={upstreamList}
              downstreamList={downstreamList}
              simulationAction={simulationAction}
              setSimulationAction={setSimulationAction}
              setImpactMode={setImpactMode}
            />
          )}
        </AnimatePresence>

        {/* Floating Artefact Library Panel - LEFT Side (Photoshop-style) */}
        <AnimatePresence>
          {showFloatingPanel && layoutMode === 'graph' && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="absolute left-3 top-3 bottom-3 w-48 lg:w-52 bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-2xl flex-col z-30 hidden md:flex"
            >
              <div className="px-3 py-2 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm">Artefact Library</h3>
                  <p className="text-[10px] text-muted-foreground">ลากไปวางบน Canvas</p>
                </div>
                <button
                  onClick={() => setShowFloatingPanel(false)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                <div className="space-y-3">
                  {(['business', 'application', 'data', 'technology', 'security', 'integration'] as const).map((type) => {
                    const typeArtefacts = artefacts.filter(a => a.type === type);
                    if (typeArtefacts.length === 0) return null;

                    return (
                      <div key={type} className="space-y-1">
                        <h4 className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                          <span className={cn("w-1.5 h-1.5 rounded-full", typeColors[type])}></span>
                          {typeLabels[type]?.th || type}
                        </h4>
                        <div className="space-y-1">
                          {typeArtefacts.map(artefact => (
                            <div
                              key={artefact.id}
                              className="p-1.5 bg-muted/30 border border-border rounded hover:bg-muted cursor-move flex items-center gap-2 transition-colors group"
                              draggable
                              onDragStart={(event) => {
                                event.dataTransfer.setData('application/reactflow', JSON.stringify(artefact));
                                event.dataTransfer.effectAllowed = 'move';
                              }}
                            >
                              <div className={cn("p-1 rounded shadow-sm", typeColors[type])}>
                                <Briefcase className="w-2.5 h-2.5 text-white" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <span className="text-xs font-medium block truncate">{artefact.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Impact Analysis Modal */}
        {showImpactAnalysis && impactArtefact && (
          <ImpactAnalysisModal
            artefact={impactArtefact}
            onClose={() => {
              setShowImpactAnalysis(false);
              setImpactArtefact(null);
            }}
            onSave={handleImpactSave}
          />
        )}

        {/* Transaction History */}
        <TransactionHistory
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
        />
      </div>
    </div>
  );
}

// Wrapper component that provides ReactFlowProvider
export function EAGraph() {
  return (
    <ReactFlowProvider>
      <EAGraphInner />
    </ReactFlowProvider>
  );
}
