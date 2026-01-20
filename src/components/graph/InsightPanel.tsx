import { motion } from 'framer-motion';
import {
  X,
  User,
  Building,
  Calendar,
  GitBranch,
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  ExternalLink,
  Briefcase,
  Database,
  Layers,
  Cpu,
  Link,
  Shield,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Artefact, ArtefactType, RiskLevel } from '@/data/mockData';
import { relationships, artefacts, typeLabels } from '@/data/mockData';

interface InsightPanelProps {
  artefact: Artefact;
  onClose: () => void;
  onImpactAnalysis: () => void;
}

const riskStyles: Record<RiskLevel, { bg: string; text: string; label: string }> = {
  high: { bg: 'bg-risk-high/10', text: 'text-risk-high', label: 'สูง' },
  medium: { bg: 'bg-risk-medium/10', text: 'text-risk-medium', label: 'ปานกลาง' },
  low: { bg: 'bg-risk-low/10', text: 'text-risk-low', label: 'ต่ำ' },
  none: { bg: 'bg-muted', text: 'text-muted-foreground', label: 'ไม่มี' },
};

const statusStyles: Record<string, { bg: string; text: string }> = {
  active: { bg: 'bg-success/10', text: 'text-success' },
  draft: { bg: 'bg-warning/10', text: 'text-warning' },
  deprecated: { bg: 'bg-muted', text: 'text-muted-foreground' },
  planned: { bg: 'bg-info/10', text: 'text-info' },
};

// Icon mapping for artefact types
const typeIcons: Record<ArtefactType, React.ElementType> = {
  business: Briefcase,
  data: Database,
  application: Layers,
  technology: Cpu,
  integration: Link,
  security: Shield,
};

// Thai labels for relationship types
const relationshipLabels: Record<string, { th: string; desc: string }> = {
  uses: { th: 'ใช้งาน', desc: 'ใช้งานระบบนี้' },
  depends_on: { th: 'พึ่งพา', desc: 'ต้องพึ่งพาระบบนี้' },
  manages: { th: 'จัดการ', desc: 'จัดการข้อมูลนี้' },
  integrates_with: { th: 'เชื่อมต่อ', desc: 'เชื่อมต่อกับระบบนี้' },
  supports: { th: 'สนับสนุน', desc: 'ให้การสนับสนุน' },
};

export function InsightPanel({ artefact, onClose, onImpactAnalysis }: InsightPanelProps) {
  // Find related artefacts with relationship info
  const upstreamRels = relationships.filter((r) => r.target === artefact.id);
  const downstreamRels = relationships.filter((r) => r.source === artefact.id);

  const upstream = upstreamRels.map(r => ({
    artefact: artefacts.find(a => a.id === r.source)!,
    relationship: r
  })).filter(item => item.artefact);

  const downstream = downstreamRels.map(r => ({
    artefact: artefacts.find(a => a.id === r.target)!,
    relationship: r
  })).filter(item => item.artefact);

  const riskStyle = riskStyles[artefact.riskLevel];
  const statusStyle = statusStyles[artefact.status];

  // Component to render a related artefact item
  const RelatedItem = ({ item, direction }: {
    item: { artefact: Artefact; relationship: typeof relationships[0] };
    direction: 'upstream' | 'downstream';
  }) => {
    const TypeIcon = typeIcons[item.artefact.type];
    const relLabel = relationshipLabels[item.relationship.type] || { th: item.relationship.label, desc: '' };
    const typeColor = `bg-ea-${item.artefact.type}`;

    return (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="group p-3 rounded-lg border border-border bg-card hover:bg-muted/50 cursor-pointer transition-all hover:shadow-sm"
      >
        {/* Header with type icon and name */}
        <div className="flex items-center gap-2 mb-1.5">
          <div className={cn("flex items-center justify-center w-6 h-6 rounded-md", typeColor)}>
            <TypeIcon className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-medium text-foreground flex-1 truncate">
            {item.artefact.name}
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Thai name */}
        <p className="text-xs text-muted-foreground ml-8 mb-2 truncate">
          {item.artefact.nameTh}
        </p>

        {/* Relationship badge */}
        <div className="flex items-center gap-1.5 ml-8">
          <span className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full",
            direction === 'upstream'
              ? "bg-blue-500/10 text-blue-600"
              : "bg-amber-500/10 text-amber-600"
          )}>
            {direction === 'upstream' ? (
              <ArrowDownToLine className="w-2.5 h-2.5" />
            ) : (
              <ArrowUpFromLine className="w-2.5 h-2.5" />
            )}
            {relLabel.th}
          </span>
          <span className="text-[10px] text-muted-foreground">
            • {typeLabels[item.artefact.type]?.th || item.artefact.type}
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed lg:relative inset-0 lg:inset-auto w-full lg:w-72 xl:w-80 flex-shrink-0 bg-card border-l border-border p-4 lg:p-5 overflow-y-auto z-50 lg:z-auto"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg text-foreground">{artefact.name}</h3>
          <p className="text-sm text-muted-foreground">{artefact.nameTh}</p>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Status & Risk */}
      <div className="flex items-center gap-2 mb-6">
        <span className={cn(
          "px-2.5 py-1 text-xs font-medium rounded-full capitalize",
          statusStyle.bg,
          statusStyle.text
        )}>
          {artefact.status}
        </span>
        <span className={cn(
          "px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1",
          riskStyle.bg,
          riskStyle.text
        )}>
          <AlertTriangle className="w-3 h-3" />
          ความเสี่ยง: {riskStyle.label}
        </span>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
          รายละเอียด
        </h4>
        <p className="text-sm text-foreground leading-relaxed">{artefact.description}</p>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <User className="w-3.5 h-3.5" />
            <span className="text-xs">ผู้รับผิดชอบ</span>
          </div>
          <p className="text-sm font-medium text-foreground truncate">{artefact.owner}</p>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Building className="w-3.5 h-3.5" />
            <span className="text-xs">หน่วยงาน</span>
          </div>
          <p className="text-sm font-medium text-foreground truncate">{artefact.department}</p>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <GitBranch className="w-3.5 h-3.5" />
            <span className="text-xs">เวอร์ชัน</span>
          </div>
          <p className="text-sm font-medium text-foreground">{artefact.version}</p>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-xs">อัพเดตล่าสุด</span>
          </div>
          <p className="text-sm font-medium text-foreground">{artefact.lastUpdated}</p>
        </div>
      </div>

      {/* Enhanced Relationships Section */}
      <div className="space-y-5">
        {/* Upstream Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/10">
              <ArrowDownToLine className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground">
                Upstream
              </h4>
              <p className="text-[10px] text-muted-foreground">
                ระบบที่ส่งข้อมูลเข้ามา ({upstream.length})
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {upstream.length > 0 ? upstream.map((item) => (
              <RelatedItem key={item.artefact.id} item={item} direction="upstream" />
            )) : (
              <div className="p-3 rounded-lg border border-dashed border-border text-center">
                <p className="text-xs text-muted-foreground">ไม่มีระบบที่ส่งข้อมูลเข้ามา</p>
              </div>
            )}
          </div>
        </div>

        {/* Downstream Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/10">
              <ArrowUpFromLine className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground">
                Downstream
              </h4>
              <p className="text-[10px] text-muted-foreground">
                ระบบที่รับข้อมูลไป ({downstream.length})
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {downstream.length > 0 ? downstream.map((item) => (
              <RelatedItem key={item.artefact.id} item={item} direction="downstream" />
            )) : (
              <div className="p-3 rounded-lg border border-dashed border-border text-center">
                <p className="text-xs text-muted-foreground">ไม่มีระบบที่รับข้อมูลไป</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Impact Analysis Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onImpactAnalysis}
        className="w-full mt-6 px-4 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
      >
        <AlertTriangle className="w-4 h-4" />
        วิเคราะห์ผลกระทบ
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}

