import { useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Login from '@/pages/Login';
import Index from '@/pages/Index';
import { Toaster } from "@/components/ui/toaster";
import { AppSidebar } from '@/components/layout/AppSidebar';
import { EAGraph } from '@/components/graph/EAGraph';
import { ArtefactListEnhanced } from '@/components/artefacts/ArtefactListEnhanced';
import { ReportsPageEnhanced } from '@/components/reports/ReportsPageEnhanced';
import { UsersPageEnhanced } from '@/components/admin/UsersPageEnhanced';
import { AuditLogPageEnhanced } from '@/components/admin/AuditLogPageEnhanced';
import { SettingsPage } from '@/components/admin/SettingsPage';
import { AppHeader } from '@/components/layout/AppHeader';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Or a proper spinner
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
};

const Layout = () => {
  const location = useLocation();

  const getHeaderInfo = (path: string) => {
    switch (path) {
      case '/': return { title: 'Executive Dashboard', subtitle: 'ภาพรวมสถาปัตยกรรมองค์กร • กรมวิทยาศาสตร์บริการ' };
      case '/graph': return { title: 'Architecture Map', subtitle: 'แผนผังความสัมพันธ์ระหว่าง Artefacts' };
      case '/artefacts': return { title: 'Artefacts', subtitle: 'จัดการ Artefacts ทั้งหมดในระบบ' };
      case '/reports': return { title: 'รายงาน', subtitle: 'สร้างและดาวน์โหลดรายงาน' };
      case '/users': return { title: 'จัดการผู้ใช้งาน', subtitle: 'บัญชีผู้ใช้และสิทธิ์การเข้าถึง' };
      case '/audit': return { title: 'Audit Log', subtitle: 'บันทึกการใช้งานระบบ' };
      case '/settings': return { title: 'ตั้งค่าระบบ', subtitle: 'กำหนดค่าระบบ EA Management' };
      default: return { title: 'EA Management System', subtitle: '' };
    }
  };

  const header = getHeaderInfo(location.pathname);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <AppSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title={header.title} subtitle={header.subtitle} />
        <div className="flex-1 overflow-y-auto p-6 bg-background">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/graph" element={<EAGraph />} />
            <Route path="/artefacts" element={<ArtefactListEnhanced />} />
            <Route path="/reports" element={<ReportsPageEnhanced />} />
            <Route path="/users" element={<UsersPageEnhanced />} />
            <Route path="/audit" element={<AuditLogPageEnhanced />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
