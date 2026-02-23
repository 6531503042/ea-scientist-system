import { NextResponse } from "next/server";
import { ApiError } from "./api-error";
import { ZodError } from "zod";

type ApiHandler<T = any> = (
    request: Request,
    context: any
) => Promise<NextResponse<T>> | NextResponse<T>;

export function apiHandler(handler: ApiHandler) {
    return async (request: Request, context: any) => {
        try {
            return await handler(request, context);
        } catch (error) {
            console.error(`[API Error] ${request.method} ${request.url}:`, error);

            if (error instanceof ApiError) {
                return NextResponse.json(
                    {
                        success: false,
                        error: error.message,
                        details: error.details,
                    },
                    { status: error.statusCode }
                );
            }

            if (error instanceof ZodError) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Validation error",
                        details: error.flatten().fieldErrors,
                    },
                    { status: 400 }
                );
            }

            // Fallback to internal server error
            const message = error instanceof Error ? error.message : "Internal Server Error";
            return NextResponse.json(
                {
                    success: false,
                    error: message,
                },
                { status: 500 }
            );
        }
    };
}
