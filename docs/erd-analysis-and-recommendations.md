# การวิเคราะห์ ERD Schema และข้อเสนอแนะ

## สรุปผลการตรวจสอบ

### ✅ สิ่งที่ตรงตาม TOR แล้ว

1. **RBAC System** ✅
   - `users`, `roles`, `permissions`, `role_permissions`
   - รองรับ Admin, Architect, Viewer (ข้อ 3)
   - มี `failed_login_attempts`, `locked_until` สำหรับ security

2. **TOGAF Architecture Layers** ✅
   - `architecture_layers` รองรับ 6 layers ตาม TOR:
     - Business Architecture
     - Data Architecture
     - Application Architecture
     - Technology Architecture
     - Security Architecture
     - Integration Architecture

3. **Artifact Management** ✅
   - `artifacts` table มี `version`, `lifecycle_status`
   - `artifact_categories` เชื่อมกับ architecture layers
   - `artifact_attributes` สำหรับ metadata (Owner, Latest Update, Usage Frequency)

4. **Relationships** ✅
   - `relationships`, `relationship_types` รองรับการสร้างโมเดลความสัมพันธ์

5. **Audit Trail** ✅
   - `audit_trails` table สำหรับบันทึกการใช้งาน (ข้อ 18)

6. **Department Hierarchy** ✅
   - `departments` รองรับ hierarchical structure (`parent_id`)

---

## ⚠️ สิ่งที่ควรเพิ่ม/ปรับปรุง

### 1. **Version History Table** (สำคัญมาก - ข้อ 11)

**ปัญหา**: ตอนนี้มีแค่ `version` field แต่ไม่มี history ของแต่ละ version

**แนะนำ**: เพิ่ม table สำหรับเก็บ version history

```sql
Table artifact_versions {
  id int [pk, increment]
  artifact_id int [not null, ref: > artifacts.id]
  version_number int [not null]
  version_label varchar  // เช่น "v1.0", "v2.1-beta"
  
  artifact_name varchar [not null]
  description text
  lifecycle_status varchar [not null]
  
  created_by_id int [ref: > users.id]
  created_at timestamp [not null, default: `now()`]
  
  change_summary text  // สรุปการเปลี่ยนแปลง
  change_details json  // รายละเอียดการเปลี่ยนแปลง
  
  Indexes {
    (artifact_id, version_number) [unique]
    artifact_id
  }
}
```

**เหตุผล**: TOR ข้อ 11 ระบุชัดเจนว่าต้องรองรับ Version Control ของ Artifact แต่ละรายการ

---

### 2. **Artifact Templates & Best Practices** (ข้อ 13)

**ปัญหา**: ไม่มี table สำหรับเก็บ templates และ best practices

**แนะนำ**: เพิ่ม tables สำหรับ templates

```sql
Table artifact_templates {
  id int [pk, increment]
  architecture_layer_id int [not null, ref: > architecture_layers.id]
  artifact_category_id int [ref: > artifact_categories.id]
  
  template_name varchar [not null]
  description text
  template_data json [not null]  // เก็บ structure ของ template
  
  is_best_practice boolean [not null, default: false]
  usage_count int [not null, default: 0]
  
  created_by_id int [ref: > users.id]
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null]
  
  Indexes {
    architecture_layer_id
    artifact_category_id
  }
}
```

**เหตุผล**: TOR ข้อ 13 ระบุว่าต้องมี Template และ Best practice libraries

---

### 3. **Export/Import Logs** (ข้อ 4)

**ปัญหา**: ไม่มี table สำหรับ track การ export/import

**แนะนำ**: เพิ่ม table สำหรับบันทึกการ export/import

```sql
Table export_import_logs {
  id int [pk, increment]
  user_id int [not null, ref: > users.id]
  
  operation_type varchar [not null]  // 'EXPORT' หรือ 'IMPORT'
  file_format varchar [not null]  // 'CSV', 'EXCEL'
  file_name varchar [not null]
  file_path varchar
  
  record_count int  // จำนวน records ที่ export/import
  status varchar [not null]  // 'SUCCESS', 'FAILED', 'PARTIAL'
  error_message text
  
  created_at timestamp [not null, default: `now()`]
  
  Indexes {
    user_id
    operation_type
    created_at
  }
}
```

**เหตุผล**: TOR ข้อ 4 ระบุว่าต้องรองรับ Export/Import CSV/Excel และควรมี audit trail

---

### 4. **Notifications & Alerts** (ข้อ 21)

**ปัญหา**: ไม่มี table สำหรับ notifications/alerts

**แนะนำ**: เพิ่ม table สำหรับ notifications

```sql
Table notifications {
  id int [pk, increment]
  user_id int [not null, ref: > users.id]
  
  notification_type varchar [not null]  // 'EMAIL', 'IN_APP', 'BOTH'
  notification_category varchar [not null]  // 'ARTIFACT_UPDATE', 'SYSTEM_ALERT', etc.
  
  title varchar [not null]
  message text [not null]
  
  is_read boolean [not null, default: false]
  read_at timestamp
  
  related_entity_type varchar  // 'artifact', 'user', 'system'
  related_entity_id int
  
  created_at timestamp [not null, default: `now()`]
  
  Indexes {
    user_id
    is_read
    created_at
  }
}
```

**เหตุผล**: TOR ข้อ 21 ระบุว่าต้องรองรับ Notification & Alert ผ่าน Email หรือ In-App

---

### 5. **File Attachments**

**ปัญหา**: ไม่มี table สำหรับเก็บไฟล์ที่ attach กับ artifacts

**แนะนำ**: เพิ่ม table สำหรับ file attachments

```sql
Table artifact_attachments {
  id int [pk, increment]
  artifact_id int [not null, ref: > artifacts.id]
  
  file_name varchar [not null]
  file_path varchar [not null]
  file_size bigint [not null]  // bytes
  mime_type varchar [not null]
  
  uploaded_by_id int [ref: > users.id]
  uploaded_at timestamp [not null, default: `now()`]
  
  description text
  
  Indexes {
    artifact_id
  }
}
```

**เหตุผล**: Best practice สำหรับ EA system ควรรองรับการแนบไฟล์เอกสาร

---

### 6. **Comments/Notes on Artifacts**

**ปัญหา**: ไม่มี table สำหรับ comments บน artifacts

**แนะนำ**: เพิ่ม table สำหรับ comments

```sql
Table artifact_comments {
  id int [pk, increment]
  artifact_id int [not null, ref: > artifacts.id]
  user_id int [not null, ref: > users.id]
  
  comment_text text [not null]
  parent_comment_id int [ref: > artifact_comments.id, null]  // สำหรับ nested comments
  
  is_resolved boolean [not null, default: false]
  
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null]
  
  Indexes {
    artifact_id
    user_id
    parent_comment_id
  }
}
```

**เหตุผล**: Best practice สำหรับ collaboration ใน EA system

---

### 7. **Tags System**

**ปัญหา**: ไม่มี table สำหรับ tagging artifacts

**แนะนำ**: เพิ่ม tables สำหรับ tags

```sql
Table tags {
  id int [pk, increment]
  tag_name varchar [not null, unique]
  tag_color varchar  // สำหรับ UI
  created_at timestamp [not null, default: `now()`]
}

Table artifact_tags {
  id int [pk, increment]
  artifact_id int [not null, ref: > artifacts.id]
  tag_id int [not null, ref: > tags.id]
  created_at timestamp [not null, default: `now()`]
  
  Indexes {
    (artifact_id, tag_id) [unique]
    artifact_id
    tag_id
  }
}
```

**เหตุผล**: ช่วยในการค้นหาและจัดหมวดหมู่ artifacts

---

### 8. **Soft Delete Support**

**ปัญหา**: ไม่มี `deleted_at` field สำหรับ soft delete

**แนะนำ**: เพิ่ม `deleted_at` field ใน tables หลัก

```sql
// เพิ่มใน artifacts table
deleted_at timestamp [null]
deleted_by_id int [ref: > users.id, null]

// เพิ่มใน users table
deleted_at timestamp [null]
deleted_by_id int [ref: > users.id, null]
```

**เหตุผล**: Best practice สำหรับการเก็บข้อมูล audit และ recovery

---

### 9. **Search History** (Optional แต่แนะนำ)

**แนะนำ**: เพิ่ม table สำหรับเก็บ search history

```sql
Table search_history {
  id int [pk, increment]
  user_id int [not null, ref: > users.id]
  
  search_query varchar [not null]
  search_filters json  // เก็บ filters ที่ใช้
  result_count int
  
  created_at timestamp [not null, default: `now()`]
  
  Indexes {
    user_id
    created_at
  }
}
```

**เหตุผล**: ช่วยในการปรับปรุง UX และ analytics

---

### 10. **ปรับปรุง Existing Tables**

#### 10.1 `artifacts` table
- ✅ มี `version` แล้ว แต่ควรเพิ่ม `previous_version_id` สำหรับ track lineage
- ✅ มี `lifecycle_status` แล้ว
- ⚠️ ควรเพิ่ม `deleted_at`, `deleted_by_id` สำหรับ soft delete

#### 10.2 `artifact_attributes` table
- ✅ ดีแล้ว แต่ควรเพิ่ม `attribute_type` (TEXT, JSON, NUMBER, DATE) เพื่อความชัดเจน

#### 10.3 `audit_trails` table
- ✅ ดีแล้ว แต่ควรเพิ่ม `ip_address`, `user_agent` สำหรับ security audit

---

## 📊 สรุปคะแนน

| หมวดหมู่ | คะแนน | หมายเหตุ |
|---------|-------|---------|
| **TOR Compliance** | 8/10 | ขาด Version History table |
| **Best Practices** | 7/10 | ขาด Templates, Attachments, Comments |
| **Security** | 8/10 | ดี แต่ควรเพิ่ม soft delete |
| **Scalability** | 9/10 | ดีมาก |
| **Maintainability** | 8/10 | ดี แต่ควรเพิ่ม audit fields |

**คะแนนรวม: 8.0/10** ⭐⭐⭐⭐

---

## 🎯 คำแนะนำลำดับความสำคัญ

### Priority 1 (ต้องทำ - ตาม TOR)
1. ✅ **Version History Table** - ข้อ 11
2. ✅ **Templates Table** - ข้อ 13
3. ✅ **Export/Import Logs** - ข้อ 4

### Priority 2 (ควรทำ - Best Practice)
4. ✅ **Notifications Table** - ข้อ 21
5. ✅ **File Attachments Table**
6. ✅ **Soft Delete Support**

### Priority 3 (Nice to Have)
7. ✅ **Comments Table**
8. ✅ **Tags System**
9. ✅ **Search History**

---

## 📝 สรุป

ERD ปัจจุบัน **ดีมาก** และครอบคลุมความต้องการหลักของ TOR แล้ว แต่ยังขาดบางส่วนที่สำคัญ:

1. **Version History** - สำคัญมากเพราะ TOR ระบุชัดเจน
2. **Templates & Best Practices** - TOR ระบุไว้
3. **Export/Import Logs** - สำหรับ audit trail

ส่วนอื่นๆ เป็น best practices ที่จะทำให้ระบบสมบูรณ์และใช้งานได้ดีขึ้น

**คำแนะนำ**: ควรเพิ่ม Priority 1 ก่อน แล้วค่อยเพิ่ม Priority 2-3 ตามความเหมาะสม
