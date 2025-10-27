FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json yarn.lock* ./
RUN yarn install --frozen-lockfile

COPY src .
RUN yarn build

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json yarn.lock* ./

RUN yarn install --production --frozen-lockfile

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/main.js"]
