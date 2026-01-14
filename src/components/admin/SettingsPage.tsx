import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Bell, 
  Shield, 
  Database, 
  Globe, 
  Palette,
  Mail,
  Key,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Server,
  HardDrive
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingSection {
  id: string;
  title: string;
  icon: React.ElementType;
}

const sections: SettingSection[] = [
  { id: 'general', title: 'ทั่วไป', icon: Settings },
  { id: 'notifications', title: 'การแจ้งเตือน', icon: Bell },
  { id: 'security', title: 'ความปลอดภัย', icon: Shield },
  { id: 'data', title: 'ข้อมูล', icon: Database },
  { id: 'integrations', title: 'การเชื่อมต่อ', icon: Globe },
];

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">ตั้งค่าระบบ</h2>
          <p className="text-muted-foreground">จัดการการตั้งค่าและกำหนดค่าระบบ EA Management</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-card rounded-xl border border-border p-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <section.icon className="w-4 h-4" />
                  {section.title}
                </button>
              ))}
            </div>

            {/* System Status */}
            <div className="mt-4 p-4 bg-card rounded-xl border border-border">
              <h4 className="font-medium text-foreground mb-3">สถานะระบบ</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">API Server</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-success">
                    <CheckCircle className="w-3 h-3" />
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Database</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-success">
                    <CheckCircle className="w-3 h-3" />
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Storage</span>
                  </div>
                  <span className="text-xs text-foreground">45% used</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              {activeSection === 'general' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground">การตั้งค่าทั่วไป</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        ชื่อองค์กร
                      </label>
                      <input
                        type="text"
                        defaultValue="กรมวิทยาศาสตร์บริการ"
                        className="w-full h-10 px-3 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        ภาษาเริ่มต้น
                      </label>
                      <select className="w-full h-10 px-3 text-sm bg-background border border-border rounded-lg">
                        <option>ไทย</option>
                        <option>English</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Timezone
                      </label>
                      <select className="w-full h-10 px-3 text-sm bg-background border border-border rounded-lg">
                        <option>Asia/Bangkok (UTC+7)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground">การแจ้งเตือน</h3>
                  
                  <div className="space-y-4">
                    {[
                      { label: 'แจ้งเตือนเมื่อมีการเปลี่ยนแปลง Artefact', default: true },
                      { label: 'แจ้งเตือนเมื่อมี Risk สูง', default: true },
                      { label: 'รายงานสรุปรายสัปดาห์', default: true },
                      { label: 'แจ้งเตือนผ่าน Email', default: false },
                      { label: 'แจ้งเตือนผ่าน Line Notify', default: false },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm text-foreground">{item.label}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                          <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground">ความปลอดภัย</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Key className="w-4 h-4 text-accent" />
                        <span className="font-medium text-foreground">Session Timeout</span>
                      </div>
                      <select className="w-full h-10 px-3 text-sm bg-background border border-border rounded-lg">
                        <option>30 นาที</option>
                        <option>1 ชั่วโมง</option>
                        <option>4 ชั่วโมง</option>
                        <option>8 ชั่วโมง</option>
                      </select>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-accent" />
                        <span className="font-medium text-foreground">Two-Factor Authentication</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        เพิ่มความปลอดภัยด้วยการยืนยันตัวตนสองขั้นตอน
                      </p>
                      <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                        เปิดใช้งาน 2FA
                      </button>
                    </div>

                    <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-warning" />
                        <span className="font-medium text-foreground">IP Whitelist</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        จำกัดการเข้าถึงเฉพาะ IP ที่อนุญาต
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'data' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground">การจัดการข้อมูล</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Download className="w-4 h-4 text-accent" />
                        <span className="font-medium text-foreground">Backup</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        สำรองข้อมูลทั้งหมดในระบบ
                      </p>
                      <button className="w-full px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                        สร้าง Backup
                      </button>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Upload className="w-4 h-4 text-accent" />
                        <span className="font-medium text-foreground">Restore</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        กู้คืนข้อมูลจาก Backup
                      </p>
                      <button className="w-full px-4 py-2 text-sm bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">
                        เลือกไฟล์ Backup
                      </button>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg md:col-span-2">
                      <div className="flex items-center gap-2 mb-2">
                        <RefreshCw className="w-4 h-4 text-accent" />
                        <span className="font-medium text-foreground">Auto Backup</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          สำรองข้อมูลอัตโนมัติทุกวัน
                        </p>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'integrations' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground">การเชื่อมต่อ</h3>
                  
                  <div className="space-y-4">
                    {[
                      { name: 'LDAP / Active Directory', status: 'connected', description: 'ระบบยืนยันตัวตน' },
                      { name: 'Email (SMTP)', status: 'connected', description: 'สำหรับแจ้งเตือน' },
                      { name: 'Line Notify', status: 'disconnected', description: 'แจ้งเตือนผ่าน Line' },
                      { name: 'API Gateway', status: 'connected', description: 'เชื่อมต่อระบบภายนอก' },
                    ].map((integration) => (
                      <div key={integration.name} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{integration.name}</p>
                          <p className="text-sm text-muted-foreground">{integration.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                            integration.status === 'connected' 
                              ? "bg-success/10 text-success" 
                              : "bg-muted text-muted-foreground"
                          )}>
                            {integration.status === 'connected' ? (
                              <><CheckCircle className="w-3 h-3" /> Connected</>
                            ) : (
                              'Disconnected'
                            )}
                          </span>
                          <button className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors">
                            ตั้งค่า
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end mt-6 pt-6 border-t border-border">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      บันทึกการตั้งค่า
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
