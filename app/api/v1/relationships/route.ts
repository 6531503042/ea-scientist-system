import { NextResponse } from "next/server";
import { RelationshipsService } from "@/lib/services/relationships/relationships-service";
import { CreateRelationshipSchema } from "@/lib/validators/relationships-validator";

const relationshipsService = new RelationshipsService();

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const artefactId = searchParams.get("artefactId");

        const data = artefactId
            ? await relationshipsService.getByArtefact(Number(artefactId))
            : await relationshipsService.getAll();

        return NextResponse.json({
            success: true,
            data,
            total: data.length,
        });
    } catch (error) {
        console.error("Error fetching relationships:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch relationships" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const result = CreateRelationshipSchema.safeParse(body);
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

        const relationship = await relationshipsService.create(result.data);
        return NextResponse.json(
            { success: true, data: relationship },
            { status: 201 }
        );
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to create relationship";
        const status = message.includes("ตัวเอง") ? 400 : 500;
        return NextResponse.json(
            { success: false, error: message },
            { status }
        );
    }
}
