import { motion } from 'framer-motion';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart as PieIcon, 
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

// Artefact type distribution data
const typeDistribution = [
  { name: 'กระบวนการ', value: 42, fill: 'hsl(262, 83%, 58%)' },
  { name: 'แอปพลิเคชัน', value: 35, fill: 'hsl(168, 76%, 42%)' },
  { name: 'ข้อมูล', value: 28, fill: 'hsl(199, 89%, 48%)' },
  { name: 'เทคโนโลยี', value: 25, fill: 'hsl(222, 47%, 35%)' },
  { name: 'ความปลอดภัย', value: 15, fill: 'hsl(0, 72%, 51%)' },
  { name: 'การเชื่อมต่อ', value: 11, fill: 'hsl(38, 92%, 50%)' },
];

// Monthly trend data
const trendData = [
  { month: 'ก.ค.', artefacts: 120, coverage: 72, risk: 12 },
  { month: 'ส.ค.', artefacts: 128, coverage: 75, risk: 10 },
  { month: 'ก.ย.', artefacts: 135, coverage: 78, risk: 11 },
  { month: 'ต.ค.', artefacts: 142, coverage: 80, risk: 9 },
  { month: 'พ.ย.', artefacts: 150, coverage: 84, risk: 10 },
  { month: 'ธ.ค.', artefacts: 156, coverage: 87, risk: 8 },
];

// Risk by department
const riskByDepartment = [
  { dept: 'ศูนย์ IT', high: 3, medium: 5, low: 8 },
  { dept: 'กองตรวจ', high: 1, medium: 3, low: 6 },
  { dept: 'กองมาตรฐาน', high: 2, medium: 2, low: 4 },
  { dept: 'กองบริการ', high: 0, medium: 2, low: 5 },
  { dept: 'กองนโยบาย', high: 1, medium: 1, low: 3 },
];

// Coverage data
const coverageData = [
  { name: 'มีระบบรองรับ', value: 87, fill: 'hsl(168, 76%, 42%)' },
  { name: 'ยังไม่มีระบบ', value: 13, fill: 'hsl(38, 92%, 50%)' },
];

export function ArtefactTypeChart() {
  const total = typeDistribution.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="p-6 bg-card rounded-2xl border border-border shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
          <PieIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">การกระจายตามประเภท</h3>
          <p className="text-xs text-muted-foreground">Artefacts ทั้งหมด {total} รายการ</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={typeDistribution}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {typeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex-1 space-y-1.5">
          {typeDistribution.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="flex items-center gap-2"
            >
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-xs text-muted-foreground flex-1">{item.name}</span>
              <span className="text-xs font-medium text-foreground">{item.value}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function TrendChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="p-6 bg-card rounded-2xl border border-border shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-success/10">
          <TrendingUp className="w-5 h-5 text-success" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">แนวโน้มรายเดือน</h3>
          <p className="text-xs text-muted-foreground">6 เดือนที่ผ่านมา</p>
        </div>
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="colorArtefacts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(222, 47%, 35%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(222, 47%, 35%)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCoverage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="artefacts" 
              stroke="hsl(222, 47%, 35%)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorArtefacts)" 
              name="Artefacts"
            />
            <Area 
              type="monotone" 
              dataKey="coverage" 
              stroke="hsl(168, 76%, 42%)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorCoverage)" 
              name="Coverage %"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[hsl(222,47%,35%)]" />
          <span className="text-xs text-muted-foreground">Artefacts</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-xs text-muted-foreground">Coverage %</span>
        </div>
      </div>
    </motion.div>
  );
}

export function RiskByDepartmentChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="p-6 bg-card rounded-2xl border border-border shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-destructive/10">
          <AlertTriangle className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">ความเสี่ยงตามหน่วยงาน</h3>
          <p className="text-xs text-muted-foreground">แยกตามระดับความเสี่ยง</p>
        </div>
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={riskByDepartment} layout="vertical">
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
            <YAxis 
              type="category" 
              dataKey="dept" 
              axisLine={false} 
              tickLine={false}
              width={70}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem'
              }}
            />
            <Bar dataKey="high" stackId="risk" fill="hsl(0, 72%, 51%)" radius={[0, 0, 0, 0]} name="สูง" />
            <Bar dataKey="medium" stackId="risk" fill="hsl(38, 92%, 50%)" radius={[0, 0, 0, 0]} name="ปานกลาง" />
            <Bar dataKey="low" stackId="risk" fill="hsl(168, 76%, 42%)" radius={[0, 4, 4, 0]} name="ต่ำ" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-destructive" />
          <span className="text-xs text-muted-foreground">สูง</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-warning" />
          <span className="text-xs text-muted-foreground">ปานกลาง</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-success" />
          <span className="text-xs text-muted-foreground">ต่ำ</span>
        </div>
      </div>
    </motion.div>
  );
}

export function CoverageDonut() {
  const covered = coverageData[0].value;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="p-6 bg-card rounded-2xl border border-border shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-info/10">
          <Shield className="w-5 h-5 text-info" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">ความครอบคลุมภารกิจ</h3>
          <p className="text-xs text-muted-foreground">ระบบรองรับภารกิจ</p>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={coverageData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {coverageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              className="text-2xl font-bold text-foreground"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
            >
              {covered}%
            </motion.span>
            <span className="text-[10px] text-muted-foreground">Coverage</span>
          </div>
        </div>
        
        <div className="flex-1 space-y-3">
          {coverageData.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.fill }}
              />
              <div className="flex-1">
                <p className="text-sm text-foreground">{item.name}</p>
                <p className="text-lg font-bold text-foreground">{item.value}%</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function QuickStatsRow() {
  const stats = [
    { label: 'Active Systems', value: 42, icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
    { label: 'ความเสี่ยงสูง', value: 8, icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
    { label: 'รอตรวจสอบ', value: 5, icon: Activity, color: 'text-warning', bg: 'bg-warning/10' },
  ];
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.05 }}
          className="p-4 bg-card rounded-xl border border-border flex items-center gap-3"
        >
          <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${stat.bg}`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
