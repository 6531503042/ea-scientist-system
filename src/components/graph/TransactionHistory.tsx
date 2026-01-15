import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, 
  X, 
  Plus, 
  Edit, 
  Trash2, 
  Link2, 
  RotateCcw,
  ChevronDown,
  ChevronRight,
  User,
  Clock,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  action: 'create' | 'update' | 'delete' | 'link' | 'unlink';
  targetName: string;
  targetType: string;
  user: string;
  timestamp: string;
  details?: string;
  canRevert: boolean;
}

const mockTransactions: Transaction[] = [
  {
    id: 't1',
    action: 'update',
    targetName: 'LIMS',
    targetType: 'Application',
    user: 'คุณวิภา สถาปัตย์',
    timestamp: '14:32:15',
    details: 'อัปเดต version: 5.2.0 → 5.2.1',
    canRevert: true,
  },
  {
    id: 't2',
    action: 'link',
    targetName: 'LIMS → Test Results',
    targetType: 'Relationship',
    user: 'คุณวิภา สถาปัตย์',
    timestamp: '14:30:00',
    details: 'เพิ่มความสัมพันธ์ใหม่: depends_on',
    canRevert: true,
  },
  {
    id: 't3',
    action: 'create',
    targetName: 'GovConnect API',
    targetType: 'Integration',
    user: 'ดร.สมชาย วิทยาการ',
    timestamp: '10:15:30',
    details: 'สร้าง Artefact ใหม่',
    canRevert: true,
  },
  {
    id: 't4',
    action: 'delete',
    targetName: 'Legacy Portal',
    targetType: 'Application',
    user: 'ดร.สมชาย วิทยาการ',
    timestamp: '09:45:00',
    details: 'ลบ Artefact ที่ deprecated',
    canRevert: false,
  },
  {
    id: 't5',
    action: 'unlink',
    targetName: 'E-Lab → Old DB',
    targetType: 'Relationship',
    user: 'คุณประสิทธิ์ เทคโน',
    timestamp: 'เมื่อวาน 16:20',
    details: 'ลบความสัมพันธ์เดิม',
    canRevert: true,
  },
];

const actionConfig: Record<Transaction['action'], { icon: React.ElementType; color: string; label: string }> = {
  create: { icon: Plus, color: 'bg-success/10 text-success', label: 'สร้าง' },
  update: { icon: Edit, color: 'bg-info/10 text-info', label: 'แก้ไข' },
  delete: { icon: Trash2, color: 'bg-destructive/10 text-destructive', label: 'ลบ' },
  link: { icon: Link2, color: 'bg-primary/10 text-primary', label: 'เชื่อมต่อ' },
  unlink: { icon: Link2, color: 'bg-warning/10 text-warning', label: 'ตัดการเชื่อมต่อ' },
};

interface TransactionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionHistory({ isOpen, onClose }: TransactionHistoryProps) {
  const [filter, setFilter] = useState<Transaction['action'] | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredTransactions = mockTransactions.filter(
    t => filter === 'all' || t.action === filter
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed right-0 top-0 bottom-0 w-96 bg-card border-l border-border shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                <History className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">ประวัติการเปลี่ยนแปลง</h2>
                <p className="text-xs text-muted-foreground">Transaction History</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors",
                filter === 'all'
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              ทั้งหมด
            </button>
            {Object.entries(actionConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setFilter(key as Transaction['action'])}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors",
                  filter === key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {filteredTransactions.map((transaction, index) => {
              const config = actionConfig[transaction.action];
              const Icon = config.icon;
              const isExpanded = expandedId === transaction.id;

              return (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-muted/30 rounded-xl border border-border overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : transaction.id)}
                    className="w-full p-3 text-left hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0",
                        config.color
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-foreground truncate">
                            {transaction.targetName}
                          </span>
                          <span className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground">
                            {transaction.targetType}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{transaction.timestamp}</span>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border overflow-hidden"
                      >
                        <div className="p-3 space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">โดย:</span>
                            <span className="text-foreground">{transaction.user}</span>
                          </div>
                          {transaction.details && (
                            <div className="text-sm text-muted-foreground">
                              {transaction.details}
                            </div>
                          )}
                          {transaction.canRevert && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex items-center gap-2 px-3 py-2 w-full text-sm font-medium text-warning bg-warning/10 rounded-lg hover:bg-warning/20 transition-colors"
                            >
                              <RotateCcw className="w-4 h-4" />
                              ย้อนกลับการเปลี่ยนแปลงนี้
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            แสดง {filteredTransactions.length} จาก {mockTransactions.length} รายการ
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
