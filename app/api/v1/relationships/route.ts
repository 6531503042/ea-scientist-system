import { NextResponse } from "next/server";
import { RelationshipsService } from "@/lib/services/relationships/relationships-service";
import { CreateRelationshipSchema } from "@/lib/validators/relationships-validator";
import { apiHandler } from "@/lib/utils/api-handler";

const relationshipsService = new RelationshipsService();

export const GET = apiHandler(async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const artefactId = searchParams.get("artefactId");

    const data = artefactId
        ? await relationshipsService.getByArtefact(Number(artefactId))
        : await relationshipsService.getAll();

    return NextResponse.json({
        success: true,
        data,
        total: data.length,
    });
});

export const POST = apiHandler(async (request: Request) => {
    const body = await request.json();
    const data = CreateRelationshipSchema.parse(body);

    const relationship = await relationshipsService.create(data);
    return NextResponse.json(
        { success: true, data: relationship },
        { status: 201 }
    );
});

