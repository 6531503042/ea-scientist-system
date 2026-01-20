import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Search, Expand, Shrink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { organizationTree, treeNodeIcons, treeNodeColors, type TreeNode } from '@/data/mockOrganization';

interface TreeViewProps {
    onNodeClick?: (node: TreeNode) => void;
    selectedNodeId?: string;
    searchQuery?: string;
}

interface TreeNodeItemProps {
    node: TreeNode;
    level: number;
    expandedNodes: Set<string>;
    toggleExpand: (id: string) => void;
    onNodeClick?: (node: TreeNode) => void;
    selectedNodeId?: string;
    searchQuery: string;
}

function TreeNodeItem({
    node,
    level,
    expandedNodes,
    toggleExpand,
    onNodeClick,
    selectedNodeId,
    searchQuery
}: TreeNodeItemProps) {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNodeId === node.id;

    // Check if this node or any descendant matches the search
    const matchesSearch = (n: TreeNode): boolean => {
        const query = searchQuery.toLowerCase();
        if (n.name.toLowerCase().includes(query) || n.nameTh.includes(query)) {
            return true;
        }
        if (n.children) {
            return n.children.some(child => matchesSearch(child));
        }
        return false;
    };

    const isVisible = !searchQuery || matchesSearch(node);

    if (!isVisible) return null;

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                    "flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer transition-all",
                    "hover:bg-muted",
                    isSelected && "bg-primary/10 border border-primary/30"
                )}
                style={{ paddingLeft: `${level * 16 + 8}px` }}
                onClick={() => onNodeClick?.(node)}
            >
                {/* Expand/Collapse Toggle */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (hasChildren) toggleExpand(node.id);
                    }}
                    className={cn(
                        "w-5 h-5 flex items-center justify-center rounded transition-colors",
                        hasChildren ? "hover:bg-muted-foreground/10" : "invisible"
                    )}
                >
                    {hasChildren && (
                        isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )
                    )}
                </button>

                {/* Icon */}
                <div
                    className="w-6 h-6 flex items-center justify-center rounded text-sm"
                    style={{ backgroundColor: `${treeNodeColors[node.type]}20` }}
                >
                    {treeNodeIcons[node.type]}
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground truncate block">
                        {node.nameTh}
                    </span>
                    <span className="text-xs text-muted-foreground truncate block">
                        {node.name}
                    </span>
                </div>

                {/* Type Badge */}
                <span
                    className="text-[10px] px-1.5 py-0.5 rounded font-medium uppercase"
                    style={{
                        backgroundColor: `${treeNodeColors[node.type]}20`,
                        color: treeNodeColors[node.type]
                    }}
                >
                    {node.type}
                </span>
            </motion.div>

            {/* Children */}
            <AnimatePresence>
                {hasChildren && isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        {node.children!.map((child) => (
                            <TreeNodeItem
                                key={child.id}
                                node={child}
                                level={level + 1}
                                expandedNodes={expandedNodes}
                                toggleExpand={toggleExpand}
                                onNodeClick={onNodeClick}
                                selectedNodeId={selectedNodeId}
                                searchQuery={searchQuery}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function TreeView({ onNodeClick, selectedNodeId, searchQuery: externalSearchQuery }: TreeViewProps) {
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['org-dss']));
    const [internalSearchQuery, setInternalSearchQuery] = useState('');

    // Use external search query if provided, otherwise use internal
    const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;

    const toggleExpand = (id: string) => {
        setExpandedNodes(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    // Get all node IDs for expand all / collapse all
    const getAllNodeIds = (node: TreeNode): string[] => {
        const ids = [node.id];
        if (node.children) {
            node.children.forEach(child => {
                ids.push(...getAllNodeIds(child));
            });
        }
        return ids;
    };

    const allNodeIds = useMemo(() => getAllNodeIds(organizationTree), []);

    const expandAll = () => {
        setExpandedNodes(new Set(allNodeIds));
    };

    const collapseAll = () => {
        setExpandedNodes(new Set());
    };

    // Count total nodes
    const totalNodes = allNodeIds.length;

    return (
        <div className="h-full flex flex-col bg-card">
            {/* Header */}
            <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h3 className="font-semibold text-foreground">Organization Hierarchy</h3>
                        <p className="text-xs text-muted-foreground">{totalNodes} nodes</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={expandAll}
                            className="p-1.5 rounded hover:bg-muted transition-colors"
                            title="Expand All"
                        >
                            <Expand className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                            onClick={collapseAll}
                            className="p-1.5 rounded hover:bg-muted transition-colors"
                            title="Collapse All"
                        >
                            <Shrink className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </div>
                </div>

                {/* Search - only show if no external search provided */}
                {externalSearchQuery === undefined && (
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="ค้นหา..."
                            value={internalSearchQuery}
                            onChange={(e) => setInternalSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm bg-muted border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>
                )}
            </div>

            {/* Tree Content */}
            <div className="flex-1 overflow-y-auto p-2">
                <TreeNodeItem
                    node={organizationTree}
                    level={0}
                    expandedNodes={expandedNodes}
                    toggleExpand={toggleExpand}
                    onNodeClick={onNodeClick}
                    selectedNodeId={selectedNodeId}
                    searchQuery={searchQuery}
                />
            </div>

            {/* Legend */}
            <div className="p-3 border-t border-border bg-muted/30">
                <p className="text-xs text-muted-foreground mb-2">Legend</p>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(treeNodeIcons).slice(0, 6).map(([type, icon]) => (
                        <div key={type} className="flex items-center gap-1">
                            <span className="text-xs">{icon}</span>
                            <span className="text-[10px] text-muted-foreground capitalize">{type}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
