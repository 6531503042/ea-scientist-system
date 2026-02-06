'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
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
import { Button } from '@/components/ui/button';
import type { User as UserType } from '@/types';

export default function UsersPage() {
  const { users, loading: usersLoading } = useUsers();
  const { roles, loading: rolesLoading } = useRoles();
  const { departments, loading: deptsLoading } = useDepartments();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'departments'>('users');
  const [selectedRole, setSelectedRole] = useState('all');

  // Modal states
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);

  // Calculate user counts per role
  const userCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    users.forEach(user => {
      const roleKey = typeof user.role === 'string' ? user.role : 'viewer';
      const matchingRole = roles.find(r =>
        r.code === roleKey ||
        r.name.toLowerCase() === roleKey.toLowerCase() ||
        r.name.toLowerCase().replace(/\s+/g, '_') === roleKey.toLowerCase()
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
        role.code === userRoleKey ||
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

  const isLoading = usersLoading || rolesLoading || deptsLoading;

  // Handlers
  const handleEditUser = (user: UserType) => {
    setEditingUser(user);
    setIsEditUserModalOpen(true);
  };

  const handleEditUserSubmit = (data: Partial<UserType>) => {
    console.log('Edit user:', data);
    // TODO: API call to update user
    setIsEditUserModalOpen(false);
    setEditingUser(null);
  };

  const handleCreateRole = (data: {
    code: string;
    name: string;
    nameTh: string;
    description: string;
    permissions: string[];
    isSystemRole: boolean;
  }) => {
    console.log('Create role:', data);
    // TODO: API call to create role
  };

  const handleEditRole = (role: typeof roles[0]) => {
    console.log('Edit role:', role);
    // TODO: Open edit role modal
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Row - Description + Tab-specific Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-6 pb-0 sm:pb-0">
        <p className="text-sm text-muted-foreground">จัดการข้อมูลผู้ใช้งาน บทบาท และสิทธิการเข้าถึงเมนูต่างๆ ในระบบ</p>
        <div className="flex gap-2">
          {activeTab === 'users' && (
            <Button className="gap-2" onClick={() => setIsCreateUserModalOpen(true)}>
              <Plus className="w-4 h-4" />
              เพิ่มผู้ใช้งาน
            </Button>
          )}
          {activeTab === 'roles' && (
            <Button className="gap-2" onClick={() => setIsCreateRoleModalOpen(true)}>
              <Plus className="w-4 h-4" />
              เพิ่มบทบาท
            </Button>
          )}
          {/* Departments button moved inside DepartmentsTable */}
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto px-4 sm:px-6 py-4 scrollbar-hide">
        <div className="flex items-center gap-1 p-1 bg-muted rounded-xl w-fit min-w-max">
          <button
            onClick={() => setActiveTab('users')}
            className={cn(
              "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
              activeTab === 'users'
                ? "bg-card shadow-sm text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <UsersIcon className="w-4 h-4" />
            <span className="hidden xs:inline">ผู้ใช้งาน</span>
            <span className="xs:hidden">ผู้ใช้</span>
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={cn(
              "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
              activeTab === 'roles'
                ? "bg-card shadow-sm text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Lock className="w-4 h-4" />
            <span className="hidden xs:inline">สิทธิ</span>
            <span className="xs:hidden">สิทธิ</span>
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={cn(
              "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
              activeTab === 'departments'
                ? "bg-card shadow-sm text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Building2 className="w-4 h-4" />
            <span className="hidden xs:inline">หน่วยงาน</span>
            <span className="xs:hidden">หน่วยงาน</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : activeTab === 'users' ? (
        <div className="flex flex-1 overflow-hidden">
          {/* Filter Sidebar - Desktop only */}
          <div className="hidden lg:block border-r border-border">
            <FilterSidebar
              roles={roles}
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
              userCounts={userCounts}
              totalUsers={users.length}
            />
          </div>

          {/* Users Table */}
          <div className="flex-1 overflow-auto p-4 sm:p-6 pt-0 sm:pt-0">
            <UsersTable
              users={searchedUsers}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onViewUser={(user) => console.log('View:', user)}
              onEditUser={handleEditUser}
              onDeleteUser={(id) => console.log('Delete:', id)}
              onResetPassword={(id) => console.log('Reset password:', id)}
            />
          </div>
        </div>
      ) : activeTab === 'roles' ? (
        <div className="flex-1 overflow-auto p-4 sm:p-6 pt-0 sm:pt-0">
          <RolesTable
            roles={roles}
            onEditRole={handleEditRole}
            onDeleteRole={(id) => console.log('Delete role:', id)}
          />
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-4 sm:p-6 pt-0 sm:pt-0">
          <DepartmentsTable
            departments={departments}
            onCreate={(data) => console.log('Create department:', data)}
            onUpdate={(id, data) => console.log('Update department:', id, data)}
            onDelete={(id) => console.log('Delete department:', id)}
          />
        </div>
      )}

      {/* Modals */}
      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        onSubmit={(data) => {
          console.log('New User:', data);
          setIsCreateUserModalOpen(false);
        }}
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
    </div>
  );
}
