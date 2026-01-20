import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  MoreVertical,
  Plus,
  Shield,
  Edit,
  Trash2,
  Mail,
  Building,
  CheckCircle2,
  UserX,
  Key,
  ChevronDown,
  Lock,
  Settings,
  Users as UsersIcon,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CreateUserModal } from './CreateUserModal';
import { mockUsers, mockRoles, mockDepartments, type User, type Role } from '@/data/mockUserManagement';

const roleLabels: Record<string, { label: string; labelTh: string; color: string }> = {
  admin: { label: 'Admin', labelTh: 'ผู้ดูแลระบบ', color: 'bg-destructive/10 text-destructive' },
  architect: { label: 'Architect', labelTh: 'Enterprise Architect', color: 'bg-info/10 text-info' },
  manager: { label: 'Manager', labelTh: 'ผู้บริหาร', color: 'bg-amber-500/10 text-amber-700' },
  business_owner: { label: 'Business Owner', labelTh: 'เจ้าของกระบวนการ', color: 'bg-success/10 text-success' },
  auditor: { label: 'Auditor', labelTh: 'ผู้ตรวจสอบ', color: 'bg-warning/10 text-warning' },
  viewer: { label: 'Viewer', labelTh: 'ผู้ดู', color: 'bg-muted text-muted-foreground' },
};

const statusLabels: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  active: { label: 'ใช้งาน', color: 'text-success', icon: CheckCircle2 },
  inactive: { label: 'ไม่ใช้งาน', color: 'text-muted-foreground', icon: UserX },
  pending: { label: 'รอยืนยัน', color: 'text-warning', icon: Mail },
};

export function UsersPageEnhanced() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<User['role'] | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'departments'>('users');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter departments based on search query
  const filteredDepartments = mockDepartments.filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-muted-foreground">จัดการข้อมูลผู้ใช้งาน บทบาท และสิทธิการเข้าถึงเมนูต่างๆ ในระบบ</p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">เพิ่มผู้ใช้งาน</span>
          <span className="sm:hidden">เพิ่ม</span>
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
        <button
          onClick={() => setActiveTab('departments')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === 'departments'
              ? "bg-card shadow-sm text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Briefcase className="w-4 h-4" />
          หน่วยงาน
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
      ) : activeTab === 'roles' ? (
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
      ) : (
        /* Departments Tab */
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">รหัสหน่วยงาน</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ชื่อหน่วยงาน</th>
                  <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">หัวหน้าหน่วยงาน</th>
                  <th className="text-right px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">บุคลากร</th>
                  <th className="text-right px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredDepartments.map((dept, index) => (
                  <motion.tr
                    key={dept.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 text-xs font-medium bg-muted rounded-md text-muted-foreground">
                        {dept.code}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-medium text-foreground">{dept.name}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-foreground">{dept.head}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-sm text-muted-foreground">{dept.memberCount} คน</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="แก้ไข">
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors" title="ลบ">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
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
