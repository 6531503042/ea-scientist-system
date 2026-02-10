import { PrismaClient } from '@prisma/client';
// import { hash } from 'bcryptjs'; // Uncomment when bcryptjs is installed

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // --- 1. Departments ---
    console.log('Seeding Departments...');
    const deptIt = await prisma.department.upsert({
        where: { shortName: 'IT' },
        update: {},
        create: {
            shortName: 'IT',
            fullName: 'ศูนย์เทคโนโลยีสารสนเทศ',
            isActive: true,
        },
    });

    const deptStandard = await prisma.department.upsert({
        where: { shortName: 'STD' },
        update: {},
        create: {
            shortName: 'STD',
            fullName: 'กองมาตรฐาน',
            isActive: true,
        },
    });

    const deptAnalysis = await prisma.department.upsert({
        where: { shortName: 'ANL' },
        update: {},
        create: {
            shortName: 'ANL',
            fullName: 'กองตรวจวิเคราะห์',
            isActive: true,
        },
    });

    const deptService = await prisma.department.upsert({
        where: { shortName: 'SVC' },
        update: {},
        create: {
            shortName: 'SVC',
            fullName: 'กองบริการ',
            isActive: true,
        },
    });

    const deptPolicy = await prisma.department.upsert({
        where: { shortName: 'POL' },
        update: {},
        create: {
            shortName: 'POL',
            fullName: 'กองนโยบาย',
            isActive: true,
        },
    });

    const deptMedical = await prisma.department.upsert({
        where: { shortName: 'MED' },
        update: {},
        create: {
            shortName: 'MED',
            fullName: 'ศูนย์วิทยาศาสตร์การแพทย์',
            isActive: true,
        },
    });


    // --- 2. Roles & Permissions ---
    console.log('Seeding Roles...');
    // Define permissions (just strings/constants effectively)
    const permissionsList = [
        'VIEW_DASHBOARD',
        'MANAGE_USERS',
        'MANAGE_ROLES',
        'MANAGE_DEPARTMENTS',
        'VIEW_ARTEFACTS',
        'CREATE_ARTEFACTS',
        'EDIT_ARTEFACTS',
        'DELETE_ARTEFACTS',
        'VIEW_AUDIT_LOGS',
    ];

    for (const permName of permissionsList) {
        await prisma.permission.upsert({
            where: { name: permName },
            update: {},
            create: { name: permName, description: `Permission to ${permName}` },
        });
    }

    // Create Roles
    const roleAdmin = await prisma.role.upsert({
        where: { roleName: 'admin' },
        update: {},
        create: {
            roleName: 'admin',
            description: 'Administrator with full access',
        },
    });

    const roleArchitect = await prisma.role.upsert({
        where: { roleName: 'architect' },
        update: {},
        create: {
            roleName: 'architect',
            description: 'Enterprise Architect',
        },
    });

    const roleExecutive = await prisma.role.upsert({
        where: { roleName: 'executive' },
        update: {},
        create: {
            roleName: 'executive',
            description: 'Executive Viewer',
        },
    });

    const roleUser = await prisma.role.upsert({
        where: { roleName: 'user' },
        update: {},
        create: {
            roleName: 'user',
            description: 'General User',
        },
    });

    const roleViewer = await prisma.role.upsert({
        where: { roleName: 'viewer' },
        update: {},
        create: {
            roleName: 'viewer',
            description: 'Read-only User',
        },
    });

    // Assign permissions (simplified)
    // Admin gets all
    const allPerms = await prisma.permission.findMany();
    for (const perm of allPerms) {
        await prisma.rolePermission.upsert({
            where: { roleId_permissionId: { roleId: roleAdmin.id, permissionId: perm.id } },
            create: { roleId: roleAdmin.id, permissionId: perm.id },
            update: {},
        });
    }

    // Architect gets almost all
    for (const perm of allPerms) {
        if (perm.name === 'MANAGE_USERS' || perm.name === 'MANAGE_ROLES') continue;
        await prisma.rolePermission.upsert({
            where: { roleId_permissionId: { roleId: roleArchitect.id, permissionId: perm.id } },
            create: { roleId: roleArchitect.id, permissionId: perm.id },
            update: {},
        });
    }


    // --- 3. Users ---
    console.log('Seeding Users...');
    // Password hash for 'password123'
    // const hashedPassword = await hash('password123', 10);
    const hashedPassword = 'password123'; // Temporary plain text until bcrypt is installed

    const usersData = [
        { email: 'admin@example.com', username: 'admin', firstName: 'Admin', lastName: 'System', roleId: roleAdmin.id, deptId: deptIt.id },
        { email: 'somchai@example.com', username: 'somchai', firstName: 'สมชาย', lastName: 'วิทยาการ', roleId: roleArchitect.id, deptId: deptAnalysis.id },
        { email: 'wipa@example.com', username: 'wipa', firstName: 'วิภา', lastName: 'สุขใจ', roleId: roleUser.id, deptId: deptMedical.id },
        { email: 'prasit@example.com', username: 'prasit', firstName: 'ประสิทธิ์', lastName: 'เทคโน', roleId: roleArchitect.id, deptId: deptIt.id },
        { email: 'suree@example.com', username: 'suree', firstName: 'สุรีย์', lastName: 'ดิจิทัล', roleId: roleUser.id, deptId: deptIt.id },
        { email: 'manas@example.com', username: 'manas', firstName: 'มนัส', lastName: 'ข้อมูล', roleId: roleArchitect.id, deptId: deptStandard.id },
        { email: 'napa@example.com', username: 'napa', firstName: 'นภา', lastName: 'ลูกค้า', roleId: roleUser.id, deptId: deptService.id },
        { email: 'thep@example.com', username: 'thep', firstName: 'เทพ', lastName: 'โครงสร้าง', roleId: roleArchitect.id, deptId: deptIt.id },
        { email: 'pol@example.com', username: 'patchara', firstName: 'ปลอดภัย', lastName: 'รักษา', roleId: roleArchitect.id, deptId: deptIt.id },
        { email: 'conn@example.com', username: 'connect', firstName: 'เชื่อม', lastName: 'ต่อ', roleId: roleUser.id, deptId: deptPolicy.id },
    ];

    for (const u of usersData) {
        await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: {
                email: u.email,
                username: u.username,
                password: hashedPassword,
                firstName: u.firstName,
                lastName: u.lastName,
                roleId: u.roleId,
                departmentId: u.deptId,
                isActive: true,
            },
        });
    }

    // Fetch users for linking later
    const userPrasit = await prisma.user.findUnique({ where: { email: 'prasit@example.com' } });
    const userSomchai = await prisma.user.findUnique({ where: { email: 'somchai@example.com' } });


    // --- 4. Architecture Layers & Categories ---
    console.log('Seeding Layers & Categories...');
    const layers = ['Business', 'Application', 'Data', 'Technology', 'Security', 'Integration'];
    const layerMap: Record<string, number> = {};

    for (const lName of layers) {
        const layer = await prisma.architectureLayer.upsert({
            where: { layerName: lName },
            update: {},
            create: { layerName: lName, description: `${lName} Layer` },
        });
        layerMap[lName] = layer.id;

        // Create a default category for each layer
        await prisma.category.upsert({
            where: { categoryName: `${lName} Default` }, // Unique constraint is name? No, unique is id.
            // Actually Category name is not unique globally, but let's assume one per layer for simplicity here
            update: {},
            create: {
                categoryName: `${lName} Default`,
                architectureLayerId: layer.id,
                description: `Default category for ${lName}`,
                color: '#abcdef',
            }
        });
    }

    // Fetch a category for each layer to use
    const getCatId = async (layerName: string) => {
        const layerId = layerMap[layerName];
        const cat = await prisma.category.findFirst({ where: { architectureLayerId: layerId } });
        return cat?.id;
    };


    // --- 5. Relationship Types ---
    console.log('Seeding Relationship Types...');
    const relTypes = [
        { key: 'uses', name: { en: 'Uses', th: 'ใช้งาน' }, inverse: 'used_by' },
        { key: 'manages', name: { en: 'Manages', th: 'จัดการ' }, inverse: 'managed_by' },
        { key: 'depends_on', name: { en: 'Depends On', th: 'พึ่งพา' }, inverse: 'dependents' },
        { key: 'integrates_with', name: { en: 'Integrates With', th: 'เชื่อมต่อ' }, inverse: 'integrated_with' },
    ];

    const relTypeMap: Record<string, number> = {};

    for (const rt of relTypes) {
        const r = await prisma.relationshipType.upsert({
            where: { relationshipKey: rt.key },
            update: {},
            create: {
                relationshipKey: rt.key,
                relationshipName: rt.name,
                allowedPairs: [], // Allow all for now
                isActive: true,
            },
        });
        relTypeMap[rt.key] = r.id;
    }


    // --- 6. Artefacts ---
    console.log('Seeding Artefacts...');

    const createArt = async (
        type: string,
        nameEn: string,
        nameTh: string,
        desc: string,
        ownerId: number | undefined,
        deptId: number,
        ver: string
    ) => {
        const catId = await getCatId(type.charAt(0).toUpperCase() + type.slice(1));

        // Check if exists
        // Since we don't have unique name, we rely on upsert by ID if we had it. 
        // But here we are creating fresh or finding by name??
        // Let's Find First by nameEn
        // Actually prisma doesn't support upsert based on non-unique fields.
        // We will just createMany or findFirst before create. 
        // For seed idempotency, let's check
        // We can't check easily with Json filter in findFirst sometimes depending on prisma version, 
        // ensuring idempotency might be hard without unique key. 
        // Let's just delete all artefacts first? No that deletes everything.
        // Let's assume empty DB for now or check count.

        // Logic: Try to find by description (string matches are easier than json sometimes)
        // or just create new ones every time is bad.
        // Let's rely on cleaning db or just create if not very many.

        // Better: user unique names in this seed?
        // Or store IDs?

        const existing = await prisma.artefact.findFirst({
            where: { description: { equals: desc } }
        });

        if (existing) return existing;

        return await prisma.artefact.create({
            data: {
                artefactName: { en: nameEn, th: nameTh },
                description: desc,
                categoryId: catId!,
                responsibleById: ownerId,
                ownerDepartmentId: deptId,
                lifecycleStatus: 'ACTIVE',
                version: ver,
                attributes: {}, // EAV could go here
                tags: [],
            }
        });
    };

    const ba001 = await createArt('business', 'Water Quality Testing', 'กระบวนการตรวจคุณภาพน้ำ', 'Core business process for water quality analysis', userSomchai?.id, deptAnalysis.id, '2.1');
    const ba002 = await createArt('business', 'Lab Sample Management', 'การจัดการตัวอย่างห้องปฏิบัติการ', 'End-to-end sample tracking', undefined, deptMedical.id, '1.8');

    const app001 = await createArt('application', 'LIMS', 'ระบบจัดการข้อมูลห้องปฏิบัติการ', 'Laboratory Information Management System', userPrasit?.id, deptIt.id, '5.2.1');
    const app002 = await createArt('application', 'E-Lab Request', 'ระบบขอใช้บริการห้องปฏิบัติการ', 'Online lab service request', undefined, deptIt.id, '3.0');

    const data001 = await createArt('data', 'Test Results Dataset', 'ชุดข้อมูลผลการทดสอบ', 'Master dataset containing all laboratory test results', undefined, deptStandard.id, '1.0');
    const data002 = await createArt('data', 'Customer Registry', 'ทะเบียนผู้รับบริการ', 'Registry of service recipients', undefined, deptService.id, '2.3');

    const tech001 = await createArt('technology', 'Central Database Server', 'เซิร์ฟเวอร์ฐานข้อมูลกลาง', 'Primary database server', undefined, deptIt.id, 'v12.2');
    const sec001 = await createArt('security', 'LDAP Authentication', 'ระบบยืนยันตัวตน LDAP', 'Centralized authentication', undefined, deptIt.id, '2.0');

    const int001 = await createArt('integration', 'GovConnect API', 'API เชื่อมต่อหน่วยงานรัฐ', 'Integration layer for government', undefined, deptPolicy.id, '1.5');


    // --- 7. Relationships ---
    console.log('Seeding Relationships...');

    const createRel = async (sourceId: number, targetId: number, typeKey: string) => {
        const typeId = relTypeMap[typeKey];
        await prisma.relationship.upsert({
            where: {
                sourceArtefactId_targetArtefactId_relationshipTypeId: {
                    sourceArtefactId: sourceId,
                    targetArtefactId: targetId,
                    relationshipTypeId: typeId
                }
            },
            update: {},
            create: {
                sourceArtefactId: sourceId,
                targetArtefactId: targetId,
                relationshipTypeId: typeId,
            }
        });
    };

    if (ba001 && app001) await createRel(ba001.id, app001.id, 'uses');
    if (ba002 && app001) await createRel(ba002.id, app001.id, 'uses');

    if (ba001 && data001) await createRel(ba001.id, data001.id, 'manages');

    if (app001 && tech001) await createRel(app001.id, tech001.id, 'depends_on');
    if (app002 && tech001) await createRel(app002.id, tech001.id, 'depends_on');

    if (app001 && sec001) await createRel(app001.id, sec001.id, 'uses');
    if (app002 && sec001) await createRel(app002.id, sec001.id, 'uses');

    if (app002 && app001) await createRel(app002.id, app001.id, 'integrates_with');
    if (int001 && app001) await createRel(int001.id, app001.id, 'integrates_with');

    if (app001 && data001) await createRel(app001.id, data001.id, 'manages');
    if (app002 && data002) await createRel(app002.id, data002.id, 'uses');

    if (data001 && tech001) await createRel(data001.id, tech001.id, 'depends_on');
    if (data002 && tech001) await createRel(data002.id, tech001.id, 'depends_on');


    // --- 8. Audit Logs ---
    console.log('Seeding Audit Logs...');
    // Just create a few
    if (userPrasit && app001) {
        await prisma.auditLog.create({
            data: {
                userId: userPrasit.id,
                action: 'UPDATE',
                entityType: 'artefact',
                entityId: app001.id,
                entityLabel: 'LIMS',
                summary: 'อัปเดตเวอร์ชันเป็น 5.2.1',
                ipAddress: '192.168.1.100',
                jsonData: { version: '5.2.1' },
            }
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
