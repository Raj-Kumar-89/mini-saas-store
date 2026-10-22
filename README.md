# Mini SaaS Template Store

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Fast%20Build-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-Backend-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Knex.js](https://img.shields.io/badge/Query_Builder-Knex.js-D26B38)
![JWT](https://img.shields.io/badge/Auth-JWT-orange?logo=jsonwebtokens&logoColor=white)
![Axios](https://img.shields.io/badge/API-Axios-5A29E4?logo=axios&logoColor=white)
![Status](https://img.shields.io/badge/Status-Internship%20Task-blue)

A full-stack web application for discovering, browsing, and organizing website templates. Users can search and filter templates, view template details, manage their favorite templates, and revisit recently viewed items.

## Overview

The **Mini SaaS Template Store** is a full-stack web application developed as part of an internship selection task. The project demonstrates practical skills in full-stack web development, RESTful API design, database integration, and user authentication. It showcases the ability to build a functional web application by integrating frontend and backend components with secure data management.

The application separates the frontend and backend into dedicated directories, with PostgreSQL providing persistent data storage.

## Features

- **User Authentication:** User registration and login using bcrypt password hashing and JWT-based authentication.
- **Template Discovery:** Browse available templates and view detailed information.
- **Search and Filtering:** Search templates and filter them by category.
- **Favorites Management:** Add templates to favorites, view saved templates, and remove favorites.
- **Recently Viewed Templates:** Track recently viewed templates using browser local storage.
- **Protected Routes:** Restrict access to authenticated sections of the application.
- **Responsive Interface:** A user interface designed for different screen sizes.
- **Database Management:** Use Knex migrations and seed scripts to manage database tables and initial template data.

## Technology Stack

### Frontend
- React
- Vite
- Tailwind CSS v4
- React Router
- Axios
- React Icons

### Backend
- Node.js
- Express.js
- JSON Web Tokens (JWT)
- bcrypt

### Database
- PostgreSQL
- Knex.js

## Project Structure

```text
mini-saas-store/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
|   |   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│
├── server/
│   ├── migrations/
│   ├── seeds/
│   ├── src/
|   |   ├── config/
|   |   ├── controllers/
|   |   ├── middleware/
|   |   ├── routes/
|   |   ├── app.js
│   │   └── server.js
|   ├── knexfile.js
│   ├── package.json
│
├── .gitignore
└── README.md
```

## Prerequisites

Before running the application, make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- [PostgreSQL](https://www.postgresql.org/)
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Raj-Kumar-89/mini-saas-store.git
cd mini-saas-store
```

### 2. Configure the Backend

Navigate to the server directory and install the dependencies:

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
```

Run the database migrations and seed scripts using the following commands:

```bash
npx knex migrate:latest
npx knex seed:run
```

Start the backend using the following command:

```bash
npm run dev
```

The backend should run at `http://localhost:5000` when using the default port.

### 3. Configure the Frontend

Open a second terminal and navigate to the client directory:

```bash
cd client
npm install
```

Create a `.env` file inside the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

Open the local URL displayed by Vite, typically `http://localhost:5173`.

## API Endpoints

The API uses `/api` as its base path.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check API health |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in a user |
| GET | `/api/templates` | Retrieve templates |
| GET | `/api/templates/:id` | Retrieve a template by ID |
| GET | `/api/favorites` | Retrieve the authenticated user's favorites |
| POST | `/api/favorites` | Add a template to favorites |
| DELETE | `/api/favorites/:id` | Remove a favorite |

Protected endpoints require valid authentication through the application's JWT middleware. Template search and category filtering depend on the query parameters supported by the implementation.

## Security Considerations

- Passwords are hashed using bcrypt rather than stored as plain text.
- JWTs are used to authenticate protected API requests.
- Environment variables store database connection details and server secrets.
- User-specific resources should be authorized on the backend.

## Future Improvements

- Add pagination and sorting for template listings.
- Introduce automated tests for frontend components and backend endpoints.
- Add template previews and more advanced filtering options.
- Improve request validation, error handling, and rate limiting.
- Expand dashboard functionality and user profile management.

# Author

**Raj Kumar**

Full Stack Developer

- GitHub: https://github.com/Raj-Kumar-89
- LinkedIn: https://www.linkedin.com/in/raj-kumar13/

---

## License

This project is intended for educational and portfolio purposes.
