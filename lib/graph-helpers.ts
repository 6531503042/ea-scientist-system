/**
 * Graph Helper Functions
 * Utility functions for node/edge creation and positioning
 */

import type { Node, Edge, MarkerType } from '@xyflow/react';
import type { Artefact, ArtefactType, Relationship } from '@/types/artefact';

// Position nodes in a hierarchical layout
export function getNodePosition(type: ArtefactType, index: number): { x: number; y: number } {
    const typeOrder: ArtefactType[] = ['business', 'application', 'data', 'technology', 'security', 'integration'];
    const row = typeOrder.indexOf(type);
    const col = index % 3;

    return {
        x: 100 + col * 320 + (row % 2) * 80,
        y: 80 + row * 180,
    };
}

export function createNodes(artefactList: Artefact[]): Node[] {
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

export function createEdges(relationships: Relationship[], markerType: typeof MarkerType): Edge[] {
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
            type: markerType.ArrowClosed,
            color: 'hsl(var(--muted-foreground))',
        },
    }));
}

// Apply graph layout to nodes (block-like grouped by type)
export function applyGraphLayout(
    currentNodes: Node[],
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
) {
    setNodes((nodes) => {
        const typeGroups = {
            business: nodes.filter(n => n.data.type === 'business'),
            application: nodes.filter(n => n.data.type === 'application'),
            data: nodes.filter(n => n.data.type === 'data'),
            integration: nodes.filter(n => n.data.type === 'integration'),
            security: nodes.filter(n => n.data.type === 'security'),
            technology: nodes.filter(n => n.data.type === 'technology'),
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

        return nodes.map(node => {
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
}

// Type colors matching the design system
export const graphTypeColors: Record<ArtefactType, string> = {
    business: 'bg-violet-500',
    application: 'bg-sky-500',
    data: 'bg-teal-500',
    technology: 'bg-indigo-500',
    security: 'bg-amber-500',
    integration: 'bg-pink-500',
};

// Type order for consistent display
export const artefactTypeOrder: readonly ArtefactType[] = ['business', 'application', 'data', 'technology', 'security', 'integration'] as const;
