import { NextResponse } from "next/server";
import { RolesService } from "@/lib/services/roles/roles-service";
import { CreateRoleSchema } from "@/lib/validators/roles-validator";
import { apiHandler } from "@/lib/utils/api-handler";

const rolesService = new RolesService();

export const GET = apiHandler(async () => {
    const roles = await rolesService.getAll();
    return NextResponse.json({
        success: true,
        data: roles,
        total: roles.length,
    });
});

export const POST = apiHandler(async (request: Request) => {
    const body = await request.json();
    const result = CreateRoleSchema.parse(body);

    const role = await rolesService.create(result);
    return NextResponse.json({ success: true, data: role }, { status: 201 });
});

