import { NextRequest, NextResponse } from "next/server";
import { getBackendOrigin } from "@/lib/backend-origin";

const BACKEND_ORIGIN = getBackendOrigin();

/**
 * Generic proxy helper for Next.js BFF route handlers.
 * Forwards requests to the NestJS backend with proper auth headers.
 */
export async function proxyToBackend(
  request: NextRequest,
  backendPath: string,
  options?: { method?: string },
): Promise<NextResponse> {
  try {
    const backendUrl = new URL(`${BACKEND_ORIGIN}/api/v1${backendPath}`);

    // Forward all query parameters
    request.nextUrl.searchParams.forEach((value, key) => {
      backendUrl.searchParams.set(key, value);
    });

    const headers: Record<string, string> = {};

    // Prefer the fresh HttpOnly cookie set by the BFF over any client-side
    // Authorization header, which can lag behind right after login/refresh.
    const accessToken = request.cookies.get("access_token")?.value;
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    } else {
      const authHeader = request.headers.get("Authorization");
      if (authHeader) {
        headers["Authorization"] = authHeader;
      }
    }

    // Forward cookies so the backend can read the refresh token
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      headers["Cookie"] = cookieHeader;
    }

    const method = options?.method || request.method;

    let body: BodyInit | undefined;
    if (["POST", "PUT", "PATCH"].includes(method)) {
      const contentType = request.headers.get("content-type") || "";
      if (contentType.includes("multipart/form-data")) {
        // Forward form data as-is
        body = await request.blob();
        headers["Content-Type"] = contentType;
      } else {
        const text = await request.text();
        if (text) {
          body = text;
          headers["Content-Type"] = "application/json";
        } else {
          headers["Content-Type"] = "application/json";
        }
      }
    }

    const backendResponse = await fetch(backendUrl.toString(), {
      method,
      headers,
      body,
    });

    const responseContentType =
      backendResponse.headers.get("content-type") || "";

    // Pass through binary / CSV responses directly
    if (
      responseContentType.includes("text/csv") ||
      responseContentType.includes("application/octet-stream") ||
      responseContentType.includes("application/vnd")
    ) {
      const arrayBuffer = await backendResponse.arrayBuffer();
      const nextResponse = new NextResponse(arrayBuffer, {
        status: backendResponse.status,
      });
      nextResponse.headers.set("Content-Type", responseContentType);
      const disposition = backendResponse.headers.get("Content-Disposition");
      if (disposition) {
        nextResponse.headers.set("Content-Disposition", disposition);
      }
      return nextResponse;
    }

    const responseText = await backendResponse.text();
    const nextResponse = new NextResponse(responseText, {
      status: backendResponse.status,
      headers: { "Content-Type": "application/json" },
    });

    return nextResponse;
  } catch (error) {
    console.error(`[api-proxy] Error proxying ${backendPath}:`, error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
