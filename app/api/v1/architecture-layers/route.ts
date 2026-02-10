import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

/**
 * GET /api/v1/architecture-layers
 * Returns all active architecture layers with their categories.
 */
export async function GET() {
    try {
        const layers = await prisma.architectureLayer.findMany({
            where: { isActive: true },
            include: {
                artifactCategories: {
                    where: { isActive: true },
                    select: { id: true, categoryName: true },
                    orderBy: { id: "asc" },
                },
            },
            orderBy: { id: "asc" },
        });

        return NextResponse.json({ success: true, data: layers });
    } catch (error) {
        console.error("[architecture-layers] GET error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch architecture layers" },
            { status: 500 },
        );
    }
}
