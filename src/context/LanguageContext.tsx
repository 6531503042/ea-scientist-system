import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'th' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

// Comprehensive translations
const translations: Record<Language, Record<string, string>> = {
    th: {
        // Navigation
        'nav.dashboard': 'แดชบอร์ด',
        'nav.artefacts': 'รายการ Artefact',
        'nav.graph': 'แผนผังสถาปัตยกรรม',
        'nav.users': 'ผู้ใช้งาน',
        'nav.audit': 'บันทึกการใช้งาน',
        'nav.settings': 'ตั้งค่า',
        'nav.main': 'หลัก',
        'nav.admin': 'ผู้ดูแล',
        'nav.reports': 'รายงาน',

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
        'common.viewAll': 'ดูทั้งหมด',
        'common.logout': 'ออกจากระบบ',
        'common.notifications': 'การแจ้งเตือน',

        // System
        'system.name': 'ระบบสถาปัตยกรรมองค์กร',
        'system.shortName': 'EA System',
        'system.org': 'กรมวิทยาศาสตร์บริการ',
        'system.title': 'Enterprise Architecture',

        // Dashboard
        'dashboard.title': 'แดชบอร์ด',
        'dashboard.totalArtefacts': 'Artefacts ทั้งหมด',
        'dashboard.relationships': 'ความสัมพันธ์',
        'dashboard.departments': 'หน่วยงาน',
        'dashboard.activeSystems': 'ระบบที่ใช้งาน',
        'dashboard.owners': 'เจ้าของ (Owner)',
        'dashboard.usageFrequency': 'ความถี่ในการใช้งาน',
        'dashboard.usageHigh': 'ใช้งานสูง (High)',
        'dashboard.usageMedium': 'ใช้งานปานกลาง (Medium)',
        'dashboard.usageLow': 'ใช้งานต่ำ (Low)',
        'dashboard.artefactStatus': 'สถานะ Artefacts',
        'dashboard.versionControl': 'Version Control & Latest Updates',
        'dashboard.totalVersions': 'Total Versions',
        'dashboard.avgVersion': 'Avg Version',
        'dashboard.updated30Days': 'อัพเดต 30 วัน',
        'dashboard.togafArchitecture': 'สถาปัตยกรรมตามมาตรฐาน TOGAF',
        'dashboard.byArchType': 'แบ่งตามประเภท Architecture',
        'dashboard.mostUsed': 'Artefacts ที่ใช้งานมากที่สุด',
        'dashboard.topDepartments': 'หน่วยงานที่มี Artefact มากที่สุด',
        'dashboard.quickActions': 'เมนูด่วน',
        'dashboard.manageArtefacts': 'จัดการ Artefacts',
        'dashboard.manageArtefactsDesc': 'ดู, เพิ่ม, แก้ไข Artefacts',
        'dashboard.architectureMap': 'แผนผังสถาปัตยกรรม',
        'dashboard.architectureMapDesc': 'ดูความสัมพันธ์แบบ Graph',
        'dashboard.reports': 'รายงาน',
        'dashboard.reportsDesc': 'ดาวน์โหลดรายงาน EA',
        'dashboard.users': 'ผู้ใช้งาน',
        'dashboard.usersDesc': 'จัดการผู้ใช้และสิทธิ์',
        'dashboard.recentUpdates': 'อัพเดตล่าสุด',
        'dashboard.aboutSystem': 'เกี่ยวกับระบบ',
        'dashboard.aboutDesc': 'ระบบจัดการสถาปัตยกรรมองค์กรของกรมวิทยาศาสตร์บริการ พัฒนาตามมาตรฐาน TOGAF Framework',

        // Artefacts
        'artefact.business': 'สถาปัตยกรรมธุรกิจ',
        'artefact.application': 'สถาปัตยกรรมแอปพลิเคชัน',
        'artefact.data': 'สถาปัตยกรรมข้อมูล',
        'artefact.technology': 'สถาปัตยกรรมเทคโนโลยี',
        'artefact.security': 'สถาปัตยกรรมความปลอดภัย',
        'artefact.integration': 'สถาปัตยกรรมการเชื่อมต่อ',
        'artefact.add': 'เพิ่ม Artefact',
        'artefact.list': 'รายการ Artefact',
        'artefact.details': 'รายละเอียด Artefact',
        'artefact.connections': 'connections',

        // Status
        'status.active': 'ใช้งาน',
        'status.draft': 'ร่าง',
        'status.deprecated': 'ยกเลิก',
        'status.planned': 'วางแผน',

        // Impact Analysis
        'impact.upstream': 'ระบบที่ส่งข้อมูลเข้ามา',
        'impact.downstream': 'ระบบที่ได้รับผลกระทบ',
        'impact.analyze': 'วิเคราะห์ผลกระทบ',
        'impact.close': 'ปิดโหมดวิเคราะห์',

        // Language
        'lang.switch': 'เปลี่ยนภาษา',
        'lang.select': 'เลือกภาษา',
        'lang.thai': 'ไทย',
        'lang.english': 'English',

        // Graph
        'graph.architectView': 'Architect',
        'graph.executiveView': 'Executive',
        'graph.graphView': 'Graph',
        'graph.hierarchyView': 'Hierarchy',
        'graph.artefactLibrary': 'Artefact Library',
        'graph.filters': 'Filters',
        'graph.artefactType': 'ประเภท Artefact',
        'graph.relationships': 'Relationships',
        'graph.total': 'ทั้งหมด',
        'graph.analyzeImpact': 'วิเคราะห์ผลกระทบ',
        'graph.organizationHierarchy': 'Organization Hierarchy',
        'graph.searchArtefact': 'ค้นหา Artefact...',

        // Artefacts Page
        'artefacts.all': 'Artefacts ทั้งหมด',
        'artefacts.showing': 'แสดง',
        'artefacts.items': 'รายการ',
        'artefacts.export': 'ส่งออก',
        'artefacts.exportData': 'ส่งออกข้อมูล',
        'artefacts.exportSpreadsheet': 'ส่งออกเป็น Spreadsheet',
        'artefacts.exportDocument': 'ส่งออกเป็นเอกสาร',
        'artefacts.import': 'นำเข้า',
        'artefacts.addArtefact': 'เพิ่ม Artefact',
        'artefacts.add': 'เพิ่ม',
        'artefacts.sortByTOGAF': 'เรียงตาม TOGAF',
        'artefacts.sortByName': 'เรียงตามชื่อ',
        'artefacts.sortByDate': 'เรียงตามวันที่',
        'artefacts.search': 'ค้นหา Artefact...',
        'artefacts.artefactName': 'ชื่อ Artefact',
        'artefacts.type': 'ประเภท',
        'artefacts.status': 'สถานะ',
        'artefacts.owner': 'ผู้รับผิดชอบ',
        'artefacts.actions': 'การดำเนินการ',
        'artefacts.artefactType': 'ประเภท Artefact',
        'artefacts.noResults': 'ไม่พบข้อมูล',
        'artefacts.tryDifferent': 'ลองเปลี่ยนคำค้นหาหรือตัวกรองใหม่',

        // Detail Panel
        'detail.details': 'รายละเอียด',
        'detail.owner': 'ผู้รับผิดชอบ',
        'detail.department': 'หน่วยงาน',
        'detail.version': 'เวอร์ชัน',
        'detail.updated': 'อัพเดต',
        'detail.upstream': 'Upstream',
        'detail.downstream': 'Downstream',
        'detail.systemsSendingData': 'ระบบที่ส่งข้อมูลเข้ามา',
        'detail.systemsReceivingData': 'ระบบที่รับข้อมูลไป',
        'detail.noUpstream': 'ไม่มีระบบที่ส่งข้อมูลเข้ามา',
        'detail.noDownstream': 'ไม่มีระบบที่ได้รับผลกระทบ',
        'detail.analyzeImpact': 'วิเคราะห์ผลกระทบ',
        'detail.close': 'ปิด',

        // Table Headers
        'table.name': 'ชื่อ',
        'table.description': 'คำอธิบาย',
        'table.type': 'ประเภท',
        'table.status': 'สถานะ',
        'table.owner': 'ผู้รับผิดชอบ',
        'table.department': 'หน่วยงาน',
        'table.artefacts': 'Artefacts',
    },
    en: {
        // Navigation
        'nav.dashboard': 'Dashboard',
        'nav.artefacts': 'Artefacts',
        'nav.graph': 'Architecture Map',
        'nav.users': 'Users',
        'nav.audit': 'Audit Log',
        'nav.settings': 'Settings',
        'nav.main': 'Main',
        'nav.admin': 'Admin',
        'nav.reports': 'Reports',

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
        'common.viewAll': 'View All',
        'common.logout': 'Logout',
        'common.notifications': 'Notifications',

        // System
        'system.name': 'Enterprise Architecture System',
        'system.shortName': 'EA System',
        'system.org': 'Department of Science Service',
        'system.title': 'Enterprise Architecture',

        // Dashboard
        'dashboard.title': 'Dashboard',
        'dashboard.totalArtefacts': 'Total Artefacts',
        'dashboard.relationships': 'Relationships',
        'dashboard.departments': 'Departments',
        'dashboard.activeSystems': 'Active Systems',
        'dashboard.owners': 'Owners',
        'dashboard.usageFrequency': 'Usage Frequency',
        'dashboard.usageHigh': 'High Usage',
        'dashboard.usageMedium': 'Medium Usage',
        'dashboard.usageLow': 'Low Usage',
        'dashboard.artefactStatus': 'Artefact Status',
        'dashboard.versionControl': 'Version Control & Latest Updates',
        'dashboard.totalVersions': 'Total Versions',
        'dashboard.avgVersion': 'Avg Version',
        'dashboard.updated30Days': 'Updated 30 Days',
        'dashboard.togafArchitecture': 'TOGAF Standard Architecture',
        'dashboard.byArchType': 'By Architecture Type',
        'dashboard.mostUsed': 'Most Used Artefacts',
        'dashboard.topDepartments': 'Top Departments by Artefacts',
        'dashboard.quickActions': 'Quick Actions',
        'dashboard.manageArtefacts': 'Manage Artefacts',
        'dashboard.manageArtefactsDesc': 'View, Add, Edit Artefacts',
        'dashboard.architectureMap': 'Architecture Map',
        'dashboard.architectureMapDesc': 'View relationships as Graph',
        'dashboard.reports': 'Reports',
        'dashboard.reportsDesc': 'Download EA Reports',
        'dashboard.users': 'Users',
        'dashboard.usersDesc': 'Manage users and permissions',
        'dashboard.recentUpdates': 'Recent Updates',
        'dashboard.aboutSystem': 'About System',
        'dashboard.aboutDesc': 'Enterprise Architecture Management System for Department of Science Service, developed following TOGAF Framework standards',

        // Artefacts
        'artefact.business': 'Business Architecture',
        'artefact.application': 'Application Architecture',
        'artefact.data': 'Data Architecture',
        'artefact.technology': 'Technology Architecture',
        'artefact.security': 'Security Architecture',
        'artefact.integration': 'Integration Architecture',
        'artefact.add': 'Add Artefact',
        'artefact.list': 'Artefact List',
        'artefact.details': 'Artefact Details',
        'artefact.connections': 'connections',

        // Status
        'status.active': 'Active',
        'status.draft': 'Draft',
        'status.deprecated': 'Deprecated',
        'status.planned': 'Planned',

        // Impact Analysis
        'impact.upstream': 'Data Sources',
        'impact.downstream': 'Affected Systems',
        'impact.analyze': 'Analyze Impact',
        'impact.close': 'Close Analysis Mode',

        // Language
        'lang.switch': 'Change Language',
        'lang.select': 'Select Language',
        'lang.thai': 'ไทย',
        'lang.english': 'English',

        // Graph
        'graph.architectView': 'Architect',
        'graph.executiveView': 'Executive',
        'graph.graphView': 'Graph',
        'graph.hierarchyView': 'Hierarchy',
        'graph.artefactLibrary': 'Artefact Library',
        'graph.filters': 'Filters',
        'graph.artefactType': 'Artefact Type',
        'graph.relationships': 'Relationships',
        'graph.total': 'Total',
        'graph.analyzeImpact': 'Analyze Impact',
        'graph.organizationHierarchy': 'Organization Hierarchy',
        'graph.searchArtefact': 'Search Artefact...',

        // Artefacts Page
        'artefacts.all': 'All Artefacts',
        'artefacts.showing': 'Showing',
        'artefacts.items': 'items',
        'artefacts.export': 'Export',
        'artefacts.exportData': 'Export Data',
        'artefacts.exportSpreadsheet': 'Export as Spreadsheet',
        'artefacts.exportDocument': 'Export as Document',
        'artefacts.import': 'Import',
        'artefacts.addArtefact': 'Add Artefact',
        'artefacts.add': 'Add',
        'artefacts.sortByTOGAF': 'Sort by TOGAF',
        'artefacts.sortByName': 'Sort by Name',
        'artefacts.sortByDate': 'Sort by Date',
        'artefacts.search': 'Search Artefact...',
        'artefacts.artefactName': 'Artefact Name',
        'artefacts.type': 'Type',
        'artefacts.status': 'Status',
        'artefacts.owner': 'Owner',
        'artefacts.actions': 'Actions',
        'artefacts.artefactType': 'Artefact Type',
        'artefacts.noResults': 'No Results Found',
        'artefacts.tryDifferent': 'Try a different search or filter',

        // Detail Panel
        'detail.details': 'Details',
        'detail.owner': 'Owner',
        'detail.department': 'Department',
        'detail.version': 'Version',
        'detail.updated': 'Updated',
        'detail.upstream': 'Upstream',
        'detail.downstream': 'Downstream',
        'detail.systemsSendingData': 'Systems sending data',
        'detail.systemsReceivingData': 'Systems receiving data',
        'detail.noUpstream': 'No upstream systems',
        'detail.noDownstream': 'No downstream systems',
        'detail.analyzeImpact': 'Analyze Impact',
        'detail.close': 'Close',

        // Table Headers
        'table.name': 'Name',
        'table.description': 'Description',
        'table.type': 'Type',
        'table.status': 'Status',
        'table.owner': 'Owner',
        'table.department': 'Department',
        'table.artefacts': 'Artefacts',
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
