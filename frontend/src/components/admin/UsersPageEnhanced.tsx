import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Shield,
  Mail,
  UserCheck,
  UserX,
  Filter,
  MoreVertical,
  Key,
  Settings,
  History,
  Download,
  ChevronDown,
  Users as UsersIcon,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CreateUserModal } from './CreateUserModal';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'architect' | 'business_owner' | 'auditor' | 'viewer';
  department: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  avatar?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  color: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'ดร.สมชาย วิทยาการ',
    email: 'somchai@dss.go.th',
    role: 'admin',
    department: 'ศูนย์เทคโนโลยีสารสนเทศ',
    status: 'active',
    lastLogin: '2 ชั่วโมงที่แล้ว',
  },
  {
    id: '2',
    name: 'คุณวิภา สถาปัตย์',
    email: 'wipa@dss.go.th',
    role: 'architect',
    department: 'ศูนย์เทคโนโลยีสารสนเทศ',
    status: 'active',
    lastLogin: '1 วันที่แล้ว',
  },
  {
    id: '3',
    name: 'คุณประสิทธิ์ เจ้าของ',
    email: 'prasit@dss.go.th',
    role: 'business_owner',
    department: 'กองตรวจวิเคราะห์',
    status: 'active',
    lastLogin: '3 วันที่แล้ว',
  },
  {
    id: '4',
    name: 'คุณสุรีย์ ตรวจสอบ',
    email: 'suree@dss.go.th',
    role: 'auditor',
    department: 'กองมาตรฐาน',
    status: 'active',
    lastLogin: '5 วันที่แล้ว',
  },
  {
    id: '5',
    name: 'คุณนภา ดูได้',
    email: 'napa@dss.go.th',
    role: 'viewer',
    department: 'กองบริการ',
    status: 'inactive',
    lastLogin: '2 สัปดาห์ที่แล้ว',
  },
  {
    id: '6',
    name: 'คุณใหม่ รอยืนยัน',
    email: 'new@dss.go.th',
    role: 'viewer',
    department: 'กองนโยบาย',
    status: 'pending',
    lastLogin: '-',
  },
];

const mockRoles: Role[] = [
  {
    id: 'admin',
    name: 'Admin',
    description: 'สิทธิ์เต็มรูปแบบ สามารถจัดการทุกอย่างในระบบ',
    permissions: ['create', 'read', 'update', 'delete', 'admin', 'export', 'audit'],
    userCount: 1,
    color: 'bg-destructive/10 text-destructive border-destructive/30',
  },
  {
    id: 'architect',
    name: 'Enterprise Architect',
    description: 'จัดการ Artefacts และความสัมพันธ์',
    permissions: ['create', 'read', 'update', 'delete', 'export'],
    userCount: 2,
    color: 'bg-info/10 text-info border-info/30',
  },
  {
    id: 'business_owner',
    name: 'Business Owner',
    description: 'จัดการ Artefacts ที่รับผิดชอบ',
    permissions: ['read', 'update', 'export'],
    userCount: 3,
    color: 'bg-success/10 text-success border-success/30',
  },
  {
    id: 'auditor',
    name: 'Auditor',
    description: 'ตรวจสอบและสร้างรายงาน',
    permissions: ['read', 'export', 'audit'],
    userCount: 2,
    color: 'bg-warning/10 text-warning border-warning/30',
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'ดูข้อมูลได้อย่างเดียว',
    permissions: ['read'],
    userCount: 4,
    color: 'bg-muted text-muted-foreground border-border',
  },
];

const roleLabels: Record<User['role'], { label: string; labelTh: string; color: string }> = {
  admin: { label: 'Admin', labelTh: 'ผู้ดูแลระบบ', color: 'bg-destructive/10 text-destructive' },
  architect: { label: 'Architect', labelTh: 'Enterprise Architect', color: 'bg-info/10 text-info' },
  business_owner: { label: 'Business Owner', labelTh: 'เจ้าของกระบวนการ', color: 'bg-success/10 text-success' },
  auditor: { label: 'Auditor', labelTh: 'ผู้ตรวจสอบ', color: 'bg-warning/10 text-warning' },
  viewer: { label: 'Viewer', labelTh: 'ผู้ดู', color: 'bg-muted text-muted-foreground' },
};

const statusLabels: Record<User['status'], { label: string; color: string; icon: React.ElementType }> = {
  active: { label: 'ใช้งาน', color: 'text-success', icon: UserCheck },
  inactive: { label: 'ไม่ใช้งาน', color: 'text-muted-foreground', icon: UserX },
  pending: { label: 'รอยืนยัน', color: 'text-warning', icon: Mail },
};

export function UsersPageEnhanced() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<User['role'] | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">จัดการข้อมูลผู้ใช้งาน</h2>
          <p className="text-muted-foreground">จัดการข้อมูลผู้ใช้งาน บทบาท และสิทธิการเข้าถึงเมนูต่างๆ ในระบบ</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          เพิ่มผู้ใช้งาน
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-muted rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('users')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === 'users'
              ? "bg-card shadow-sm text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <UsersIcon className="w-4 h-4" />
          ผู้ใช้งานทั้งหมด
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === 'roles'
              ? "bg-card shadow-sm text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Lock className="w-4 h-4" />
          สิทธิการเข้าถึง
        </button>
      </div>

      {activeTab === 'users' ? (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="ค้นหา..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 h-11 bg-muted hover:bg-muted/80 rounded-xl transition-colors">
              <Filter className="w-4 h-4" />
              <span className="text-sm">กรองข้อมูล</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ผู้ใช้</th>
                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">บทบาท</th>
                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">หน่วยงาน</th>
                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">สถานะ</th>
                    <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">เข้าใช้ล่าสุด</th>
                    <th className="text-right px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">การดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => {
                    const StatusIcon = statusLabels[user.status].icon;
                    return (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-lg",
                            roleLabels[user.role].color
                          )}>
                            {roleLabels[user.role].labelTh}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm text-foreground">{user.department}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className={cn("flex items-center gap-1.5", statusLabels[user.status].color)}>
                            <StatusIcon className="w-4 h-4" />
                            <span className="text-sm">{statusLabels[user.status].label}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm text-muted-foreground">{user.lastLogin}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="จัดการสิทธิ์">
                              <Shield className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="แก้ไข">
                              <Edit className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="รีเซ็ตรหัสผ่าน">
                              <Key className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors" title="ลบ">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Roles Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockRoles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "p-5 bg-card rounded-xl border-2 hover:shadow-lg transition-all",
                role.color
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{role.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                </div>
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  สิทธิ์การใช้งาน
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions.map((perm) => (
                    <span
                      key={perm}
                      className="px-2 py-1 text-xs bg-muted rounded-md text-muted-foreground"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">
                  {role.userCount} ผู้ใช้งาน
                </span>
                <button className="text-sm text-primary hover:underline">
                  ดูรายชื่อ →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => {
          console.log('New User:', data);
        }}
      />
    </div>
  );
}
