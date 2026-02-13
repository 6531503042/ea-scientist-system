import { NextResponse } from "next/server";
import { UsersService } from "@/lib/services/users/users-service";
import { UserIdSchema, UpdateUserSchema } from "@/lib/validators/users-validator";

const usersService = new UsersService();

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = UserIdSchema.parse(await params);
        const user = await usersService.getById(id);
        return NextResponse.json({ success: true, data: user });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "User not found";
        const status = message.includes("ไม่พบ") ? 404 : 500;
        return NextResponse.json(
            { success: false, error: message },
            { status }
        );
    }
}

async function handleUpdate(
    request: Request,
    params: Promise<{ id: string }>
) {
    const { id } = UserIdSchema.parse(await params);
    const body = await request.json();
    const result = UpdateUserSchema.safeParse(body);
    if (!result.success) {
        return NextResponse.json(
            { success: false, error: "Validation failed", details: result.error.flatten().fieldErrors },
            { status: 400 }
        );
    }
    const user = await usersService.update(id, result.data);
    return NextResponse.json({ success: true, data: user });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        return await handleUpdate(request, params);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update user";
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        return await handleUpdate(request, params);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update user";
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = UserIdSchema.parse(await params);
        await usersService.delete(id);
        return NextResponse.json({ success: true, message: "User deactivated" });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to delete user";
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}
