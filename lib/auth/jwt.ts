import { SignJWT, jwtVerify } from "jose";

// JWT Configuration
const JWT_ACCESS_SECRET =
    process.env.JWT_ACCESS_SECRET ||
    "your-super-secret-access-key-change-in-production";
const JWT_REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET ||
    "your-super-secret-refresh-key-change-in-production";

const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "8h"; // 8 hours
const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "30d"; // 30 days

// Convert time string to seconds
function timeToSeconds(timeStr: string): number {
    const unit = timeStr.slice(-1);
    const value = parseInt(timeStr.slice(0, -1));

    switch (unit) {
        case "s":
            return value;
        case "m":
            return value * 60;
        case "h":
            return value * 60 * 60;
        case "d":
            return value * 24 * 60 * 60;
        default:
            return 1800; // Default 30 minutes
    }
}

// JWT Payload Interface
export interface JWTPayload {
    userId: number;
    email: string;
    role: string;
    roleId: number;
    department: string | null;
    departmentId: number | null;
    type: "access" | "refresh";
}

/**
 * Generate Access Token
 * @param payload User information to encode
 * @returns JWT token string
 */
export async function generateAccessToken(
    payload: Omit<JWTPayload, "type">
): Promise<string> {
    const secret = new TextEncoder().encode(JWT_ACCESS_SECRET);
    const expiresIn = timeToSeconds(ACCESS_TOKEN_EXPIRES_IN);

    return await new SignJWT({
        ...payload,
        type: "access",
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(Math.floor(Date.now() / 1000) + expiresIn)
        .setJti(crypto.randomUUID()) // Unique token ID
        .sign(secret);
}

/**
 * Generate Refresh Token
 * @param payload User information to encode
 * @returns JWT token string
 */
export async function generateRefreshToken(
    payload: Omit<JWTPayload, "type">
): Promise<string> {
    const secret = new TextEncoder().encode(JWT_REFRESH_SECRET);
    const expiresIn = timeToSeconds(REFRESH_TOKEN_EXPIRES_IN);

    return await new SignJWT({
        ...payload,
        type: "refresh",
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(Math.floor(Date.now() / 1000) + expiresIn)
        .setJti(crypto.randomUUID())
        .sign(secret);
}

/**
 * Verify Access Token
 * @param token JWT token to verify
 * @returns Decoded payload or null if invalid
 */
export async function verifyAccessToken(
    token: string
): Promise<JWTPayload | null> {
    try {
        const secret = new TextEncoder().encode(JWT_ACCESS_SECRET);
        const { payload } = await jwtVerify(token, secret);

        if (payload.type !== "access") {
            return null;
        }

        return payload as unknown as JWTPayload;
    } catch (error) {
        console.error("Access token verification failed:", error);
        return null;
    }
}

/**
 * Verify Refresh Token
 * @param token JWT token to verify
 * @returns Decoded payload or null if invalid
 */
export async function verifyRefreshToken(
    token: string
): Promise<JWTPayload | null> {
    try {
        const secret = new TextEncoder().encode(JWT_REFRESH_SECRET);
        const { payload } = await jwtVerify(token, secret);

        if (payload.type !== "refresh") {
            return null;
        }

        return payload as unknown as JWTPayload;
    } catch (error) {
        console.error("Refresh token verification failed:", error);
        return null;
    }
}

/**
 * Get token expiration time
 * @param type Token type
 * @returns Expiration time in seconds
 */
export function getTokenExpiration(type: "access" | "refresh"): number {
    if (type === "access") {
        return timeToSeconds(ACCESS_TOKEN_EXPIRES_IN);
    }
    return timeToSeconds(REFRESH_TOKEN_EXPIRES_IN);
}
