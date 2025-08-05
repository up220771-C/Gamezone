FROM node:18

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

# Asegúrate de copiar también el código fuente
COPY . .

# (opcional pero útil para depuración)
RUN ls -la && ls -la src

RUN npm run build

EXPOSE 5000
CMD ["node", "dist/index.js"]
