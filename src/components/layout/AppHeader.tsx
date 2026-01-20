import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, HelpCircle, Globe, ChevronRight, LayoutDashboard, Network, Layers, Users, Wifi, Activity, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { NotificationDropdown } from './NotificationDropdown';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

// Breadcrumb configuration with icons and colors
const breadcrumbConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  '/': { label: 'Dashboard', icon: LayoutDashboard, color: 'text-primary' },
  '/graph': { label: 'แผนผังสถาปัตยกรรม', icon: Network, color: 'text-info' },
  '/artefacts': { label: 'Artefacts', icon: Layers, color: 'text-violet-500' },
  '/users': { label: 'จัดการผู้ใช้งาน', icon: Users, color: 'text-amber-500' },
  '/wifi': { label: 'WiFi Authentication', icon: Wifi, color: 'text-teal-500' },
  '/audit': { label: 'ข้อมูลการใช้งาน', icon: Activity, color: 'text-success' },
  '/settings': { label: 'ตั้งค่าระบบ', icon: Settings, color: 'text-muted-foreground' },
};

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  const [language, setLanguage] = useState<'th' | 'en'>('th');
  const location = useLocation();

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'th' ? 'en' : 'th');
  };

  // Generate breadcrumb
  const currentPath = location.pathname;
  const currentBreadcrumb = breadcrumbConfig[currentPath];
  const Icon = currentBreadcrumb?.icon;

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-background via-background to-background/95 backdrop-blur-xl border-b border-border/50">
      {/* Main Header Row */}
      <div className="flex items-center justify-between h-16 sm:h-[72px] px-4 sm:px-6">
        <div className="min-w-0 flex-1">
          {/* Breadcrumb with icon */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm mb-1">
            <span className="text-muted-foreground flex-shrink-0">ระบบสถาปัตยกรรมองค์กร</span>
            {currentBreadcrumb && (
              <>
                <ChevronRight className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
                <div className="flex items-center gap-1.5">
                  {Icon && <Icon className={cn("w-3.5 h-3.5 flex-shrink-0", currentBreadcrumb.color)} />}
                  <span className={cn("font-medium truncate", currentBreadcrumb.color)}>{currentBreadcrumb.label}</span>
                </div>
              </>
            )}
          </div>
          {/* Title with gradient */}
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent truncate">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Search - Premium design */}
          <div className="relative hidden md:flex items-center group">
            <Search className="absolute left-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder={language === 'th' ? 'ค้นหา...' : 'Search...'}
              className="w-48 lg:w-64 h-10 pl-9 pr-12 text-sm bg-muted/30 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 focus:bg-muted/50 transition-all"
            />
            <kbd className="absolute right-3 hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground bg-background/80 border border-border rounded shadow-sm">
              ⌘K
            </kbd>
          </div>

          {/* Language Toggle - Premium */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 h-9 sm:h-10 rounded-xl bg-muted/30 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:border-border transition-all"
            title={language === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
          >
            <Globe className="w-4 h-4" />
            <span className="text-xs font-semibold hidden sm:inline">{language.toUpperCase()}</span>
          </motion.button>

          {/* Help - Premium */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-muted/30 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:border-border transition-all"
            title={language === 'th' ? 'ช่วยเหลือ' : 'Help'}
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>

          {/* Notifications */}
          <NotificationDropdown />
        </div>
      </div>
    </header>
  );
}
