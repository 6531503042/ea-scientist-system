import { NextRequest, NextResponse } from "next/server";
import { getBackendOrigin } from "@/lib/backend-origin";
import { setAuthCookies } from "@/lib/auth/cookies";

const BACKEND_ORIGIN = getBackendOrigin();

export async function POST(request: NextRequest) {
  try {
    // Read refresh token from the normalized snake_case cookie set by login BFF
    const refreshToken = request.cookies.get("refresh_token")?.value;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (refreshToken) {
      // NestJS backend expects camelCase cookie name "refreshToken"
      headers["Cookie"] =
        `refreshToken=${refreshToken}; refresh_token=${refreshToken}`;
    } else {
      // Forward original cookies as-is
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        headers["Cookie"] = cookieHeader;
      }
    }

    const backendResponse = await fetch(
      `${BACKEND_ORIGIN}/api/v1/auth/refresh`,
      { method: "POST", headers, body: JSON.stringify({}) },
    );

    const data = await backendResponse.json().catch(() => ({}));
    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    if (!backendResponse.ok) {
      return response;
    }

    // Parse new tokens from the backend's Set-Cookie headers
    const setCookieHeaders = backendResponse.headers.getSetCookie?.() || [];
    const payload = data?.data ?? {};
    let newAccessToken: string | null =
      payload?.access_token ?? payload?.accessToken ?? null;
    let newRefreshToken: string | null =
      payload?.refresh_token ?? payload?.refreshToken ?? null;
    let accessMaxAge = 900;
    let refreshMaxAge = 604800;

    for (const header of setCookieHeaders) {
      if (header.includes("accessToken=")) {
        const match = header.match(/accessToken=([^;]+)/);
        if (match) newAccessToken = match[1];
        const maxAgeMatch = header.match(/Max-Age=(\d+)/);
        if (maxAgeMatch) accessMaxAge = parseInt(maxAgeMatch[1], 10);
      }
      if (header.includes("refreshToken=")) {
        const match = header.match(/refreshToken=([^;]+)/);
        if (match) newRefreshToken = match[1];
        const maxAgeMatch = header.match(/Max-Age=(\d+)/);
        if (maxAgeMatch) refreshMaxAge = parseInt(maxAgeMatch[1], 10);
      }
    }

    if (newAccessToken && newRefreshToken) {
      setAuthCookies(
        response,
        newAccessToken,
        newRefreshToken,
        accessMaxAge,
        refreshMaxAge,
      );
    }

    return response;
  } catch (error) {
    console.error("[auth/refresh] proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
