import { NextResponse } from "next/server";
import { RolesService } from "@/lib/services/roles/roles-service";
import { RoleIdSchema, UpdateRoleSchema } from "@/lib/validators/roles-validator";

const rolesService = new RolesService();

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = RoleIdSchema.parse(await params);
        const role = await rolesService.getById(id);
        return NextResponse.json({ success: true, data: role });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Role not found";
        const status = message.includes("ไม่พบ") ? 404 : 500;
        return NextResponse.json(
            { success: false, error: message },
            { status }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = RoleIdSchema.parse(await params);
        const body = await request.json();

        const result = UpdateRoleSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Validation failed",
                    details: result.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const role = await rolesService.update(id, result.data);
        return NextResponse.json({ success: true, data: role });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to update role";
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = RoleIdSchema.parse(await params);
        await rolesService.delete(id);
        return NextResponse.json({ success: true, message: "Role deactivated" });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to delete role";
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}
