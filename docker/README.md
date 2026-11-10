# Docker

Imagen de producción de la landing: `node:current-alpine` (última versión de Node) compila
como usuario `node` y `nginx-unprivileged:mainline-alpine` (última versión de Nginx) sirve los
estáticos en el puerto **8080** como usuario `nginx`, el puerto que Cloud Run espera por
defecto. Ningún stage corre como root.

| Archivo            | Para qué                                                                                       |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| `../Dockerfile`    | Stages `deps` → `build` → `runtime`; vive en la raíz porque Cloud Run busca ahí el Dockerfile |
| `nginx.conf`       | Fallback a `index.html` para vue-router, caché, gzip, cabeceras de seguridad y `/healthz`     |
| `../.dockerignore` | Lo que no entra al contexto (BuildKit y el builder legacy leen el mismo)                       |
| `../compose.yaml`  | Servicio `web` para levantarla con `docker compose up`                                         |

## Desde una copia local

```sh
docker compose up -d              # construye la imagen y levanta el contenedor
# http://localhost:8080
docker compose up -d --build      # reconstruir tras cambios en el código
docker compose down               # detener y eliminar el contenedor
```

Sin compose:

```sh
docker build -t rodrigo-lazo .
docker run -d --name rodrigo-lazo -p 8080:8080 --restart unless-stopped rodrigo-lazo
```

## Cloud Run

Con el asistente «Implementación continua» de Cloud Run basta con apuntar al repo y elegir
**Dockerfile** como tipo de build: toma la raíz del repo como contexto y expone el puerto 8080.
Desde la terminal, con `gcloud` autenticado:

```sh
gcloud run deploy rodrigo-lazo --source . --region us-central1 --port 8080 --allow-unauthenticated
```

## Operación

```sh
docker compose ps                # STATUS muestra (healthy)
docker compose logs -f           # logs de acceso de Nginx
```

La imagen no ejecuta `vue-tsc`: su binario nativo no carga en Alpine (musl). Corre
`npm run type-check` antes de hacer merge a main.
