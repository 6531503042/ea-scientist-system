import { NextResponse } from "next/server";
import { DepartmentsService } from "@/lib/services/departments/departments-service";
import { CreateDepartmentSchema } from "@/lib/validators/departments-validator";

const departmentsService = new DepartmentsService();

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const hierarchy = searchParams.get("hierarchy") === "true";

        const data = hierarchy
            ? await departmentsService.getHierarchy()
            : await departmentsService.getAll();

        return NextResponse.json({
            success: true,
            data,
            total: Array.isArray(data) ? data.length : 0,
        });
    } catch (error) {
        console.error("Error fetching departments:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch departments" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const result = CreateDepartmentSchema.safeParse(body);
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

        const dept = await departmentsService.create(result.data);
        return NextResponse.json({ success: true, data: dept }, { status: 201 });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to create department";
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}
