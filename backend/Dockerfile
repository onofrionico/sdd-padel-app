FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production && \
    npm install tsconfig-paths ts-node

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/database ./src/database
COPY --from=builder /app/src/config ./src/config
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY start.sh ./start.sh

RUN chmod +x ./start.sh

EXPOSE 3000

CMD ["sh", "./start.sh"]
