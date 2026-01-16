import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
} from 'recharts';
import type { Artefact } from '@/data/mockData';

// Color mapping for pillars
const pillarColors: Record<string, string> = {
    Business: '#8B5CF6',
    Data: '#14B8A6',
    Application: '#0EA5E9',
    Security: '#F59E0B',
    Technology: '#6366F1',
    Integration: '#EC4899',
};

interface ArtefactTypeData {
    type: string;
    count: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}

interface MaturityRadarChartProps {
    artefactsByType: ArtefactTypeData[];
}

export function MaturityRadarChart({ artefactsByType }: MaturityRadarChartProps) {
    // Calculate maturity scores based on artefact coverage
    // More artefacts = higher maturity (simplified model)
    const maturityData = useMemo(() => {
        const maxCount = Math.max(...artefactsByType.map(t => t.count), 1);
        return artefactsByType.map(item => ({
            pillar: item.type,
            score: Math.round((item.count / maxCount) * 100),
            fullMark: 100,
        }));
    }, [artefactsByType]);

    const overallScore = Math.round(
        maturityData.reduce((sum, item) => sum + item.score, 0) / Math.max(maturityData.length, 1)
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-card rounded-2xl border border-border shadow-sm"
        >
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">Architecture Coverage</h3>
                <p className="text-xs text-muted-foreground mt-1">Based on artefact distribution</p>
                {/* Legend */}
                <div className="flex flex-wrap gap-3 mt-3">
                    {maturityData.map((item) => (
                        <div key={item.pillar} className="flex items-center gap-1.5">
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: pillarColors[item.pillar] }}
                            />
                            <span className="text-xs text-muted-foreground">
                                {item.pillar}: {item.score}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={maturityData}>
                        <PolarGrid
                            stroke="hsl(var(--border))"
                            strokeOpacity={0.5}
                        />
                        <PolarAngleAxis
                            dataKey="pillar"
                            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                            axisLine={false}
                        />
                        <Radar
                            name="Coverage Score"
                            dataKey="score"
                            stroke="hsl(199, 89%, 48%)"
                            fill="hsl(199, 89%, 48%)"
                            fillOpacity={0.3}
                            strokeWidth={2}
                        />
                    </RadarChart>
                </ResponsiveContainer>

                {/* Center Score */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                        className="flex flex-col items-center"
                    >
                        <span className="text-4xl font-bold text-primary">{overallScore}%</span>
                        <span className="text-xs text-muted-foreground">Coverage Score</span>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

interface PillarDetailsProps {
    artefactsByType: ArtefactTypeData[];
}

export function PillarDetails({ artefactsByType }: PillarDetailsProps) {
    const maxCount = Math.max(...artefactsByType.map(t => t.count), 1);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 bg-card rounded-2xl border border-border shadow-sm"
        >
            <h3 className="text-lg font-semibold text-foreground mb-4">Artefact Distribution</h3>
            <div className="space-y-4">
                {artefactsByType.map((item, index) => {
                    const percentage = Math.round((item.count / maxCount) * 100);
                    return (
                        <motion.div
                            key={item.type}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.05 }}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-foreground">{item.type}</span>
                                <span className="text-sm text-muted-foreground">{item.count} artefacts</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ delay: 0.6 + index * 0.05, duration: 0.5 }}
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

interface RecentActivityProps {
    artefacts: Artefact[];
}

export function RecentActivity({ artefacts }: RecentActivityProps) {
    // Get recent activities from artefact data
    const activities = useMemo(() => {
        return artefacts
            .filter(a => a.updatedAt)
            .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime())
            .slice(0, 6)
            .map((artefact, idx) => {
                const actions = ['Updated', 'Created', 'Modified', 'Reviewed'];
                const action = actions[idx % actions.length];
                const initials = artefact.owner ? artefact.owner.split(' ').map(n => n[0]).join('').toUpperCase() : 'AD';

                // Calculate relative time
                const updatedDate = new Date(artefact.updatedAt || new Date());
                const now = new Date();
                const diffMs = now.getTime() - updatedDate.getTime();
                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                const diffDays = Math.floor(diffHours / 24);

                let time = 'just now';
                if (diffDays > 0) time = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
                else if (diffHours > 0) time = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

                return {
                    user: artefact.owner || 'Admin',
                    action,
                    target: artefact.nameTh || artefact.name,
                    time,
                    avatar: initials,
                };
            });
    }, [artefacts]);

    const actionColors: Record<string, string> = {
        Updated: 'text-blue-500',
        Created: 'text-green-500',
        Modified: 'text-yellow-500',
        Reviewed: 'text-purple-500',
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-card rounded-2xl border border-border shadow-sm h-full"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Recent Activity</h3>
                <button className="text-xs text-primary hover:underline">View All</button>
            </div>
            <div className="space-y-3">
                {activities.map((activity, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        className="flex items-start gap-3"
                    >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-primary">{activity.avatar}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground truncate">
                                <span className="font-medium">{activity.user}</span>{' '}
                                <span className={actionColors[activity.action]}>{activity.action}</span>{' '}
                                <span className="font-medium">{activity.target}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

interface QuickStatsProps {
    totalArtefacts: number;
    totalRelationships: number;
    activeCount: number;
}

export function QuickStats({ totalArtefacts, totalRelationships, activeCount }: QuickStatsProps) {
    const stats = [
        { label: 'Total Artefacts', value: totalArtefacts },
        { label: 'Relationships', value: totalRelationships },
        { label: 'Active Items', value: activeCount },
        { label: 'Coverage %', value: Math.round((activeCount / Math.max(totalArtefacts, 1)) * 100) },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4 bg-card rounded-2xl border border-border shadow-sm"
        >
            <h3 className="font-semibold text-foreground mb-3">Quick Stats</h3>
            <div className="space-y-2">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.05 }}
                        className="flex items-center justify-between py-1"
                    >
                        <span className="text-sm text-muted-foreground">{stat.label}</span>
                        <span className="text-sm font-semibold text-foreground">{stat.value.toLocaleString()}</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
