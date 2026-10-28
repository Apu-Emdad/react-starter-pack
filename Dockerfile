# syntax=docker/dockerfile:1

# Node 24 with Corepack, which provides the Yarn 4 version pinned in package.json
FROM node:24-slim AS base
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
WORKDIR /app

# Build stage: installs every dependency and builds the app into dist/.
# Vite writes VITE_API_URL into the files at build time, so it is a build argument.
FROM base AS build
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL
COPY package.json yarn.lock .yarnrc.yml ./
RUN --mount=type=cache,target=/root/.yarn/berry/cache yarn install --immutable
COPY . .
RUN yarn build

# Runtime stage: serves dist/ with `vite preview`, as the non-root node user.
# Good for demos and local runs. For production, serve dist/ with Nginx or a CDN instead.
FROM build AS runtime
ENV NODE_ENV=production
# Vite writes a temporary file while loading vite.config.ts
RUN mkdir -p node_modules/.vite-temp && chown node:node node_modules/.vite-temp
USER node
EXPOSE 4173
CMD ["node_modules/.bin/vite", "preview", "--host", "0.0.0.0", "--port", "4173"]
