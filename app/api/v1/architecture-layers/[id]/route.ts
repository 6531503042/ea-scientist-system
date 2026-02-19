import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
    ArchitectureLayerIdSchema,
    UpdateArchitectureLayerSchema,
} from "@/lib/validators/artefact-types-validator";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = ArchitectureLayerIdSchema.parse(await params);
        const body = await request.json();
        const result = UpdateArchitectureLayerSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const layer = await prisma.architectureLayer.update({
            where: { id },
            data: {
                ...(result.data.layerName && { layerName: result.data.layerName }),
                ...(result.data.description !== undefined && { description: result.data.description }),
                ...(result.data.isActive !== undefined && { isActive: result.data.isActive }),
            },
        });
        return NextResponse.json({ success: true, data: layer });
    } catch (error) {
        console.error("[architecture-layers] PUT error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update architecture layer" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = ArchitectureLayerIdSchema.parse(await params);
        await prisma.architectureLayer.update({
            where: { id },
            data: { isActive: false },
        });
        return NextResponse.json({ success: true, message: "Layer deactivated" });
    } catch (error) {
        console.error("[architecture-layers] DELETE error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to deactivate architecture layer" },
            { status: 500 }
        );
    }
}
