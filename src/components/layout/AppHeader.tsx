import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, HelpCircle, Globe, ChevronRight, ChevronDown, LayoutDashboard, Network, Layers, Users, Wifi, Activity, Settings, BookOpen, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationDropdown } from './NotificationDropdown';
import { cn } from '@/lib/utils';
import { useLanguage, type Language } from '@/context/LanguageContext';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

// Language options with flags
const languageOptions: { code: Language; label: string; flag: string; nativeName: string }[] = [
  { code: 'th', label: 'Thai', flag: '🇹🇭', nativeName: 'ภาษาไทย' },
  { code: 'en', label: 'English', flag: '🇺🇸', nativeName: 'English' },
];

// Breadcrumb configuration with icons and colors
const breadcrumbConfig: Record<string, { label: string; labelEn: string; icon: React.ElementType; color: string }> = {
  '/': { label: 'Dashboard', labelEn: 'Dashboard', icon: LayoutDashboard, color: 'text-primary' },
  '/graph': { label: 'แผนผังสถาปัตยกรรม', labelEn: 'Architecture Map', icon: Network, color: 'text-info' },
  '/artefacts': { label: 'Artefacts', labelEn: 'Artefacts', icon: Layers, color: 'text-violet-500' },
  '/users': { label: 'จัดการผู้ใช้งาน', labelEn: 'User Management', icon: Users, color: 'text-amber-500' },
  '/wifi': { label: 'WiFi Authentication', labelEn: 'WiFi Authentication', icon: Wifi, color: 'text-teal-500' },
  '/audit': { label: 'ข้อมูลการใช้งาน', labelEn: 'Audit Log', icon: Activity, color: 'text-success' },
  '/settings': { label: 'ตั้งค่าระบบ', labelEn: 'Settings', icon: Settings, color: 'text-muted-foreground' },
};

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languageOptions.find(l => l.code === language)!;

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
            <span className="text-muted-foreground flex-shrink-0">
              {language === 'th' ? 'ระบบสถาปัตยกรรมองค์กร' : 'Enterprise Architecture'}
            </span>
            {currentBreadcrumb && (
              <>
                <ChevronRight className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
                <div className="flex items-center gap-1.5">
                  {Icon && <Icon className={cn("w-3.5 h-3.5 flex-shrink-0", currentBreadcrumb.color)} />}
                  <span className={cn("font-medium truncate", currentBreadcrumb.color)}>
                    {language === 'th' ? currentBreadcrumb.label : currentBreadcrumb.labelEn}
                  </span>
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
              placeholder={t('common.search')}
              className="w-48 lg:w-64 h-10 pl-9 pr-12 text-sm bg-muted/30 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 focus:bg-muted/50 transition-all"
            />
            <kbd className="absolute right-3 hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground bg-background/80 border border-border rounded shadow-sm">
              ⌘K
            </kbd>
          </div>

          {/* Language Dropdown - Premium */}
          <div ref={languageMenuRef} className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center gap-1.5 px-2.5 h-9 sm:h-10 rounded-xl bg-muted/30 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:border-border transition-all"
              title={t('lang.switch')}
            >
              <span className="text-base">{currentLang.flag}</span>
              <span className="text-xs font-semibold hidden sm:inline">{currentLang.code.toUpperCase()}</span>
              <ChevronDown className={cn("w-3 h-3 transition-transform", showLanguageMenu && "rotate-180")} />
            </motion.button>

            <AnimatePresence>
              {showLanguageMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden"
                >
                  <div className="p-1.5">
                    <p className="px-2 py-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      {language === 'th' ? 'เลือกภาษา' : 'Select Language'}
                    </p>
                    {languageOptions.map((option) => (
                      <button
                        key={option.code}
                        onClick={() => {
                          setLanguage(option.code);
                          setShowLanguageMenu(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm transition-colors",
                          language === option.code
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted text-foreground"
                        )}
                      >
                        <span className="text-xl">{option.flag}</span>
                        <div className="flex-1 text-left">
                          <span className="font-medium block">{option.nativeName}</span>
                          <span className="text-[10px] text-muted-foreground">{option.label}</span>
                        </div>
                        {language === option.code && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Help - Premium */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-muted/30 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:border-border transition-all"
            title={t('common.help')}
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
