import { NextResponse } from "next/server";
import { RolesService } from "@/lib/services/roles/roles-service";
import { CreateRoleSchema } from "@/lib/validators/roles-validator";

const rolesService = new RolesService();

export async function GET() {
    try {
        const roles = await rolesService.getAll();
        return NextResponse.json({
            success: true,
            data: roles,
            total: roles.length,
        });
    } catch (error) {
        console.error("Error fetching roles:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch roles" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const result = CreateRoleSchema.safeParse(body);
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

        const role = await rolesService.create(result.data);
        return NextResponse.json({ success: true, data: role }, { status: 201 });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to create role";
        const status = message.includes("มีอยู่แล้ว") ? 409 : 500;
        return NextResponse.json(
            { success: false, error: message },
            { status }
        );
    }
}
