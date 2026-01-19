import { useState } from 'react';
import { Search, HelpCircle, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { NotificationDropdown } from './NotificationDropdown';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  const [language, setLanguage] = useState<'th' | 'en'>('th');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'th' ? 'en' : 'th');
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 bg-background/80 backdrop-blur-lg border-b border-border">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={language === 'th' ? 'ค้นหา Artefact...' : 'Search Artefact...'}
            className="w-64 h-9 pl-9 pr-4 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
          />
          <kbd className="absolute right-3 hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground bg-background border border-border rounded">
            ⌘K
          </kbd>
        </div>

        {/* Language Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-2.5 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title={language === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
        >
          <Globe className="w-4 h-4" />
          <span className="text-xs font-medium">{language.toUpperCase()}</span>
        </motion.button>

        {/* Help */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title={language === 'th' ? 'ช่วยเหลือ' : 'Help'}
        >
          <HelpCircle className="w-5 h-5" />
        </motion.button>

        {/* Notifications */}
        <NotificationDropdown />
      </div>
    </header>
  );
}
