# SaaS Template Store

**Internship Submission:** Software Engineering Intern Task

**Developer:** Raj Kumar A

**Contact:** rajk89a@gmail.com

## Project Overview

A full-stack SaaS template marketplace built with React, Vite, Tailwind CSS, Node.js, Express, and PostgreSQL.

Users can explore templates, search and filter listings, view template details, manage favorites, and access a personalized dashboard.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Axios, React Router, React Icons
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL, Knex.js
- **Authentication:** JWT and bcrypt

## Setup Instructions

### Backend

```bash
cd server
npm install
```

Create `server/.env` with the required database connection, JWT secret, port, and frontend URL.

Run migrations and seed data:

```bash
npx knex migrate:latest
npx knex seed:run
```

Start the backend using the start script defined in `server/package.json`.

### Frontend

Open another terminal:

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Make sure PostgreSQL is running and the backend environment variables are configured before starting the application.