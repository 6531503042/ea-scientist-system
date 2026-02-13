'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users as UsersIcon, Lock, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUsers } from '@/hooks/useUsers';
import { useRoles } from '@/hooks/useRoles';
import { useDepartments } from '@/hooks/useDepartments';
import { FilterSidebar } from './_components/FilterSidebar';
import { UsersTable } from './_components/UsersTable';
import { RolesTable } from './_components/RolesTable';
import { DepartmentsTable } from './_components/DepartmentsTable';
import { CreateUserModal } from './_components/CreateUserModal';
import { EditUserModal } from './_components/EditUserModal';
import { CreateRoleModal } from './_components/CreateRoleModal';
import { CreateDepartmentModal } from './_components/CreateDepartmentModal';
import { EditDepartmentModal } from './_components/EditDepartmentModal';
import {
  UsersTableSkeleton,
  RolesTableSkeleton,
  DepartmentsTableSkeleton,
  FilterSidebarSkeleton,
} from './_components/UserManagementSkeleton';
import { Button } from '@/components/ui/button';
import type { User as UserType } from '@/types/user';

const TABS = [
  { id: 'users', icon: UsersIcon, label: 'ผู้ใช้งาน' },
  { id: 'roles', icon: Lock, label: 'บทบาท' },
  { id: 'departments', icon: Building2, label: 'หน่วยงาน' },
] as const;

type TabId = typeof TABS[number]['id'];

export default function UsersPage() {
  const { users, loading: usersLoading, createUser, updateUser, deleteUser } = useUsers();
  const { roles, loading: rolesLoading, createRole, updateRole, deleteRole } = useRoles();
  const { departments, loading: deptsLoading, createDepartment, updateDepartment, deleteDepartment } = useDepartments();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabId>('users');
  const [selectedRole, setSelectedRole] = useState('all');

  // Modal states
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [isCreateDepartmentModalOpen, setIsCreateDepartmentModalOpen] = useState(false);
  const [isEditDepartmentModalOpen, setIsEditDepartmentModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<import('@/types/department').Department | null>(null);

  // Loading states per tab
  const isUsersLoading = usersLoading || rolesLoading;
  const isRolesLoading = rolesLoading;
  const isDepartmentsLoading = deptsLoading;

  // Calculate user counts per role (match by role name or _id)
  const userCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    users.forEach(user => {
      const roleKey = typeof user.role === 'string' ? user.role : 'viewer';
      const matchingRole = roles.find(r =>
        r._id === roleKey ||
        r.name?.toLowerCase() === roleKey.toLowerCase() ||
        (r.name?.toLowerCase() ?? '').replace(/\s+/g, '_') === roleKey.toLowerCase()
      );
      if (matchingRole) {
        counts[matchingRole._id] = (counts[matchingRole._id] || 0) + 1;
      }
    });
    return counts;
  }, [users, roles]);

  // Filter users by selected role
  const filteredUsers = useMemo(() => {
    if (selectedRole === 'all') return users;

    const role = roles.find(r => r._id === selectedRole);
    if (!role) return users;

    return users.filter(user => {
      const userRoleKey = typeof user.role === 'string' ? user.role : 'viewer';
      return (
        role._id === userRoleKey ||
        role.name.toLowerCase() === userRoleKey.toLowerCase() ||
        role.name.toLowerCase().replace(/\s+/g, '_') === userRoleKey.toLowerCase()
      );
    });
  }, [users, selectedRole, roles]);

  // Search filter applied on top
  const searchedUsers = useMemo(() => {
    return filteredUsers.filter(user => {
      const displayName = user.displayName || `${user.name.first} ${user.name.last || ''}`.trim();
      return displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [filteredUsers, searchQuery]);

  // Handlers
  const handleEditUser = (user: UserType) => {
    setEditingUser(user);
    setIsEditUserModalOpen(true);
  };

  const handleEditUserSubmit = async (data: Partial<UserType> & { password?: string }) => {
    if (!editingUser?._id) return;
    const roleMatch = roles.find(
      (r) =>
        r.name?.toLowerCase() === (data.role as string)?.toLowerCase() ||
        r._id === (data.role as string)
    );
    const deptMatch = departments.find(
      (d) =>
        d.code === data.department ||
        d.name === data.department ||
        (typeof data.department === 'string' && d.name?.includes(data.department))
    );
    const updated = await updateUser(editingUser._id, {
      firstName: data.name?.first,
      lastName: data.name?.last,
      email: data.email,
      ...(data.password && { password: data.password }),
      roleId: roleMatch ? Number(roleMatch._id) : undefined,
      departmentId: deptMatch ? Number(deptMatch._id) : undefined,
      isActive: data.status === 'active',
    });
    if (updated) {
      setIsEditUserModalOpen(false);
      setEditingUser(null);
    }
  };

  const handleCreateRole = async (data: {
    code: string;
    name: string;
    nameTh: string;
    description: string;
    permissions: string[];
    isSystemRole: boolean;
  }) => {
    const created = await createRole({
      name: data.name,
      description: data.description,
      permissions: data.permissions,
    });
    if (created) setIsCreateRoleModalOpen(false);
  };

  const handleEditRole = (role: typeof roles[0]) => {
    // TODO: Add EditRoleModal - for now keep console
    console.log('Edit role:', role);
  };

  const handleDeleteRole = async (roleId: string) => {
    await deleteRole(roleId);
  };

  const handleDeleteUser = async (userId: string) => {
    await deleteUser(userId);
  };

  const handleCreateUser = async (data: Partial<import('@/types/user').CreateUserInput>) => {
    const roleMatch = roles.find(
      (r) =>
        r.name?.toLowerCase() === (data.role as string)?.toLowerCase() ||
        r._id === (data.role as string)
    );
    const deptMatch = data.department
      ? departments.find(
          (d) =>
            d.code === data.department ||
            d.name === data.department ||
            (typeof data.department === 'string' && d.name?.includes(data.department))
        )
      : null;
    if (!roleMatch) return;
    const created = await createUser({
      firstName: data.name?.first ?? '',
      lastName: data.name?.last ?? '',
      email: data.email ?? '',
      username: data.username ?? data.email?.split('@')[0] ?? 'user',
      password: (data as { password?: string }).password ?? 'password123',
      roleId: Number(roleMatch._id),
      departmentId: deptMatch ? Number(deptMatch._id) : undefined,
    });
    if (created) setIsCreateUserModalOpen(false);
  };

  const handleDepartmentCreate = async (data: Partial<import('@/types/department').Department> & { code?: string; name?: string }) => {
    const result = await createDepartment({
      code: data.code ?? '',
      name: data.name ?? '',
    });
    if (result) setIsCreateDepartmentModalOpen(false);
  };

  const handleDepartmentUpdate = async (
    id: string,
    data: Partial<import('@/types/department').Department>
  ) => {
    await updateDepartment(id, {
      code: data.code,
      name: data.name,
    });
    setIsEditDepartmentModalOpen(false);
    setEditingDepartment(null);
  };

  const handleDepartmentDelete = async (id: string) => {
    await deleteDepartment(id);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 pt-5 sm:pt-6 pb-4">
        <div className="space-y-0.5">
          <h1 className="text-xl font-semibold text-foreground">จัดการผู้ใช้งาน</h1>
          <p className="text-sm text-muted-foreground">
            จัดการข้อมูลผู้ใช้งาน บทบาท และสิทธิการเข้าถึงเมนูต่างๆ ในระบบ
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Tabs - integrated into header */}
          <div className="flex items-center gap-0.5 p-1 bg-muted/80 rounded-lg">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab-specific action button */}
          <AnimatePresence mode="wait">
            {activeTab === 'users' && (
              <motion.div
                key="users-btn"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.12 }}
              >
                <Button size="sm" className="gap-1.5 h-8" onClick={() => setIsCreateUserModalOpen(true)}>
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">เพิ่มผู้ใช้งาน</span>
                  <span className="sm:hidden">เพิ่ม</span>
                </Button>
              </motion.div>
            )}
            {activeTab === 'roles' && (
              <motion.div
                key="roles-btn"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.12 }}
              >
                <Button size="sm" className="gap-1.5 h-8" onClick={() => setIsCreateRoleModalOpen(true)}>
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">เพิ่มบทบาท</span>
                  <span className="sm:hidden">เพิ่ม</span>
                </Button>
              </motion.div>
            )}
            {activeTab === 'departments' && (
              <motion.div
                key="departments-btn"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.12 }}
              >
                <Button size="sm" className="gap-1.5 h-8" onClick={() => setIsCreateDepartmentModalOpen(true)}>
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">เพิ่มหน่วยงาน</span>
                  <span className="sm:hidden">เพิ่ม</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content with AnimatePresence for smooth transitions */}
      <AnimatePresence mode="wait">
        {activeTab === 'users' && (
          <motion.div
            key="users-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-1 overflow-hidden border-t border-border"
          >
            {/* Filter Sidebar - Desktop only */}
            <div className="hidden lg:block">
              {isUsersLoading ? (
                <FilterSidebarSkeleton />
              ) : (
                <FilterSidebar
                  roles={roles}
                  selectedRole={selectedRole}
                  onRoleChange={setSelectedRole}
                  userCounts={userCounts}
                  totalUsers={users.length}
                />
              )}
            </div>

            {/* Users Table */}
            <div className="flex-1 overflow-auto p-4 sm:p-5">
              {isUsersLoading ? (
                <UsersTableSkeleton />
              ) : (
                <UsersTable
                  isLoading={isUsersLoading}
                  users={searchedUsers}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onEditUser={handleEditUser}
                  onDeleteUser={handleDeleteUser}
                />
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'roles' && (
          <motion.div
            key="roles-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-1 overflow-auto p-4 sm:p-5 border-t border-border"
          >
            {isRolesLoading ? (
              <RolesTableSkeleton />
            ) : (
              <RolesTable
                roles={roles}
                onEditRole={handleEditRole}
                onDeleteRole={handleDeleteRole}
              />
            )}
          </motion.div>
        )}

        {activeTab === 'departments' && (
          <motion.div
            key="departments-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex-1 overflow-auto p-4 sm:p-5 border-t border-border"
          >
            {isDepartmentsLoading ? (
              <DepartmentsTableSkeleton />
            ) : (
              <DepartmentsTable
                departments={departments}
                onEdit={(dept) => {
                  setEditingDepartment(dept);
                  setIsEditDepartmentModalOpen(true);
                }}
                onDelete={handleDepartmentDelete}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        onSubmit={handleCreateUser}
      />

      <EditUserModal
        isOpen={isEditUserModalOpen}
        onClose={() => {
          setIsEditUserModalOpen(false);
          setEditingUser(null);
        }}
        user={editingUser}
        onSubmit={handleEditUserSubmit}
      />

      <CreateRoleModal
        isOpen={isCreateRoleModalOpen}
        onClose={() => setIsCreateRoleModalOpen(false)}
        onSubmit={handleCreateRole}
      />

      <CreateDepartmentModal
        isOpen={isCreateDepartmentModalOpen}
        onClose={() => setIsCreateDepartmentModalOpen(false)}
        onSubmit={handleDepartmentCreate}
      />

      <EditDepartmentModal
        isOpen={isEditDepartmentModalOpen}
        onClose={() => {
          setIsEditDepartmentModalOpen(false);
          setEditingDepartment(null);
        }}
        department={editingDepartment}
        onSubmit={handleDepartmentUpdate}
      />
    </div>
  );
}
