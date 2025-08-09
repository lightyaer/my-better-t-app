## Multi-stage Dockerfile for apps/server (Bun + Railway)

FROM oven/bun:1.2.19 AS base
WORKDIR /app

# --- deps: install workspace deps with cache
FROM base AS deps
WORKDIR /app
COPY bun.lock package.json bunfig.toml turbo.json ./
COPY apps/server/package.json ./apps/server/package.json
RUN bun install --ci 

# --- build: compile server to dist/
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/server/node_modules ./apps/server/node_modules
COPY apps/server ./apps/server
WORKDIR /app/apps/server
RUN bun run build

# --- runtime: minimal image with just runtime deps + build output
FROM oven/bun:1.2.19 AS runner
WORKDIR /app/apps/server

ENV NODE_ENV=production
# Railway sets PORT automatically. Default to 3000 for local runs.
ENV PORT=3000

# Copy runtime deps and built output
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/apps/server/dist ./dist

EXPOSE 3000

# Start the Hono server - Bun will serve the exported app on $PORT
CMD ["bun", "dist/index.js"]

