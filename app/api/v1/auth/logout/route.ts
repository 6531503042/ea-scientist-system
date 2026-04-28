import { NextRequest, NextResponse } from "next/server";
import { getBackendOrigin } from "@/lib/backend-origin";
import { clearAuthCookies } from "@/lib/auth/cookies";

const BACKEND_ORIGIN = getBackendOrigin();

export async function POST(request: NextRequest) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const authHeader = request.headers.get("Authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    } else {
      const accessToken = request.cookies.get("access_token")?.value;
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }

    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      headers["Cookie"] = cookieHeader;
    }

    const backendResponse = await fetch(
      `${BACKEND_ORIGIN}/api/v1/auth/logout`,
      { method: "POST", headers, body: JSON.stringify({}) },
    );

    const data = await backendResponse.json().catch(() => ({}));
    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    // Always clear auth cookies on logout
    clearAuthCookies(response);

    return response;
  } catch (error) {
    console.error("[auth/logout] proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
