FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev && \
    npm install tsconfig-paths ts-node

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY start.sh ./start.sh

RUN chmod +x ./start.sh

EXPOSE 3000

CMD ["sh", "./start.sh"]
