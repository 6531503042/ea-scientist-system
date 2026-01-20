import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, HelpCircle, Globe, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { NotificationDropdown } from './NotificationDropdown';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

// Breadcrumb configuration
const breadcrumbConfig: Record<string, { label: string; parent?: string }> = {
  '/': { label: 'Dashboard' },
  '/graph': { label: 'แผนผังสถาปัตยกรรม' },
  '/artefacts': { label: 'Artefacts' },
  '/users': { label: 'จัดการผู้ใช้งาน' },
  '/wifi': { label: 'WiFi Authentication' },
  '/audit': { label: 'ข้อมูลการใช้งาน' },
  '/settings': { label: 'ตั้งค่าระบบ' },
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

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
      {/* Main Header Row */}
      <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">
        <div className="min-w-0 flex-1">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mb-0.5 overflow-hidden">
            <span className="flex-shrink-0">ระบบสถาปัตยกรรมองค์กร</span>
            {currentBreadcrumb && (
              <>
                <ChevronRight className="w-3 h-3 flex-shrink-0" />
                <span className="text-foreground font-medium truncate">{currentBreadcrumb.label}</span>
              </>
            )}
          </div>
          {/* Title */}
          <h1 className="text-base sm:text-lg font-semibold text-foreground truncate">{title}</h1>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Search - Hidden on very small screens */}
          <div className="relative hidden md:flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={language === 'th' ? 'ค้นหา...' : 'Search...'}
              className="w-48 lg:w-64 h-9 pl-9 pr-4 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
            />
            <kbd className="absolute right-3 hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground bg-background border border-border rounded">
              ⌘K
            </kbd>
          </div>

          {/* Language Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2 h-8 sm:h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title={language === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
          >
            <Globe className="w-4 h-4" />
            <span className="text-xs font-medium hidden sm:inline">{language.toUpperCase()}</span>
          </motion.button>

          {/* Help */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
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
