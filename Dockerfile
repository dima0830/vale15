# ---- Build stage ----
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# ---- Production stage ----
FROM node:22-alpine AS production

WORKDIR /app

COPY --from=builder /app/.output ./.output

# Las fotos de invitados viven en un volumen montado aquí
RUN mkdir -p /app/uploads && chown node:node /app/uploads

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
