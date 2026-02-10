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
import { History, Layers } from 'lucide-react';
import { ArtefactNode } from './_components/ArtefactNode';
import { FilterPanel } from './_components/FilterPanel';
import { ImpactAnalysisModal } from './_components/ImpactAnalysisModal';
import { TransactionHistory } from './_components/TransactionHistory';
import { artefacts, relationships } from '@/data/mockData';
import type { Artefact, ArtefactType } from '@/types/artefact';
import { TreeView } from './_components/TreeView';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { FloatingInsightPanel } from './_components/FloatingInsightPanel';
import { ArtefactLibraryPanel } from './_components/ArtefactLibraryPanel';
import { MobileLibrarySheet } from './_components/MobileLibrarySheet';
import { GraphToolbar } from './_components/GraphToolbar';
import { createNodes, createEdges } from '@/lib/graph-helpers';
import { useImpactAnalysis } from '@/hooks/useImpactAnalysis';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AppNode = Node<any, string>;

const nodeTypes = {
  artefact: ArtefactNode,
};

function GraphPageContent() {
  const { language } = useLanguage();
  const { role } = useAuth();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const [selectedNode, setSelectedNode] = useState<Artefact | null>(null);
  const [filters, setFilters] = useState<ArtefactType[]>([]);
  const [showImpactAnalysis, setShowImpactAnalysis] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [impactArtefact, setImpactArtefact] = useState<Artefact | null>(null);

  // Mode state
  const [viewMode, setViewMode] = useState<'architect' | 'executive'>('architect');
  const [layoutMode, setLayoutMode] = useState<'graph' | 'hierarchy'>('graph');
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
  const initialEdges = useMemo(() => createEdges(relationships, MarkerType), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Use impact analysis hook
  const {
    impactMode,
    setImpactMode,
    simulationAction,
    setSimulationAction,
    impactStats,
    upstreamList,
    downstreamList,
    handleTriggerImpact,
  } = useImpactAnalysis({
    selectedNode,
    nodes,
    edges,
    setNodes,
    setEdges,
  });

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

  const filteredNodes = useMemo(() => {
    let result = nodes;
    if (viewMode === 'executive') {
      result = result.filter(n =>
        n.data.type === 'business' || n.data.type === 'application' || n.data.type === 'data'
      );
    }
    if (filters.length > 0) {
      result = result.filter((node) => filters.includes(node.data.type as ArtefactType));
    }
    if (searchQuery) {
      result = result.filter((node) =>
        (node.data.name as string).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (node.data.nameTh as string).toLowerCase().includes(searchQuery.toLowerCase())
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
  }, [impactMode, setImpactMode]);

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
        source: connection.source!,
        target: connection.target!,
        type: 'smoothstep',
        label: 'new relationship',
        style: { stroke: 'hsl(var(--muted-foreground))', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--muted-foreground))' },
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
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

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
        data: { ...artefact, id: nodeId, name: nodeName },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes, screenToFlowPosition],
  );

  return (
    <div className="relative flex w-full h-full flex-col">
      {/* Top Toolbar */}
      <GraphToolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        layoutMode={layoutMode}
        setLayoutMode={setLayoutMode}
        showFloatingPanel={showFloatingPanel}
        setShowFloatingPanel={setShowFloatingPanel}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area */}
      <div className="flex-1 relative flex overflow-hidden">
        <div ref={reactFlowWrapper} className="flex-1 relative h-full">
          {layoutMode === 'hierarchy' ? (
            <TreeView
              onNodeClick={(node) => {
                if (node.artefactId) {
                  setSelectedNode(null);
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
              <Controls className="bg-card border border-border rounded-lg shadow-card" showInteractive={false} />
              <Panel position="top-right" className="m-4">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
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
            <FilterPanel selectedTypes={filters} onFilterChange={setFilters} relationships={edges} />
          </div>
        )}

        {/* Floating Insight Panel */}
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

        {/* Floating Artefact Library Panel */}
        <AnimatePresence>
          {showFloatingPanel && layoutMode === 'graph' && (
            <ArtefactLibraryPanel onClose={() => setShowFloatingPanel(false)} />
          )}
        </AnimatePresence>

        {/* Impact Analysis Modal */}
        {showImpactAnalysis && impactArtefact && layoutMode === 'graph' && (
          <ImpactAnalysisModal
            artefact={impactArtefact}
            onClose={() => { setShowImpactAnalysis(false); setImpactArtefact(null); }}
            onSave={handleImpactSave}
          />
        )}

        {/* Transaction History */}
        <TransactionHistory isOpen={showHistory} onClose={() => setShowHistory(false)} />

        {/* Mobile FAB */}
        {isMobile && layoutMode === 'graph' && (
          <button
            onClick={() => setShowMobileLibrary(true)}
            className="fixed bottom-20 right-4 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg"
          >
            <Layers className="w-6 h-6" />
          </button>
        )}

        {/* Mobile Bottom Sheet */}
        <AnimatePresence>
          {showMobileLibrary && isMobile && (
            <MobileLibrarySheet
              onClose={() => setShowMobileLibrary(false)}
              onSelectArtefact={(artefact) => setSelectedNode(artefact)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function GraphPage() {
  return (
    <ReactFlowProvider>
      <GraphPageContent />
    </ReactFlowProvider>
  );
}
