# syntax=docker/dockerfile:1
FROM node:18-alpine AS build-frontend

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Stage final con nginx
FROM nginx:alpine
COPY --from=build-frontend /app/build /usr/share/nginx/html
# Copia tu configuración nginx si la personalizas:
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
