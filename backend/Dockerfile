# syntax=docker/dockerfile:1
FROM node:18-alpine AS build-backend

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
# si usas TS necesitas compilar, si no, comentar:
# RUN yarn build

EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "src/index.js"] 
# o si no transpilas,: CMD ["node", "src/index.js"]
