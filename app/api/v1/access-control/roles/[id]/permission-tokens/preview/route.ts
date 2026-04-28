import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/api-proxy";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  return proxyToBackend(
    request,
    `/access-control/roles/${id}/permission-tokens/preview`,
  );
}
