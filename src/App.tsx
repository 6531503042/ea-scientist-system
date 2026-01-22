import { useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import Login from '@/pages/Login';
import Index from '@/pages/Index';
import { Toaster } from "@/components/ui/toaster";
import { AppSidebar } from '@/components/layout/AppSidebar';
import { EAGraph } from '@/components/graph/EAGraph';
import { ArtefactListEnhanced } from '@/components/artefacts/ArtefactListEnhanced';

import { UsersPageEnhanced } from '@/components/admin/UsersPageEnhanced';
import { AuditLogPageEnhanced } from '@/components/admin/AuditLogPageEnhanced';
import { SettingsPage } from '@/components/admin/SettingsPage';
import { WifiAuthPage } from '@/pages/WifiAuthPage';
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
      case '/': return { title: 'ภาพรวมสถาปัตยกรรมองค์กร', subtitle: '' };
      case '/graph': return { title: 'แผนผังสถาปัตยกรรม', subtitle: '' };
      case '/artefacts': return { title: 'Artefacts ทั้งหมด', subtitle: '' };
      case '/users': return { title: 'จัดการผู้ใช้งาน', subtitle: '' };
      case '/wifi': return { title: 'WiFi Authentication', subtitle: '' };
      case '/audit': return { title: 'ข้อมูลการใช้งาน', subtitle: '' };
      case '/settings': return { title: 'ตั้งค่าระบบ', subtitle: '' };
      default: return { title: 'EA Management System', subtitle: '' };
    }
  };

  const header = getHeaderInfo(location.pathname);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <AppSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title={header.title} subtitle={header.subtitle} />
        <div className={`flex-1 bg-background ${location.pathname === '/graph' ? 'p-0 overflow-hidden' : 'p-6 overflow-y-auto'}`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

const App = () => (
  <LanguageProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/graph" element={<EAGraph />} />
              <Route path="/artefacts" element={<ArtefactListEnhanced />} />

              <Route path="/users" element={<UsersPageEnhanced />} />
              <Route path="/wifi" element={<WifiAuthPage />} />
              <Route path="/audit" element={<AuditLogPageEnhanced />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  </LanguageProvider>
);

export default App;
