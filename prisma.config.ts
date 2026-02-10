import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Load .env.local first, then fallback to .env
config({ path: ".env.local" });
config({ path: ".env" });

export default defineConfig({
    migrations: {
        seed: "tsx prisma/seed.ts",
    },
    datasource: {
        url: env("DATABASE_URL"),
    },
});
