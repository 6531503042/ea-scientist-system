import { NextResponse } from "next/server";
import { DepartmentsService } from "@/lib/services/departments/departments-service";
import {
    DepartmentIdSchema,
    UpdateDepartmentSchema,
} from "@/lib/validators/departments-validator";

const departmentsService = new DepartmentsService();

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = DepartmentIdSchema.parse(await params);
        const dept = await departmentsService.getById(id);
        return NextResponse.json({ success: true, data: dept });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Department not found";
        const status = message.includes("ไม่พบ") ? 404 : 500;
        return NextResponse.json(
            { success: false, error: message },
            { status }
        );
    }
}

async function handleUpdate(request: Request, params: Promise<{ id: string }>) {
    const { id } = DepartmentIdSchema.parse(await params);
    const body = await request.json();
    const result = UpdateDepartmentSchema.safeParse(body);
    if (!result.success) {
        return NextResponse.json(
            { success: false, error: "Validation failed", details: result.error.flatten().fieldErrors },
            { status: 400 }
        );
    }
    const dept = await departmentsService.update(id, result.data);
    return NextResponse.json({ success: true, data: dept });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        return await handleUpdate(request, params);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update department";
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        return await handleUpdate(request, params);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update department";
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = DepartmentIdSchema.parse(await params);
        await departmentsService.delete(id);
        return NextResponse.json({
            success: true,
            message: "Department deactivated",
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to delete department";
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}
