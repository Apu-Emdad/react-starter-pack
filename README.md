# React Starter Pack

[![CI](https://github.com/Apu-Emdad/react-starter-pack/actions/workflows/ci.yml/badge.svg)](https://github.com/Apu-Emdad/react-starter-pack/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A React dashboard starter with login, register, a users admin page and a dashboard already built, so a new project starts with features instead of setup. It works with [nestjs-starter-pack](https://github.com/Apu-Emdad/nestjs-starter-pack) as the API, runs with one command in Docker and comes with tests and CI.

## Features

- **Auth:** login and register screens. The user and access token are saved in `localStorage` with `redux-persist`, so a page reload keeps the session. Without a saved token, the `httpOnly` refresh cookie restores it. An expired token is refreshed once, in the background, and the failed request is retried.
- **Account self-service:** forgot and reset password, email verification from the email link, a dismissible "verify your email" banner with a resend link, and a profile page to change the user name, email and password. Verification is optional: unverified users can use everything.
- **Protected routes:** `RequireAuth`, `GuestOnly` and `RequireRole` guards, and a redirect back to the page the user came from.
- **Users admin:** list with search, role and status filters and paging, plus deactivate and delete with a confirm dialog (super admin only).
- **Dashboard:** welcome banner, stat cards and a chart.
- **Form fields:** `FormTextInput`, `FormSelect`, `FormSwitch` and more in one file. Each field needs only a `name`, and the schema comes from Zod.
- **Design:** an indigo to magenta brand gradient, light and dark mode, and a responsive layout with a mobile menu. The theme is one file.
- **Same contract as the API:** every response is `{ status, message, data }`, rows are identified by `uid`, and the API's own messages show in toasts and forms.
- **Docker:** a multi-stage Dockerfile and a Compose file.
- **Quality:** unit and component tests with Vitest, Testing Library and MSW, oxlint, Prettier and a GitHub Actions workflow.

## Tech stack

| Area         | Tools                                            |
| ------------ | ------------------------------------------------ |
| Build        | Vite, TypeScript, Node.js 24                     |
| UI           | React 19, Mantine, Mantine Charts, Tabler Icons  |
| Routing      | React Router                                     |
| Server data  | TanStack Query, Axios                            |
| Client state | Redux Toolkit (auth session)                     |
| Forms        | React Hook Form, Zod                             |
| Testing      | Vitest, Testing Library, MSW                     |
| Tooling      | Yarn 4, oxlint, Prettier, GitHub Actions, Docker |

## Quick start

You only need [Docker](https://docs.docker.com/get-docker/). Start the API first, then the web app.

```bash
# 1. The API (PostgreSQL, Redis and the API on http://localhost:3000)
git clone https://github.com/Apu-Emdad/nestjs-starter-pack.git api
cd api
cp .env.example .env
docker compose up --build
```

In a second terminal:

```bash
# 2. The web app on http://localhost:5173
git clone https://github.com/Apu-Emdad/react-starter-pack.git web
cd web
cp .env.example .env
docker compose up --build
```

Open `http://localhost:5173` and log in as `admin` with the password `12345678`. Press Ctrl+C in each terminal to stop.

The API's `WEB_ORIGIN` must be `http://localhost:5173`, which is the default. CORS and the refresh cookie depend on it.

## Installation

Use this guide to start a new project from the starter. The quick start above is only for trying it out.

### 1. Requirements

- Node.js 24 (with [nvm](https://github.com/nvm-sh/nvm): `nvm install 24`)
- Corepack, which ships with Node and provides Yarn 4: `corepack enable`
- A running API that follows the [nestjs-starter-pack](https://github.com/Apu-Emdad/nestjs-starter-pack) contract

### 2. Create your project

Click **Use this template** on GitHub to create a new repository, then clone it:

```bash
git clone git@github.com:<you>/<your-project>.git
cd <your-project>
```

Or copy the starter without its git history:

```bash
git clone --depth 1 https://github.com/Apu-Emdad/react-starter-pack.git <your-project>
cd <your-project>
rm -rf .git && git init -b main
```

### 3. Rename the project

| What             | Where                                                                            |
| ---------------- | -------------------------------------------------------------------------------- |
| Package name     | `name` and `description` in `package.json`                                       |
| App name         | `APP_NAME` in `src/shared/components/ui/Logo.tsx`, and `<title>` in `index.html` |
| Brand text       | The tagline in `src/features/auth/components/AuthLayout.tsx`                     |
| Compose project  | `name`, `image` and `container_name` in `docker-compose.yml`                     |
| Docs and license | This README, `docs/`, and the copyright line in `LICENSE`                        |

To change colors, radius or fonts, edit `src/theme/theme.ts`.

### 4. Install dependencies

```bash
nvm use
yarn install
```

### 5. Configure the environment

```bash
cp .env.example .env
```

Set `VITE_API_URL` to the address of your API. Vite writes this value into the build, so restart `yarn dev` (or rebuild the Docker image) after you change it.

On the API side, set `WEB_ORIGIN` to this app's URL (`http://localhost:5173` for `yarn dev`), and `WEB_URL` too: the links in the API's emails open `<WEB_URL>/verify-email` and `<WEB_URL>/reset-password` here.

### 6. Run the app

```bash
yarn dev
```

Open `http://localhost:5173`.

### 7. Commit your starting point

```bash
git add -A
git commit -m "chore: start from react-starter-pack"
```

### Next steps

- **Add a feature:** create `src/features/<name>/` with `api`, `components` and `pages`, then add its route in `src/app/router.tsx`. See [docs/architecture.md](docs/architecture.md#adding-a-feature).
- **Add a form:** see [Forms](docs/architecture.md#forms).
- **Run in Docker:** `docker compose up --build` serves the built app on `http://localhost:5173`. Stop `yarn dev` first, since both use that port.

## Scripts

| Command             | What it does                         |
| ------------------- | ------------------------------------ |
| `yarn dev`          | Start the dev server with hot reload |
| `yarn build`        | Build for production into `dist/`    |
| `yarn preview`      | Serve the built app                  |
| `yarn lint`         | Run oxlint                           |
| `yarn typecheck`    | Type-check the whole project         |
| `yarn test`         | Run the tests once                   |
| `yarn test:watch`   | Run the tests in watch mode          |
| `yarn format`       | Format the code with Prettier        |
| `yarn format:check` | Check formatting (used in CI)        |

## Project structure

```
src/
  app/          providers, router, Redux store
  theme/        Mantine theme and global styles
  features/     one folder per business area
    auth/       login, register, forgot/reset password, verify email, guards, session state
    profile/    the user's own details and password
    users/      users admin page
    dashboard/  dashboard page
  shared/
    api/        Axios client with token refresh, Result types
    components/ui/      shared UI: form fields, feedback, modals
    components/layout/  app shell, sidebar, header
    constants/  roles, routes
    utils/      formatting helpers
  test/         test setup and the fake API (MSW)
```

## Documentation

- [Architecture](docs/architecture.md): folder rules, auth flow, forms and how to add a feature
- [Local setup](docs/local-setup.md): running the project and the API together

## License

[MIT](LICENSE) © Emdadul Haque Apu
