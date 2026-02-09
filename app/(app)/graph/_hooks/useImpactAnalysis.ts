'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Edge, Node } from '@xyflow/react';
import type { Artefact } from '@/data/mockData';
import { artefacts } from '@/data/mockData';

interface ImpactStats {
    affected: number;
    critical: number;
    upstream: number;
}

interface UseImpactAnalysisProps {
    selectedNode: Artefact | null;
    nodes: Node[];
    edges: Edge[];
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

export function useImpactAnalysis({
    selectedNode,
    nodes,
    edges,
    setNodes,
    setEdges
}: UseImpactAnalysisProps) {
    const [impactMode, setImpactMode] = useState(false);
    const [simulationAction, setSimulationAction] = useState<'none' | 'delete' | 'modify'>('none');
    const [impactStats, setImpactStats] = useState<ImpactStats>({ affected: 0, critical: 0, upstream: 0 });
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

    return {
        impactMode,
        setImpactMode,
        simulationAction,
        setSimulationAction,
        impactStats,
        upstreamList,
        downstreamList,
        handleTriggerImpact,
    };
}
