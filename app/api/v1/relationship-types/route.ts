import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

/**
 * GET /api/v1/relationship-types
 * List all relationship types with usage count.
 */
export async function GET() {
    try {
        const types = await prisma.relationshipType.findMany({
            where: { isActive: true },
            include: { _count: { select: { relationships: true } } },
            orderBy: { id: "asc" },
        });
        return NextResponse.json({ success: true, data: types });
    } catch (error) {
        console.error("[relationship-types] GET:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch relationship types" },
            { status: 500 },
        );
    }
}

/**
 * POST /api/v1/relationship-types
 * Create a new relationship type.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { relationshipKey, relationshipName, description, allowedPairs } = body;

        if (!relationshipKey || !relationshipName) {
            return NextResponse.json(
                { success: false, error: "relationshipKey and relationshipName are required" },
                { status: 400 },
            );
        }

        const rt = await prisma.relationshipType.create({
            data: {
                relationshipKey,
                relationshipName,
                description: description || null,
                allowedPairs: allowedPairs || [],
                isActive: true,
            },
        });
        return NextResponse.json({ success: true, data: rt }, { status: 201 });
    } catch (error) {
        const msg = error instanceof Error ? error.message : "Failed to create";
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
