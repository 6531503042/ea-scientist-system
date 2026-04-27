"use client";

import { useCallback, useMemo, useState, useEffect, useRef } from "react";
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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { History, Layers } from "lucide-react";
import { ArtefactNode } from "./_components/ArtefactNode";
import { FilterPanel } from "./_components/FilterPanel";
import { ImpactAnalysisModal } from "./_components/ImpactAnalysisModal";
import { TransactionHistory } from "./_components/TransactionHistory";
import type { Artefact, ArtefactType } from "@/types/artefact";
import { TreeView, type TreeNode } from "./_components/TreeView";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { FloatingInsightPanel } from "./_components/FloatingInsightPanel";
import { ArtefactLibraryPanel } from "./_components/ArtefactLibraryPanel";
import { MobileLibrarySheet } from "./_components/MobileLibrarySheet";
import { GraphToolbar } from "./_components/GraphToolbar";
import { createNodes, createEdges } from "@/lib/graph-helpers";
import { useImpactAnalysis } from "@/hooks/useImpactAnalysis";
import { useArtefacts } from "@/hooks/useArtefacts";
import { useRelationships } from "@/hooks/useRelationships";
import { useDepartments } from "@/hooks/useDepartments";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AppNode = Node<any, string>;

const nodeTypes = {
  artefact: ArtefactNode,
};

function GraphPageContent() {
  const { language } = useLanguage();
  const { role } = useAuth();
  const { toast } = useToast();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const [selectedNode, setSelectedNode] = useState<Artefact | null>(null);
  const [filters, setFilters] = useState<ArtefactType[]>([]);
  const [showImpactAnalysis, setShowImpactAnalysis] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [impactArtefact, setImpactArtefact] = useState<Artefact | null>(null);

  // Mode state
  const [viewMode, setViewMode] = useState<"architect" | "executive">(
    "architect",
  );
  const [layoutMode, setLayoutMode] = useState<"graph" | "hierarchy">("graph");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFloatingPanel, setShowFloatingPanel] = useState(true);

  // Mobile state
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileLibrary, setShowMobileLibrary] = useState(false);
  const {
    allArtefacts,
    loading: artefactsLoading,
    error: artefactsError,
    fetchArtefacts,
  } = useArtefacts();
  const {
    departments,
    loading: departmentsLoading,
    error: departmentsError,
    fetchDepartments,
  } = useDepartments();
  const {
    relationships,
    loading: relationshipsLoading,
    error: relationshipsError,
    refetch: fetchRelationships,
    createRelationship,
    deleteRelationship,
  } = useRelationships();

  const graphLoading =
    artefactsLoading || relationshipsLoading || departmentsLoading;
  const graphError = artefactsError || relationshipsError || departmentsError;
  const hasGraphData =
    allArtefacts.length > 0 ||
    relationships.length > 0 ||
    departments.length > 0;

  const handleRetryGraphData = useCallback(async () => {
    await Promise.all([
      fetchArtefacts(),
      fetchRelationships(),
      fetchDepartments(),
    ]);
  }, [fetchArtefacts, fetchRelationships, fetchDepartments]);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Initialize nodes and edges
  const initialNodes = useMemo(() => createNodes([]), []);
  const initialEdges = useMemo(() => createEdges([], MarkerType), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(createNodes(allArtefacts));
    setEdges(createEdges(relationships, MarkerType));
  }, [allArtefacts, relationships, setNodes, setEdges]);

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
    artefacts: allArtefacts,
    nodes,
    edges,
    setNodes,
    setEdges,
  });

  // Update view mode if role changes
  useEffect(() => {
    if (role === "executive") setViewMode("executive");
    else if (role === "architect") setViewMode("architect");
  }, [role]);

  // Handle Layout Changes - Graph Layout Only
  useEffect(() => {
    if (layoutMode === "hierarchy") return;

    setNodes((currentNodes) => {
      const typeGroups = {
        business: currentNodes.filter((n) => n.data.type === "business"),
        application: currentNodes.filter((n) => n.data.type === "application"),
        data: currentNodes.filter((n) => n.data.type === "data"),
        integration: currentNodes.filter((n) => n.data.type === "integration"),
        security: currentNodes.filter((n) => n.data.type === "security"),
        technology: currentNodes.filter((n) => n.data.type === "technology"),
      };

      const levels = [
        typeGroups.business,
        typeGroups.application,
        [...typeGroups.data, ...typeGroups.integration, ...typeGroups.security],
        typeGroups.technology,
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

      return currentNodes.map((node) => {
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

    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        type: "smoothstep",
        style: { ...e.style, strokeWidth: 2 },
      })),
    );
  }, [layoutMode, setNodes, setEdges]);

  const filteredNodes = useMemo(() => {
    let result = nodes;
    if (viewMode === "executive") {
      result = result.filter(
        (n) =>
          n.data.type === "business" ||
          n.data.type === "application" ||
          n.data.type === "data",
      );
    }
    if (filters.length > 0) {
      result = result.filter((node) =>
        filters.includes(node.data.type as ArtefactType),
      );
    }
    if (searchQuery) {
      result = result.filter(
        (node) =>
          (node.data.name as string)
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (node.data.nameTh as string)
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }
    return result;
  }, [nodes, filters, viewMode, searchQuery]);

  const filteredEdges = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map((n) => n.id));
    return edges.filter(
      (edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target),
    );
  }, [edges, filteredNodes]);

  const hierarchyTree = useMemo<TreeNode>(() => {
    const normalizeStatus = (
      status?: string,
    ): TreeNode["status"] | undefined => {
      const normalized = String(status || "").toLowerCase();
      if (normalized === "active") return "active";
      if (normalized === "draft") return "draft";
      if (normalized === "archived" || normalized === "inactive") {
        return "archived";
      }
      return undefined;
    };

    const root: TreeNode = {
      id: "org-dss",
      name: "Department of Science Service",
      nameTh: "กรมวิทยาศาสตร์บริการ",
      type: "organization",
      status: "active",
      owner: "-",
      children: [],
    };

    const artefactsByDepartment = new Map<string, Artefact[]>();
    allArtefacts.forEach((artefact) => {
      const key = artefact.department || "unknown";
      const current = artefactsByDepartment.get(key) || [];
      current.push(artefact);
      artefactsByDepartment.set(key, current);
    });

    root.children = departments.map((department) => {
      const deptArtefacts = artefactsByDepartment.get(department.name) || [];

      const children: TreeNode[] = deptArtefacts.map((artefact) => ({
        id: `artefact-${artefact.id}`,
        name: artefact.name,
        nameTh: artefact.nameTh || artefact.name,
        type: artefact.type === "data" ? "data" : "application",
        artefactId: artefact.id,
        owner: artefact.owner,
        status: normalizeStatus(artefact.status),
      }));

      return {
        id: `department-${department._id}`,
        name: department.name,
        nameTh: department.nameTh || department.name,
        type: "department",
        owner: department.head || "-",
        status: normalizeStatus(department.status),
        children,
      };
    });

    return root;
  }, [allArtefacts, departments]);

  const handleNodeClick = useCallback((_: React.MouseEvent, node: AppNode) => {
    setSelectedNode(node.data as unknown as Artefact);
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
    if (impactMode) setImpactMode(false);
  }, [impactMode, setImpactMode]);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;

      createRelationship({
        source: connection.source,
        target: connection.target,
        type: "depends_on",
      }).catch((error) => {
        toast({
          variant: "destructive",
          title: "สร้างความสัมพันธ์ไม่สำเร็จ",
          description:
            error instanceof Error ? error.message : "กรุณาลองใหม่อีกครั้ง",
        });
      });
    },
    [createRelationship, toast],
  );

  const onEdgesDelete = useCallback(
    (deletedEdges: Edge[]) => {
      deletedEdges.forEach((edge) => {
        deleteRelationship(edge.id).catch(() => {
          toast({
            variant: "destructive",
            title: "ลบความสัมพันธ์ไม่สำเร็จ",
            description: "รายการนี้อาจยังไม่ได้ถูกบันทึกในระบบ",
          });
        });
      });
    },
    [deleteRelationship, toast],
  );

  const handleImpactSave = (
    action: "break" | "modify",
    affectedIds: string[],
  ) => {
    console.log("Impact action:", action, "Affected:", affectedIds);
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const data = event.dataTransfer.getData("application/reactflow");
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
        type: "artefact",
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
          {graphLoading && !hasGraphData && !graphError ? (
            <div className="h-full flex items-center justify-center">
              <span className="text-sm text-muted-foreground">
                กำลังโหลดข้อมูลกราฟ...
              </span>
            </div>
          ) : graphError && !hasGraphData ? (
            <div className="p-4 sm:p-6">
              <Alert variant="destructive">
                <AlertTitle>โหลดข้อมูล Graph ไม่สำเร็จ</AlertTitle>
                <AlertDescription className="space-y-3">
                  <p>{graphError}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRetryGraphData}
                  >
                    ลองใหม่
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          ) : layoutMode === "hierarchy" ? (
            <TreeView
              tree={hierarchyTree}
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
              onEdgesDelete={onEdgesDelete}
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
                      {filteredNodes.length} Artefacts • {filteredEdges.length}{" "}
                      Relationships
                    </span>
                  </div>
                  <button
                    onClick={() => setShowHistory(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-card/90 backdrop-blur border border-border rounded-lg shadow-card hover:bg-muted transition-colors"
                  >
                    <History className="w-4 h-4" />
                    <span className="text-sm hidden sm:inline">
                      {language === "th" ? "ประวัติ" : "History"}
                    </span>
                  </button>
                </motion.div>
              </Panel>
            </ReactFlow>
          )}
        </div>

        {/* Right Side Filter Panel (when no node selected) */}
        {!selectedNode && layoutMode === "graph" && (
          <div className="hidden lg:block border-l border-border bg-card w-64">
            <FilterPanel
              selectedTypes={filters}
              onFilterChange={setFilters}
              relationships={edges}
            />
          </div>
        )}

        {/* Floating Insight Panel */}
        <AnimatePresence>
          {selectedNode && layoutMode === "graph" && (
            <FloatingInsightPanel
              artefact={selectedNode}
              artefacts={allArtefacts}
              relationships={relationships}
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
          {showFloatingPanel && layoutMode === "graph" && (
            <ArtefactLibraryPanel
              artefacts={allArtefacts}
              onClose={() => setShowFloatingPanel(false)}
            />
          )}
        </AnimatePresence>

        {/* Impact Analysis Modal */}
        {showImpactAnalysis && impactArtefact && layoutMode === "graph" && (
          <ImpactAnalysisModal
            artefact={impactArtefact}
            artefacts={allArtefacts}
            relationships={relationships}
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

        {/* Mobile FAB */}
        {isMobile && layoutMode === "graph" && (
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
              artefacts={allArtefacts}
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
