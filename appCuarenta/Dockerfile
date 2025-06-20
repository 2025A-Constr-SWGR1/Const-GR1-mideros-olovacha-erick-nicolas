# Etapa 1: Build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Producción
FROM node:18-alpine

WORKDIR /app

# Necesario para dockerizar
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/frontend ./frontend

# Establecer la variable de entorno (puerto NestJS)
ENV PORT=3000

# Puerto
EXPOSE 3000

# Comando de arranque
CMD ["node", "dist/main"]