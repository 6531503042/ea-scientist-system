import { NextResponse } from "next/server";
import { CreateArchitectureLayerSchema } from "@/lib/validators/artefact-types-validator";
import { apiHandler } from "@/lib/utils/api-handler";
import { ArchitectureLayersService } from "@/lib/services/architecture-layers/layers-service";

const layersService = new ArchitectureLayersService();

export const GET = apiHandler(async () => {
    const layers = await layersService.getAll();
    return NextResponse.json({ success: true, data: layers });
});

export const POST = apiHandler(async (request: Request) => {
    const body = await request.json();
    const data = CreateArchitectureLayerSchema.parse(body);

    const layer = await layersService.create(data);
    return NextResponse.json({ success: true, data: layer }, { status: 201 });
});

