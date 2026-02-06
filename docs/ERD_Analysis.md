# การวิเคราะห์ ERD Schema กับ TOR และ Best Practices

## 📋 สรุปการตรวจสอบ

### ✅ **ส่วนที่ตรงตาม TOR**

#### 1. **RBAC/AUTH (ข้อ 3, 16, 17)**
- ✅ `users` - รองรับ Username/Password, LDAP
- ✅ `roles` - Admin, Architect, Viewer (ตาม TOR)
- ✅ `permissions` + `role_permissions` - Role-based access control
- ✅ `departments` - Hierarchical structure (parent_id)
- ✅ `audit_trails` - Audit log (ข้อ 18)

#### 2. **EA CORE - TOGAF (ข้อ 6)**
- ✅ `architecture_layers` - 6 layers:
  - Business Architecture
  - Data Architecture  
  - Application Architecture
  - Technology Architecture
  - Security Architecture
  - Integration Architecture
- ✅ `artifact_categories` - จัดหมวดหมู่ตาม layer
- ✅ `artifacts` - จัดเก็บ artifacts พร้อม version control (ข้อ 11)
- ✅ `artifact_attributes` - Metadata (Owner, Latest Update, Usage Frequency) (ข้อ 12)
- ✅ `relationships` + `relationship_types` - สร้างโมเดลความสัมพันธ์ (ข้อ 7)

#### 3. **VIEW/DASHBOARD (ข้อ 8, 9, 15)**
- ✅ `view_definitions` - Executive view, Solution architect view, Dashboard config

---

## ⚠️ **ปัญหาที่พบและข้อเสนอแนะ**

### 1. **Version Control (ข้อ 11) - ไม่ครบถ้วน**

**ปัญหา:**
- `artifacts.version` เป็น `int` แต่ไม่มี history table
- ไม่สามารถ track การเปลี่ยนแปลงแต่ละ version ได้
- ไม่มี `version_history` หรือ `artifact_versions` table

**แนะนำ:**
```sql
Table artifact_versions {
  id int [pk, increment]
  artifact_id int [not null, ref: > artifacts.id]
  version_number int [not null]
  version_label varchar  // "v1.0", "v2.1"
  change_summary text
  created_by_id int [ref: > users.id]
  created_at timestamp [not null, default: `now()`]
  
  Indexes {
    (artifact_id, version_number) [unique]
  }
}
```

### 2. **Metadata (ข้อ 12) - ควรปรับปรุง**

**ปัญหา:**
- `artifact_attributes` ใช้ key-value pattern ซึ่งยืดหยุ่นแต่ query ยาก
- ไม่มี field สำหรับ Owner, Latest Update, Usage Frequency โดยตรง

**แนะนำ:**
```sql
Table artifacts {
  // ... existing fields ...
  
  owner_user_id int [ref: > users.id, null]  // เพิ่มตรงนี้
  owner_department_id int [ref: > departments.id, null]  // มีอยู่แล้ว
  last_updated_at timestamp [not null]  // เพิ่ม
  usage_frequency varchar  // 'high' | 'medium' | 'low'
  
  // หรือเก็บใน artifact_attributes ก็ได้ แต่ควรมี index
}
```

### 3. **Export/Import (ข้อ 4) - ไม่มี tracking**

**แนะนำ:**
```sql
Table export_import_logs {
  id int [pk, increment]
  user_id int [not null, ref: > users.id]
  operation_type varchar [not null]  // 'export' | 'import'
  file_format varchar [not null]  // 'csv' | 'excel'
  entity_type varchar  // 'artifacts' | 'relationships' | 'users'
  record_count int
  file_path varchar
  status varchar  // 'success' | 'failed' | 'processing'
  error_message text
  created_at timestamp [not null, default: `now()`]
  
  Indexes {
    user_id
    created_at
  }
}
```

### 4. **Templates & Best Practices (ข้อ 13) - ไม่มี**

**แนะนำ:**
```sql
Table artifact_templates {
  id int [pk, increment]
  architecture_layer_id int [not null, ref: > architecture_layers.id]
  artifact_category_id int [ref: > artifact_categories.id]
  template_name varchar [not null]
  template_description text
  template_data json [not null]  // เก็บ structure + example data
  is_active boolean [not null, default: true]
  usage_count int [default: 0]
  created_by_id int [ref: > users.id]
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null]
  
  Indexes {
    architecture_layer_id
    is_active
  }
}

Table best_practices {
  id int [pk, increment]
  architecture_layer_id int [ref: > architecture_layers.id]
  title varchar [not null]
  description text
  content text  // หรือ json สำหรับ structured content
  category varchar  // 'guideline' | 'example' | 'checklist'
  is_active boolean [not null, default: true]
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null]
}
```

### 5. **Search/Filter (ข้อ 14) - ไม่มี full-text search support**

**แนะนำ:**
- เพิ่ม full-text search index บน `artifacts.artifact_name`, `artifacts.description`
- หรือใช้ `artifact_attributes` สำหรับ searchable fields
- พิจารณาใช้ PostgreSQL `tsvector` หรือ Elasticsearch

### 6. **Notifications (ข้อ 21) - ไม่มี**

**แนะนำ:**
```sql
Table notifications {
  id int [pk, increment]
  user_id int [not null, ref: > users.id]
  notification_type varchar [not null]  // 'alert' | 'info' | 'warning'
  title varchar [not null]
  message text
  entity_type varchar  // 'artifact' | 'relationship' | 'user'
  entity_id int
  is_read boolean [not null, default: false]
  created_at timestamp [not null, default: `now()`]
  
  Indexes {
    (user_id, is_read)
    created_at
  }
}
```

### 7. **API Integration (ข้อ 20) - ไม่มี API keys/tokens**

**แนะนำ:**
```sql
Table api_keys {
  id int [pk, increment]
  user_id int [not null, ref: > users.id]
  key_name varchar [not null]
  api_key varchar [not null, unique]
  api_secret varchar  // สำหรับ HMAC
  permissions json  // กำหนด permissions
  expires_at timestamp
  last_used_at timestamp
  is_active boolean [not null, default: true]
  created_at timestamp [not null, default: `now()`]
  
  Indexes {
    api_key
    user_id
  }
}
```

### 8. **WiFi Authenticator (ภาคผนวก จ) - ไม่มี**

**แนะนำ:**
```sql
Table wifi_users {
  id int [pk, increment]
  user_id int [ref: > users.id, null]  // link กับ system user
  username varchar [not null, unique]
  password_hash varchar [not null]
  email varchar
  phone varchar
  mac_address varchar
  device_type varchar  // 'laptop' | 'mobile' | 'tablet'
  status varchar  // 'active' | 'blocked' | 'expired'
  expiry_date timestamp
  created_at timestamp [not null, default: `now()`]
  last_login_at timestamp
  
  Indexes {
    username
    mac_address
  }
}

Table wifi_sessions {
  id int [pk, increment]
  wifi_user_id int [not null, ref: > wifi_users.id]
  ip_address varchar
  mac_address varchar
  start_time timestamp [not null]
  end_time timestamp
  bytes_sent bigint
  bytes_received bigint
  created_at timestamp [not null, default: `now()`]
  
  Indexes {
    wifi_user_id
    start_time
  }
}
```

### 9. **Best Practices - Database Design**

#### ✅ **ดีแล้ว:**
- ใช้ foreign keys ครบถ้วน
- มี indexes สำหรับ foreign keys
- มี unique constraints ที่เหมาะสม
- มี timestamps (created_at, updated_at)
- มี soft delete support (status/is_active)

#### ⚠️ **ควรปรับปรุง:**

1. **Naming Convention:**
   - ใช้ `snake_case` สม่ำเสมอ ✅
   - แต่ควรใช้ `artifacts` แทน `artifacts` (plural) ✅

2. **Data Types:**
   - `artifacts.version` ควรเป็น `varchar` สำหรับ "v1.0", "v2.1" แทน `int`
   - `lifecycle_status` ควรเป็น enum หรือ reference table

3. **Normalization:**
   - `artifact_attributes` เป็น EAV pattern - ดีสำหรับ flexibility แต่ควรมี specific columns สำหรับ common attributes

4. **Indexes:**
   - เพิ่ม index บน `artifacts.artifact_name` สำหรับ search
   - เพิ่ม index บน `artifacts.created_at`, `artifacts.updated_at` สำหรับ sorting
   - เพิ่ม composite index `(architecture_layer_id, artifact_category_id)` สำหรับ filtering

5. **Constraints:**
   - เพิ่ม check constraint สำหรับ `lifecycle_status` values
   - เพิ่ม check constraint สำหรับ `usage_frequency` values

---

## 📊 **สรุปคะแนน**

| หมวดหมู่ | คะแนน | หมายเหตุ |
|---------|-------|----------|
| **RBAC/Auth** | 9/10 | ครบถ้วน แต่ขาด API keys |
| **EA Core** | 8/10 | ครบแต่ขาด version history |
| **Metadata** | 7/10 | มีแต่ควรปรับโครงสร้าง |
| **Relationships** | 9/10 | ดีมาก |
| **Audit Trail** | 8/10 | มีแต่ควรเพิ่ม details |
| **Export/Import** | 5/10 | ไม่มี tracking |
| **Templates** | 0/10 | ไม่มีเลย |
| **Notifications** | 0/10 | ไม่มีเลย |
| **WiFi Auth** | 0/10 | ไม่มีเลย (ภาคผนวก จ) |

**คะแนนรวม: 6.2/10**

---

## 🎯 **คำแนะนำเร่งด่วน**

### Priority 1 (ต้องมี):
1. ✅ เพิ่ม `artifact_versions` table สำหรับ version control
2. ✅ เพิ่ม `artifact_templates` และ `best_practices` tables
3. ✅ เพิ่ม `notifications` table
4. ✅ เพิ่ม `export_import_logs` table

### Priority 2 (ควรมี):
5. ✅ ปรับ `artifacts.version` เป็น varchar และเพิ่ม version history
6. ✅ เพิ่ม indexes สำหรับ performance
7. ✅ เพิ่ม `api_keys` table สำหรับ API integration

### Priority 3 (ถ้ามีเวลา):
8. ✅ เพิ่ม WiFi Authenticator tables (ภาคผนวก จ)
9. ✅ ปรับปรุง `artifact_attributes` structure
10. ✅ เพิ่ม full-text search support

---

## 📝 **ERD ที่แนะนำ (สรุป)**

```sql
// เพิ่ม tables เหล่านี้:

Table artifact_versions { ... }
Table artifact_templates { ... }
Table best_practices { ... }
Table notifications { ... }
Table export_import_logs { ... }
Table api_keys { ... }
Table wifi_users { ... }  // ถ้าต้องการ WiFi Auth
Table wifi_sessions { ... }  // ถ้าต้องการ WiFi Auth

// แก้ไข tables ที่มีอยู่:

Table artifacts {
  // เพิ่ม fields:
  owner_user_id int [ref: > users.id, null]
  last_updated_at timestamp [not null]
  usage_frequency varchar  // หรือเก็บใน artifact_attributes
  
  // แก้ไข:
  version varchar  // แทน int
  
  // เพิ่ม indexes:
  Indexes {
    artifact_name [fulltext]  // สำหรับ search
    created_at
    updated_at
    (architecture_layer_id, artifact_category_id)
  }
}
```

---

**สรุป:** ERD ปัจจุบันดีมากสำหรับโครงสร้างพื้นฐาน แต่ยังขาด features สำคัญหลายอย่างตาม TOR โดยเฉพาะ Version History, Templates, และ Notifications ควรเพิ่มก่อน deploy
