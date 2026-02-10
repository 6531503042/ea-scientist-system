import { NextResponse } from "next/server";
import { ArtefactsService } from "@/lib/services/artefacts/artefacts-service";
import {
    ArtefactIdSchema,
    UpdateArtefactSchema,
} from "@/lib/validators/artefacts-validator";

const artefactsService = new ArtefactsService();

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = ArtefactIdSchema.parse(await params);
        const artefact = await artefactsService.getById(id);
        return NextResponse.json({ success: true, data: artefact });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Artefact not found";
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
        const { id } = ArtefactIdSchema.parse(await params);
        const body = await request.json();

        const result = UpdateArtefactSchema.safeParse(body);
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

        const artefact = await artefactsService.update(id, result.data);
        return NextResponse.json({ success: true, data: artefact });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to update artefact";
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
        const { id } = ArtefactIdSchema.parse(await params);
        await artefactsService.delete(id);
        return NextResponse.json({ success: true, message: "Artefact retired" });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to delete artefact";
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}
