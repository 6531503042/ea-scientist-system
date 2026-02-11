/**
 * prisma/seed.ts
 * Comprehensive seed for the EA System.
 *
 * Run:
 *   bunx prisma db seed          (via prisma.config.ts)
 *   bun prisma/seed.ts           (direct)
 *
 * Idempotent – safe to run multiple times on the same database.
 */

import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

// ── Bootstrap Prisma ────────────────────────────────────────────────────────
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is not set – cannot seed.');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Hash password with bcrypt (cost 10) */
const hashPassword = (plain: string) => bcrypt.hashSync(plain, 10);

/** Find-or-create pattern for entities without a scalar unique field */
async function findOrCreate<T extends { id: number }>(
    findFn: () => Promise<T | null>,
    createFn: () => Promise<T>,
): Promise<T> {
    const existing = await findFn();
    if (existing) return existing;
    return createFn();
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
    console.log('🌱 Start seeding …');

    // =====================================================================
    // 1. Departments (กรมวิทยาศาสตร์บริการ organization structure)
    // =====================================================================
    console.log('  → Departments');

    const deptData = [
        { shortName: 'OFM', fullName: 'สำนักงานเลขานุการกรม' },
        { shortName: 'IT', fullName: 'ศูนย์เทคโนโลยีสารสนเทศ' },
        { shortName: 'STD', fullName: 'กองมาตรฐาน' },
        { shortName: 'ANL', fullName: 'กองตรวจวิเคราะห์' },
        { shortName: 'SVC', fullName: 'กองบริการ' },
        { shortName: 'POL', fullName: 'กองนโยบายและแผน' },
        { shortName: 'MED', fullName: 'ศูนย์วิทยาศาสตร์การแพทย์' },
        { shortName: 'SEC', fullName: 'ศูนย์รักษาความปลอดภัยข้อมูล' },
        { shortName: 'DS', fullName: 'กองข้อมูลและสถิติ' },
    ];

    const departments: Record<string, Awaited<ReturnType<typeof prisma.department.create>>> = {};

    for (const d of deptData) {
        departments[d.shortName] = await findOrCreate(
            () => prisma.department.findFirst({ where: { shortName: d.shortName } }),
            () => prisma.department.create({ data: { shortName: d.shortName, fullName: d.fullName, isActive: true } }),
        );
    }

    // =====================================================================
    // 2. Permissions
    // =====================================================================
    console.log('  → Permissions');

    const permissionNames = [
        'artefacts:read',
        'artefacts:write',
        'artefacts:delete',
        'graph:read',
        'graph:write',
        'users:read',
        'users:write',
        'audit:read',
        'settings:read',
        'settings:write',
        'departments:read',
        'departments:write',
        'roles:read',
        'roles:write',
    ];

    const permissions: Record<string, number> = {};
    for (const name of permissionNames) {
        const perm = await prisma.permission.upsert({
            where: { name },
            update: {},
            create: { name, description: `Permission: ${name}` },
        });
        permissions[name] = perm.id;
    }

    // =====================================================================
    // 3. Roles
    // =====================================================================
    console.log('  → Roles');

    const roleAdmin = await prisma.role.upsert({
        where: { roleName: 'admin' },
        update: {},
        create: { roleName: 'admin', description: 'System Administrator - Full access' },
    });

    const roleArchitect = await prisma.role.upsert({
        where: { roleName: 'architect' },
        update: {},
        create: { roleName: 'architect', description: 'Enterprise Architect - CRUD artefacts & graph' },
    });

    const roleExecutive = await prisma.role.upsert({
        where: { roleName: 'executive' },
        update: {},
        create: { roleName: 'executive', description: 'Executive - Dashboard & reports viewer' },
    });

    const roleUser = await prisma.role.upsert({
        where: { roleName: 'user' },
        update: {},
        create: { roleName: 'user', description: 'General User - Read-only access' },
    });

    const roleViewer = await prisma.role.upsert({
        where: { roleName: 'viewer' },
        update: {},
        create: { roleName: 'viewer', description: 'Viewer - Read-only, limited scope' },
    });

    // ── Assign permissions ──────────────────────────────────────────────
    // Admin → all permissions
    const allPerms = await prisma.permission.findMany();
    for (const perm of allPerms) {
        await prisma.rolePermission.upsert({
            where: { roleId_permissionId: { roleId: roleAdmin.id, permissionId: perm.id } },
            update: {},
            create: { roleId: roleAdmin.id, permissionId: perm.id },
        });
    }

    // Architect → all except user/role management
    const architectExcluded = ['users:write', 'roles:write', 'settings:write'];
    for (const perm of allPerms) {
        if (architectExcluded.includes(perm.name)) continue;
        await prisma.rolePermission.upsert({
            where: { roleId_permissionId: { roleId: roleArchitect.id, permissionId: perm.id } },
            update: {},
            create: { roleId: roleArchitect.id, permissionId: perm.id },
        });
    }

    // Executive → read permissions only
    const executivePerms = ['artefacts:read', 'graph:read', 'audit:read', 'settings:read', 'departments:read', 'roles:read', 'users:read'];
    for (const name of executivePerms) {
        if (!permissions[name]) continue;
        await prisma.rolePermission.upsert({
            where: { roleId_permissionId: { roleId: roleExecutive.id, permissionId: permissions[name] } },
            update: {},
            create: { roleId: roleExecutive.id, permissionId: permissions[name] },
        });
    }

    // =====================================================================
    // 4. Users (password: "password123" for all test accounts)
    // =====================================================================
    console.log('  → Users');

    const hashedPw = hashPassword('password123');

    const usersData = [
        { email: 'admin@dss.go.th', username: 'admin', firstName: 'Admin', lastName: 'System', roleId: roleAdmin.id, deptKey: 'IT' },
        { email: 'somchai@dss.go.th', username: 'somchai', firstName: 'สมชาย', lastName: 'วิทยาการ', roleId: roleArchitect.id, deptKey: 'ANL' },
        { email: 'wipa@dss.go.th', username: 'wipa', firstName: 'วิภา', lastName: 'สุขใจ', roleId: roleArchitect.id, deptKey: 'IT' },
        { email: 'prasit@dss.go.th', username: 'prasit', firstName: 'ประสิทธิ์', lastName: 'เทคโน', roleId: roleArchitect.id, deptKey: 'IT' },
        { email: 'suree@dss.go.th', username: 'suree', firstName: 'สุรีย์', lastName: 'ดิจิทัล', roleId: roleUser.id, deptKey: 'IT' },
        { email: 'manas@dss.go.th', username: 'manas', firstName: 'มนัส', lastName: 'ข้อมูล', roleId: roleArchitect.id, deptKey: 'DS' },
        { email: 'napa@dss.go.th', username: 'napa', firstName: 'นภา', lastName: 'บริการ', roleId: roleUser.id, deptKey: 'SVC' },
        { email: 'thep@dss.go.th', username: 'thep', firstName: 'เทพ', lastName: 'โครงสร้าง', roleId: roleArchitect.id, deptKey: 'IT' },
        { email: 'safe@dss.go.th', username: 'safe', firstName: 'ปลอดภัย', lastName: 'รักษา', roleId: roleArchitect.id, deptKey: 'SEC' },
        { email: 'apiwat@dss.go.th', username: 'apiwat', firstName: 'อภิวัฒน์', lastName: 'เชื่อมต่อ', roleId: roleUser.id, deptKey: 'POL' },
        { email: 'director@dss.go.th', username: 'director', firstName: 'ดร.สมศักดิ์', lastName: 'ผู้บริหาร', roleId: roleExecutive.id, deptKey: 'OFM' },
    ];

    const users: Record<string, Awaited<ReturnType<typeof prisma.user.create>>> = {};

    for (const u of usersData) {
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: {
                email: u.email,
                username: u.username,
                password: hashedPw,
                firstName: u.firstName,
                lastName: u.lastName,
                roleId: u.roleId,
                departmentId: departments[u.deptKey]?.id,
                isActive: true,
            },
        });
        users[u.username] = user;
    }

    // =====================================================================
    // 5. Architecture Layers (TOGAF)
    // =====================================================================
    console.log('  → Architecture Layers');

    const layerData = [
        { en: 'Business Architecture', th: 'สถาปัตยกรรมธุรกิจ' },
        { en: 'Application Architecture', th: 'สถาปัตยกรรมแอปพลิเคชัน' },
        { en: 'Data Architecture', th: 'สถาปัตยกรรมข้อมูล' },
        { en: 'Technology Architecture', th: 'สถาปัตยกรรมเทคโนโลยี' },
        { en: 'Security Architecture', th: 'สถาปัตยกรรมความมั่นคงปลอดภัย' },
        { en: 'Integration Architecture', th: 'สถาปัตยกรรมการเชื่อมโยง' },
    ];

    const layers: Record<string, Awaited<ReturnType<typeof prisma.architectureLayer.create>>> = {};

    for (const l of layerData) {
        const layer = await findOrCreate(
            () => prisma.architectureLayer.findFirst({
                where: { layerName: { equals: l } },
            }),
            () => prisma.architectureLayer.create({
                data: { layerName: l, description: { en: `${l.en} layer`, th: `${l.th}` }, isActive: true },
            }),
        );
        layers[l.en] = layer;
    }

    // =====================================================================
    // 6. Artifact Categories (per layer)
    // =====================================================================
    console.log('  → Artifact Categories');

    const categoryData = [
        { layerEn: 'Business Architecture', en: 'Business Process', th: 'กระบวนการธุรกิจ' },
        { layerEn: 'Business Architecture', en: 'Business Capability', th: 'ความสามารถทางธุรกิจ' },
        { layerEn: 'Application Architecture', en: 'Application', th: 'แอปพลิเคชัน' },
        { layerEn: 'Application Architecture', en: 'Application Service', th: 'บริการแอปพลิเคชัน' },
        { layerEn: 'Data Architecture', en: 'Data Entity', th: 'เอนทิตีข้อมูล' },
        { layerEn: 'Data Architecture', en: 'Data Store', th: 'ที่เก็บข้อมูล' },
        { layerEn: 'Technology Architecture', en: 'Infrastructure', th: 'โครงสร้างพื้นฐาน' },
        { layerEn: 'Technology Architecture', en: 'Platform', th: 'แพลตฟอร์ม' },
        { layerEn: 'Security Architecture', en: 'Security Control', th: 'มาตรการควบคุมความปลอดภัย' },
        { layerEn: 'Security Architecture', en: 'Identity & Access', th: 'การยืนยันตัวตนและสิทธิ์เข้าถึง' },
        { layerEn: 'Integration Architecture', en: 'API / Interface', th: 'API / อินเตอร์เฟส' },
        { layerEn: 'Integration Architecture', en: 'Integration Pattern', th: 'รูปแบบการเชื่อมโยง' },
    ];

    const categories: Record<string, Awaited<ReturnType<typeof prisma.artefactCategory.create>>> = {};

    for (const c of categoryData) {
        const layer = layers[c.layerEn];
        if (!layer) continue;

        const catName = { en: c.en, th: c.th };
        const cat = await findOrCreate(
            () => prisma.artefactCategory.findFirst({
                where: {
                    architectureLayerId: layer.id,
                    categoryName: { equals: catName },
                },
            }),
            () => prisma.artefactCategory.create({
                data: {
                    architectureLayerId: layer.id,
                    categoryName: catName,
                    description: { en: c.en, th: c.th },
                    isActive: true,
                },
            }),
        );
        categories[c.en] = cat;
    }

    // =====================================================================
    // 7. Relationship Types
    // =====================================================================
    console.log('  → Relationship Types');

    const relTypeData = [
        { key: 'uses', name: { en: 'Uses', th: 'ใช้งาน' } },
        { key: 'manages', name: { en: 'Manages', th: 'จัดการ' } },
        { key: 'depends_on', name: { en: 'Depends On', th: 'พึ่งพา' } },
        { key: 'integrates_with', name: { en: 'Integrates With', th: 'เชื่อมต่อกับ' } },
        { key: 'authenticates', name: { en: 'Authenticates', th: 'ยืนยันตัวตน' } },
        { key: 'reads', name: { en: 'Reads', th: 'อ่านข้อมูล' } },
        { key: 'writes', name: { en: 'Writes', th: 'เขียนข้อมูล' } },
        { key: 'hosts', name: { en: 'Hosts', th: 'โฮสต์' } },
    ];

    const relTypes: Record<string, number> = {};
    for (const rt of relTypeData) {
        const r = await prisma.relationshipType.upsert({
            where: { relationshipKey: rt.key },
            update: {},
            create: {
                relationshipKey: rt.key,
                relationshipName: rt.name,
                allowedPairs: [],
                isActive: true,
            },
        });
        relTypes[rt.key] = r.id;
    }

    // =====================================================================
    // 8. Artefacts (sample data matching DSS context)
    // =====================================================================
    console.log('  → Artefacts');

    const artefactData = [
        // Business
        {
            nameEn: 'Water Quality Testing Process', nameTh: 'กระบวนการตรวจคุณภาพน้ำ',
            descEn: 'Core business process for water quality analysis including sample collection, testing, and reporting',
            descTh: 'กระบวนการหลักในการวิเคราะห์คุณภาพน้ำ รวมถึงการเก็บตัวอย่าง การทดสอบ และการรายงานผล',
            category: 'Business Process', owner: 'somchai', dept: 'ANL',
        },
        {
            nameEn: 'Lab Sample Management', nameTh: 'การจัดการตัวอย่างห้องปฏิบัติการ',
            descEn: 'End-to-end lab sample lifecycle management from reception to disposal',
            descTh: 'การจัดการวงจรชีวิตตัวอย่างห้องปฏิบัติการตั้งแต่รับเข้าจนถึงทำลาย',
            category: 'Business Process', owner: undefined, dept: 'MED',
        },
        // Application
        {
            nameEn: 'LIMS', nameTh: 'ระบบจัดการข้อมูลห้องปฏิบัติการ',
            descEn: 'Laboratory Information Management System – core application for managing lab workflows, sample tracking, and test results',
            descTh: 'ระบบจัดการข้อมูลห้องปฏิบัติการ สำหรับจัดการ workflow ติดตามตัวอย่าง และผลทดสอบ',
            category: 'Application', owner: 'prasit', dept: 'IT',
        },
        {
            nameEn: 'E-Lab Request Portal', nameTh: 'ระบบขอใช้บริการห้องปฏิบัติการออนไลน์',
            descEn: 'Public-facing web portal for requesting laboratory services electronically',
            descTh: 'เว็บพอร์ทัลสำหรับประชาชนในการขอใช้บริการห้องปฏิบัติการทางอิเล็กทรอนิกส์',
            category: 'Application', owner: undefined, dept: 'IT',
        },
        // Data
        {
            nameEn: 'Test Results Dataset', nameTh: 'ชุดข้อมูลผลการทดสอบ',
            descEn: 'Master dataset containing all laboratory test results with historical data',
            descTh: 'ชุดข้อมูลหลักที่เก็บผลการทดสอบทั้งหมดของห้องปฏิบัติการพร้อมข้อมูลย้อนหลัง',
            category: 'Data Entity', owner: 'manas', dept: 'DS',
        },
        {
            nameEn: 'Customer Registry', nameTh: 'ทะเบียนผู้รับบริการ',
            descEn: 'Registry of all service recipients and their interaction history',
            descTh: 'ทะเบียนผู้รับบริการทั้งหมดและประวัติการใช้บริการ',
            category: 'Data Entity', owner: undefined, dept: 'SVC',
        },
        // Technology
        {
            nameEn: 'Central Database Server', nameTh: 'เซิร์ฟเวอร์ฐานข้อมูลกลาง',
            descEn: 'Primary PostgreSQL database server hosting all transactional data',
            descTh: 'เซิร์ฟเวอร์ PostgreSQL หลักสำหรับเก็บข้อมูลธุรกรรมทั้งหมด',
            category: 'Infrastructure', owner: 'thep', dept: 'IT',
        },
        {
            nameEn: 'DSS Cloud Platform', nameTh: 'แพลตฟอร์มคลาวด์กรมวิทยาศาสตร์บริการ',
            descEn: 'AWS-based cloud platform hosting web applications and APIs (EC2, RDS, S3, CloudFront)',
            descTh: 'แพลตฟอร์มคลาวด์บน AWS สำหรับโฮสต์เว็บแอปพลิเคชันและ API',
            category: 'Platform', owner: 'thep', dept: 'IT',
        },
        // Security
        {
            nameEn: 'LDAP Authentication', nameTh: 'ระบบยืนยันตัวตน LDAP',
            descEn: 'Centralized LDAP-based authentication and authorization service',
            descTh: 'ระบบยืนยันตัวตนและกำหนดสิทธิ์แบบรวมศูนย์ผ่าน LDAP',
            category: 'Identity & Access', owner: 'safe', dept: 'SEC',
        },
        // Integration
        {
            nameEn: 'GovConnect API Gateway', nameTh: 'API เชื่อมต่อหน่วยงานรัฐ',
            descEn: 'Integration gateway for exchanging data with other government agencies',
            descTh: 'API Gateway สำหรับแลกเปลี่ยนข้อมูลกับหน่วยงานราชการอื่น',
            category: 'API / Interface', owner: 'apiwat', dept: 'POL',
        },
    ];

    const artefacts: Record<string, Awaited<ReturnType<typeof prisma.artefact.create>>> = {};

    for (const a of artefactData) {
        const cat = categories[a.category];
        if (!cat) {
            console.warn(`    ⚠ Category "${a.category}" not found – skipping artefact "${a.nameEn}"`);
            continue;
        }

        const artefactName = { en: a.nameEn, th: a.nameTh };
        const art = await findOrCreate(
            () => prisma.artefact.findFirst({
                where: {
                    categoryId: cat.id,
                    artefactName: { equals: artefactName },
                },
            }),
            () => prisma.artefact.create({
                data: {
                    artefactName,
                    description: { en: a.descEn, th: a.descTh },
                    categoryId: cat.id,
                    architectureLayerId: cat.architectureLayerId,
                    responsibleById: a.owner ? users[a.owner]?.id : undefined,
                    ownerDepartmentId: departments[a.dept]?.id,
                    lifecycleStatus: 'ACTIVE',
                    version: 1,
                },
            }),
        );
        artefacts[a.nameEn] = art;
    }

    // =====================================================================
    // 9. Relationships between artefacts
    // =====================================================================
    console.log('  → Relationships');

    const relData = [
        // Business → Application (uses)
        { source: 'Water Quality Testing Process', target: 'LIMS', type: 'uses' },
        { source: 'Lab Sample Management', target: 'LIMS', type: 'uses' },
        // Business → Data (manages)
        { source: 'Water Quality Testing Process', target: 'Test Results Dataset', type: 'manages' },
        // Application → Technology (depends_on)
        { source: 'LIMS', target: 'Central Database Server', type: 'depends_on' },
        { source: 'E-Lab Request Portal', target: 'Central Database Server', type: 'depends_on' },
        { source: 'LIMS', target: 'DSS Cloud Platform', type: 'hosts' },
        // Application → Security (authenticates)
        { source: 'LIMS', target: 'LDAP Authentication', type: 'authenticates' },
        { source: 'E-Lab Request Portal', target: 'LDAP Authentication', type: 'authenticates' },
        // Application → Application (integrates)
        { source: 'E-Lab Request Portal', target: 'LIMS', type: 'integrates_with' },
        { source: 'GovConnect API Gateway', target: 'LIMS', type: 'integrates_with' },
        // Application → Data (reads/writes)
        { source: 'LIMS', target: 'Test Results Dataset', type: 'writes' },
        { source: 'E-Lab Request Portal', target: 'Customer Registry', type: 'reads' },
        // Data → Technology (depends_on)
        { source: 'Test Results Dataset', target: 'Central Database Server', type: 'depends_on' },
        { source: 'Customer Registry', target: 'Central Database Server', type: 'depends_on' },
    ];

    for (const r of relData) {
        const source = artefacts[r.source];
        const target = artefacts[r.target];
        const typeId = relTypes[r.type];
        if (!source || !target || !typeId) continue;

        await prisma.relationship.upsert({
            where: {
                sourceArtefactId_targetArtefactId_relationshipTypeId: {
                    sourceArtefactId: source.id,
                    targetArtefactId: target.id,
                    relationshipTypeId: typeId,
                },
            },
            update: {},
            create: {
                sourceArtefactId: source.id,
                targetArtefactId: target.id,
                relationshipTypeId: typeId,
            },
        });
    }

    // =====================================================================
    // 10. Artefact Versions (initial snapshots)
    // =====================================================================
    console.log('  → Artefact Versions');

    for (const [, art] of Object.entries(artefacts)) {
        await findOrCreate(
            () => prisma.artefactVersion.findFirst({ where: { artefactId: art.id, versionNumber: 1 } }),
            () => prisma.artefactVersion.create({
                data: {
                    artefactId: art.id,
                    versionNumber: 1,
                    changeSummary: { en: 'Initial creation', th: 'สร้างครั้งแรก' },
                    snapshot: art,
                },
            }),
        );
    }

    // =====================================================================
    // 11. Sample Audit Logs
    // =====================================================================
    console.log('  → Audit Logs');

    const auditSamples = [
        { user: 'prasit', action: 'CREATE', entityType: 'artefact', label: 'LIMS', summary: 'สร้าง artefact LIMS' },
        { user: 'somchai', action: 'UPDATE', entityType: 'artefact', label: 'Water Quality Testing Process', summary: 'อัปเดตรายละเอียดกระบวนการ' },
        { user: 'admin', action: 'LOGIN', entityType: 'user', label: 'Admin System', summary: 'เข้าสู่ระบบ' },
        { user: 'thep', action: 'CREATE', entityType: 'artefact', label: 'Central Database Server', summary: 'สร้าง artefact เซิร์ฟเวอร์ฐานข้อมูลกลาง' },
    ];

    for (const log of auditSamples) {
        const user = users[log.user];
        if (!user) continue;

        // Only create if no similar audit log exists (avoid duplicates)
        const existing = await prisma.auditLog.findFirst({
            where: { userId: user.id, action: log.action, entityLabel: log.label },
        });
        if (!existing) {
            await prisma.auditLog.create({
                data: {
                    userId: user.id,
                    action: log.action,
                    entityType: log.entityType,
                    entityLabel: log.label,
                    summary: log.summary,
                    ipAddress: '127.0.0.1',
                },
            });
        }
    }

    console.log('✅ Seeding complete!');
    console.log('');
    console.log('Test accounts (password: password123):');
    console.log('  admin@dss.go.th       → Admin');
    console.log('  somchai@dss.go.th     → Architect');
    console.log('  director@dss.go.th    → Executive');
    console.log('  suree@dss.go.th       → User');
}

// ── Run ─────────────────────────────────────────────────────────────────────
main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
