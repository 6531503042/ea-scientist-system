import { NextRequest, NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/auth/cookies";

/**
 * Proxy login endpoint that:
 * 1. Forwards credentials to backend API
 * 2. Receives cookies from backend (accessToken, refreshToken with camelCase)
 * 3. Sets normalized cookies (access_token, refresh_token with snake_case)
 * 4. Returns the JSON response
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward to backend login endpoint
    const backendResponse = await fetch(
      "http://localhost:3000/api/v1/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    // Get response data
    const data = await backendResponse.json();

    // Parse Set-Cookie headers from backend
    const setCookieHeaders = backendResponse.headers.getSetCookie?.() || [];
    let accessToken: string | null = null;
    let refreshToken: string | null = null;
    let accessMaxAge = 900; // 15 minutes default
    let refreshMaxAge = 604800; // 7 days default

    for (const header of setCookieHeaders) {
      if (header.includes("accessToken=")) {
        const match = header.match(/accessToken=([^;]+)/);
        if (match) accessToken = match[1];
        // Try to extract Max-Age if present
        const maxAgeMatch = header.match(/Max-Age=(\d+)/);
        if (maxAgeMatch) accessMaxAge = parseInt(maxAgeMatch[1], 10);
      }
      if (header.includes("refreshToken=")) {
        const match = header.match(/refreshToken=([^;]+)/);
        if (match) refreshToken = match[1];
        const maxAgeMatch = header.match(/Max-Age=(\d+)/);
        if (maxAgeMatch) refreshMaxAge = parseInt(maxAgeMatch[1], 10);
      }
    }

    // Create response
    const response = NextResponse.json(data, {
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
