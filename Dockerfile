# ---------- build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# ---------- runtime stage ----------
FROM nginx:1.27-alpine

# Зібраний фронт
COPY --from=build /app/dist /usr/share/nginx/html

# Шаблон конфіга (перегенеруємо на старті)
COPY public/config.js.template /usr/share/nginx/html/config.js.template

# Скрипт генерації конфіга
COPY docker/entrypoint.sh /docker-entrypoint.d/40-gen-config.sh
RUN chmod +x /docker-entrypoint.d/40-gen-config.sh

# Nginx SPA конфіг
COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# Значення за замовчуванням (можна перевизначити при запуску)
ENV API_BASE_URL="http://localhost:8080" \
    APP_NAME="Cubic helper"
