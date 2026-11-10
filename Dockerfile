# syntax=docker/dockerfile:1

# Imagen de producción de la landing: compila con Node y sirve los estáticos con Nginx.
# Vive en la raíz del repo a propósito: el asistente «Implementación continua» de Cloud Run
# deriva el contexto del build de la carpeta que contiene el Dockerfile y necesita package.json
# a este nivel. Compatible con el builder legacy: sin RUN --mount; el filtrado del contexto
# usa el .dockerignore de la raíz.
# Construir desde la raíz del repo:  docker compose build   (o docker build -t rodrigo-lazo .)
#
# Imágenes base sin versión fija: `node:current-alpine` es siempre la última versión de Node
# y `nginx-unprivileged:mainline-alpine` la última de Nginx. Cada build toma la más reciente.

# ── Stage 1: deps ─────────────────────────────────────────────────────────────
# Solo package.json + lock: esta capa queda en caché mientras no cambien las dependencias.
# Corre como el usuario `node` (uid 1000) de la imagen oficial, nunca como root.
# El directorio se crea con RUN y no solo con WORKDIR: el builder legacy crea los WORKDIR
# faltantes como root y luego npm no puede escribir ahí (EACCES).
FROM node:current-alpine AS deps
USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ── Stage 2: build ────────────────────────────────────────────────────────────
# Solo vite build. El type-check (vue-tsc) no corre aquí: typescript-native-bridge trae un
# binario para glibc que no carga en Alpine (musl). Se valida antes con `npm run type-check`.
FROM deps AS build
COPY --chown=node:node . .
RUN npm run build-only

# ── Stage 3: runtime ──────────────────────────────────────────────────────────
# Nginx sin privilegios (usuario nginx, puerto 8080, el que Cloud Run espera por defecto).
# Sin Node ni node_modules.
FROM nginxinc/nginx-unprivileged:mainline-alpine AS runtime
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /home/node/app/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/healthz || exit 1
