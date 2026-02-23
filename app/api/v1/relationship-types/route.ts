import { NextResponse } from "next/server";
import { apiHandler } from "@/lib/utils/api-handler";
import { RelationshipTypesService } from "@/lib/services/relationships/relationship-types-service";

const relationshipTypesService = new RelationshipTypesService();

export const GET = apiHandler(async () => {
    const types = await relationshipTypesService.getAll();
    return NextResponse.json({ success: true, data: types });
});

export const POST = apiHandler(async (request: Request) => {
    const body = await request.json();
    const rt = await relationshipTypesService.create(body);
    return NextResponse.json({ success: true, data: rt }, { status: 201 });
});

