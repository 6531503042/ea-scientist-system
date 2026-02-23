import { NextResponse } from "next/server";
import { RelationshipsService } from "@/lib/services/relationships/relationships-service";
import { RelationshipIdSchema } from "@/lib/validators/relationships-validator";
import { apiHandler } from "@/lib/utils/api-handler";

const relationshipsService = new RelationshipsService();

export const GET = apiHandler(async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = RelationshipIdSchema.parse(await params);
    const relationship = await relationshipsService.getById(id);
    return NextResponse.json({ success: true, data: relationship });
});

export const DELETE = apiHandler(async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = RelationshipIdSchema.parse(await params);
    await relationshipsService.delete(id);
    return NextResponse.json({
        success: true,
        message: "Relationship deleted",
    });
});

