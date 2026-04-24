/*
  Auth + IAM smoke tests for local development.
  Usage:
    BASE_URL=http://localhost:3000 node scripts/smoke/auth-iam-smoke.mjs
*/

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const AUTH_EMAIL = process.env.SMOKE_AUTH_EMAIL || 'admin@dss.go.th';
const AUTH_PASSWORD = process.env.SMOKE_AUTH_PASSWORD || 'password123';
const AUTH_FALLBACKS = [
  { email: AUTH_EMAIL, password: AUTH_PASSWORD },
  { email: 'admin@dss.go.th', password: 'password123' },
  { email: 'somchai@dss.go.th', password: 'password123' },
  { email: 'director@dss.go.th', password: 'password123' },
];
const SMOKE_COOKIE = process.env.SMOKE_COOKIE || '';

const cookieJar = new Map();

if (SMOKE_COOKIE) {
  for (const pair of SMOKE_COOKIE.split(';')) {
    const trimmed = pair.trim();
    if (!trimmed) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    cookieJar.set(key, value);
  }
}

function setCookiesFromResponse(response) {
  const rawSetCookie = response.headers.get('set-cookie');
  if (!rawSetCookie) return;

  const cookiePairs = rawSetCookie
    .split(/,\s*(?=[^;]+=)/)
    .map((part) => part.split(';')[0])
    .filter(Boolean);

  for (const pair of cookiePairs) {
    const eq = pair.indexOf('=');
    if (eq <= 0) continue;
    const key = pair.slice(0, eq).trim();
    const value = pair.slice(eq + 1).trim();
    cookieJar.set(key, value);
  }
}

function getCookieHeader() {
  if (cookieJar.size === 0) return '';
  return Array.from(cookieJar.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const cookieHeader = getCookieHeader();
  if (cookieHeader) headers.Cookie = cookieHeader;

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  setCookiesFromResponse(response);

  let json;
  try {
    json = await response.json();
  } catch {
    json = null;
  }

  return { response, json };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

async function loginWithFallbacks() {
  for (const candidate of AUTH_FALLBACKS) {
    const loginRes = await request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(candidate),
    });

    if (loginRes.response.ok && loginRes.json?.success === true) {
      return candidate;
    }
  }

  throw new Error('[Auth] login failed for all credential candidates. Set SMOKE_AUTH_EMAIL and SMOKE_AUTH_PASSWORD to valid credentials.');
}

async function testAuthModule() {
  console.log('\n[Auth] Login -> Me -> Logout');

  const activeCredential = SMOKE_COOKIE ? null : await loginWithFallbacks();

  const meRes = await request('/api/v1/auth/me', { method: 'GET' });
  assert(meRes.response.ok, `[Auth] me failed: ${meRes.json?.error || meRes.response.status}`);
  assert(meRes.json?.success === true, '[Auth] me success flag is false');

  const logoutRes = await request('/api/v1/auth/logout', { method: 'POST' });
  assert(logoutRes.response.ok, `[Auth] logout failed: ${logoutRes.json?.error || logoutRes.response.status}`);
  assert(logoutRes.json?.success === true, '[Auth] logout success flag is false');

  const meAfterLogoutRes = await request('/api/v1/auth/me', { method: 'GET' });
  assert(meAfterLogoutRes.response.status === 401, `[Auth] expected me after logout = 401, got ${meAfterLogoutRes.response.status}`);

  if (activeCredential) {
    const reloginRes = await request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(activeCredential),
    });
    assert(reloginRes.response.ok, '[Auth] relogin failed for IAM module tests');
  }

  console.log('[Auth] PASS');
}

async function ensureRoleAndDepartment() {
  const rolesRes = await request('/api/v1/roles', { method: 'GET' });
  assert(rolesRes.response.ok, `[IAM] cannot load roles: ${rolesRes.json?.error || rolesRes.response.status}`);

  let roleId = rolesRes.json?.data?.[0]?.id;
  if (!Number.isInteger(roleId)) {
    const fallbackRoleName = uid('smoke-bootstrap-role');
    const createRoleRes = await request('/api/v1/roles', {
      method: 'POST',
      body: JSON.stringify({ roleName: fallbackRoleName, description: 'smoke bootstrap role', permissionIds: [] }),
    });
    assert(createRoleRes.response.ok, `[IAM] bootstrap role create failed: ${createRoleRes.json?.error || createRoleRes.response.status}`);
    roleId = createRoleRes.json?.data?.id;
  }
  assert(Number.isInteger(roleId), '[IAM] no role id available after bootstrap');

  const departmentsRes = await request('/api/v1/departments', { method: 'GET' });
  assert(departmentsRes.response.ok, `[IAM] cannot load departments: ${departmentsRes.json?.error || departmentsRes.response.status}`);

  let departmentId = departmentsRes.json?.data?.[0]?.id;
  if (!Number.isInteger(departmentId)) {
    const bootstrapShortName = uid('SMK').slice(0, 20).toUpperCase();
    const bootstrapFullName = uid('Smoke Bootstrap Department');
    const createDepartmentRes = await request('/api/v1/departments', {
      method: 'POST',
      body: JSON.stringify({ shortName: bootstrapShortName, fullName: bootstrapFullName }),
    });
    assert(createDepartmentRes.response.ok, `[IAM] bootstrap department create failed: ${createDepartmentRes.json?.error || createDepartmentRes.response.status}`);
    departmentId = createDepartmentRes.json?.data?.id;
  }
  assert(Number.isInteger(departmentId), '[IAM] no department id available after bootstrap');

  return { roleId, departmentId };
}

async function testUsersModule() {
  console.log('\n[IAM:Users] List -> Create -> Update -> Delete');

  const listRes = await request('/api/v1/users', { method: 'GET' });
  assert(listRes.response.ok, `[Users] list failed: ${listRes.json?.error || listRes.response.status}`);
  assert(Array.isArray(listRes.json?.data), '[Users] list data is not array');

  const { roleId, departmentId } = await ensureRoleAndDepartment();
  const key = uid('smoke-user');

  const createPayload = {
    firstName: 'Smoke',
    lastName: 'User',
    email: `${key}@example.local`,
    username: key,
    password: 'password123',
    roleId,
    departmentId,
  };

  const createRes = await request('/api/v1/users', {
    method: 'POST',
    body: JSON.stringify(createPayload),
  });
  assert(createRes.response.ok, `[Users] create failed: ${createRes.json?.error || createRes.response.status}`);
  const userId = createRes.json?.data?.id;
  assert(Number.isInteger(userId), '[Users] create did not return user id');

  const updateRes = await request(`/api/v1/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({ firstName: 'SmokeUpdated' }),
  });
  assert(updateRes.response.ok, `[Users] update failed: ${updateRes.json?.error || updateRes.response.status}`);

  const deleteRes = await request(`/api/v1/users/${userId}`, { method: 'DELETE' });
  assert(deleteRes.response.ok, `[Users] delete failed: ${deleteRes.json?.error || deleteRes.response.status}`);

  console.log('[IAM:Users] PASS');
}

async function testRolesModule() {
  console.log('\n[IAM:Roles] List -> Create -> Update -> Delete');

  const listRes = await request('/api/v1/roles', { method: 'GET' });
  assert(listRes.response.ok, `[Roles] list failed: ${listRes.json?.error || listRes.response.status}`);
  assert(Array.isArray(listRes.json?.data), '[Roles] list data is not array');

  const roleName = uid('smoke-role');
  let createRes = await request('/api/v1/roles', {
    method: 'POST',
    body: JSON.stringify({ roleName, description: 'smoke role', permissionIds: [] }),
  });

  if (!createRes.response.ok) {
    // Alternate contract used by some implementations.
    createRes = await request('/api/v1/roles', {
      method: 'POST',
      body: JSON.stringify({ roleName, description: 'smoke role', permissions: [] }),
    });
  }

  assert(createRes.response.ok, `[Roles] create failed: ${createRes.json?.error || createRes.response.status}`);
  const roleId = createRes.json?.data?.id;
  assert(Number.isInteger(roleId), '[Roles] create did not return role id');

  const updateRes = await request(`/api/v1/roles/${roleId}`, {
    method: 'PUT',
    body: JSON.stringify({ description: 'smoke role updated' }),
  });
  assert(updateRes.response.ok, `[Roles] update failed: ${updateRes.json?.error || updateRes.response.status}`);

  const deleteRes = await request(`/api/v1/roles/${roleId}`, { method: 'DELETE' });
  assert(deleteRes.response.ok, `[Roles] delete failed: ${deleteRes.json?.error || deleteRes.response.status}`);

  console.log('[IAM:Roles] PASS');
}

async function testDepartmentsModule() {
  console.log('\n[IAM:Departments] List -> Create -> Update -> Delete');

  const listRes = await request('/api/v1/departments', { method: 'GET' });
  assert(listRes.response.ok, `[Departments] list failed: ${listRes.json?.error || listRes.response.status}`);
  assert(Array.isArray(listRes.json?.data), '[Departments] list data is not array');

  const shortName = uid('SMK').slice(0, 20).toUpperCase();
  const fullName = uid('Smoke Department');
  const createRes = await request('/api/v1/departments', {
    method: 'POST',
    body: JSON.stringify({ shortName, fullName }),
  });
  assert(createRes.response.ok, `[Departments] create failed: ${createRes.json?.error || createRes.response.status}`);
  const departmentId = createRes.json?.data?.id;
  assert(Number.isInteger(departmentId), '[Departments] create did not return department id');

  const updateRes = await request(`/api/v1/departments/${departmentId}`, {
    method: 'PUT',
    body: JSON.stringify({ fullName: `${fullName} Updated` }),
  });
  assert(updateRes.response.ok, `[Departments] update failed: ${updateRes.json?.error || updateRes.response.status}`);

  const deleteRes = await request(`/api/v1/departments/${departmentId}`, { method: 'DELETE' });
  assert(deleteRes.response.ok, `[Departments] delete failed: ${deleteRes.json?.error || deleteRes.response.status}`);

  console.log('[IAM:Departments] PASS');
}

async function main() {
  console.log(`Running Auth + IAM smoke tests against ${BASE_URL}`);

  await testAuthModule();
  await testUsersModule();
  await testRolesModule();
  await testDepartmentsModule();

  console.log('\nAll requested modules passed smoke checks.');
}

main().catch((error) => {
  console.error('\nSmoke test failed.');
  console.error(error.message || error);
  process.exit(1);
});
