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
import { History, Briefcase, User, GitGraph, Network, Activity, X, RotateCcw, Trash2, AlertTriangle, Info, FolderTree } from 'lucide-react';
import { ArtefactNode } from './ArtefactNode';
import { FilterPanel } from './FilterPanel';
import { InsightPanel } from './InsightPanel';
import { ImpactAnalysisModal } from './ImpactAnalysisModal';
import { TransactionHistory } from './TransactionHistory';
import { TreeView } from './TreeView';
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

function EAGraphInner() {
  const { role } = useAuth();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const [selectedNode, setSelectedNode] = useState<Artefact | null>(null);
  const [filters, setFilters] = useState<ArtefactType[]>([]);
  const [showImpactAnalysis, setShowImpactAnalysis] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [impactArtefact, setImpactArtefact] = useState<Artefact | null>(null);

  // New state for modes
  const [viewMode, setViewMode] = useState<'architect' | 'executive'>(role === 'executive' ? 'executive' : 'architect');
  const [layoutMode, setLayoutMode] = useState<'graph' | 'tree' | 'hierarchy'>('graph');

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

  // Track previous layout mode to only apply layout on actual changes
  const prevLayoutModeRef = useRef(layoutMode);

  // Handle Layout Changes - Based on ACTUAL RELATIONSHIPS
  // Only runs when layoutMode CHANGES, not on every render
  useEffect(() => {
    // Skip if layout mode hasn't actually changed
    if (prevLayoutModeRef.current === layoutMode && prevLayoutModeRef.current !== 'graph') {
      return;
    }
    prevLayoutModeRef.current = layoutMode;

    // Build adjacency lists from edges (use initialEdges to avoid dependency)
    const edgeList = edges;
    const childrenOf: Record<string, string[]> = {};
    const parentsOf: Record<string, string[]> = {};

    edgeList.forEach(e => {
      if (!childrenOf[e.source]) childrenOf[e.source] = [];
      childrenOf[e.source].push(e.target);
      if (!parentsOf[e.target]) parentsOf[e.target] = [];
      parentsOf[e.target].push(e.source);
    });

    setNodes((currentNodes) => {
      if (layoutMode === 'tree') {
        // ========== TREE LAYOUT (Organic Tree-like Flow) ==========
        // Find the most connected node as the center/root
        const connectionCount: Record<string, number> = {};
        currentNodes.forEach(n => {
          connectionCount[n.id] = (childrenOf[n.id]?.length || 0) + (parentsOf[n.id]?.length || 0);
        });

        // Sort by connections to find central node
        const sortedByConnections = [...currentNodes].sort(
          (a, b) => (connectionCount[b.id] || 0) - (connectionCount[a.id] || 0)
        );

        const centralNode = sortedByConnections[0];
        if (!centralNode) return currentNodes;

        // Position central node
        const positions: Map<string, { x: number; y: number }> = new Map();
        positions.set(centralNode.id, { x: 0, y: 200 });

        // Position parents above central node
        const parents = parentsOf[centralNode.id] || [];
        parents.forEach((parentId, idx) => {
          const spread = parents.length > 1 ? 300 : 0;
          const offsetX = (idx - (parents.length - 1) / 2) * spread;
          positions.set(parentId, { x: offsetX, y: 0 });
        });

        // Position direct children below central node in a spread pattern
        const children = childrenOf[centralNode.id] || [];
        const childSpread = Math.max(280, 1200 / Math.max(children.length, 1));
        children.forEach((childId, idx) => {
          const offsetX = (idx - (children.length - 1) / 2) * childSpread;
          positions.set(childId, { x: offsetX, y: 420 });
        });

        // Position grandchildren
        const grandchildY = 650;
        children.forEach((childId) => {
          const grandchildren = childrenOf[childId] || [];
          const childX = positions.get(childId)?.x || 0;
          grandchildren.forEach((gcId, gcIdx) => {
            if (!positions.has(gcId)) {
              const gcSpread = Math.max(220, 500 / Math.max(grandchildren.length, 1));
              const offsetX = (gcIdx - (grandchildren.length - 1) / 2) * gcSpread;
              positions.set(gcId, { x: childX + offsetX, y: grandchildY });
            }
          });
        });

        // Position any remaining unpositioned nodes around the edges
        const unpositioned = currentNodes.filter(n => !positions.has(n.id));
        unpositioned.forEach((n, idx) => {
          const angle = (idx / Math.max(unpositioned.length, 1)) * 2 * Math.PI - Math.PI / 2;
          const radius = 600;
          positions.set(n.id, {
            x: radius * Math.cos(angle),
            y: 350 + radius * Math.sin(angle) * 0.6
          });
        });

        return currentNodes.map(node => ({
          ...node,
          position: positions.get(node.id) || node.position
        }));

      } else {
        // ========== GRAPH LAYOUT (Block/Row by Type) ==========
        // Group nodes by artefact type into rows
        const typeGroups = {
          business: currentNodes.filter(n => n.data.type === 'business'),
          application: currentNodes.filter(n => n.data.type === 'application'),
          data: currentNodes.filter(n => n.data.type === 'data'),
          integration: currentNodes.filter(n => n.data.type === 'integration'),
          security: currentNodes.filter(n => n.data.type === 'security'),
          technology: currentNodes.filter(n => n.data.type === 'technology'),
        };

        // Define levels (rows)
        const levels = [
          typeGroups.business,
          typeGroups.application,
          [...typeGroups.data, ...typeGroups.integration, ...typeGroups.security],
          typeGroups.technology
        ];

        const LEVEL_HEIGHT = 200;
        const NODE_WIDTH = 220;
        const GAP = 60;

        // Build level map
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
      }
    });

    // Update edge types
    setEdges((eds) => eds.map(e => ({
      ...e,
      type: layoutMode === 'tree' ? 'default' : 'smoothstep', // Bezier for Tree, Smooth for Graph
      style: { ...e.style, strokeWidth: 2 }
    })));

    // eslint-disable-next-line react-hooks/exhaustive-deps
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

        let style: React.CSSProperties = { opacity: isRelated ? 1 : 0.1, transition: 'all 0.3s' };
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
    if (impactMode) setImpactMode(false);
  }, [impactMode]);

  // Handle new edge connections
  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
        source: connection.source!,
        target: connection.target!,
        type: layoutMode === 'tree' ? 'default' : 'smoothstep',
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
    [setEdges, layoutMode]
  );

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

      // Use screenToFlowPosition to properly convert screen coordinates to flow coordinates
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Check if node already exists - if so, create a copy with a unique ID
      let nodeId = artefact.id;
      let nodeName = artefact.name;
      if (nodes.find((n) => n.id === artefact.id)) {
        // Create a unique ID for the copy
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
    <div className="relative flex w-full h-[calc(100vh-4rem)] flex-col">
      {/* Top Toolbar - Compact & Responsive */}
      <div className="min-h-[40px] border-b bg-background flex items-center justify-start px-2 sm:px-4 py-1.5 z-10 flex-wrap gap-1.5">
        {/* View Mode Toggle */}
        <div className="flex items-center h-7 p-0.5 bg-muted rounded-md">
          <button
            onClick={() => setViewMode('architect')}
            className={`flex items-center gap-1 px-2 h-6 rounded text-[11px] font-medium transition-all ${viewMode === 'architect'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <Briefcase className="w-3 h-3" />
            <span className="hidden sm:inline">Architect</span>
          </button>
          <button
            onClick={() => setViewMode('executive')}
            className={`flex items-center gap-1 px-2 h-6 rounded text-[11px] font-medium transition-all ${viewMode === 'executive'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            <User className="w-3 h-3" />
            <span className="hidden sm:inline">Executive</span>
          </button>
        </div>

        <div className="w-px h-4 bg-border hidden sm:block" />

        {/* Layout Toggle - Compact */}
        <div className="flex items-center h-7 p-0.5 bg-muted rounded-md">
          <button
            onClick={() => setLayoutMode('graph')}
            className={`flex items-center gap-1 px-2 h-6 rounded text-[11px] font-medium transition-all ${layoutMode === 'graph'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
              }`}
            title="Graph View"
          >
            <Network className="w-3 h-3" />
            <span className="hidden md:inline">Graph</span>
          </button>
          <button
            onClick={() => setLayoutMode('tree')}
            className={`flex items-center gap-1 px-2 h-6 rounded text-[11px] font-medium transition-all ${layoutMode === 'tree'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
              }`}
            title="Tree View"
          >
            <GitGraph className="w-3 h-3" />
            <span className="hidden md:inline">Tree</span>
          </button>
          <button
            onClick={() => setLayoutMode('hierarchy')}
            className={`flex items-center gap-1 px-2 h-6 rounded text-[11px] font-medium transition-all ${layoutMode === 'hierarchy'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
              }`}
            title="Hierarchy View"
          >
            <FolderTree className="w-3 h-3" />
            <span className="hidden md:inline">Hierarchy</span>
          </button>
        </div>
      </div>

      {/* Sidebar and Canvas */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Artefact Library Sidebar - Compact & Responsive */}
        <div className="hidden sm:flex w-48 md:w-52 border-r bg-card flex-col z-20 shadow-lg">
          <div className="px-3 py-2 border-b">
            <h3 className="font-semibold text-sm">Artefacts</h3>
            <p className="text-[10px] text-muted-foreground">Drag to canvas</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-3">
              {(['business', 'application', 'data', 'technology'] as const).map((type) => {
                const typeArtefacts = artefacts.filter(a => a.type === type);
                if (typeArtefacts.length === 0) return null;

                return (
                  <div key={type} className="space-y-1">
                    <h4 className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full bg-ea-${type}`}></span>
                      {type}
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
                          <div className="p-1 bg-background rounded shadow-sm">
                            <Briefcase className="w-2.5 h-2.5 text-muted-foreground" />
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
        </div>

        {/* Graph Canvas Wrapper */}
        <div ref={reactFlowWrapper} className="flex-1 relative h-full">
          {layoutMode === 'hierarchy' ? (
            <TreeView
              onNodeClick={(node) => {
                // If node has artefactId, select that artefact
                if (node.artefactId) {
                  const artefact = artefacts.find(a => a.id === node.artefactId);
                  if (artefact) {
                    setSelectedNode(artefact);
                  }
                }
              }}
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
                    <span className="text-sm">ประวัติ</span>
                  </button>
                </motion.div>
              </Panel>
              {/* Impact Analysis Control Panel - Compact & Responsive */}
              {impactMode && selectedNode && (
                <Panel position="bottom-center" className="mb-4 mx-2 p-3 bg-card/95 backdrop-blur border border-border rounded-lg shadow-2xl flex flex-col gap-2 w-[calc(100%-1rem)] sm:w-auto sm:min-w-[320px] md:min-w-[400px]">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold flex items-center gap-1.5 truncate">
                        <Activity className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="truncate">{selectedNode.name}</span>
                      </h3>
                      <p className="text-[10px] text-muted-foreground">
                        <span className="text-foreground font-medium">{impactStats.affected}</span> impacts
                        {impactStats.critical > 0 && <span className="text-destructive ml-1 font-bold">({impactStats.critical} critical)</span>}
                      </p>
                    </div>
                    <button onClick={() => setImpactMode(false)} className="p-1.5 hover:bg-muted rounded-full flex-shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSimulationAction(curr => curr === 'modify' ? 'none' : 'modify')}
                      className={`flex-1 py-2 px-2 rounded border-2 transition-all flex items-center justify-center gap-1.5 text-xs ${simulationAction === 'modify' ? 'border-warning bg-warning/10 text-warning font-bold' : 'border-border hover:bg-muted'}`}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Simulate</span> Modify
                    </button>
                    <button
                      onClick={() => setSimulationAction(curr => curr === 'delete' ? 'none' : 'delete')}
                      className={`flex-1 py-2 px-2 rounded border-2 transition-all flex items-center justify-center gap-1.5 text-xs ${simulationAction === 'delete' ? 'border-destructive bg-destructive/10 text-destructive font-bold' : 'border-border hover:bg-muted'}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Simulate</span> Delete
                    </button>
                  </div>

                  {simulationAction !== 'none' && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-xs p-2 bg-muted rounded border border-border">
                      {simulationAction === 'delete' ? (
                        <p className="flex items-start gap-1.5 text-destructive">
                          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                          <span>Breaks {impactStats.affected} dependencies</span>
                        </p>
                      ) : (
                        <p className="flex items-start gap-1.5 text-warning">
                          <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                          <span>Requires testing for {impactStats.affected} systems</span>
                        </p>
                      )}
                    </motion.div>
                  )}
                </Panel>
              )}

            </ReactFlow>
          )}
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
            <FilterPanel
              selectedTypes={filters}
              onFilterChange={setFilters}
              relationships={edges}
            />
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

// Wrapper component that provides ReactFlowProvider
export function EAGraph() {
  return (
    <ReactFlowProvider>
      <EAGraphInner />
    </ReactFlowProvider>
  );
}
