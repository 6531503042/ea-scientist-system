import { NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth/auth-service";
import { loginSchema } from "@/lib/validators/auth-validator";
import {
    generateAccessToken,
    generateRefreshToken,
    getTokenExpiration,
} from "@/lib/auth/jwt";
import { setAuthCookies } from "@/lib/auth/cookies";

const authService = new AuthService();

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate input
        const result = loginSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Validation failed",
                    details: result.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { email, password } = result.data;

        // Authenticate user
        const user = await authService.login(email, password);

        if (!user) {
            return NextResponse.json(
                { success: false, error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Generate tokens
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role.roleName,
            roleId: user.roleId,
            department: user.department?.fullName || null,
            departmentId: user.departmentId,
            type: "access" as const, // Add type here to satisfy TS
        };

        const accessToken = await generateAccessToken(payload);
        // For refresh token, we use the same payload but type will be overridden inside generateRefreshToken
        const refreshToken = await generateRefreshToken(payload);

        // Calculate expiration
        const accessExpires = getTokenExpiration("access");
        const refreshExpires = getTokenExpiration("refresh");

        // Create response with cookies
        const response = NextResponse.json({
            success: true,
            data: user,
        });

        setAuthCookies(
            response,
            accessToken,
            refreshToken,
            accessExpires,
            refreshExpires
        );

        return response;
    } catch (error) {
        console.error("Login error:", error);
        const message =
            error instanceof Error ? error.message : "Login failed";
        return NextResponse.json(
            { success: false, error: message },
            { status: 401 }
        );
    }
}
