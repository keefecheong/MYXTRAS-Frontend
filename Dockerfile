FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies separately so Docker can reuse this layer when only
# application source files change.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite embeds these values into the browser bundle during the build. Firebase
# web configuration is public client configuration; do not pass private
# server-side credentials as build arguments.
ARG PORT=80
ARG BASE_URL=http://localhost
ARG APP_SERVER_URL=http://localhost:3124
ARG FIREBASE_APIKEY=<your_firebase_api_key>
ARG FIREBASE_AUTHDOMAIN=<your_firebase_auth_domain>
ARG FIREBASE_PROJECTID=<your_firebase_project_id>
ARG FIREBASE_APPID=<your_firebase_app_id>

ENV PORT=${PORT} \
    BASE_URL=${BASE_URL} \
    APP_SERVER_URL=${APP_SERVER_URL} \
    FIREBASE_APIKEY=${FIREBASE_APIKEY} \
    FIREBASE_AUTHDOMAIN=${FIREBASE_AUTHDOMAIN} \
    FIREBASE_PROJECTID=${FIREBASE_PROJECTID} \
    FIREBASE_APPID=${FIREBASE_APPID}

RUN npm run build

FROM nginx:1.27-alpine

# The Vite multi-page inputs live under public/, so Rollup keeps that directory
# in the output. Copy the pages to Nginx's document root while preserving the
# separately generated asset directory.
COPY --from=build /app/dist/public /usr/share/nginx/html
COPY --from=build /app/dist/assets /usr/share/nginx/html/assets
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --spider --quiet http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
