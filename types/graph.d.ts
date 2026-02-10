/**
 * Graph Module Types
 * Shared types for the Architecture Map / Graph page
 */

import type { Edge, Node } from '@xyflow/react';
import type { Artefact, ArtefactType } from './artefact';

// ── Shared Type Aliases ──

export type SimulationAction = 'none' | 'delete' | 'modify';
export type ViewMode = 'architect' | 'executive';
export type LayoutMode = 'graph' | 'hierarchy';

// ── Impact Analysis ──

export interface ImpactStats {
    affected: number;
    critical: number;
    upstream: number;
}

export interface UseImpactAnalysisProps {
    selectedNode: Artefact | null;
    nodes: Node[];
    edges: Edge[];
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

// ── Component Props ──

export interface FloatingInsightPanelProps {
    artefact: Artefact;
    onClose: () => void;
    onImpactAnalysis: () => void;
    impactMode: boolean;
    impactStats: ImpactStats;
    upstreamList: Artefact[];
    downstreamList: Artefact[];
    simulationAction: SimulationAction;
    setSimulationAction: (action: SimulationAction) => void;
    setImpactMode: (mode: boolean) => void;
}

export interface GraphToolbarProps {
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    layoutMode: LayoutMode;
    setLayoutMode: (mode: LayoutMode) => void;
    showFloatingPanel: boolean;
    setShowFloatingPanel: (show: boolean) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export interface FilterPanelProps {
    selectedTypes: ArtefactType[];
    onFilterChange: (types: ArtefactType[]) => void;
    relationships?: Edge[];
}
