# IAM API Change List (Before UI Refactor)

Date: 2026-04-27
Scope: IAM only (Auth + Role/Permission + Route Guard contracts)
Out of scope: Delegation/effective-role assignment logic (explicitly excluded)

## 1) Required API changes before UI work

### 1.1 Make role_key first-class and stable (DB + API)

Why: UI will depend on role_key as canonical role identity, not roleName.

Changes:

- Prisma model `Role`
  - Change `roleKey String?` -> `roleKey String @unique`
  - Keep `level` editable (already present).
- Migration data backfill:
  - Backfill existing null `roleKey` with normalized snake_case from `roleName`.
  - Resolve duplicates before adding unique constraint.
- Seed update:
  - Ensure all seeded roles have deterministic `roleKey`.

Files likely touched:

- `api/prisma/schema.prisma`
- `api/prisma/seed.ts`
- new Prisma migration files

---

### 1.2 Normalize auth response contract to snake_case (example-compatible)

Why: contract should be aligned before UI refactor.

Target responses:

- `POST /auth/login`
  - from `{ accessToken, refreshToken, expiresIn, user }`
  - to `{ access_token, refresh_token, expires_in, user }`
- `POST /auth/refresh`
  - same snake_case token fields as login

Notes:

- Keep cookie behavior unchanged.
- If backward compatibility is needed temporarily, support both keys during transition.

Files likely touched:

- `api/src/module/iam/authentication/authentication.service.ts`
- `api/src/module/iam/authentication/authentication.controller.ts`

---

### 1.3 Add `GET /users/me` endpoint

Why: example UI uses `/users/me` for profile bootstrap.

Changes:

- Add `GET /users/me` in UsersController.
- Return current authenticated user profile in snake_case contract.
- Reuse existing user serializer logic (or shared mapper) to avoid drift.

Files likely touched:

- `api/src/module/iam/users/users.controller.ts`
- `api/src/module/iam/users/users.service.ts`

---

### 1.4 Align access-control role payloads to snake_case

Why: example IAM role APIs use snake_case fields.

Endpoints:

- `GET /access-control/roles`
- `GET /access-control/roles/:id`
- `POST /access-control/roles`
- `PATCH /access-control/roles/:id`
- `PATCH /access-control/roles/:id/status`

Expected role fields:

- `name`
- `role_key`
- `description`
- `level`
- `is_active`
- timestamps as `created_at`, `updated_at`
- counts as `_count.users` and `_count.role_permissions`

Current gap:

- service currently returns Prisma raw/camel fields (`roleName`, `roleKey`, `isActive`, `_count.rolePermissions`).

Files likely touched:

- `api/src/module/iam/access-control/services/role.service.ts`
- `api/src/module/iam/access-control/controllers/roles.controller.ts`
- `api/src/module/iam/access-control/types/access-control.types.ts` (if needed)

---

### 1.5 Accept snake_case request DTOs for role create/update

Why: example request bodies use snake_case.

Required request compatibility:

- create role: accept `role_key`, `is_active`
- update role: accept `role_key`, `is_active`
- keep camelCase aliases optional during transition (`roleKey`, `isActive`) to avoid breaking existing consumers

Files likely touched:

- `api/src/module/iam/access-control/dto/create-role.dto.ts`
- `api/src/module/iam/access-control/dto/update-role.dto.ts`

---

### 1.6 Ensure user payload is consistently snake_case for IAM bootstrap

Why: UI bootstrap should consume a single stable profile contract.

Fields to guarantee on profile/list item:

- `id`, `role_id`, `department_id`
- `first_name`, `last_name`, `email`, `username`
- `status`, `is_active`, `last_login_at`
- `created_at`, `updated_at`
- nested role includes `role_key`, `is_active`

Current status:

- users service already returns mixed camel+snake keys; standardize to snake_case primary contract.

Files likely touched:

- `api/src/module/iam/users/users.service.ts`
- `api/src/module/iam/authentication/authentication.service.ts` (serializer for auth endpoints)

---

## 2) Keep as-is (already aligned enough)

- `GET /access-control/me` structure already includes:
  - `subject.user_id`, `subject.role_id`, `subject.role_key`
  - `effective_role_ids`
  - `permissions`
  - `policy_version`, `generated_at`
- Permission token endpoints under `/access-control/roles/:roleId/permission-tokens` are close to example contract.

Files checked:

- `api/src/module/iam/access-control/access-control.controller.ts`
- `api/src/module/iam/access-control/services/permission.service.ts`
- `api/src/module/iam/access-control/controllers/role-permissions.controller.ts`

---

## 3) Optional cleanup (recommended, not blocking)

- Deprecate legacy `/roles` module to reduce duplicate IAM role sources and contract confusion.
  - Current legacy files:
    - `api/src/module/iam/roles/roles.controller.ts`
    - `api/src/module/iam/roles/roles.service.ts`
- Tighten `JwtUserPayload.roleKey` from optional to required after role_key migration is complete.
  - `api/src/pkg/types/jwt-user-payload.ts`

---

## 4) Suggested implementation order

1. DB migration for `roleKey` required + unique, seed/data backfill
2. Role DTO input compatibility (`role_key`/`is_active`)
3. Role API response mapping to snake_case
4. Auth response mapping to snake_case tokens
5. Add `GET /users/me` and finalize user profile contract
6. Optional deprecations/cleanup

---

## 5) Verification checklist for API team

- `POST /auth/login` returns `access_token`, `refresh_token`, `expires_in`
- `POST /auth/refresh` returns same snake_case token keys
- `GET /users/me` exists and returns snake_case user profile
- `GET /access-control/roles` returns role items with `role_key`, `is_active`, `_count.role_permissions`
- `POST/PATCH /access-control/roles` accepts `role_key` and `is_active`
- `GET /access-control/me` still returns valid permission snapshot
- No delegation logic added

---

## 6) Impact note for upcoming UI refactor

After these API changes are done, UI can be refactored to example-style IAM layers with minimal adapter shims and lower regression risk.
