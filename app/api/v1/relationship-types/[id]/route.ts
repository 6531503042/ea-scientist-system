import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

type Params = { params: Promise<{ id: string }> };

/**
 * PUT /api/v1/relationship-types/:id
 * Update a relationship type (name, description, allowedPairs).
 */
export async function PUT(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        const body = await request.json();

        const rt = await prisma.relationshipType.update({
            where: { id: Number(id) },
            data: {
                ...(body.relationshipName && { relationshipName: body.relationshipName }),
                ...(body.description !== undefined && { description: body.description }),
                ...(body.allowedPairs !== undefined && { allowedPairs: body.allowedPairs }),
            },
        });
        return NextResponse.json({ success: true, data: rt });
    } catch (error) {
        const msg = error instanceof Error ? error.message : "Failed to update";
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}

/**
 * DELETE /api/v1/relationship-types/:id
 * Soft-delete (deactivate) a relationship type.
 */
export async function DELETE(_request: Request, { params }: Params) {
    try {
        const { id } = await params;
        await prisma.relationshipType.update({
            where: { id: Number(id) },
            data: { isActive: false },
        });
        return NextResponse.json({ success: true, message: "Deactivated" });
    } catch (error) {
        const msg = error instanceof Error ? error.message : "Failed to delete";
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
