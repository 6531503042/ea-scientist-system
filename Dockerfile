# ==============================================================================
# Dockerfile for Next.js App (Bun Version)
# ==============================================================================

# Stage 1: Install dependencies
FROM oven/bun:1 AS deps
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies (allow lockfile update since we might be missing deps like dotenv in package.json)
RUN bun install

# Add dotenv explicitly as it's required by prisma.config.ts
# Prisma v7 requires adapter-pg for PostgreSQL connectivity
RUN bun add -d dotenv prisma @prisma/client
RUN bun add @prisma/adapter-pg pg

# Stage 2: Build the application
FROM oven/bun:1 AS builder
WORKDIR /app
ENV TZ=Asia/Bangkok

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set dummy DATABASE_URL for prisma generate to work (it validates config but doesn't connect)
ARG DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ea_system"
ENV DATABASE_URL=${DATABASE_URL}

# Generate Prisma Client
RUN bunx prisma generate

# Build Next.js app
# Note: Next.js build might try to use 'node', but 'bun run build' usually works 
# if the script is "next build". Bun executes 'next' which runs on Node (if present) or Bun's compat layer.
# oven/bun image comes with Node.js compatible runtime.
RUN bun run build

# Stage 3: Migrator (runs migrations + seed at startup)
FROM builder AS migrator
WORKDIR /app
CMD ["sh", "-c", "bunx prisma db push --accept-data-loss && bun prisma/seed.ts"]

# Stage 4: Runner
FROM oven/bun:1 AS runner
WORKDIR /app
ENV TZ=Asia/Bangkok
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install system dependencies for Puppeteer/Chromium if needed (matching example)
# oven/bun is based on debian-slim usually, so apt-get works
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    fonts-liberation \
    fonts-noto-cjk \
    fonts-thai-tlwg \
    ca-certificates \
    procps \
    && rm -rf /var/lib/apt/lists/*

# Set Puppeteer to use system Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Create user for security
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs --create-home nextjs

# Create required directories and set permissions
RUN mkdir -p /app/public/uploads /app/public/signatures /app/file/uploads && \
    chown -R nextjs:nodejs /app/public /app/file

# Copy standalone build from builder
COPY --from=builder /app/public ./public
# Automatically verify if standalone exists, if not fall back (but we enabled it)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma schema and generated client
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/generated ./generated

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Start server
CMD ["bun", "server.js"]
