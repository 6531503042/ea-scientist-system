import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Search, Expand, Shrink, User, Activity } from 'lucide-react';
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

const statusColors: Record<string, string> = {
    active: 'bg-green-500/10 text-green-600 border-green-200',
    draft: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
    archived: 'bg-gray-500/10 text-gray-600 border-gray-200',
    planned: 'bg-blue-500/10 text-blue-600 border-blue-200',
};

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
        if (n.name.toLowerCase().includes(query) || n.nameTh.includes(query) || n.owner?.toLowerCase().includes(query)) {
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
        <div className="group">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                    "flex items-center py-2 px-2 border-b border-border/50 transition-colors",
                    "hover:bg-muted/50",
                    isSelected && "bg-primary/5 border-primary/20"
                )}
                onClick={() => onNodeClick?.(node)}
            >
                {/* Column 1: Name (Tree Indented) - 45% */}
                <div className="flex-1 min-w-0 flex items-center gap-2" style={{ paddingLeft: `${level * 20}px` }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (hasChildren) toggleExpand(node.id);
                        }}
                        className={cn(
                            "w-5 h-5 flex items-center justify-center rounded transition-colors flex-shrink-0",
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

                    <div
                        className="w-6 h-6 flex items-center justify-center rounded text-sm flex-shrink-0"
                        style={{ backgroundColor: `${treeNodeColors[node.type]}20` }}
                    >
                        {treeNodeIcons[node.type]}
                    </div>

                    <div className="min-w-0">
                        <span className="text-sm font-medium text-foreground truncate block">
                            {node.nameTh}
                        </span>
                        <span className="text-xs text-muted-foreground truncate block">
                            {node.name}
                        </span>
                    </div>
                </div>

                {/* Column 2: Type - 15% */}
                <div className="w-[15%] px-2 hidden sm:flex items-center">
                    <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium uppercase border"
                        style={{
                            backgroundColor: `${treeNodeColors[node.type]}10`,
                            color: treeNodeColors[node.type],
                            borderColor: `${treeNodeColors[node.type]}30`
                        }}
                    >
                        {node.type}
                    </span>
                </div>

                {/* Column 3: Status - 15% */}
                <div className="w-[15%] px-2 hidden sm:flex items-center">
                    {node.status && (
                        <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full font-medium uppercase border",
                            statusColors[node.status] || "bg-gray-100 text-gray-600"
                        )}>
                            {node.status}
                        </span>
                    )}
                </div>

                {/* Column 4: Owner - 25% */}
                <div className="w-[25%] px-2 hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                    {node.owner && node.owner !== '-' && (
                        <>
                            <User className="w-3 h-3" />
                            <span className="truncate">{node.owner}</span>
                        </>
                    )}
                </div>
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
        <div className="h-full flex flex-col bg-card rounded-lg overflow-hidden border border-border shadow-sm">
            {/* Toolbar */}
            <div className="p-4 border-b border-border bg-background/50">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-semibold text-lg text-foreground">Organization Hierarchy</h3>
                        <p className="text-xs text-muted-foreground">{totalNodes} nodes • Department of Science Service</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={expandAll}
                            className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            title="Expand All"
                        >
                            <Expand className="w-4 h-4" />
                        </button>
                        <button
                            onClick={collapseAll}
                            className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            title="Collapse All"
                        >
                            <Shrink className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Search - only show if no external search provided */}
                {externalSearchQuery === undefined && (
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="ค้นหา (หน่วยงาน, ระบบ, ผู้รับผิดชอบ)..."
                            value={internalSearchQuery}
                            onChange={(e) => setInternalSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm bg-muted/50 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-border transition-all"
                        />
                    </div>
                )}
            </div>

            {/* Table Header */}
            <div className="flex items-center py-2 px-2 bg-muted/30 border-b border-border text-xs font-semibold text-muted-foreground">
                <div className="flex-1 pl-10">ชื่อหน่วยงาน / ระบบ</div>
                <div className="w-[15%] px-2 hidden sm:block">ประเภท</div>
                <div className="w-[15%] px-2 hidden sm:block">สถานะ</div>
                <div className="w-[25%] px-2 hidden sm:block">ผู้รับผิดชอบ</div>
            </div>

            {/* Tree Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto">
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

            {/* Legend Footer */}
            <div className="p-3 border-t border-border bg-muted/20">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap mr-2">Legend:</span>
                    {Object.entries(treeNodeIcons).slice(0, 6).map(([type, icon]) => (
                        <div key={type} className="flex items-center gap-1 flex-shrink-0 bg-background border border-border rounded px-1.5 py-0.5">
                            <span className="text-xs">{icon}</span>
                            <span className="text-[10px] text-muted-foreground capitalize">{type}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
