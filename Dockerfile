ARG NODE_VERSION=22-alpine

FROM node:${NODE_VERSION} AS base

# ---------- builder ----------
FROM base AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm --no-fund --no-update-notifier ci
COPY prisma/ ./prisma
COPY . .
RUN mkdir -p public
RUN npx prisma generate
RUN npm run build

# ---------- runner ----------
FROM base AS runner
WORKDIR /app

RUN apk add --no-cache tini

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV CHECKPOINT_DISABLE=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts

# Install Prisma CLI at the exact version matching @prisma/client in the standalone output.
# Set NODE_PATH so that prisma.config.ts can resolve `prisma/config` from the global install.
RUN npm install --global --save-exact \
  "prisma@$(node --print 'require("./node_modules/@prisma/client/package.json").version')"

ENV NODE_PATH=/usr/local/lib/node_modules

USER nextjs
EXPOSE 3000

CMD ["sh", "-c", "prisma migrate deploy && exec /sbin/tini -- node server.js"]
