import { motion } from 'framer-motion';
import { 
  Layers, 
  Activity, 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  TrendingDown,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Layers,
  Activity,
  AlertTriangle,
  Shield,
};

interface MetricCardProps {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  index: number;
  isPercentage?: boolean;
}

export function MetricCard({ 
  label, 
  value, 
  change, 
  trend, 
  icon, 
  index,
  isPercentage = false 
}: MetricCardProps) {
  const Icon = iconMap[icon] || Layers;
  
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  
  const trendColor = 
    trend === 'up' && !label.includes('Risk') 
      ? 'text-success' 
      : trend === 'down' && label.includes('Risk')
        ? 'text-success'
        : trend === 'up' && label.includes('Risk')
          ? 'text-destructive'
          : 'text-muted-foreground';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="relative overflow-hidden p-6 bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-accent/5 to-transparent" />
      
      <div className="flex items-start justify-between">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        
        <div className={cn("flex items-center gap-1 text-sm font-medium", trendColor)}>
          <TrendIcon className="w-4 h-4" />
          <span>{Math.abs(change)}{isPercentage ? '%' : ''}</span>
        </div>
      </div>

      <div className="mt-4">
        <motion.p 
          className="text-3xl font-bold text-foreground"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
        >
          {value}{label.includes('Coverage') || label.includes('Rate') ? '%' : ''}
        </motion.p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      </div>
    </motion.div>
  );
}
