const DEFAULT_BACKEND_ORIGIN = "http://127.0.0.1:3000";

function normalizeBackendOrigin(origin: string): string {
  try {
    const url = new URL(origin);

    if (url.hostname === "localhost") {
      url.hostname = "127.0.0.1";
    }

    return url.toString().replace(/\/$/, "");
  } catch {
    return DEFAULT_BACKEND_ORIGIN;
  }
}

export function getBackendOrigin(): string {
  const configuredOrigin =
    process.env.API_ORIGIN ||
    process.env.NEXT_PUBLIC_API_ORIGIN ||
    DEFAULT_BACKEND_ORIGIN;

  return normalizeBackendOrigin(configuredOrigin);
}
