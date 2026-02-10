import { NextResponse } from "next/server";
import { ArtefactsService } from "@/lib/services/artefacts/artefacts-service";
import { CreateArtefactSchema } from "@/lib/validators/artefacts-validator";

const artefactsService = new ArtefactsService();

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const filters = {
            architectureLayerId: searchParams.get("layerId")
                ? Number(searchParams.get("layerId"))
                : undefined,
            categoryId: searchParams.get("categoryId")
                ? Number(searchParams.get("categoryId"))
                : undefined,
            lifecycleStatus: searchParams.get("status") || undefined,
        };

        const artefacts = await artefactsService.getAll(filters);
        return NextResponse.json({
            success: true,
            data: artefacts,
            total: artefacts.length,
        });
    } catch (error) {
        console.error("Error fetching artefacts:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch artefacts" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const result = CreateArtefactSchema.safeParse(body);
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

        const artefact = await artefactsService.create(result.data);
        return NextResponse.json(
            { success: true, data: artefact },
            { status: 201 }
        );
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to create artefact";
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}
