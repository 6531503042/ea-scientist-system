import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/the-insight-compass';

// Schemas
const artefactSchema = new mongoose.Schema({
    name: String,
    nameTh: String,
    type: String,
    description: String,
    owner: String,
    department: String,
    status: String,
    riskLevel: String,
    version: String,
    usageFrequency: String,
    dependencies: { type: Number, default: 0 },
    dependents: { type: Number, default: 0 },
}, { timestamps: true });

const relationshipSchema = new mongoose.Schema({
    sourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artefact' },
    targetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artefact' },
    type: String,
    label: String,
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    name: String,
    role: String,
    avatar: String,
    password: String,
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const settingSchema = new mongoose.Schema({
    key: { type: String, unique: true },
    value: String,
    category: String,
}, { timestamps: true });

const Artefact = mongoose.model('Artefact', artefactSchema);
const Relationship = mongoose.model('Relationship', relationshipSchema);
const User = mongoose.model('User', userSchema);
const Setting = mongoose.model('Setting', settingSchema);

async function seed() {
    console.log('🌱 Seeding database...');

    await mongoose.connect(MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Clear existing data
    await Artefact.deleteMany({});
    await Relationship.deleteMany({});
    await User.deleteMany({});
    await Setting.deleteMany({});

    // Seed Artefacts
    const artefactsData = [
        {
            name: 'Water Quality Testing',
            nameTh: 'กระบวนการตรวจคุณภาพน้ำ',
            type: 'business',
            description: 'Core business process for water quality analysis and certification',
            owner: 'ดร.สมชาย วิทยาการ',
            department: 'กองตรวจวิเคราะห์',
            status: 'active',
            riskLevel: 'low',
            version: '2.1',
            usageFrequency: 'high',
            dependencies: 3,
            dependents: 5,
        },
        {
            name: 'Lab Sample Management',
            nameTh: 'การจัดการตัวอย่างห้องปฏิบัติการ',
            type: 'business',
            description: 'End-to-end sample tracking from receipt to disposal',
            owner: 'คุณวิภา สุขใจ',
            department: 'ศูนย์วิทยาศาสตร์การแพทย์',
            status: 'active',
            riskLevel: 'medium',
            version: '1.8',
            usageFrequency: 'high',
            dependencies: 4,
            dependents: 8,
        },
        {
            name: 'LIMS',
            nameTh: 'ระบบจัดการข้อมูลห้องปฏิบัติการ',
            type: 'application',
            description: 'Laboratory Information Management System - Core platform',
            owner: 'คุณประสิทธิ์ เทคโน',
            department: 'ศูนย์เทคโนโลยีสารสนเทศ',
            status: 'active',
            riskLevel: 'high',
            version: '5.2.1',
            usageFrequency: 'high',
            dependencies: 6,
            dependents: 12,
        },
        {
            name: 'E-Lab Request',
            nameTh: 'ระบบขอใช้บริการห้องปฏิบัติการ',
            type: 'application',
            description: 'Online lab service request and tracking portal',
            owner: 'คุณสุรีย์ ดิจิทัล',
            department: 'ศูนย์เทคโนโลยีสารสนเทศ',
            status: 'active',
            riskLevel: 'low',
            version: '3.0',
            usageFrequency: 'medium',
            dependencies: 2,
            dependents: 3,
        },
        {
            name: 'Test Results Dataset',
            nameTh: 'ชุดข้อมูลผลการทดสอบ',
            type: 'data',
            description: 'Master dataset containing all laboratory test results',
            owner: 'ดร.มนัส ข้อมูล',
            department: 'กองมาตรฐาน',
            status: 'active',
            riskLevel: 'high',
            version: '1.0',
            usageFrequency: 'high',
            dependencies: 1,
            dependents: 7,
        },
        {
            name: 'Customer Registry',
            nameTh: 'ทะเบียนผู้รับบริการ',
            type: 'data',
            description: 'Registry of all service recipients and their history',
            owner: 'คุณนภา ลูกค้า',
            department: 'กองบริการ',
            status: 'active',
            riskLevel: 'medium',
            version: '2.3',
            usageFrequency: 'high',
            dependencies: 0,
            dependents: 4,
        },
        {
            name: 'Central Database Server',
            nameTh: 'เซิร์ฟเวอร์ฐานข้อมูลกลาง',
            type: 'technology',
            description: 'Primary database server hosting all core systems',
            owner: 'คุณเทพ โครงสร้าง',
            department: 'ศูนย์เทคโนโลยีสารสนเทศ',
            status: 'active',
            riskLevel: 'high',
            version: 'v12.2',
            usageFrequency: 'high',
            dependencies: 0,
            dependents: 15,
        },
        {
            name: 'LDAP Authentication',
            nameTh: 'ระบบยืนยันตัวตน LDAP',
            type: 'security',
            description: 'Centralized authentication and access control',
            owner: 'คุณปลอดภัย รักษา',
            department: 'ศูนย์เทคโนโลยีสารสนเทศ',
            status: 'active',
            riskLevel: 'medium',
            version: '2.0',
            usageFrequency: 'high',
            dependencies: 1,
            dependents: 10,
        },
        {
            name: 'GovConnect API',
            nameTh: 'API เชื่อมต่อหน่วยงานรัฐ',
            type: 'integration',
            description: 'Integration layer for government agency data exchange',
            owner: 'คุณเชื่อม ต่อ',
            department: 'กองนโยบาย',
            status: 'active',
            riskLevel: 'low',
            version: '1.5',
            usageFrequency: 'medium',
            dependencies: 2,
            dependents: 3,
        },
    ];

    const artefacts = await Artefact.insertMany(artefactsData);
    console.log(`✅ Created ${artefacts.length} artefacts`);

    // Create a map of artefact names to IDs
    const artefactMap = new Map<string, mongoose.Types.ObjectId>();
    artefacts.forEach(a => artefactMap.set(a.name, a._id as mongoose.Types.ObjectId));

    // Seed Relationships
    const relationshipsData = [
        { source: 'Water Quality Testing', target: 'LIMS', type: 'uses', label: 'ใช้งาน' },
        { source: 'Water Quality Testing', target: 'Test Results Dataset', type: 'manages', label: 'จัดการ' },
        { source: 'Lab Sample Management', target: 'LIMS', type: 'uses', label: 'ใช้งาน' },
        { source: 'LIMS', target: 'Central Database Server', type: 'depends_on', label: 'พึ่งพา' },
        { source: 'LIMS', target: 'Test Results Dataset', type: 'manages', label: 'จัดการ' },
        { source: 'LIMS', target: 'LDAP Authentication', type: 'uses', label: 'ใช้งาน' },
        { source: 'E-Lab Request', target: 'LIMS', type: 'integrates_with', label: 'เชื่อมต่อ' },
        { source: 'E-Lab Request', target: 'Customer Registry', type: 'uses', label: 'ใช้งาน' },
        { source: 'Test Results Dataset', target: 'Central Database Server', type: 'depends_on', label: 'พึ่งพา' },
        { source: 'LDAP Authentication', target: 'Central Database Server', type: 'depends_on', label: 'พึ่งพา' },
        { source: 'GovConnect API', target: 'LIMS', type: 'integrates_with', label: 'เชื่อมต่อ' },
    ];

    const relationships = await Relationship.insertMany(
        relationshipsData.map(r => ({
            sourceId: artefactMap.get(r.source),
            targetId: artefactMap.get(r.target),
            type: r.type,
            label: r.label,
        }))
    );
    console.log(`✅ Created ${relationships.length} relationships`);

    // Seed Users
    const hashedPassword = await bcrypt.hash('password123', 10); // Hash a default password
    const usersData = [
        { email: 'admin@dss.go.th', name: 'Admin User', role: 'admin', isActive: true, password: hashedPassword },
        { email: 'architect@dss.go.th', name: 'Enterprise Architect', role: 'editor', isActive: true, password: hashedPassword },
        { email: 'viewer@dss.go.th', name: 'Viewer User', role: 'viewer', isActive: true, password: hashedPassword },
    ];

    const users = await User.insertMany(usersData);
    console.log(`✅ Created ${users.length} users`);

    // Seed Settings
    const settingsData = [
        { key: 'app_name', value: 'EA Management System', category: 'general' },
        { key: 'app_theme', value: 'light', category: 'appearance' },
        { key: 'language', value: 'th', category: 'general' },
        { key: 'notification_enabled', value: 'true', category: 'notifications' },
        { key: 'email_notifications', value: 'true', category: 'notifications' },
    ];

    const settings = await Setting.insertMany(settingsData);
    console.log(`✅ Created ${settings.length} settings`);

    console.log('🎉 Database seeded successfully!');
    await mongoose.disconnect();
}

seed().catch((e) => {
    console.error(e);
    process.exit(1);
});
