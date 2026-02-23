import { NextResponse } from "next/server";
import {
    ArchitectureLayerIdSchema,
    UpdateArchitectureLayerSchema,
} from "@/lib/validators/artefact-types-validator";
import { apiHandler } from "@/lib/utils/api-handler";
import { ArchitectureLayersService } from "@/lib/services/architecture-layers/layers-service";

const layersService = new ArchitectureLayersService();

export const PUT = apiHandler(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = ArchitectureLayerIdSchema.parse(await params);
    const body = await request.json();
    const data = UpdateArchitectureLayerSchema.parse(body);

    const layer = await layersService.update(id, data);
    return NextResponse.json({ success: true, data: layer });
});

export const DELETE = apiHandler(async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = ArchitectureLayerIdSchema.parse(await params);
    await layersService.delete(id);
    return NextResponse.json({ success: true, message: "Layer deactivated" });
});

