import { NextResponse } from "next/server";
import { UsersService } from "@/lib/services/users/users-service";
import { CreateUserSchema } from "@/lib/validators/users-validator";

const usersService = new UsersService();

export async function GET() {
    try {
        const users = await usersService.getAll();
        return NextResponse.json({
            success: true,
            data: users,
            total: users.length,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const result = CreateUserSchema.safeParse(body);
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

        const user = await usersService.create(result.data);
        return NextResponse.json({ success: true, data: user }, { status: 201 });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to create user";
        const status = message.includes("ถูกใช้งานแล้ว") ? 409 : 500;
        return NextResponse.json(
            { success: false, error: message },
            { status }
        );
    }
}
