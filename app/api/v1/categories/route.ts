import { NextResponse } from "next/server";
import { CreateArtefactCategorySchema } from "@/lib/validators/artefact-types-validator";
import { apiHandler } from "@/lib/utils/api-handler";
import { CategoriesService } from "@/lib/services/categories/categories-service";

const categoriesService = new CategoriesService();

export const GET = apiHandler(async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const layerIdStr = searchParams.get("layerId");
    const layerId = layerIdStr ? Number(layerIdStr) : null;

    const categories = await categoriesService.getAll(layerId);
    return NextResponse.json({ success: true, data: categories });
});

export const POST = apiHandler(async (request: Request) => {
    const body = await request.json();
    const data = CreateArtefactCategorySchema.parse(body);

    const category = await categoriesService.create(data);
    return NextResponse.json({ success: true, data: category }, { status: 201 });
});

