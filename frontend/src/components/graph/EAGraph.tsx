import { useCallback, useMemo, useState, useEffect } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  Panel,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Plus } from 'lucide-react';
import { ArtefactNode } from './ArtefactNode';
import { FilterPanel } from './FilterPanel';
import { InsightPanel } from './InsightPanel';
import { ImpactAnalysisModal } from './ImpactAnalysisModal';
import { TransactionHistory } from './TransactionHistory';
import { CreateArtefactModal } from '@/components/artefacts/CreateArtefactModal';
import { artefacts, relationships, type Artefact, type ArtefactType } from '@/data/mockData';

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

export function EAGraph() {
  const [selectedNode, setSelectedNode] = useState<Artefact | null>(null);
  const [filters, setFilters] = useState<ArtefactType[]>([]);
  const [showImpactAnalysis, setShowImpactAnalysis] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [impactArtefact, setImpactArtefact] = useState<Artefact | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const initialNodes = useMemo(() => createNodes(artefacts), []);
  const initialEdges = useMemo(() => createEdges(), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Listen for impact analysis events
  useEffect(() => {
    const handleImpactAnalysis = (e: CustomEvent<Artefact>) => {
      setImpactArtefact(e.detail);
      setShowImpactAnalysis(true);
    };
    window.addEventListener('openImpactAnalysis', handleImpactAnalysis as EventListener);
    return () => window.removeEventListener('openImpactAnalysis', handleImpactAnalysis as EventListener);
  }, []);

  const filteredNodes = useMemo(() => {
    if (filters.length === 0) return nodes;
    return nodes.filter((node) => filters.includes(node.data.type as ArtefactType));
  }, [nodes, filters]);

  const filteredEdges = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    return edges.filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target));
  }, [edges, filteredNodes]);

  const handleNodeClick = useCallback((_: React.MouseEvent, node: AppNode) => {
    setSelectedNode(node.data as unknown as Artefact);
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleImpactSave = (action: 'break' | 'modify', affectedIds: string[]) => {
    console.log('Impact action:', action, 'Affected:', affectedIds);
    // In real app, this would update the database
  };

  return (
    <div className="relative flex w-full h-[calc(100vh-4rem)]">
      {/* Filter Panel */}
      <FilterPanel
        selectedTypes={filters}
        onFilterChange={setFilters}
      />

      {/* Graph Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={filteredNodes}
          edges={filteredEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
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
                <span className="text-sm">ประวัติ</span>
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg shadow-card hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">เพิ่ม Artefact</span>
              </button>
            </motion.div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Insight Panel */}
      <AnimatePresence>
        {selectedNode && (
          <InsightPanel
            artefact={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
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

      {/* Create Artefact Modal */}
      <CreateArtefactModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => {
          console.log('New Artefact:', data);
        }}
      />
    </div>
  );
}
