import { NextResponse } from "next/server";
import { RelationshipsService } from "@/lib/services/relationships/relationships-service";
import { RelationshipIdSchema } from "@/lib/validators/relationships-validator";

const relationshipsService = new RelationshipsService();

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = RelationshipIdSchema.parse(await params);
        const relationship = await relationshipsService.getById(id);
        return NextResponse.json({ success: true, data: relationship });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Relationship not found";
        const status = message.includes("ไม่พบ") ? 404 : 500;
        return NextResponse.json(
            { success: false, error: message },
            { status }
        );
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = RelationshipIdSchema.parse(await params);
        await relationshipsService.delete(id);
        return NextResponse.json({
            success: true,
            message: "Relationship deleted",
        });
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to delete relationship";
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}
