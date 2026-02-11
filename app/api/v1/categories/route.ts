import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

/**
 * GET /api/v1/categories
 * Returns all active artifact categories, optionally filtered by layerId.
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const layerId = searchParams.get("layerId");

        const categories = await prisma.artefactCategory.findMany({
            where: {
                isActive: true,
                ...(layerId ? { architectureLayerId: Number(layerId) } : {}),
            },
            include: {
                architectureLayer: { select: { id: true, layerName: true } },
            },
            orderBy: { id: "asc" },
        });

        return NextResponse.json({ success: true, data: categories });
    } catch (error) {
        console.error("[categories] GET error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch categories" },
            { status: 500 },
        );
    }
}
