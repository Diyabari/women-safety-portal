# RASHI

A full-stack web application (React + Node.js/Express + MongoDB) providing women with
emergency assistance, incident reporting, nearby safe-place search, safety awareness
resources, and an admin panel — built from the project proposal.

## Tech Stack

- **Frontend:** React 18, Vite, React Router, Tailwind CSS, Axios, lucide-react icons
- **Backend:** Node.js, Express.js, JWT authentication, Multer (file uploads)
- **Database:** MongoDB (Mongoose ODM)

## Project Structure

```
women-safety-portal/
├── backend/
│   ├── config/db.js
│   ├── controllers/        # business logic for each module
│   ├── middleware/         # auth (JWT) + file upload (multer)
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routers
│   ├── uploads/            # incident evidence files (created at runtime)
│   ├── seed.js             # creates demo admin, safe places, safety tips
│   ├── server.js           # app entry point
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/axios.js            # axios instance + auth token interceptor
    │   ├── context/AuthContext.jsx # login/register/logout state
    │   ├── components/             # Navbar, SOSButton, ProtectedRoute
    │   ├── pages/                  # Login, Register, Dashboard, Contacts,
    │   │                           # Incidents, SafePlaces, SafetyTips
    │   └── pages/admin/             # AdminDashboard, AdminIncidents, AdminUsers
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## Prerequisites

- Node.js 18+ and npm
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas connection string

## 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set:
- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string
- `GOOGLE_MAPS_API_KEY` — optional, only needed if you extend the Safe Place Finder to render an actual map

Seed the database with a demo admin account, sample safe places, and safety tips:

```bash
npm run seed
```

This prints the admin login:
```
email: admin@safetyportal.com
password: Admin@123
```

Start the API server:

```bash
npm run dev      # with nodemon (auto-restart)
# or
npm start
```

The API runs at `http://localhost:5000`. Check `http://localhost:5000/api/health` to confirm it's up.

## 2. Frontend Setup

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`. Vite is configured to proxy `/api` and `/uploads`
requests to the backend at `http://localhost:5000`, so no CORS configuration is needed
in development.

## 3. Using the App

1. Register a new account at `/register`, or log in as the seeded admin.
2. As a regular user: add emergency contacts, try the SOS button (grants location
   permission), report an incident (optionally with photo/video/PDF evidence), search
   for nearby safe places, and browse safety tips.
3. As the admin: view analytics, review/verify/resolve reported incidents, and
   activate/deactivate user accounts.

## API Overview

| Method | Endpoint                          | Access        | Description                        |
|--------|------------------------------------|---------------|------------------------------------|
| POST   | /api/auth/register                 | Public        | Create account                     |
| POST   | /api/auth/login                    | Public        | Log in                             |
| GET    | /api/auth/me                       | User          | Current profile                    |
| PUT    | /api/auth/me                       | User          | Update profile                     |
| PUT    | /api/auth/location                 | User          | Update last known location         |
| GET/POST/PUT/DELETE | /api/contacts         | User          | Manage emergency contacts          |
| POST   | /api/sos                           | User          | Trigger SOS alert                  |
| GET    | /api/sos                           | User          | SOS alert history                  |
| PUT    | /api/sos/:id/status                | User          | Resolve/cancel an alert            |
| POST   | /api/incidents                     | User          | Report incident (multipart, `evidence` files) |
| GET    | /api/incidents/mine                | User          | Own incident reports               |
| GET    | /api/safe-places?lat=&lng=&type=   | User          | Find nearby safe places            |
| GET    | /api/safety-tips                   | User          | Browse safety tips                 |
| GET    | /api/admin/users                   | Admin         | List all users                     |
| PUT    | /api/admin/users/:id/status         | Admin         | Activate/deactivate a user         |
| GET    | /api/admin/incidents                | Admin         | List/filter all incidents          |
| PUT    | /api/admin/incidents/:id            | Admin         | Update status / add notes          |
| GET    | /api/admin/analytics                | Admin         | Dashboard analytics                |

## Security Notes

- Passwords are hashed with bcrypt before storage; the password field is excluded from
  query results by default (`select: false`).
- All non-public routes require a valid JWT (`Authorization: Bearer <token>`).
- Uploaded evidence files are validated by type (images, PDF, video) and size-limited
  (25MB) via Multer.
- Users can mark incident reports as anonymous; the backend still stores the reporter's
  ID for moderation purposes, but the frontend/admin UI hides the name for anonymous
  reports.

## Future Enhancements (not yet implemented)

These are called out in the project report and are natural next steps:
- Real SMS/WhatsApp notifications to emergency contacts (e.g. via Twilio) — a hook for
  this is already marked in `controllers/sosController.js`.
- Real-time live location tracking (WebSockets) shared with trusted contacts.
- A mobile app (React Native) reusing the same backend API.
- AI-based safety chatbot and crime hotspot analysis.
- Multi-language support (English, Hindi, Marathi).
