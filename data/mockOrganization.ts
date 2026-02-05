// Mock Organization Data for Tree View
// โครงสร้างองค์กรจำลองของกรมวิทยาศาสตร์บริการ

export interface TreeNode {
    id: string;
    name: string;
    nameTh: string;
    type: 'organization' | 'division' | 'department' | 'role' | 'actor' | 'process' | 'application' | 'data';
    icon?: string;
    children?: TreeNode[];
    artefactId?: string; // Link to existing artefact
    owner?: string;
    status?: 'active' | 'draft' | 'archived' | 'planned';
    description?: string;
}

export const organizationTree: TreeNode = {
    id: 'org-dss',
    name: 'Department of Science Service',
    nameTh: 'กรมวิทยาศาสตร์บริการ',
    type: 'organization',
    owner: 'Director General',
    status: 'active',
    description: 'Leading agency in science and technology services',
    children: [
        {
            id: 'div-chem',
            name: 'Chemistry Division',
            nameTh: 'กองเคมีภัณฑ์และผลิตภัณฑ์อุปโภค',
            type: 'division',
            owner: 'Dr. Suporn',
            status: 'active',
            description: 'Chemical testing and standards',
            children: [
                {
                    id: 'dept-water',
                    name: 'Water Quality Testing',
                    nameTh: 'ฝ่ายทดสอบคุณภาพน้ำ',
                    type: 'department',
                    owner: 'Ms. Ratana',
                    status: 'active',
                    children: [
                        {
                            id: 'role-scientist',
                            name: 'Scientist',
                            nameTh: 'นักวิทยาศาสตร์',
                            type: 'role',
                            owner: '-',
                            status: 'active',
                            children: [
                                {
                                    id: 'actor-somchai',
                                    name: 'Somchai Jaidee',
                                    nameTh: 'นายสมชาย ใจดี',
                                    type: 'actor',
                                    owner: '-',
                                    status: 'active',
                                },
                                {
                                    id: 'process-receive',
                                    name: 'Receive Sample',
                                    nameTh: 'รับตัวอย่างทดสอบ',
                                    type: 'process',
                                    artefactId: 'ba-001',
                                    owner: 'Somchai Jaidee',
                                    status: 'active',
                                },
                                {
                                    id: 'process-analyze',
                                    name: 'Analyze Water Results',
                                    nameTh: 'วิเคราะห์ผลน้ำ',
                                    type: 'process',
                                    artefactId: 'ba-002',
                                    owner: 'Somchai Jaidee',
                                    status: 'active',
                                },
                            ],
                        },
                        {
                            id: 'role-head',
                            name: 'Department Head',
                            nameTh: 'หัวหน้าฝ่าย',
                            type: 'role',
                            owner: '-',
                            status: 'active',
                            children: [
                                {
                                    id: 'process-review',
                                    name: 'Review Results',
                                    nameTh: 'ตรวจสอบผล',
                                    type: 'process',
                                    owner: 'Ms. Ratana',
                                    status: 'active',
                                },
                                {
                                    id: 'process-approve',
                                    name: 'Approve Report',
                                    nameTh: 'อนุมัติรายงาน',
                                    type: 'process',
                                    owner: 'Ms. Ratana',
                                    status: 'active',
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 'dept-food',
                    name: 'Food Safety Testing',
                    nameTh: 'ฝ่ายทดสอบความปลอดภัยอาหาร',
                    type: 'department',
                    owner: 'Dr. Prasit',
                    status: 'active',
                    children: [
                        {
                            id: 'role-food-scientist',
                            name: 'Food Scientist',
                            nameTh: 'นักวิทยาศาสตร์อาหาร',
                            type: 'role',
                            children: [
                                {
                                    id: 'process-food-sample',
                                    name: 'Food Sample Collection',
                                    nameTh: 'เก็บตัวอย่างอาหาร',
                                    type: 'process',
                                    owner: 'Staff',
                                    status: 'active',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: 'div-bio',
            name: 'Biological Science Division',
            nameTh: 'กองวิทยาศาสตร์ชีวภาพ',
            type: 'division',
            owner: 'Dr. Nipa',
            status: 'active',
            children: [
                {
                    id: 'dept-lab',
                    name: 'Laboratory Services',
                    nameTh: 'ฝ่ายบริการห้องปฏิบัติการ',
                    type: 'department',
                    owner: 'Mr. Somsak',
                    status: 'active',
                    children: [
                        {
                            id: 'app-lims',
                            name: 'LIMS Application',
                            nameTh: 'ระบบ LIMS',
                            type: 'application',
                            artefactId: 'app-001',
                            owner: 'IT Center',
                            status: 'active',
                            description: 'Laboratory Information Management System',
                        },
                        {
                            id: 'data-samples',
                            name: 'Sample Database',
                            nameTh: 'ฐานข้อมูลตัวอย่าง',
                            type: 'data',
                            artefactId: 'data-001',
                            owner: 'IT Center',
                            status: 'active',
                        },
                    ],
                },
            ],
        },
        {
            id: 'div-it',
            name: 'Information Technology Center',
            nameTh: 'ศูนย์เทคโนโลยีสารสนเทศ',
            type: 'division',
            owner: 'Mr. Wichai',
            status: 'active',
            description: 'Tech support and development',
            children: [
                {
                    id: 'dept-infra',
                    name: 'Infrastructure',
                    nameTh: 'ฝ่ายโครงสร้างพื้นฐาน',
                    type: 'department',
                    owner: 'Mr. Bob',
                    status: 'active',
                    children: [
                        {
                            id: 'tech-server',
                            name: 'Server Infrastructure',
                            nameTh: 'เซิร์ฟเวอร์',
                            type: 'application',
                            artefactId: 'tech-001',
                            owner: 'Mr. Bob',
                            status: 'active',
                            description: 'Main production servers',
                        },
                    ],
                },
                {
                    id: 'dept-dev',
                    name: 'Development',
                    nameTh: 'ฝ่ายพัฒนาระบบ',
                    type: 'department',
                    owner: 'Ms. Alice',
                    status: 'active',
                    children: [
                        {
                            id: 'app-elab',
                            name: 'E-Lab Request',
                            nameTh: 'ระบบขอใช้บริการห้องปฏิบัติการ',
                            type: 'application',
                            artefactId: 'app-002',
                            owner: 'Ms. Alice',
                            status: 'planned',
                        },
                    ],
                },
            ],
        },
    ],
};

// Icon mapping for tree nodes
export const treeNodeIcons: Record<TreeNode['type'], string> = {
    organization: '🏢',
    division: '📂',
    department: '📁',
    role: '👤',
    actor: '🧑',
    process: '📜',
    application: '💻',
    data: '🗄️',
};

// Color mapping for tree nodes
export const treeNodeColors: Record<TreeNode['type'], string> = {
    organization: '#8B5CF6',
    division: '#3B82F6',
    department: '#10B981',
    role: '#F59E0B',
    actor: '#EC4899',
    process: '#6366F1',
    application: '#0EA5E9',
    data: '#14B8A6',
};
