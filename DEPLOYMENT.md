# Railway Deployment Guide

This repo is configured for a single Railway service that serves both the Express API and the built React app.

## How It Works

The backend serves the API and the built frontend from `client/dist` in production. Railway deploys one service from the repository root.

## Railway Setup

1. Push the latest code to GitHub.
2. In Railway, create a new project.
3. Choose `Deploy from GitHub repo`.
4. Select `iammalikmusaib/team-task-manager`.
5. Keep the root directory as the repository root.
6. Railway should use `railway.json` automatically.

## Railway Variables

Set these variables in the Railway service. Do not hardcode secrets in source files and do not commit `server/.env`.

```env
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-railway-domain.up.railway.app
PUBLIC_APP_URL=https://your-railway-domain.up.railway.app
```

Variable meanings:

- `MONGO_URI`: MongoDB Atlas connection string.
- `JWT_SECRET`: long random secret used to sign login tokens.
- `JWT_EXPIRES_IN`: token lifetime, for example `7d`.
- `CLIENT_URL`: allowed browser origin for CORS.
- `PUBLIC_APP_URL`: public URL used to generate forgot-password reset links.
- `PORT`: set automatically by Railway. Do not set it manually on Railway.

Optional password reset email variables:

```env
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="Team Task Manager <no-reply@example.com>"
```

## Build and Start Commands

Railway should run these from the root:

```bash
npm install
npm run build
npm start
```

Do not run `node dist/index.js`; this is not a compiled Node app. The backend entrypoint is:

```bash
npm start
```

which runs:

```bash
npm start --prefix server
```

## Local Production Test

From the repo root:

```bash
npm install
npm run build
```

Create `server/.env`, then run:

```bash
set NODE_ENV=production
npm start
```

Open:

```txt
http://localhost:5000
```

The API health endpoint is:

```txt
http://localhost:5000/api/health
```

## Common Mistakes

- Do not run `node dist/index.js`; there is no backend file there.
- Do not put MongoDB credentials in README, code, or GitHub.
- Do not set Railway root directory to `client` or `server` for this setup. Use the repository root.
- Do not set `VITE_API_URL` on Railway unless you intentionally split frontend and backend into separate services.
