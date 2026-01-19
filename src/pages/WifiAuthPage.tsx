import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Wifi,
    Users,
    Activity,
    Clock,
    Smartphone,
    Laptop,
    Tablet,
    Monitor,
    HelpCircle,
    Search,
    Filter,
    MoreVertical,
    Ban,
    RefreshCw,
    Download,
    Settings,
    Shield,
    TrendingUp,
    BarChart3
} from 'lucide-react';
import {
    wifiDevices,
    wifiSessions,
    wifiStats,
    wifiConfig,
    loginMethodStats,
    hourlyUsage,
    WifiDevice
} from '@/data/mockWifiAuth';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const deviceIcons = {
    smartphone: Smartphone,
    tablet: Tablet,
    laptop: Laptop,
    desktop: Monitor,
    other: HelpCircle,
};

const statusColors = {
    connected: 'bg-success/10 text-success',
    idle: 'bg-warning/10 text-warning',
    blocked: 'bg-destructive/10 text-destructive',
};

const COLORS = ['hsl(262, 83%, 58%)', 'hsl(168, 76%, 42%)', 'hsl(199, 89%, 48%)', 'hsl(38, 92%, 50%)', 'hsl(0, 72%, 51%)', 'hsl(222, 47%, 35%)'];

export function WifiAuthPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTab, setSelectedTab] = useState<'devices' | 'sessions' | 'config'>('devices');

    const filteredDevices = wifiDevices.filter(d =>
        d.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.macAddress.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-xl p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Wifi className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{wifiStats.activeConnections}</p>
                            <p className="text-xs text-muted-foreground">เชื่อมต่ออยู่</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="bg-card border border-border rounded-xl p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-success" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{wifiStats.totalDevices}</p>
                            <p className="text-xs text-muted-foreground">อุปกรณ์ทั้งหมด</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-card border border-border rounded-xl p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-info" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{wifiStats.totalDataUsage} GB</p>
                            <p className="text-xs text-muted-foreground">ปริมาณข้อมูล</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-card border border-border rounded-xl p-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-warning" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{wifiStats.avgSessionDuration} นาที</p>
                            <p className="text-xs text-muted-foreground">ใช้งานเฉลี่ย</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hourly Usage Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-card border border-border rounded-xl p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-foreground">การใช้งานรายชั่วโมง</h3>
                    </div>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={hourlyUsage}>
                                <defs>
                                    <linearGradient id="colorConnections" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(222, 47%, 35%)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(222, 47%, 35%)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '0.5rem'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="connections"
                                    stroke="hsl(222, 47%, 35%)"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorConnections)"
                                    name="การเชื่อมต่อ"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Login Methods Pie Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-card border border-border rounded-xl p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-foreground">วิธียืนยันตัวตน</h3>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-32 h-32">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={loginMethodStats}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={30}
                                        outerRadius={55}
                                        paddingAngle={2}
                                        dataKey="count"
                                        stroke="none"
                                    >
                                        {loginMethodStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex-1 space-y-1.5">
                            {loginMethodStats.map((item, index) => (
                                <div key={item.method} className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
                                    <span className="text-xs text-muted-foreground flex-1">{item.method}</span>
                                    <span className="text-xs font-medium text-foreground">{item.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-4 border-b border-border">
                <button
                    onClick={() => setSelectedTab('devices')}
                    className={`px-4 py-2 text-sm font-medium transition-colors relative ${selectedTab === 'devices'
                            ? 'text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    อุปกรณ์ที่เชื่อมต่อ
                    {selectedTab === 'devices' && (
                        <motion.div
                            layoutId="tab-indicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        />
                    )}
                </button>
                <button
                    onClick={() => setSelectedTab('sessions')}
                    className={`px-4 py-2 text-sm font-medium transition-colors relative ${selectedTab === 'sessions'
                            ? 'text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    ประวัติการเข้าใช้
                    {selectedTab === 'sessions' && (
                        <motion.div
                            layoutId="tab-indicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        />
                    )}
                </button>
                <button
                    onClick={() => setSelectedTab('config')}
                    className={`px-4 py-2 text-sm font-medium transition-colors relative ${selectedTab === 'config'
                            ? 'text-primary'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    ตั้งค่าระบบ
                    {selectedTab === 'config' && (
                        <motion.div
                            layoutId="tab-indicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        />
                    )}
                </button>
            </div>

            {/* Content */}
            {selectedTab === 'devices' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-card border border-border rounded-xl overflow-hidden"
                >
                    {/* Toolbar */}
                    <div className="p-4 border-b border-border flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="ค้นหาอุปกรณ์, ผู้ใช้, MAC Address..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm hover:bg-accent transition-colors">
                            <Filter className="w-4 h-4" />
                            กรอง
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm hover:bg-accent transition-colors">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">
                            <RefreshCw className="w-4 h-4" />
                            รีเฟรช
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-muted/50">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">อุปกรณ์</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">ผู้ใช้</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">IP Address</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">MAC Address</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">ระยะเวลา</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">ข้อมูล</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">สถานะ</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredDevices.map((device) => {
                                    const DeviceIcon = deviceIcons[device.deviceType];
                                    return (
                                        <tr key={device.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                                                        <DeviceIcon className="w-4 h-4 text-muted-foreground" />
                                                    </div>
                                                    <span className="text-sm font-medium text-foreground">{device.deviceName}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="text-sm text-foreground">{device.userName}</p>
                                                    <p className="text-xs text-muted-foreground">{device.department}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{device.ipAddress}</td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{device.macAddress}</td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">{device.sessionDuration} นาที</td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">{device.dataUsage} MB</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[device.status]}`}>
                                                    {device.status === 'connected' ? 'เชื่อมต่อ' : device.status === 'idle' ? 'ไม่ใช้งาน' : 'ถูกบล็อค'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                                                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {selectedTab === 'sessions' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-card border border-border rounded-xl overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-muted/50">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">ผู้ใช้</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">วิธีล็อกอิน</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">เริ่มต้น</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">สิ้นสุด</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Download</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Upload</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">สถานะ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {wifiSessions.map((session) => (
                                    <tr key={session.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-3 text-sm text-foreground">{session.userName}</td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 rounded bg-muted text-xs font-medium">{session.loginMethod.toUpperCase()}</span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">{session.startTime}</td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">{session.endTime || '-'}</td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">{session.dataDownload} MB</td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">{session.dataUpload} MB</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${session.status === 'active' ? 'bg-success/10 text-success' :
                                                    session.status === 'completed' ? 'bg-muted text-muted-foreground' :
                                                        'bg-destructive/10 text-destructive'
                                                }`}>
                                                {session.status === 'active' ? 'กำลังใช้งาน' : session.status === 'completed' ? 'เสร็จสิ้น' : 'ยกเลิก'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {selectedTab === 'config' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                    {/* WiFi Settings */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Settings className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold text-foreground">ตั้งค่า WiFi</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-muted-foreground">SSID</label>
                                <input
                                    type="text"
                                    value={wifiConfig.ssid}
                                    disabled
                                    className="w-full mt-1 px-3 py-2 bg-muted rounded-lg text-sm"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-muted-foreground">Session Timeout (นาที)</label>
                                    <input
                                        type="number"
                                        value={wifiConfig.sessionTimeout}
                                        disabled
                                        className="w-full mt-1 px-3 py-2 bg-muted rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Idle Timeout (นาที)</label>
                                    <input
                                        type="number"
                                        value={wifiConfig.idleTimeout}
                                        disabled
                                        className="w-full mt-1 px-3 py-2 bg-muted rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-muted-foreground">อุปกรณ์/ผู้ใช้</label>
                                    <input
                                        type="number"
                                        value={wifiConfig.maxDevicesPerUser}
                                        disabled
                                        className="w-full mt-1 px-3 py-2 bg-muted rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Bandwidth Limit (Mbps)</label>
                                    <input
                                        type="number"
                                        value={wifiConfig.bandwidthLimit}
                                        disabled
                                        className="w-full mt-1 px-3 py-2 bg-muted rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* LDAP Settings */}
                    <div className="bg-card border border-border rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold text-foreground">ตั้งค่า LDAP</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-muted-foreground">LDAP Server</label>
                                <input
                                    type="text"
                                    value={wifiConfig.ldapServer}
                                    disabled
                                    className="w-full mt-1 px-3 py-2 bg-muted rounded-lg text-sm font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Port</label>
                                <input
                                    type="number"
                                    value={wifiConfig.ldapPort}
                                    disabled
                                    className="w-full mt-1 px-3 py-2 bg-muted rounded-lg text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Base DN</label>
                                <input
                                    type="text"
                                    value={wifiConfig.ldapBaseDN}
                                    disabled
                                    className="w-full mt-1 px-3 py-2 bg-muted rounded-lg text-sm font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">NTP Server</label>
                                <input
                                    type="text"
                                    value={wifiConfig.ntpServer}
                                    disabled
                                    className="w-full mt-1 px-3 py-2 bg-muted rounded-lg text-sm font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Auth Methods */}
                    <div className="bg-card border border-border rounded-xl p-6 lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Activity className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold text-foreground">วิธียืนยันตัวตนที่รองรับ</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {wifiConfig.authMethods.map((method) => (
                                <span key={method} className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                    {method}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
