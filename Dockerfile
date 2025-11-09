# --- Builder stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# Use corepack to enable pnpm (compatível com Node >=16)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy lockfile and package file first for better cache
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm build

# --- Runner stage ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package manifests and install only production deps to keep image lean
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Copy build output and public assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# If you rely on other runtime files (next.config, etc.) uncomment next line
# COPY --from=builder /app/next.config.js ./

EXPOSE 3000

CMD ["pnpm", "start"]
