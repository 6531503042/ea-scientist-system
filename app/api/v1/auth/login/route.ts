import { NextRequest, NextResponse } from "next/server";
import { getBackendOrigin } from "@/lib/backend-origin";
import { setAuthCookies } from "@/lib/auth/cookies";

function normalizeRole(role: Record<string, unknown> | null | undefined) {
  if (!role) {
    return undefined;
  }

  return {
    id: role.id,
    name: role.name,
    description: role.description ?? null,
    roleKey: role.roleKey ?? role.role_key,
    level: role.level,
    isActive: role.isActive ?? role.is_active,
  };
}

function normalizeDepartment(
  department: Record<string, unknown> | null | undefined,
) {
  if (!department) {
    return undefined;
  }

  return {
    id: department.id,
    name: department.name ?? department.fullName ?? department.full_name,
  };
}

function normalizeUser(user: Record<string, unknown> | null | undefined) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    roleId: user.roleId ?? user.role_id,
    departmentId: user.departmentId ?? user.department_id,
    firstName: user.firstName ?? user.first_name,
    lastName: user.lastName ?? user.last_name,
    email: user.email,
    username: user.username,
    phoneNumber: user.phoneNumber ?? user.phone_number ?? null,
    status: user.status,
    mustChangePassword:
      user.mustChangePassword ?? user.must_change_password ?? false,
    lastLoginAt: user.lastLoginAt ?? user.last_login_at ?? null,
    createdAt: user.createdAt ?? user.created_at,
    updatedAt: user.updatedAt ?? user.updated_at,
    role: normalizeRole(
      (user.role as Record<string, unknown> | undefined) ?? undefined,
    ),
    department: normalizeDepartment(
      (user.department as Record<string, unknown> | undefined) ?? undefined,
    ),
  };
}

/**
 * Proxy login endpoint that:
 * 1. Forwards credentials to backend API
 * 2. Receives cookies from backend (accessToken, refreshToken with camelCase)
 * 3. Sets normalized cookies (access_token, refresh_token with snake_case names for HttpOnly cookies)
 * 4. Returns the JSON response
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendOrigin = getBackendOrigin();

    // Forward to backend login endpoint
    const backendResponse = await fetch(`${backendOrigin}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Get response data
    const data = await backendResponse.json();
    const payload = data?.data ?? null;

    const accessToken = payload?.access_token ?? payload?.accessToken ?? null;
    const refreshToken =
      payload?.refresh_token ?? payload?.refreshToken ?? null;

    const normalizedData = payload
      ? {
          accessToken: accessToken,
          refreshToken: refreshToken,
          expiresIn: payload.expiresIn ?? payload.expires_in ?? null,
          user: normalizeUser(payload.user),
        }
      : null;

    // Parse Set-Cookie headers from backend
    const setCookieHeaders = backendResponse.headers.getSetCookie?.() || [];
    let accessMaxAge = 900; // 15 minutes default
    let refreshMaxAge = 604800; // 7 days default

    for (const header of setCookieHeaders) {
      if (header.includes("refreshToken=")) {
        const maxAgeMatch = header.match(/Max-Age=(\d+)/);
        if (maxAgeMatch) refreshMaxAge = parseInt(maxAgeMatch[1], 10);
      }
      if (header.includes("accessToken=") || header.includes("refreshToken=")) {
        const maxAgeMatch = header.match(/Max-Age=(\d+)/);
        if (maxAgeMatch && header.includes("accessToken=")) {
          accessMaxAge = parseInt(maxAgeMatch[1], 10);
        }
      }
    }

    // Create response
    const responseBody = normalizedData
      ? {
          ...data,
          data: normalizedData,
        }
      : data;

    const response = NextResponse.json(responseBody, {
      status: backendResponse.status,
    });

    // Set normalized cookies
    if (accessToken && refreshToken) {
      setAuthCookies(
        response,
        accessToken,
        refreshToken,
        accessMaxAge,
        refreshMaxAge,
      );
    }

    return response;
  } catch (error) {
    console.error("Login proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
