# Railway Deployment Guide

This repo is configured for a single Railway service that serves both the Express API and the built React app.

## Why the `vite: not found` Error Happened

Railway installed production dependencies only, so the client build tools in `client/devDependencies` were missing. The root `postinstall` script now installs:

- backend production dependencies
- client dependencies including dev build tools

The backend also serves `client/dist` in production, so Railway can run one service from the repo root.

## Railway Setup

1. Push the latest code to GitHub.
2. In Railway, create a new project.
3. Choose `Deploy from GitHub repo`.
4. Select `iammalikmusaib/team-task-manager`.
5. Keep the root directory as the repository root.
6. Railway should use `railway.json` automatically.

## Railway Variables

Set these variables in the Railway service:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/team-task-manager?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-railway-domain.up.railway.app
```

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
