/**
 * Department Templates
 * Pre-defined templates for common organizational structures.
 * Used by CreateDepartmentModal for quick setup.
 */

export interface DepartmentTemplate {
    name: string;
    description?: string;
    fields: {
        name: string;
        code: string;
        description: string;
    };
}

export const departmentTemplates: DepartmentTemplate[] = [
    {
        name: 'กอง (Division)',
        description: 'หน่วยงานระดับกอง',
        fields: {
            name: 'กองบริการห้องปฏิบัติการ',
            code: 'LAB',
            description: 'หน่วยงานรับผิดชอบด้านห้องปฏิบัติการและการวิเคราะห์ตัวอย่าง',
        },
    },
    {
        name: 'กรม (Department)',
        description: 'หน่วยงานระดับกรม',
        fields: {
            name: 'กรมวิทยาศาสตร์บริการ',
            code: 'DSS',
            description: 'หน่วยงานหลักด้านวิทยาศาสตร์และบริการทางวิชาการ',
        },
    },
    {
        name: 'ฝ่าย (Section)',
        description: 'หน่วยงานระดับฝ่าย',
        fields: {
            name: 'ฝ่ายสารสนเทศ',
            code: 'IT',
            description: 'หน่วยงานรับผิดชอบด้านเทคโนโลยีสารสนเทศและการพัฒนาระบบ',
        },
    },
    {
        name: 'ศูนย์ (Center)',
        description: 'ศูนย์เฉพาะทาง',
        fields: {
            name: 'ศูนย์วิทยาศาสตร์การแพทย์',
            code: 'MED',
            description: 'ศูนย์รับผิดชอบงานด้านวิทยาศาสตร์การแพทย์และห้องปฏิบัติการ',
        },
    },
    {
        name: 'สำนัก (Office)',
        description: 'สำนักหรือสำนักงาน',
        fields: {
            name: 'สำนักนโยบายและแผน',
            code: 'POL',
            description: 'หน่วยงานด้านการวางแผนและนโยบายองค์กร',
        },
    },
    {
        name: 'กลุ่มงาน (Work Unit)',
        description: 'กลุ่มงานย่อย',
        fields: {
            name: 'กลุ่มงานพัฒนาระบบ',
            code: 'DEV',
            description: 'กลุ่มงานรับผิดชอบการพัฒนาและบำรุงรักษาระบบสารสนเทศ',
        },
    },
];
