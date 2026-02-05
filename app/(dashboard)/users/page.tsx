'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users as UsersIcon, Lock, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUsers } from '@/hooks/useUsers';
import { useRoles } from '@/hooks/useRoles';
import { useDepartments } from '@/hooks/useDepartments';
import { UsersTable } from './_components/UsersTable';
import { RolesCard } from './_components/RolesCard';
import { DepartmentsTable } from './_components/DepartmentsTable';
import { CreateUserModal } from './_components/CreateUserModal';

export default function UsersPage() {
  const { users, loading: usersLoading } = useUsers();
  const { roles, loading: rolesLoading } = useRoles();
  const { departments, loading: deptsLoading } = useDepartments();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'departments'>('users');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredUsers = users.filter(user => {
    const displayName = user.displayName || `${user.name.first} ${user.name.last || ''}`.trim();
    return displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const isLoading = usersLoading || rolesLoading || deptsLoading;

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
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
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
            <span className="hidden xs:inline">ผู้ใช้งานทั้งหมด</span>
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
            <span className="hidden xs:inline">สิทธิการเข้าถึง</span>
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
            <Briefcase className="w-4 h-4" />
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
        <UsersTable
          users={filteredUsers}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      ) : activeTab === 'roles' ? (
        <RolesCard roles={roles} />
      ) : (
        <DepartmentsTable
          departments={departments}
          searchQuery={searchQuery}
        />
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
