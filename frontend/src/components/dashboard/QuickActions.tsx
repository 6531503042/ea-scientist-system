import { motion } from 'framer-motion';
import { Network, FileText, Download, Plus } from 'lucide-react';

interface QuickActionsProps {
  onExploreGraph: () => void;
}

export function QuickActions({ onExploreGraph }: QuickActionsProps) {
  const actions = [
    {
      icon: Network,
      label: 'Explore Architecture',
      labelTh: 'สำรวจสถาปัตยกรรม',
      description: 'ดูแผนผังความสัมพันธ์ทั้งหมด',
      primary: true,
      onClick: onExploreGraph,
    },
    {
      icon: Plus,
      label: 'Add Artefact',
      labelTh: 'เพิ่ม Artefact',
      description: 'สร้าง Artefact ใหม่',
      primary: false,
      onClick: () => {},
    },
    {
      icon: FileText,
      label: 'Generate Report',
      labelTh: 'สร้างรายงาน',
      description: 'รายงาน EA ประจำเดือน',
      primary: false,
      onClick: () => {},
    },
    {
      icon: Download,
      label: 'Export Data',
      labelTh: 'ส่งออกข้อมูล',
      description: 'CSV, Excel, PDF',
      primary: false,
      onClick: () => {},
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="p-6 bg-card rounded-2xl border border-border shadow-card"
    >
      <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            className={`
              relative flex flex-col items-start p-4 rounded-xl text-left transition-all duration-200
              ${action.primary 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 col-span-2' 
                : 'bg-muted/50 hover:bg-muted text-foreground'
              }
            `}
          >
            {action.primary && (
              <div className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-medium bg-accent text-accent-foreground rounded-full">
                ✨ แนะนำ
              </div>
            )}
            <action.icon className={`w-5 h-5 ${action.primary ? 'text-primary-foreground' : 'text-accent'}`} />
            <p className="font-medium mt-2">{action.labelTh}</p>
            <p className={`text-xs mt-0.5 ${action.primary ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
              {action.description}
            </p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
