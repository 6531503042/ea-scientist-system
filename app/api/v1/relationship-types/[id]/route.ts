import { NextResponse } from "next/server";
import { apiHandler } from "@/lib/utils/api-handler";
import { RelationshipTypesService } from "@/lib/services/relationships/relationship-types-service";

const relationshipTypesService = new RelationshipTypesService();

type Params = { params: Promise<{ id: string }> };

export const PUT = apiHandler(async (request: Request, { params }: Params) => {
    const { id } = await params;
    const body = await request.json();

    const rt = await relationshipTypesService.update(Number(id), body);
    return NextResponse.json({ success: true, data: rt });
});

export const DELETE = apiHandler(async (_request: Request, { params }: Params) => {
    const { id } = await params;
    await relationshipTypesService.delete(Number(id));
    return NextResponse.json({ success: true, message: "Deactivated" });
});

