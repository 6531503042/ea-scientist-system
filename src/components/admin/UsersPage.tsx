import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Shield,
  Mail,
  UserCheck,
  UserX,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

const roleLabels: Record<User['role'], { label: string; color: string }> = {
  admin: { label: 'Admin', color: 'bg-destructive/10 text-destructive' },
  architect: { label: 'Architect', color: 'bg-info/10 text-info' },
  business_owner: { label: 'Business Owner', color: 'bg-success/10 text-success' },
  auditor: { label: 'Auditor', color: 'bg-warning/10 text-warning' },
  viewer: { label: 'Viewer', color: 'bg-muted text-muted-foreground' },
};

const statusLabels: Record<User['status'], { label: string; color: string; icon: React.ElementType }> = {
  active: { label: 'Active', color: 'text-success', icon: UserCheck },
  inactive: { label: 'Inactive', color: 'text-muted-foreground', icon: UserX },
  pending: { label: 'Pending', color: 'text-warning', icon: Mail },
};

export function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<User['role'] | 'all'>('all');

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
          <h2 className="text-2xl font-bold text-foreground">จัดการผู้ใช้งาน</h2>
          <p className="text-muted-foreground">จัดการบัญชีผู้ใช้และสิทธิ์การเข้าถึง ({mockUsers.length} คน)</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          เพิ่มผู้ใช้
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'ผู้ใช้ทั้งหมด', value: mockUsers.length, color: 'text-foreground' },
          { label: 'Active', value: mockUsers.filter(u => u.status === 'active').length, color: 'text-success' },
          { label: 'Inactive', value: mockUsers.filter(u => u.status === 'inactive').length, color: 'text-muted-foreground' },
          { label: 'รอยืนยัน', value: mockUsers.filter(u => u.status === 'pending').length, color: 'text-warning' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 bg-card rounded-xl border border-border"
          >
            <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="ค้นหาผู้ใช้..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as User['role'] | 'all')}
            className="h-10 px-3 text-sm bg-card border border-border rounded-lg"
          >
            <option value="all">ทุก Role</option>
            <option value="admin">Admin</option>
            <option value="architect">Architect</option>
            <option value="business_owner">Business Owner</option>
            <option value="auditor">Auditor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ผู้ใช้</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">หน่วยงาน</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">สถานะ</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">เข้าใช้ล่าสุด</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">การดำเนินการ</th>
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
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn(
                        "px-2.5 py-1 text-xs font-medium rounded-full",
                        roleLabels[user.role].color
                      )}>
                        {roleLabels[user.role].label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-foreground">{user.department}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className={cn("flex items-center gap-1.5", statusLabels[user.status].color)}>
                        <StatusIcon className="w-4 h-4" />
                        <span className="text-sm">{statusLabels[user.status].label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-muted-foreground">{user.lastLogin}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <Shield className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors">
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
    </div>
  );
}
