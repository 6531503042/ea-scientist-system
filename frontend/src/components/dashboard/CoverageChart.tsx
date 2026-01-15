import { motion } from 'framer-motion';
import { PieChart } from 'lucide-react';

interface CoverageData {
  label: string;
  value: number;
  color: string;
}

const coverageData: CoverageData[] = [
  { label: 'ภารกิจที่มีระบบรองรับ', value: 87, color: 'var(--success)' },
  { label: 'ภารกิจที่ยังไม่มีระบบ', value: 13, color: 'var(--warning)' },
];

export function CoverageChart() {
  const total = coverageData.reduce((acc, d) => acc + d.value, 0);
  let currentAngle = -90;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="p-6 bg-card rounded-2xl border border-border shadow-card"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success/10">
          <PieChart className="w-4 h-4 text-success" />
        </div>
        <h3 className="font-semibold text-foreground">Mission Coverage</h3>
      </div>

      <div className="flex items-center gap-6">
        {/* Donut Chart */}
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {coverageData.map((segment, index) => {
              const percentage = (segment.value / total) * 100;
              const strokeDasharray = `${percentage} ${100 - percentage}`;
              const strokeDashoffset = index === 0 ? 0 : -coverageData.slice(0, index).reduce((acc, d) => acc + (d.value / total) * 100, 0);
              
              return (
                <motion.circle
                  key={segment.label}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="12"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.6 + index * 0.2, duration: 0.8 }}
                  style={{ pathLength: percentage / 100 }}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              className="text-2xl font-bold text-foreground"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
            >
              {coverageData[0].value}%
            </motion.span>
            <span className="text-xs text-muted-foreground">Coverage</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3">
          {coverageData.map((item, index) => (
            <motion.div 
              key={item.label}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-center gap-2"
            >
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: `hsl(${item.color})` }}
              />
              <div className="flex-1">
                <p className="text-sm text-foreground">{item.label}</p>
                <p className="text-lg font-semibold text-foreground">{item.value}%</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
