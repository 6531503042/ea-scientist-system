# API Gap Assessment: UI vs Backend

อัปเดตล่าสุด: 2026-04-27

เอกสารนี้สรุปจากการเทียบ 2 ฝั่งโดยตรง:

- UI ในโปรเจคหลัก `ea-scientist-system`
- Backend NestJS ในโฟลเดอร์ `api`

เป้าหมายคือบอกทีมหลังบ้านว่าอะไร "ยังขาดจริง", อะไร "มี endpoint แล้วแต่ contract ไม่ตรง", และหน้าไหนพร้อมแล้วหรือยังไม่พร้อม

## สรุประดับสูง

### ขาดจริงฝั่ง backend ที่ UI ใช้อยู่หรือ UI แสดง action ชัดเจนแล้ว

1. `POST /api/v1/audit-logs`
   ใช้ใน flow export/import หน้า Artefacts เพื่อบันทึก audit log แต่ backend ปัจจุบันมีเฉพาะ `GET /audit-logs`, `GET /audit-logs/stats`, `GET /audit-logs/export`

2. Settings APIs ทั้งชุด
   หน้า Settings มี UI สำหรับแก้ไขค่าระบบ, notification, security, integrations, backup/restore และ system status แต่ backend ยังไม่มี endpoints รองรับ feature เหล่านี้

3. ถ้าต้องการให้ Import/Export Artefacts เป็น backend-driven จริง
   ตอนนี้หน้า Artefacts ทำ export/import แบบจำลองใน browser เป็นหลัก ยังไม่มี endpoints เฉพาะสำหรับ import/export artefacts

### มี endpoint แล้ว แต่ contract/การใช้งานยังไม่ตรงกัน

1. `GET /api/v1/users`
   หน้า Users อ่านแบบ paginated envelope แต่หน้า Artefact form options อ่านเหมือนเป็น flat array ตรง ๆ

2. Auth cookie naming
   Backend login ตั้ง cookie เป็น `accessToken` / `refreshToken` แต่ frontend middleware ใช้ `access_token` / `refresh_token`
   ตอนนี้ฝั่ง frontend แก้ด้วย proxy route แล้ว แต่ถ้าจะให้ contract ตรงกันตรง ๆ ควรตกลงชื่อ cookie ให้ชัด

3. Permission token naming
   Backend ส่ง permission แบบ underscore เช่น `view_users`, `manage_settings` ขณะที่ IAM layer ฝั่ง frontend normalize เป็น canonical menu key เอง
   ตอนนี้ frontend รองรับแล้ว แต่ควรตกลง format กลางระยะยาว

### ไม่ได้ขาด backend แต่ยังเป็น frontend gap

1. Graph / Relationships
   Backend มี CRUD relationships ครบแล้ว แต่ UI ปัจจุบันใช้จริงแค่ `GET /relationships`

2. Auth refresh
   Backend มี `POST /auth/refresh` แต่ frontend ยังไม่ได้ใช้ใน auth service ชุดปัจจุบันโดยตรง

---

## Backend ที่มีอยู่จริง

สแกนจาก `api/src` พบ endpoint หลักดังนี้

### Authentication

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/logout-all`

### IAM

- `GET /api/v1/users`
- `GET /api/v1/users/me`
- `GET /api/v1/users/:id`
- `POST /api/v1/users`
- `PATCH /api/v1/users/:id`
- `PUT /api/v1/users/:id`
- `DELETE /api/v1/users/:id`
- `GET /api/v1/departments`
- `POST /api/v1/departments`
- `PUT /api/v1/departments/:id`
- `DELETE /api/v1/departments/:id`
- `GET /api/v1/access-control/permission-catalog`
- `GET /api/v1/access-control/me`
- `GET /api/v1/access-control/roles`
- `GET /api/v1/access-control/roles/:id`
- `POST /api/v1/access-control/roles`
- `PATCH /api/v1/access-control/roles/:id`
- `PATCH /api/v1/access-control/roles/:id/status`
- `DELETE /api/v1/access-control/roles/:id`
- `GET /api/v1/access-control/roles/:roleId/permission-tokens`
- `PUT /api/v1/access-control/roles/:roleId/permission-tokens`
- `POST /api/v1/access-control/roles/:roleId/permission-tokens/preview`

### EA Core

- `GET /api/v1/artefacts`
- `GET /api/v1/artefacts/:id`
- `POST /api/v1/artefacts`
- `PUT /api/v1/artefacts/:id`
- `DELETE /api/v1/artefacts/:id`
- `GET /api/v1/relationships`
- `GET /api/v1/relationships/:id`
- `POST /api/v1/relationships`
- `PUT /api/v1/relationships/:id`
- `DELETE /api/v1/relationships/:id`
- `GET /api/v1/relationship-types`
- `POST /api/v1/relationship-types`
- `PUT /api/v1/relationship-types/:id`
- `DELETE /api/v1/relationship-types/:id`
- `GET /api/v1/categories`
- `POST /api/v1/categories`
- `PUT /api/v1/categories/:id`
- `DELETE /api/v1/categories/:id`
- `GET /api/v1/architecture-layers`
- `POST /api/v1/architecture-layers`
- `PUT /api/v1/architecture-layers/:id`
- `DELETE /api/v1/architecture-layers/:id`

### Audit

- `GET /api/v1/audit-logs`
- `GET /api/v1/audit-logs/stats`
- `GET /api/v1/audit-logs/export`

---

## สรุปรายหน้า

## 1. Login / Auth

### UI ใช้อะไร

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/access-control/me`
- `GET /api/v1/users/me`

### สถานะ

- Backend มีครบสำหรับ flow login/logout/profile/access-control

### Gap / สิ่งที่ต้องคุยกับ backend

- ไม่มี endpoint ที่ขาดจริง
- มี contract mismatch เรื่อง cookie names:
  - backend: `accessToken`, `refreshToken`
  - frontend middleware: `access_token`, `refresh_token`
- มี contract mismatch เรื่อง permission token naming format

### หมายเหตุสำหรับทีม backend

ถ้าจะลด logic พิเศษฝั่ง frontend ควรทำให้ auth cookie naming และ permission token format เป็นมาตรฐานเดียวทั้งระบบ

---

## 2. Dashboard

### UI ใช้อะไร

- `GET /api/v1/artefacts`
- `GET /api/v1/relationships`

### สถานะ

- Backend มีครบสำหรับ dashboard ปัจจุบัน

### Gap

- ไม่มี backend API ที่ขาดจริงสำหรับ dashboard เวอร์ชันปัจจุบัน

---

## 3. Artefacts Page

ครอบคลุมทั้ง list, detail, create/edit, type management, relationship rule pair, export/import modal

### UI ใช้อะไร

- `GET /api/v1/artefacts`
- `GET /api/v1/artefacts/:id`
- `POST /api/v1/artefacts`
- `PUT /api/v1/artefacts/:id`
- `DELETE /api/v1/artefacts/:id`
- `GET /api/v1/categories`
- `POST /api/v1/categories`
- `PUT /api/v1/categories/:id`
- `DELETE /api/v1/categories/:id`
- `GET /api/v1/architecture-layers`
- `POST /api/v1/architecture-layers`
- `PUT /api/v1/architecture-layers/:id`
- `DELETE /api/v1/architecture-layers/:id`
- `GET /api/v1/relationship-types`
- `POST /api/v1/relationship-types`
- `PUT /api/v1/relationship-types/:id`
- `DELETE /api/v1/relationship-types/:id`
- `GET /api/v1/users`
- `GET /api/v1/departments`
- `POST /api/v1/audit-logs` จาก export/import modal

### สถานะ

- Artefacts CRUD มีครบ
- Layers / Categories / Relationship Types มีครบ
- Form options สำหรับ users/departments/layers ใช้งาน endpoint ได้ แต่มีจุดเสี่ยงเรื่อง response shape ของ `/users`

### ขาดจริง

1. `POST /api/v1/audit-logs`
   ต้องมีเพื่อให้ export/import modal เขียน audit log ได้จริง

2. ถ้าต้องการ import/export artefacts แบบ server-driven จริง ควรเพิ่มอย่างน้อย:
   - `GET /api/v1/artefacts/export`
   - `POST /api/v1/artefacts/import`

### Contract mismatch

1. `GET /api/v1/users`
   - หน้า Users อ่าน response แบบ paginated (`data.data`)
   - hook `useArtefactFormOptions` อ่านเหมือน `data` เป็น array ตรง ๆ
   - ควรตกลง response shape ให้แน่ชัด หรือทำ endpoint dropdown โดยเฉพาะ

### ข้อเสนอแนะให้ทีม backend

ถ้าจะรองรับ modal สร้าง/แก้ไข artefact ให้เสถียร ควรมี endpoint สำหรับ dropdown/lightweight options เช่น:

- `GET /api/v1/users/options`
- `GET /api/v1/departments/options`
- `GET /api/v1/architecture-layers/options`

---

## 4. Graph Page

### UI ใช้อะไร

- `GET /api/v1/artefacts`
- `GET /api/v1/relationships`

### สถานะ

- Backend มี endpoint ที่ UI ใช้อ่านข้อมูลครบ

### Gap ฝั่ง backend

- ไม่มี endpoint ที่ขาดจริงสำหรับ behavior ปัจจุบัน

### หมายเหตุสำคัญ

- แม้ backend จะมี `POST/PUT/DELETE /relationships` ครบแล้ว แต่ UI ตอนนี้ยังไม่ได้ยิง create/update/delete จริง
- ถ้าทีมต้องการให้ลากเชื่อม relationship แล้วบันทึกได้จริง ฝั่ง frontend ยังต้อง wire เข้ากับ endpoint ที่มีอยู่แล้ว ไม่ใช่ backend gap

---

## 5. Users / Roles / Departments Page

### UI ใช้อะไร

- `GET /api/v1/users`
- `POST /api/v1/users`
- `PATCH /api/v1/users/:id`
- `DELETE /api/v1/users/:id`
- `GET /api/v1/access-control/roles`
- `POST /api/v1/access-control/roles`
- `PATCH /api/v1/access-control/roles/:id`
- `DELETE /api/v1/access-control/roles/:id`
- `GET /api/v1/access-control/permission-catalog`
- `GET /api/v1/access-control/roles/:roleId/permission-tokens`
- `PUT /api/v1/access-control/roles/:roleId/permission-tokens`
- `GET /api/v1/departments`
- `POST /api/v1/departments`
- `PUT /api/v1/departments/:id`
- `DELETE /api/v1/departments/:id`

### สถานะ

- Backend มีครบสำหรับหน้า Users ปัจจุบัน

### Gap

- ไม่มี backend API ที่ขาดจริง

### Contract / design notes

- Backend มี `PATCH /api/v1/access-control/roles/:id/status` แต่ UI ยังไม่ใช้
- ถ้าจะทำ enable/disable role แบบ explicit ในอนาคต endpoint นี้ใช้ได้เลย

---

## 6. Audit Page

### UI ใช้อะไร

- `GET /api/v1/audit-logs`
- `GET /api/v1/audit-logs/stats`
- `GET /api/v1/audit-logs/export`

### สถานะ

- Backend มีครบสำหรับหน้า Audit ปัจจุบัน

### Gap

- ไม่มี backend API ที่ขาดจริงสำหรับหน้า Audit เอง

### หมายเหตุ

- ถ้าต้องการ filter export ให้ตรงกับ tab หรือ search query จริง อาจต้องขยาย `GET /audit-logs/export` ให้รับ query params เพิ่มเติม เช่น action/module/date-range

---

## 7. Settings Page

### UI ที่แสดงอยู่

หน้า Settings มี section ต่อไปนี้:

- General
- Notifications
- Security
- Data
- Integrations
- System Status sidebar

### สถานะ

- ปัจจุบันเป็น static UI เกือบทั้งหมด
- ยังไม่มี backend module ที่รองรับโดยตรง

### ขาดจริงที่ควรมี

### 7.1 General Settings

- `GET /api/v1/settings/general`
- `PUT /api/v1/settings/general`

ตัวอย่างข้อมูล:

- organizationName
- defaultLanguage
- timezone

### 7.2 Notification Settings

- `GET /api/v1/settings/notifications`
- `PUT /api/v1/settings/notifications`

ตัวอย่างข้อมูล:

- artefactChangeEnabled
- highRiskEnabled
- weeklySummaryEnabled
- emailEnabled
- lineNotifyEnabled

### 7.3 Security Settings

- `GET /api/v1/settings/security`
- `PUT /api/v1/settings/security`

ตัวอย่างข้อมูล:

- sessionTimeoutMinutes
- twoFactorEnabled
- ipWhitelistEnabled
- ipWhitelistEntries

### 7.4 Data Management

- `POST /api/v1/system/backup`
- `POST /api/v1/system/restore`
- `GET /api/v1/system/backup/history` หรือ `GET /api/v1/backups`

### 7.5 System Status

- `GET /api/v1/system/status`

ตัวอย่างข้อมูล:

- apiServerStatus
- databaseStatus
- storageUsedPercent
- storageTotal
- storageAvailable

### 7.6 Integrations

- `GET /api/v1/settings/integrations`
- `PUT /api/v1/settings/integrations`

---

## 8. Route ที่ยังไม่อยู่ในเมนูหลัก แต่มี code อยู่

## WiFi Feature

ไฟล์ hook `hooks/useWifi.ts` ยังใช้ mock data ล้วน และไม่พบหน้า route หลักที่เปิดใช้งานในเมนูปัจจุบัน

ถ้าฟีเจอร์นี้จะเปิดใช้ภายหลัง backend ควรมีอย่างน้อย:

- `GET /api/v1/wifi/devices`
- `GET /api/v1/wifi/stats`
- `POST /api/v1/wifi/devices/:id/authorize`
- `POST /api/v1/wifi/devices/:id/block`
- `POST /api/v1/wifi/devices/:id/unblock`

---

## รายการที่ควรส่งให้ทีม backend ทำก่อน

ถ้าจะ prioritize แบบใช้งานจริงเร็วที่สุด แนะนำเรียงดังนี้

1. `POST /api/v1/audit-logs`
   เพื่อให้ Artefacts export/import log ทำงานจริง

2. Settings module ทั้งชุด
   เพราะหน้า Settings ตอนนี้ยังไม่มี API รองรับเลย

3. Artefacts import/export endpoints
   ถ้าต้องการเลิกใช้ demo mode ใน modal

4. ทำ response contract ให้คงที่สำหรับ `/users`
   เพื่อไม่ให้หน้า Users กับ Artefact form options คาดหวัง payload คนละแบบ

---

## หลักฐานจากไฟล์ที่ใช้เทียบ

### Frontend

- `hooks/useArtefacts.ts`
- `hooks/useArtefactTypes.ts`
- `hooks/useArtefactFormOptions.ts`
- `hooks/useArtefactVersions.ts`
- `hooks/useRelationships.ts`
- `hooks/useRelationshipRules.ts`
- `hooks/useUsers.ts`
- `hooks/useRoles.ts`
- `hooks/useDepartments.ts`
- `hooks/useAudit.ts`
- `features/auth/services/auth.service.ts`
- `app/(app)/dashboard/page.tsx`
- `app/(app)/artefacts/page.tsx`
- `app/(app)/graph/page.tsx`
- `app/(app)/users/page.tsx`
- `app/(app)/audit/page.tsx`
- `app/(app)/settings/page.tsx`
- `app/(app)/artefacts/_components/ExportImportModal.tsx`
- `app/(app)/audit/_components/AuditLogTable.tsx`
- `app/(app)/users/_components/RolePermissionModal.tsx`

### Backend

- `api/src/module/iam/authentication/authentication.controller.ts`
- `api/src/module/iam/users/users.controller.ts`
- `api/src/module/iam/departments/departments.controller.ts`
- `api/src/module/iam/access-control/access-control.controller.ts`
- `api/src/module/iam/access-control/controllers/roles.controller.ts`
- `api/src/module/iam/access-control/controllers/role-permissions.controller.ts`
- `api/src/module/ea/artefacts/artefacts.controller.ts`
- `api/src/module/ea/relationships/relationships.controller.ts`
- `api/src/module/ea/relationship-types/relationship-types.controller.ts`
- `api/src/module/ea/categories/categories.controller.ts`
- `api/src/module/ea/architecture-layers/architecture-layers.controller.ts`
- `api/src/module/audit/audit-logs.controller.ts`
