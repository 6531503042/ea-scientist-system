import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { CreateArtefactCategorySchema } from "@/lib/validators/artefact-types-validator";

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

/**
 * POST /api/v1/categories
 * Create a new artefact category.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = CreateArtefactCategorySchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const category = await prisma.artefactCategory.create({
            data: {
                architectureLayerId: result.data.architectureLayerId,
                categoryName: result.data.categoryName,
                description: result.data.description ?? undefined,
                isActive: result.data.isActive ?? true,
            },
            include: {
                architectureLayer: { select: { id: true, layerName: true } },
            },
        });
        return NextResponse.json({ success: true, data: category }, { status: 201 });
    } catch (error) {
        console.error("[categories] POST error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create category" },
            { status: 500 },
        );
    }
}
