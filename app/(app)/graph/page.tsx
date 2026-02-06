'use client';

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
import { History, Briefcase, User, Network, X, FolderTree, Search, PanelRightOpen, PanelRightClose, Layers } from 'lucide-react';
import { ArtefactNode } from './_components/ArtefactNode';
import { FilterPanel } from './_components/FilterPanel';
import { ImpactAnalysisModal } from './_components/ImpactAnalysisModal';
import { TransactionHistory } from './_components/TransactionHistory';
import { artefacts, relationships, type Artefact, type ArtefactType, typeLabels } from '@/data/mockData';
import { TreeView } from './_components/TreeView';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { FloatingInsightPanel } from './_components/FloatingInsightPanel';

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

function GraphPageContent() {
  const { t, language } = useLanguage();
  const { role } = useAuth();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const [selectedNode, setSelectedNode] = useState<Artefact | null>(null);
  const [filters, setFilters] = useState<ArtefactType[]>([]);
  const [showImpactAnalysis, setShowImpactAnalysis] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [impactArtefact, setImpactArtefact] = useState<Artefact | null>(null);

  // Mode state - Architect is always default
  const [viewMode, setViewMode] = useState<'architect' | 'executive'>('architect');
  const [layoutMode, setLayoutMode] = useState<'graph' | 'hierarchy'>('graph');

  // Search and floating panel state
  const [searchQuery, setSearchQuery] = useState('');
  const [showFloatingPanel, setShowFloatingPanel] = useState(true);

  // Mobile state
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileLibrary, setShowMobileLibrary] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

            {/* Artefact Library Toggle - Moved to left side */}
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

          {/* Right side - empty for now */}
          <div className="flex items-center gap-2">
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
            <TreeView
              onNodeClick={(node) => {
                // If node has artefactId, select that artefact
                // But don't show panels in hierarchy mode - just select for reference
                if (node.artefactId) {
                  const artefact = artefacts.find(a => a.id === node.artefactId);
                  if (artefact) {
                    // In hierarchy mode, we don't want to show panels
                    // Just keep track of selection for potential future use
                    setSelectedNode(null); // Clear selection to prevent panels from showing
                  }
                }
              }}
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
                    <span className="text-sm hidden sm:inline">{language === 'th' ? 'ประวัติ' : 'History'}</span>
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

        {/* Floating Insight Panel - RIGHT Side (Photoshop-style) - Only show in graph mode */}
        <AnimatePresence>
          {selectedNode && layoutMode === 'graph' && (
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
                  <h3 className="font-semibold text-sm">{t('graph.artefactLibrary')}</h3>
                  <p className="text-[10px] text-muted-foreground">{language === 'th' ? 'ลากไปวางบน Canvas' : 'Drag to Canvas'}</p>
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
                          {language === 'th' ? (typeLabels[type]?.th || type) : (typeLabels[type]?.en || type)}
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

        {/* Impact Analysis Modal - Only show in graph mode */}
        {showImpactAnalysis && impactArtefact && layoutMode === 'graph' && (
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

        {/* Mobile FAB for Artefact Library */}
        {isMobile && layoutMode === 'graph' && (
          <button
            onClick={() => setShowMobileLibrary(true)}
            className="fixed bottom-20 right-4 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg"
          >
            <Layers className="w-6 h-6" />
          </button>
        )}

        {/* Mobile Bottom Sheet for Artefact Library */}
        <AnimatePresence>
          {showMobileLibrary && isMobile && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileLibrary(false)}
                className="fixed inset-0 bg-black/50 z-40"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 h-[70vh] bg-card rounded-t-2xl shadow-2xl z-50 flex flex-col"
              >
                {/* Handle bar */}
                <div className="flex items-center justify-center py-2">
                  <div className="w-12 h-1 bg-muted rounded-full" />
                </div>

                {/* Header */}
                <div className="px-4 py-2 border-b flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{t('graph.artefactLibrary')}</h3>
                    <p className="text-xs text-muted-foreground">{language === 'th' ? 'เลือก Artefact เพื่อดูรายละเอียด' : 'Select Artefact to view details'}</p>
                  </div>
                  <button
                    onClick={() => setShowMobileLibrary(false)}
                    className="p-2 hover:bg-muted rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {(['business', 'application', 'data', 'technology', 'security', 'integration'] as const).map((type) => {
                      const typeArtefacts = artefacts.filter(a => a.type === type);
                      if (typeArtefacts.length === 0) return null;

                      return (
                        <div key={type} className="space-y-2">
                          <h4 className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                            <span className={cn("w-2 h-2 rounded-full", typeColors[type])}></span>
                            {language === 'th' ? (typeLabels[type]?.th || type) : (typeLabels[type]?.en || type)} ({typeArtefacts.length})
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {typeArtefacts.map(artefact => (
                              <button
                                key={artefact.id}
                                onClick={() => {
                                  setSelectedNode(artefact);
                                  setShowMobileLibrary(false);
                                }}
                                className="p-3 bg-muted/50 border border-border rounded-lg text-left hover:bg-muted transition-colors"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <div className={cn("p-1 rounded", typeColors[type])}>
                                    <Briefcase className="w-3 h-3 text-white" />
                                  </div>
                                  <span className="text-xs font-medium truncate flex-1">{artefact.name}</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground truncate">{artefact.nameTh}</p>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Wrapper component that provides ReactFlowProvider
export default function GraphPage() {
  return (
    <ReactFlowProvider>
      <GraphPageContent />
    </ReactFlowProvider>
  );
}
