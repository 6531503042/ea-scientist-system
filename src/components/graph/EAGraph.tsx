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
import { History, Briefcase, User, GitGraph, Network } from 'lucide-react';
import { ArtefactNode } from './ArtefactNode';
import { FilterPanel } from './FilterPanel';
import { InsightPanel } from './InsightPanel';
import { ImpactAnalysisModal } from './ImpactAnalysisModal';
import { TransactionHistory } from './TransactionHistory';
import { artefacts, relationships, type Artefact, type ArtefactType } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';

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
  const { role } = useAuth();
  const [selectedNode, setSelectedNode] = useState<Artefact | null>(null);
  const [filters, setFilters] = useState<ArtefactType[]>([]);
  const [showImpactAnalysis, setShowImpactAnalysis] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [impactArtefact, setImpactArtefact] = useState<Artefact | null>(null);

  // New state for modes
  const [viewMode, setViewMode] = useState<'architect' | 'executive'>(role === 'executive' ? 'executive' : 'architect');
  const [layoutMode, setLayoutMode] = useState<'graph' | 'tree'>('graph');

  // Initialize nodes and edges
  const initialNodes = useMemo(() => createNodes(artefacts), []);
  const initialEdges = useMemo(() => createEdges(), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update view mode if role changes types
  useEffect(() => {
    if (role === 'executive') setViewMode('executive');
    else if (role === 'architect') setViewMode('architect');
  }, [role]);

  // Handle Layout Changes
  useEffect(() => {
    setNodes((currentNodes) => {
      // 1. Group nodes by type for layer processing
      const typeGroups = {
        business: currentNodes.filter(n => n.data.type === 'business'),
        application: currentNodes.filter(n => n.data.type === 'application'),
        data: currentNodes.filter(n => n.data.type === 'data'),
        integration: currentNodes.filter(n => n.data.type === 'integration'),
        technology: currentNodes.filter(n => n.data.type === 'technology'),
        security: currentNodes.filter(n => n.data.type === 'security'),
      };

      if (layoutMode === 'tree') {
        // --- STRICT HIERARCHICAL TREE (Previously 'Map' logic) ---
        // Use the Layered Map logic here because user wants "Tree" to be "Hierarchical/Layered"
        // and "Graph" to be "Interactive/Radial".

        // Level 1: Business (Top)
        // Level 2: Application (Middle-Top)
        // Level 3: Data / Integration (Middle-Bottom)
        // Level 4: Technology / Security (Bottom)

        const levels = [
          typeGroups.business,
          typeGroups.application,
          [...typeGroups.data, ...typeGroups.integration],
          [...typeGroups.technology, ...typeGroups.security]
        ];

        const LEVEL_HEIGHT = 200;
        const NODE_WIDTH = 220;
        const GAP = 50;

        return currentNodes.map(node => {
          let levelIndex = -1;
          let nodeIndexInLevel = -1;
          let levelNodesCount = 0;

          // Find which level this node belongs to
          levels.forEach((lvl, idx) => {
            const foundIndex = lvl.findIndex(n => n.id === node.id);
            if (foundIndex !== -1) {
              levelIndex = idx;
              nodeIndexInLevel = foundIndex;
              levelNodesCount = lvl.length;
            }
          });

          if (levelIndex === -1) return node;

          // Calculate X to center the row
          const totalRowWidth = levelNodesCount * (NODE_WIDTH + GAP) - GAP;
          const startX = -(totalRowWidth / 2);
          const x = startX + nodeIndexInLevel * (NODE_WIDTH + GAP);
          const y = levelIndex * LEVEL_HEIGHT;

          return { ...node, position: { x, y } };
        });

      } else {
        // --- CONCENTRIC / RADIAL GRAPH (Interactive) ---
        // Center: Applications (or Specific System)
        // Ring 1: Business & Data
        // Ring 2: Technology & Security

        const center = { x: 0, y: 0 };
        const rings = {
          inner: { radius: 350, nodes: [...typeGroups.application, ...typeGroups.business] },
          outer: { radius: 700, nodes: [...typeGroups.data, ...typeGroups.integration, ...typeGroups.technology, ...typeGroups.security] }
        };

        return currentNodes.map(node => {
          // Find which ring
          let ringConfig = rings.outer;
          if (rings.inner.nodes.find(n => n.id === node.id)) ringConfig = rings.inner;

          const nodesInRing = ringConfig.nodes;
          const totalInRing = nodesInRing.length;
          const index = nodesInRing.findIndex(n => n.id === node.id);

          const angleStep = (2 * Math.PI) / totalInRing;
          const angle = index * angleStep;

          return {
            ...node,
            position: {
              x: center.x + ringConfig.radius * Math.cos(angle),
              y: center.y + ringConfig.radius * Math.sin(angle)
            }
          };
        });
      }
    });

    // Also update edge types
    setEdges((eds) => eds.map(e => ({
      ...e,
      type: layoutMode === 'tree' ? 'smoothstep' : 'default', // Smooth for Tree, Bezier for Graph
      style: { ...e.style, strokeWidth: layoutMode === 'tree' ? 2 : 1.5 }
    })));

  }, [layoutMode, setNodes, setEdges]);

  // Impact Analysis State
  const [impactMode, setImpactMode] = useState(false);
  const [simulationAction, setSimulationAction] = useState<'none' | 'delete' | 'modify'>('none');
  const [impactStats, setImpactStats] = useState({ affected: 0, critical: 0 });

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
      // Simple BFS/DFS to find dependencies
      // This is a simplified version of what was in the modal, now applied to graph state
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
            // Check risk
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

      setImpactStats({ affected: downstream.size, critical: criticalNodes.size });

      // Update Visuals
      setNodes(nds => nds.map(node => {
        const isSelected = node.id === selectedNode.id;
        const isUpstream = upstream.has(node.id);
        const isDownstream = downstream.has(node.id);
        const isRelated = isSelected || isUpstream || isDownstream;

        let style = { opacity: isRelated ? 1 : 0.1, transition: 'all 0.3s' };
        let className = '';

        if (isSelected) {
          style = { ...style, border: '2px solid hsl(var(--primary))', boxShadow: '0 0 20px hsl(var(--primary)/0.3)' };
        } else if (isUpstream) {
          style = { ...style, border: '2px solid hsl(var(--info))' };
        } else if (isDownstream) {
          // Simulation styling
          if (simulationAction === 'delete') {
            style = { ...style, border: '2px solid hsl(var(--destructive))', background: 'hsl(var(--destructive)/0.1)' };
          } else if (simulationAction === 'modify') {
            style = { ...style, border: '2px dashed hsl(var(--warning))', background: 'hsl(var(--warning)/0.1)' };
          } else {
            style = { ...style, border: '2px solid hsl(var(--accent))' };
          }
        }

        return { ...node, style };
      }));

      setEdges(eds => eds.map(edge => {
        const isUpstream = upstream.has(edge.source) && (upstream.has(edge.target) || edge.target === selectedNode.id);
        const isDownstream = (downstream.has(edge.source) || edge.source === selectedNode.id) && downstream.has(edge.target);
        const isRelated = isUpstream || isDownstream;

        return {
          ...edge,
          style: {
            ...edge.style,
            opacity: isRelated ? 1 : 0.05,
            stroke: isDownstream && simulationAction === 'delete' ? 'hsl(var(--destructive))' :
              isDownstream && simulationAction === 'modify' ? 'hsl(var(--warning))' :
                isRelated ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
            strokeWidth: isRelated ? 3 : 1
          },
          animated: isRelated || simulationAction !== 'none'
        };
      }));
    };

    analyzeImpact();
  }, [impactMode, selectedNode, simulationAction, nodes.length, edges.length]);

  // Listen for impact analysis events - triggers mode
  // Removed window event listener in favor of direct prop passing to InsightPanel
  const handleTriggerImpact = useCallback(() => {
    if (selectedNode) {
      setImpactMode(true);
    }
  }, [selectedNode]);

  const filteredNodes = useMemo(() => {
    let result = nodes;

    // View Mode Filter (Executive sees simplified view)
    if (viewMode === 'executive') {
      // Executive focuses on Business and Application layers mainly, and higher level items
      // For mock, let's filter out Technology and Integration types unless crucial
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

    return result;
  }, [nodes, filters, viewMode]);

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

      // Check if node already exists
      if (nodes.find((n) => n.id === artefact.id)) {
        // Maybe highlight existing node?
        return;
      }

      // Get drop position relative to the react flow bounds
      // Note: In a real app we'd need to use useReactFlow().screenToFlowPosition
      // simplified here for mock
      const position = {
        x: event.clientX - 300, // Approximate offset for sidebar
        y: event.clientY - 100, // Approximate offset for header
      };

      const newNode: AppNode = {
        id: artefact.id,
        type: 'artefact',
        position,
        data: artefact,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes],
  );

  return (
    <div className="relative flex w-full h-[calc(100vh-4rem)] flex-col">
      {/* Top Toolbar */}
      <div className="h-14 border-b bg-background flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-muted rounded-lg">
            <button
              onClick={() => setViewMode('architect')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'architect'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <Briefcase className="w-4 h-4" />
              Architect
            </button>
            <button
              onClick={() => setViewMode('executive')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'executive'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <User className="w-4 h-4" />
              Executive
            </button>
          </div>

          <div className="w-px h-6 bg-border" />

          {/* Layout Toggle */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <button
              onClick={() => setLayoutMode('tree')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${layoutMode === 'tree' ? 'text-primary bg-primary/10 font-medium' : 'hover:bg-muted'
                }`}
            >
              <GitGraph className="w-4 h-4" />
              Tree Layout
            </button>
            <button
              onClick={() => setLayoutMode('graph')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${layoutMode === 'graph' ? 'text-primary bg-primary/10 font-medium' : 'hover:bg-muted'
                }`}
            >
              <Network className="w-4 h-4" />
              Graph
            </button>
          </div>
        </div>

      </div>

      {/* Sidebar and Canvas */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Artefact Library Sidebar */}
        <div className="w-64 border-r bg-card flex flex-col z-20 shadow-lg">
          <div className="p-4 border-b">
            <h3 className="font-semibold mb-1">Artefact Library</h3>
            <p className="text-xs text-muted-foreground">Drag to add to canvas</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-6">
              {(['business', 'application', 'data', 'technology'] as const).map((type) => {
                const typeArtefacts = artefacts.filter(a => a.type === type);
                if (typeArtefacts.length === 0) return null;

                return (
                  <div key={type} className="space-y-2">
                    <h4 className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full bg-ea-${type}`}></span>
                      {type}
                    </h4>
                    <div className="space-y-2">
                      {typeArtefacts.map(artefact => (
                        <div
                          key={artefact.id}
                          className="p-2 bg-muted/30 border border-border rounded-lg hover:bg-muted cursor-move flex items-center gap-3 transition-colors group"
                          draggable
                          onDragStart={(event) => {
                            event.dataTransfer.setData('application/reactflow', JSON.stringify(artefact));
                            event.dataTransfer.effectAllowed = 'move';
                          }}
                        >
                          <div className="p-1.5 bg-background rounded-md shadow-sm group-hover:shadow-md transition-shadow">
                            <Briefcase className="w-3 h-3 text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-sm font-medium block truncate">{artefact.name}</span>
                            <span className="text-xs text-muted-foreground block truncate">{artefact.id}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Graph Canvas Wrapper */}
        <div className="flex-1 relative h-full">
          <ReactFlow
            nodes={filteredNodes}
            edges={filteredEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            onPaneClick={handlePaneClick}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
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
                  <span className="text-sm">ประวัติ</span>
                </button>
              </motion.div>
            </Panel>
            {/* Impact Analysis Control Panel */}
            {impactMode && selectedNode && (
              <Panel position="bottom-center" className="mb-8 p-4 bg-card/95 backdrop-blur border border-border rounded-xl shadow-2xl flex flex-col gap-4 min-w-[500px]">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="font-bold flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      Simulation Mode: {selectedNode.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Impacts: <span className="text-foreground font-medium">{impactStats.affected} systems</span>
                      {impactStats.critical > 0 && <span className="text-destructive ml-2 font-bold">({impactStats.critical} Critical)</span>}
                    </p>
                  </div>
                  <button onClick={() => setImpactMode(false)} className="p-2 hover:bg-muted rounded-full">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSimulationAction(curr => curr === 'modify' ? 'none' : 'modify')}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${simulationAction === 'modify' ? 'border-warning bg-warning/10 text-warning font-bold' : 'border-border hover:bg-muted'}`}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Simulate Modify
                  </button>
                  <button
                    onClick={() => setSimulationAction(curr => curr === 'delete' ? 'none' : 'delete')}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${simulationAction === 'delete' ? 'border-destructive bg-destructive/10 text-destructive font-bold' : 'border-border hover:bg-muted'}`}
                  >
                    <Trash2 className="w-4 h-4" />
                    Simulate Delete
                  </button>
                </div>

                {simulationAction !== 'none' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-sm p-3 bg-muted rounded-lg border border-border">
                    {simulationAction === 'delete' ? (
                      <p className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="w-4 h-4" />
                        <strong>Warning:</strong> Deleting this artefact breaks {impactStats.affected} dependent chains.
                      </p>
                    ) : (
                      <p className="flex items-center gap-2 text-warning">
                        <Info className="w-4 h-4" />
                        <strong>Note:</strong> Modification requires regression testing for {impactStats.affected} systems.
                      </p>
                    )}
                  </motion.div>
                )}
              </Panel>
            )}

          </ReactFlow>
        </div>

        {/* Right Side: FilterPanel or InsightPanel */}
        {selectedNode ? (
          <AnimatePresence>
            <InsightPanel
              artefact={selectedNode}
              onClose={() => setSelectedNode(null)}
              onImpactAnalysis={handleTriggerImpact}
            />
          </AnimatePresence>
        ) : (
          <div className="border-l border-border bg-card">
            <FilterPanel selectedTypes={filters} onFilterChange={setFilters} />
          </div>
        )}


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
