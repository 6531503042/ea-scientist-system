import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
    ArtefactCategoryIdSchema,
    UpdateArtefactCategorySchema,
} from "@/lib/validators/artefact-types-validator";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = ArtefactCategoryIdSchema.parse(await params);
        const body = await request.json();
        const result = UpdateArtefactCategorySchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { success: false, error: "Validation failed", details: result.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const category = await prisma.artefactCategory.update({
            where: { id },
            data: {
                ...(result.data.architectureLayerId && { architectureLayerId: result.data.architectureLayerId }),
                ...(result.data.categoryName && { categoryName: result.data.categoryName }),
                ...(result.data.description !== undefined && { description: result.data.description }),
                ...(result.data.isActive !== undefined && { isActive: result.data.isActive }),
            },
            include: {
                architectureLayer: { select: { id: true, layerName: true } },
            },
        });
        return NextResponse.json({ success: true, data: category });
    } catch (error) {
        console.error("[categories] PUT error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update category" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = ArtefactCategoryIdSchema.parse(await params);
        await prisma.artefactCategory.update({
            where: { id },
            data: { isActive: false },
        });
        return NextResponse.json({ success: true, message: "Category deactivated" });
    } catch (error) {
        console.error("[categories] DELETE error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to deactivate category" },
            { status: 500 }
        );
    }
}
