import { NextResponse } from "next/server";
import { DepartmentsService } from "@/lib/services/departments/departments-service";
import {
    DepartmentIdSchema,
    UpdateDepartmentSchema,
} from "@/lib/validators/departments-validator";
import { apiHandler } from "@/lib/utils/api-handler";

const departmentsService = new DepartmentsService();

export const GET = apiHandler(async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = DepartmentIdSchema.parse(await params);
    const dept = await departmentsService.getById(id);
    return NextResponse.json({ success: true, data: dept });
});

async function handleUpdate(request: Request, params: Promise<{ id: string }>) {
    const { id } = DepartmentIdSchema.parse(await params);
    const body = await request.json();
    const data = UpdateDepartmentSchema.parse(body); // Using parse to leverage apiHandler's ZodError handling

    const dept = await departmentsService.update(id, data);
    return NextResponse.json({ success: true, data: dept });
}

export const PUT = apiHandler(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    return await handleUpdate(request, params);
});

export const PATCH = apiHandler(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    return await handleUpdate(request, params);
});

export const DELETE = apiHandler(async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = DepartmentIdSchema.parse(await params);
    await departmentsService.delete(id);
    return NextResponse.json({
        success: true,
        message: "Department deactivated",
    });
});
