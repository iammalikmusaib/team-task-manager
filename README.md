# Team Task Manager

A production-ready full-stack Team Task Manager built with React, Vite, Tailwind CSS, Express, MongoDB, Mongoose, JWT authentication, and role-based access control.

## Features

- Signup, login, persistent JWT auth, and logout
- Forgot password and reset password flow with expiring reset tokens
- Admin and Member roles
- Admin project CRUD with team member management
- Admin task CRUD, assignment, priority, due date, and status management
- Member access to assigned projects and assigned task status updates
- Dashboard analytics with cards, status chart, overdue counts, and recent activity
- Task search, filtering, overdue detection, status badges, and drag-and-drop Kanban updates
- Profile updates with generated avatar initials and color selection
- Responsive SaaS-style UI with sidebar navigation and dark/light theme
- Backend validation, protected APIs, CORS, bcrypt password hashing, and environment-based config
- Optional SMTP configuration for password reset email delivery
- Railway-compatible single-service deployment configuration

## Tech Stack

Frontend:
- React.js + Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast
- Recharts
- Lucide React

Backend:
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs

## Folder Structure

```txt
team-task-manager/
  client/
    src/
      components/
      context/
      hooks/
      layouts/
      pages/
      services/
      utils/
  server/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
```

## Local Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Create backend env:

```bash
cp server/.env.example server/.env
```

Update `server/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/team-task-manager?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="Team Task Manager <no-reply@example.com>"
```

3. Create frontend env:

```bash
cp client/.env.example client/.env
```

Update `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

4. Optional seed data:

```bash
npm run seed --prefix server
```

Demo credentials after seeding:
- Admin: `admin@example.com` / `password123`
- Member: `member@example.com` / `password123`

Forgot password in development:
- Leave SMTP variables blank.
- Submit an email on `/forgot-password`.
- The API response includes a development reset link, and the backend logs the same link.
- In production, configure SMTP variables so reset links are emailed.

5. Run both apps:

```bash
npm run dev
```

Frontend: `http://localhost:5173`  
Backend health: `http://localhost:5000/api/health`

## API Endpoints

Auth:
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password/:token`
- `GET /api/auth/me`

Users:
- `GET /api/users`
- `PUT /api/users/profile`

Projects:
- `POST /api/projects` Admin
- `GET /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id` Admin
- `DELETE /api/projects/:id` Admin

Tasks:
- `POST /api/tasks` Admin
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id` Admin can edit all fields, Member can update assigned task status and progress
- `DELETE /api/tasks/:id` Admin

Dashboard:
- `GET /api/dashboard`

## Railway Deployment

This app is configured as one Railway service from the repository root. Express serves the API and the built React app from `client/dist`.

1. Create a new Railway project.
2. Choose `Deploy from GitHub repo`.
3. Select `iammalikmusaib/team-task-manager`.
4. Keep the root directory as the repository root.
5. Add variables:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/team-task-manager?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-railway-domain.up.railway.app
```

Optional SMTP variables:

```env
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="Team Task Manager <no-reply@example.com>"
```

Railway uses `railway.json`:

```bash
npm install
npm run build
npm start
```

Do not run `node dist/index.js`; this project is not a compiled backend. The backend entrypoint is `server/src/server.js`, and the root `npm start` script starts it.

After deploy, confirm:

```txt
https://your-railway-domain.up.railway.app/api/health
```

## Notes

- The backend intentionally adds a task assignee to the selected project members if they are not already present.
- Members can drag their assigned tasks between statuses and update progress on assigned work.
- Admins control project/task creation, assignment, editing, and deletion.
