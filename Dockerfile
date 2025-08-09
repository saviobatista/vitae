###############################
# Multi-stage Dockerfile for Next.js (pnpm)
# Stages: base → deps → builder → runner (prod) | dev (hot-reload)
###############################

# ===== Base (shared) =====
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache libc6-compat

# Install pnpm explicitly for reliability in CI/CD and containers
RUN npm i -g pnpm@9

# ===== Deps (install dependencies with cache) =====
FROM base AS deps
ENV NODE_ENV=development
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ===== Builder (compile Next.js to standalone) =====
FROM base AS builder
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# ===== Runner (production image) =====
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache libc6-compat \
  && addgroup -g 1001 -S nodejs \
  && adduser -S nextjs -u 1001

# Only copy what we need to run the standalone server
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/package.json ./package.json

# Runtime envs (secrets should be injected at runtime, not baked at build time)
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
EXPOSE 3000
USER nextjs
CMD ["node", "server.js"]

# ===== Dev (hot reload with bind mount) =====
FROM base AS dev
ENV NODE_ENV=development
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
# Source will be bind-mounted in docker-compose for instant reload
EXPOSE 3000
CMD ["pnpm", "dev"]
