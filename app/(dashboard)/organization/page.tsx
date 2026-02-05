'use client';

export default function OrganizationPage() {
    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-2xl font-bold text-foreground">จัดการหน่วยงาน</h2>
                <p className="text-sm text-muted-foreground">
                    จัดการข้อมูลโครงสร้างองค์กรและหน่วยงานภายใน
                </p>
            </div>

            <div className="p-6 bg-card rounded-xl border border-border flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-2">
                    <p className="text-lg font-medium text-foreground">กำลังปรับปรุง</p>
                    <p className="text-sm text-muted-foreground">ระบบจัดการหน่วยงานอยู่ระหว่างการพัฒนา</p>
                </div>
            </div>
        </div>
    );
}
