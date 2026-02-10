import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getAccessTokenFromCookies } from "@/lib/auth/cookies";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { AuthService } from "@/lib/services/auth/auth-service";

const authService = new AuthService();

export async function GET(request: NextRequest) {
    try {
        const token = getAccessTokenFromCookies(request.cookies);

        if (!token) {
            return NextResponse.json(
                { success: false, error: "Not authenticated" },
                { status: 401 }
            );
        }

        const payload = await verifyAccessToken(token);

        if (!payload) {
            return NextResponse.json(
                { success: false, error: "Invalid token" },
                { status: 401 }
            );
        }

        // Optional: Fetch fresh user data from DB to ensure they still exist/are active
        // For performance, we could trust the token, but fetching ensures disabled users are caught
        // Here we'll trust the token payload for speed, or implement a lightweight check

        return NextResponse.json({
            success: true,
            data: {
                id: payload.userId,
                email: payload.email,
                role: payload.role,
                roleId: payload.roleId,
                department: payload.department,
                departmentId: payload.departmentId
            },
        });
    } catch (error) {
        console.error("Auth check error:", error);
        return NextResponse.json(
            { success: false, error: "Authentication failed" },
            { status: 401 }
        );
    }
}
