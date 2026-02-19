'use client';

import { usePathname } from 'next/navigation';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AppHeader } from '@/components/layout/AppHeader';

const getHeaderInfo = (path: string) => {
  switch (path) {
    case '/':
    case '/dashboard': return { title: 'ภาพรวมสถาปัตยกรรมองค์กร', subtitle: '' };
    case '/graph': return { title: 'แผนผังสถาปัตยกรรม', subtitle: '' };
    case '/artefacts': return { title: 'Artefacts ทั้งหมด', subtitle: '' };
    case '/users': return { title: 'จัดการผู้ใช้งาน', subtitle: '' };
    case '/audit': return { title: 'ข้อมูลการใช้งาน', subtitle: '' };
    case '/settings': return { title: 'ตั้งค่าระบบ', subtitle: '' };
    default: return { title: 'EA Management System', subtitle: '' };
  }
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const header = getHeaderInfo(pathname);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <AppSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <AppHeader title={header.title} subtitle={header.subtitle} />
        <div className={`flex-1 bg-background ${['/graph', '/users', '/artefacts'].includes(pathname) ? 'p-0 overflow-hidden' : 'p-6 overflow-y-auto'}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
