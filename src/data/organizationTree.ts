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
    owner?: string; // ผู้รับผิดชอบ
    status?: 'active' | 'draft' | 'archived' | 'planned';
}

export const organizationTree: TreeNode = {
    id: 'org-dss',
    name: 'Department of Science Service',
    nameTh: 'กรมวิทยาศาสตร์บริการ',
    type: 'organization',
    owner: 'อธิบดีกรม',
    status: 'active',
    children: [
        {
            id: 'div-chem',
            name: 'Chemistry Division',
            nameTh: 'กองเคมีภัณฑ์และผลิตภัณฑ์อุปโภค',
            type: 'division',
            owner: 'ดร.สมชาย วิทยาการ',
            status: 'active',
            children: [
                {
                    id: 'dept-water',
                    name: 'Water Quality Testing',
                    nameTh: 'ฝ่ายทดสอบคุณภาพน้ำ',
                    type: 'department',
                    owner: 'คุณวิภา สุขใจ',
                    status: 'active',
                    children: [
                        {
                            id: 'role-scientist',
                            name: 'Scientist',
                            nameTh: 'นักวิทยาศาสตร์',
                            type: 'role',
                            children: [
                                {
                                    id: 'actor-somchai',
                                    name: 'Somchai Jaidee',
                                    nameTh: 'นายสมชาย ใจดี',
                                    type: 'actor',
                                },
                                {
                                    id: 'process-receive',
                                    name: 'Receive Sample',
                                    nameTh: 'รับตัวอย่างทดสอบ',
                                    type: 'process',
                                    artefactId: 'ba-001',
                                    owner: 'นายสมชาย ใจดี',
                                    status: 'active',
                                },
                                {
                                    id: 'process-analyze',
                                    name: 'Analyze Water Results',
                                    nameTh: 'วิเคราะห์ผลน้ำ',
                                    type: 'process',
                                    artefactId: 'ba-002',
                                },
                            ],
                        },
                        {
                            id: 'role-head',
                            name: 'Department Head',
                            nameTh: 'หัวหน้าฝ่าย',
                            type: 'role',
                            children: [
                                {
                                    id: 'process-review',
                                    name: 'Review Results',
                                    nameTh: 'ตรวจสอบผล',
                                    type: 'process',
                                },
                                {
                                    id: 'process-approve',
                                    name: 'Approve Report',
                                    nameTh: 'อนุมัติรายงาน',
                                    type: 'process',
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
            children: [
                {
                    id: 'dept-lab',
                    name: 'Laboratory Services',
                    nameTh: 'ฝ่ายบริการห้องปฏิบัติการ',
                    type: 'department',
                    children: [
                        {
                            id: 'app-lims',
                            name: 'LIMS Application',
                            nameTh: 'ระบบ LIMS',
                            type: 'application',
                            artefactId: 'app-001',
                            owner: 'คุณประสิทธิ์ เทคโน',
                            status: 'active',
                        },
                        {
                            id: 'data-samples',
                            name: 'Sample Database',
                            nameTh: 'ฐานข้อมูลตัวอย่าง',
                            type: 'data',
                            artefactId: 'data-001',
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
            children: [
                {
                    id: 'dept-infra',
                    name: 'Infrastructure',
                    nameTh: 'ฝ่ายโครงสร้างพื้นฐาน',
                    type: 'department',
                    children: [
                        {
                            id: 'tech-server',
                            name: 'Server Infrastructure',
                            nameTh: 'เซิร์ฟเวอร์',
                            type: 'application',
                            artefactId: 'tech-001',
                        },
                    ],
                },
                {
                    id: 'dept-dev',
                    name: 'Development',
                    nameTh: 'ฝ่ายพัฒนาระบบ',
                    type: 'department',
                    children: [
                        {
                            id: 'app-elab',
                            name: 'E-Lab Request',
                            nameTh: 'ระบบขอใช้บริการห้องปฏิบัติการ',
                            type: 'application',
                            artefactId: 'app-002',
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
