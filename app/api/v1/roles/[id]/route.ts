import { NextResponse } from "next/server";
import { RolesService } from "@/lib/services/roles/roles-service";
import { RoleIdSchema, UpdateRoleSchema } from "@/lib/validators/roles-validator";
import { apiHandler } from "@/lib/utils/api-handler";

const rolesService = new RolesService();

export const GET = apiHandler(async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = RoleIdSchema.parse(await params);
    const role = await rolesService.getById(id);
    return NextResponse.json({ success: true, data: role });
});

export const PUT = apiHandler(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = RoleIdSchema.parse(await params);
    const body = await request.json();
    const data = UpdateRoleSchema.parse(body);

    const role = await rolesService.update(id, data);
    return NextResponse.json({ success: true, data: role });
});

export const DELETE = apiHandler(async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = RoleIdSchema.parse(await params);
    await rolesService.delete(id);
    return NextResponse.json({ success: true, message: "Role deactivated" });
});

