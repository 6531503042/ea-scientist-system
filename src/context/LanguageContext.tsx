import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'th' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

// Simple translations
const translations: Record<Language, Record<string, string>> = {
    th: {
        // Navigation
        'nav.dashboard': 'แดชบอร์ด',
        'nav.artefacts': 'รายการ Artefact',
        'nav.graph': 'แผนผังสถาปัตยกรรม',
        'nav.users': 'ผู้ใช้งาน',
        'nav.audit': 'บันทึกการใช้งาน',
        'nav.settings': 'ตั้งค่า',

        // Common
        'common.search': 'ค้นหา...',
        'common.help': 'ช่วยเหลือ',
        'common.save': 'บันทึก',
        'common.cancel': 'ยกเลิก',
        'common.delete': 'ลบ',
        'common.edit': 'แก้ไข',
        'common.add': 'เพิ่ม',
        'common.export': 'ส่งออก',
        'common.import': 'นำเข้า',
        'common.all': 'ทั้งหมด',
        'common.filter': 'กรองข้อมูล',
        'common.close': 'ปิด',

        // System
        'system.name': 'ระบบสถาปัตยกรรมองค์กร',
        'system.org': 'กรมวิทยาศาสตร์บริการ',

        // Artefacts
        'artefact.business': 'สถาปัตยกรรมธุรกิจ',
        'artefact.application': 'สถาปัตยกรรมแอปพลิเคชัน',
        'artefact.data': 'สถาปัตยกรรมข้อมูล',
        'artefact.technology': 'สถาปัตยกรรมเทคโนโลยี',
        'artefact.security': 'สถาปัตยกรรมความปลอดภัย',
        'artefact.integration': 'สถาปัตยกรรมการเชื่อมต่อ',

        // Impact Analysis
        'impact.upstream': 'ระบบที่ส่งข้อมูลเข้ามา',
        'impact.downstream': 'ระบบที่ได้รับผลกระทบ',
        'impact.analyze': 'วิเคราะห์ผลกระทบ',
        'impact.close': 'ปิดโหมดวิเคราะห์',

        // Language
        'lang.switch': 'เปลี่ยนภาษา',
        'lang.thai': 'ไทย',
        'lang.english': 'English',
    },
    en: {
        // Navigation
        'nav.dashboard': 'Dashboard',
        'nav.artefacts': 'Artefacts',
        'nav.graph': 'Architecture Map',
        'nav.users': 'Users',
        'nav.audit': 'Audit Log',
        'nav.settings': 'Settings',

        // Common
        'common.search': 'Search...',
        'common.help': 'Help',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.delete': 'Delete',
        'common.edit': 'Edit',
        'common.add': 'Add',
        'common.export': 'Export',
        'common.import': 'Import',
        'common.all': 'All',
        'common.filter': 'Filter',
        'common.close': 'Close',

        // System
        'system.name': 'Enterprise Architecture System',
        'system.org': 'Department of Science Service',

        // Artefacts
        'artefact.business': 'Business Architecture',
        'artefact.application': 'Application Architecture',
        'artefact.data': 'Data Architecture',
        'artefact.technology': 'Technology Architecture',
        'artefact.security': 'Security Architecture',
        'artefact.integration': 'Integration Architecture',

        // Impact Analysis
        'impact.upstream': 'Data Sources',
        'impact.downstream': 'Affected Systems',
        'impact.analyze': 'Analyze Impact',
        'impact.close': 'Close Analysis Mode',

        // Language
        'lang.switch': 'Change Language',
        'lang.thai': 'ไทย',
        'lang.english': 'English',
    },
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => {
        // Get from localStorage or default to 'th'
        const saved = localStorage.getItem('ea-language');
        return (saved as Language) || 'th';
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('ea-language', lang);
    };

    // Translation function
    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
