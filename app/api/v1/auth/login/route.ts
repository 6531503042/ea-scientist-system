import { NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth/auth-service";
import { loginSchema } from "@/lib/validators/auth-validator";
import {
    generateAccessToken,
    generateRefreshToken,
    getTokenExpiration,
} from "@/lib/auth/jwt";
import { setAuthCookies } from "@/lib/auth/cookies";
import { AuditLogsRepository } from "@/lib/repositories/audit-logs/audit-logs-repository";

const authService = new AuthService();
const auditLogsRepository = new AuditLogsRepository();

/** Get client IP from request (supports proxies). Max 45 chars for DB. */
function getClientIp(request: Request): string | null {
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const raw = forwarded?.split(",")[0]?.trim() || realIp || null;
    if (!raw) return null;
    return raw.length > 45 ? raw.slice(0, 45) : raw;
}

/** Get User-Agent from request. Max 1000 chars for DB. */
function getUserAgent(request: Request): string | null {
    const ua = request.headers.get("user-agent");
    if (!ua) return null;
    return ua.length > 1000 ? ua.slice(0, 1000) : ua;
}

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

        // Audit trail: LOGIN (backend-only, with IP and User-Agent)
        const ipAddress = getClientIp(request);
        const userAgent = getUserAgent(request);
        await auditLogsRepository.create({
            user: { connect: { id: user.id } },
            action: "LOGIN",
            summary: "Login success",
            ipAddress: ipAddress ?? undefined,
            userAgent: userAgent ?? undefined,
        });

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
