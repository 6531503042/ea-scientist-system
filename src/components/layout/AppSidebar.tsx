import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Network,
  Layers,
  Users,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  Shield,
  LogOut,
  Wifi
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  icon: React.ElementType;
  label: string;
  labelTh: string;
  href: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', labelTh: 'แดชบอร์ด', href: '/' },
  { icon: Layers, label: 'Artefacts', labelTh: 'รายการ Artefact', href: '/artefacts' },
  { icon: Network, label: 'Architecture Map', labelTh: 'แผนผังสถาปัตยกรรม', href: '/graph' },
];

const adminItems: NavItem[] = [
  { icon: Users, label: 'Users', labelTh: 'ผู้ใช้งาน', href: '/users' },
  { icon: Shield, label: 'Audit Log', labelTh: 'บันทึกการใช้งาน', href: '/audit' },
  { icon: Settings, label: 'Settings', labelTh: 'ตั้งค่า', href: '/settings' },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border"
    >
      {/* Header */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent">
                <Network className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h1 className="text-sm font-semibold">EA Management</h1>
                <p className="text-xs text-sidebar-foreground/60">กรมวิทยาศาสตร์บริการ</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          <div className="flex items-center justify-center w-9 h-9 mx-auto rounded-lg bg-accent">
            <Network className="w-5 h-5 text-accent-foreground" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="mb-2">
          {!collapsed && (
            <span className="px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/40">
              Main
            </span>
          )}
        </div>
        {navItems.map((item) => (
          <NavButton
            key={item.href}
            item={item}
            isActive={location.pathname === item.href}
            collapsed={collapsed}
          />
        ))}

        <div className="pt-4 mt-4 border-t border-sidebar-border">
          {!collapsed && (
            <span className="px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/40">
              Admin
            </span>
          )}
        </div>
        {adminItems.map((item) => (
          <NavButton
            key={item.href}
            item={item}
            isActive={location.pathname === item.href}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-sidebar-border">
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer",
          collapsed && "justify-center"
        )}>
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-accent text-accent-foreground text-sm font-medium">
            {user?.name?.substring(0, 2).toUpperCase() || 'EA'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email || 'email@example.com'}</p>
            </div>
          )}
          <button onClick={logout} className="ml-auto p-1 hover:text-destructive transition-colors" title="ออกจากระบบ">
            {!collapsed && <LogOut className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex items-center justify-center w-6 h-6 rounded-full bg-card border border-border shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>
    </motion.aside>
  );
}

interface NavButtonProps {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
}

function NavButton({ item, isActive, collapsed }: NavButtonProps) {
  const Icon = item.icon;

  return (
    <Link
      to={item.href}
      className={cn(
        "relative flex items-center w-full gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
        collapsed && "justify-center px-2"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="activeNav"
          className="absolute left-0 w-1 h-6 rounded-r-full bg-accent"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
      <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-accent")} />
      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="truncate"
          >
            {item.labelTh}
          </motion.span>
        )}
      </AnimatePresence>
      {item.badge && !collapsed && (
        <span className="ml-auto flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-accent text-accent-foreground">
          {item.badge}
        </span>
      )}
    </Link>
  );
}
