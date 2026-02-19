import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { CreateArchitectureLayerSchema } from "@/lib/validators/artefact-types-validator";

/**
 * GET /api/v1/architecture-layers
 * Returns all active architecture layers with their categories.
 */
export async function GET() {
    try {
        const layers = await prisma.architectureLayer.findMany({
            where: { isActive: true },
            include: {
                artefactCategories: {
                    where: { isActive: true },
                    select: { id: true, categoryName: true, architectureLayerId: true },
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

/**
 * POST /api/v1/architecture-layers
 * Create a new architecture layer.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = CreateArchitectureLayerSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const layer = await prisma.architectureLayer.create({
            data: {
                layerName: result.data.layerName,
                description: result.data.description ?? undefined,
                isActive: result.data.isActive ?? true,
            },
        });
        return NextResponse.json({ success: true, data: layer }, { status: 201 });
    } catch (error) {
        console.error("[architecture-layers] POST error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create architecture layer" },
            { status: 500 }
        );
    }
}
