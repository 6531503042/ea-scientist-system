import { NextResponse } from "next/server";
import {
    ArtefactCategoryIdSchema,
    UpdateArtefactCategorySchema,
} from "@/lib/validators/artefact-types-validator";
import { apiHandler } from "@/lib/utils/api-handler";
import { CategoriesService } from "@/lib/services/categories/categories-service";

const categoriesService = new CategoriesService();

export const PUT = apiHandler(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = ArtefactCategoryIdSchema.parse(await params);
    const body = await request.json();
    const data = UpdateArtefactCategorySchema.parse(body);

    const category = await categoriesService.update(id, data);
    return NextResponse.json({ success: true, data: category });
});

export const DELETE = apiHandler(async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = ArtefactCategoryIdSchema.parse(await params);
    await categoriesService.delete(id);
    return NextResponse.json({ success: true, message: "Category deactivated" });
});

