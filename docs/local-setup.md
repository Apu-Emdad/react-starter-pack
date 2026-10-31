# Local setup

## What runs where

| Service | Address                 | Started by                                  |
| ------- | ----------------------- | ------------------------------------------- |
| Web     | `http://localhost:5001` | `yarn dev`, or `docker compose up --build`  |
| API     | `http://localhost:5000` | `nestjs-starter-pack` (`docker compose up`) |

Use one of `yarn dev` and `docker compose` at a time, since both use port 5001.

## Run with Docker

```bash
cp .env.example .env
docker compose up --build
```

The image is built with `VITE_API_URL` from `.env`. Change it, then run `docker compose up --build` again.

The Docker image serves the built app with `vite preview`. That is fine for demos and local runs. For production, serve the `dist/` folder with Nginx or a CDN.

## Run for development

```bash
nvm use
yarn install
cp .env.example .env
yarn dev
```

## Cookies and CORS

The API sends the refresh token as an `httpOnly` cookie with `sameSite: strict` on the `/auth` path. This works when the web app and the API are on the same site, such as `localhost:5001` and `localhost:5000`, or `app.example.com` and `api.example.com`.

The API's `WEB_ORIGIN` must match the web app's address exactly, or the browser blocks the requests. The Axios client sends cookies with `withCredentials: true`.

## Tests

`yarn test` runs everything without a backend. MSW fakes the API in `src/test/handlers.ts`. A test can replace a response with `server.use(...)`.
