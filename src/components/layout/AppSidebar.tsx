import { useState, useEffect } from 'react';
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
  Wifi,
  BookOpen,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { language, t } = useLanguage();

  // Auto-collapse on smaller screens and detect mobile
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      const tablet = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setMobileOpen(false);
      }
      if (tablet && !mobile) {
        setCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Mobile: Show hamburger button and overlay sidebar
  if (isMobile) {
    return (
      <>
        {/* Mobile hamburger button */}
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-40 flex items-center justify-center w-10 h-10 rounded-lg bg-card border border-border shadow-sm md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed left-0 top-0 h-screen w-[280px] bg-sidebar text-sidebar-foreground border-r border-sidebar-border z-50 flex flex-col"
              >
                {/* Close button */}
                <button
                  onClick={() => setMobileOpen(false)}
                  className="absolute top-4 right-4 p-1 rounded-lg hover:bg-sidebar-accent"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent">
                      <Network className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h1 className="text-sm font-semibold">EA Management</h1>
                      <p className="text-xs text-sidebar-foreground/60">{language === 'th' ? 'กรมวิทยาศาสตร์บริการ' : 'Department of Science Service'}</p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                  <div className="mb-2">
                    <span className="px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/40">
                      {t('nav.main')}
                    </span>
                  </div>
                  {navItems.map((item) => (
                    <NavButton
                      key={item.href}
                      item={item}
                      isActive={location.pathname === item.href}
                      collapsed={false}
                      language={language}
                    />
                  ))}

                  <div className="pt-4 mt-4 border-t border-sidebar-border">
                    <span className="px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/40">
                      {t('nav.admin')}
                    </span>
                  </div>
                  {adminItems.map((item) => (
                    <NavButton
                      key={item.href}
                      item={item}
                      isActive={location.pathname === item.href}
                      collapsed={false}
                      language={language}
                    />
                  ))}
                </nav>

                {/* User Section */}
                <div className="p-3 border-t border-sidebar-border">
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                      {user?.name?.substring(0, 2).toUpperCase() || 'EA'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                      <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email || 'email@example.com'}</p>
                    </div>
                    <button onClick={logout} className="ml-auto p-1 hover:text-destructive transition-colors" title={t('nav.signOut')}>
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop/Tablet: Normal sidebar
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border shrink-0"
    >
      {/* Header */}
      <div className={cn(
        "flex items-center h-16 border-b border-sidebar-border transition-all duration-250",
        collapsed ? "px-2 justify-center" : "px-4 justify-between"
      )}>
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 flex-1 min-w-0"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent shrink-0">
                <Network className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="overflow-hidden min-w-0">
                <h1 className="text-sm font-bold truncate">EA Management</h1>
                <p className="text-[10px] text-muted-foreground truncate">{language === 'th' ? 'กรมวิทยาศาสตร์บริการ' : 'Department of Science Service'}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-foreground transition-all duration-200 shrink-0",
            collapsed && "mx-auto"
          )}
          title={collapsed ? (language === 'th' ? "ขยาย Sidebar" : "Expand Sidebar") : (language === 'th' ? "ย่อ Sidebar" : "Collapse Sidebar")}
        >
          {collapsed ? (
            <PanelLeft className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-2"
            >
              <span className="px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/40">
                {t('nav.main')}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        {navItems.map((item) => (
          <NavButton
            key={item.href}
            item={item}
            isActive={location.pathname === item.href}
            collapsed={collapsed}
            language={language}
          />
        ))}

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="pt-4 mt-4 border-t border-sidebar-border"
            >
              <span className="px-3 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/40">
                {t('nav.admin')}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        {adminItems.map((item) => (
          <NavButton
            key={item.href}
            item={item}
            isActive={location.pathname === item.href}
            collapsed={collapsed}
            language={language}
          />
        ))}
      </nav>

      {/* User Section */}
      <div className={cn(
        "border-t border-sidebar-border transition-all duration-250",
        collapsed ? "p-2" : "p-3"
      )}>
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer",
          collapsed && "justify-center"
        )}>
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-accent text-accent-foreground text-sm font-medium shrink-0">
            {user?.name?.substring(0, 2).toUpperCase() || 'EA'}
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email || 'email@example.com'}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!collapsed && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={logout}
                className="ml-auto p-1 hover:text-destructive transition-colors shrink-0"
                title={t('nav.signOut')}
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>


    </motion.aside>
  );
}

interface NavButtonProps {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  language?: 'th' | 'en';
}

function NavButton({ item, isActive, collapsed, language = 'th' }: NavButtonProps) {
  const Icon = item.icon;
  const displayLabel = language === 'th' ? item.labelTh : item.label;

  return (
    <Link
      to={item.href}
      className={cn(
        "relative flex items-center w-full gap-3 rounded-lg text-sm font-medium transition-all duration-200 group",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
        collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"
      )}
      title={collapsed ? displayLabel : undefined}
    >
      {isActive && !collapsed && (
        <motion.div
          layoutId="activeNav"
          className="absolute left-0 w-1 h-6 rounded-r-full bg-accent"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
      <Icon className={cn(
        "flex-shrink-0 transition-colors",
        collapsed ? "w-5 h-5" : "w-5 h-5",
        isActive && "text-accent"
      )} />
      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0, marginLeft: 0 }}
            animate={{ opacity: 1, width: 'auto', marginLeft: 'auto' }}
            exit={{ opacity: 0, width: 0, marginLeft: 0 }}
            transition={{ duration: 0.2 }}
            className="truncate flex-1"
          >
            {displayLabel}
          </motion.span>
        )}
      </AnimatePresence>
      {item.badge && !collapsed && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="ml-auto flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-accent text-accent-foreground shrink-0"
        >
          {item.badge}
        </motion.span>
      )}
      {/* Tooltip for collapsed state */}
      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
          {displayLabel}
        </div>
      )}
    </Link>
  );
}
