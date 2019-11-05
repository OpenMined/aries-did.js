# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY controller/package*.json ./
RUN npm install
COPY controller/ .

ENV PATH="/app/node_modules/typescript/bin:${PATH}"

RUN npm run build

# production stage
FROM abiosoft/caddy:1.0.0 as production-stage
COPY docker/controller/Caddyfile /etc/Caddyfile
COPY --from=build-stage /app/dist /srv
