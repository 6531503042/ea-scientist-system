import { motion } from 'framer-motion';
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    Legend,
} from 'recharts';

// Architecture maturity data for each pillar
const maturityData = [
    { pillar: 'Business', score: 78, fullMark: 100 },
    { pillar: 'Data', score: 65, fullMark: 100 },
    { pillar: 'Application', score: 82, fullMark: 100 },
    { pillar: 'Security', score: 71, fullMark: 100 },
    { pillar: 'Technology', score: 85, fullMark: 100 },
    { pillar: 'Integration', score: 63, fullMark: 100 },
];

// Calculate overall maturity score
const overallScore = Math.round(
    maturityData.reduce((sum, item) => sum + item.score, 0) / maturityData.length
);

// Color mapping for pillars
const pillarColors: Record<string, string> = {
    Business: '#8B5CF6',
    Data: '#3B82F6',
    Application: '#10B981',
    Security: '#F59E0B',
    Technology: '#6366F1',
    Integration: '#EC4899',
};

export function MaturityRadarChart() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-card rounded-2xl border border-border shadow-sm"
        >
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">Architecture Maturity</h3>
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
                            name="Maturity Score"
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
                        <span className="text-xs text-muted-foreground">Maturity Score</span>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

export function PillarDetails() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 bg-card rounded-2xl border border-border shadow-sm"
        >
            <h3 className="text-lg font-semibold text-foreground mb-4">Pillar Details</h3>
            <div className="space-y-4">
                {maturityData.map((item, index) => (
                    <motion.div
                        key={item.pillar}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-foreground">{item.pillar}</span>
                            <span className="text-sm text-muted-foreground">{item.score}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.score}%` }}
                                transition={{ delay: 0.6 + index * 0.05, duration: 0.5 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: pillarColors[item.pillar] }}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

export function RecentActivity() {
    const activities = [
        { user: 'Somchai A.', action: 'Updated', target: 'LIMS Application', time: '2 min ago', avatar: 'SA' },
        { user: 'Napak K.', action: 'Created', target: 'Data Entity Sample Test', time: '10 min ago', avatar: 'NK' },
        { user: 'Admin', action: 'Approved', target: 'Business Process v2.1', time: '1 hour ago', avatar: 'AD' },
        { user: 'Wichai P.', action: 'Commented on', target: 'Tech Infrastructure Map', time: '2 hours ago', avatar: 'WP' },
        { user: 'Somchai A.', action: 'Versioned', target: 'Security Policy Doc', time: '3 hours ago', avatar: 'SA' },
        { user: 'Napak K.', action: 'Linked', target: 'API Gateway → Auth Service', time: '4 hours ago', avatar: 'NK' },
    ];

    const actionColors: Record<string, string> = {
        Updated: 'text-blue-500',
        Created: 'text-green-500',
        Approved: 'text-purple-500',
        'Commented on': 'text-yellow-500',
        Versioned: 'text-cyan-500',
        Linked: 'text-pink-500',
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

export function QuickStats() {
    const stats = [
        { label: 'Documents', value: 342 },
        { label: 'Diagrams', value: 89 },
        { label: 'Models', value: 156 },
        { label: 'Relationships', value: 1847 },
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
