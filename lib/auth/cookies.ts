import { NextResponse } from "next/server";
import { RequestCookies } from "next/dist/server/web/spec-extension/cookies";

// Cookie configuration
const COOKIE_SECURE = process.env.NODE_ENV === "production";
const COOKIE_SAME_SITE = "strict" as const;

// Cookie names
export const COOKIE_NAMES = {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
} as const;

/**
 * Set authentication cookies in the response
 */
export function setAuthCookies(
    response: NextResponse,
    accessToken: string,
    refreshToken: string,
    accessMaxAge: number,
    refreshMaxAge: number
): void {
    // Set access token cookie
    response.cookies.set(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
        httpOnly: true,
        secure: COOKIE_SECURE,
        sameSite: COOKIE_SAME_SITE,
        maxAge: accessMaxAge,
        path: "/",
    });

    // Set refresh token cookie
    response.cookies.set(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
        httpOnly: true,
        secure: COOKIE_SECURE,
        sameSite: COOKIE_SAME_SITE,
        maxAge: refreshMaxAge,
        path: "/",
    });
}

/**
 * Clear authentication cookies
 */
export function clearAuthCookies(response: NextResponse): void {
    response.cookies.set(COOKIE_NAMES.ACCESS_TOKEN, "", {
        httpOnly: true,
        secure: COOKIE_SECURE,
        sameSite: COOKIE_SAME_SITE,
        maxAge: 0,
        path: "/",
    });

    response.cookies.set(COOKIE_NAMES.REFRESH_TOKEN, "", {
        httpOnly: true,
        secure: COOKIE_SECURE,
        sameSite: COOKIE_SAME_SITE,
        maxAge: 0,
        path: "/",
    });
}

/**
 * Get access token from cookies
 */
export function getAccessTokenFromCookies(cookies: RequestCookies): string | null {
    const cookie = cookies.get(COOKIE_NAMES.ACCESS_TOKEN);
    return cookie?.value || null;
}

/**
 * Get refresh token from cookies
 */
export function getRefreshTokenFromCookies(cookies: RequestCookies): string | null {
    const cookie = cookies.get(COOKIE_NAMES.REFRESH_TOKEN);
    return cookie?.value || null;
}
