# syntax=docker/dockerfile:1
FROM node:18-alpine AS build-backend

WORKDIR /app
# Usa package*.json para npm
COPY package*.json ./
# Instala deps con npm (ci si ya tienes package-lock.json)
RUN npm ci --omit=dev || npm install --omit=dev

# Copia el resto del código
COPY . .
# Si usas TS, aquí compilarías
# RUN npm run build

EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "src/index.js"]
