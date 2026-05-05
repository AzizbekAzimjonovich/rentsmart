# UzRent

Full-stack house rental web application: **React (Vite)** + **Redux Toolkit** + **Tailwind CSS** frontend, **Node.js** + **Express** + **MongoDB** backend. Features JWT auth, user listings with admin moderation (pending / approved / rejected), dark mode, and a responsive admin dashboard.

## Prerequisites

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

## Quick start

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: MONGODB_URI, JWT_SECRET, CLIENT_URL (http://localhost:5173)
npm install
npm run seed:admin
npm run dev
```

API runs at `http://localhost:5000` by default. Uploaded images are stored under `backend/uploads/`.

**Default admin** (after `seed:admin`, from `.env.example`): `admin@uzrent.com` / `Admin123!`

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`. In development, API requests are proxied to the backend (see `vite.config.js`).

### 3. Production build (frontend)

Set `VITE_API_URL` to your public API origin (no trailing slash), then:

```bash
cd frontend
npm run build
npm run preview
```

## API overview

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user (Bearer) |
| PATCH | `/api/auth/profile` | Update profile (Bearer) |
| GET | `/api/listings/public` | Approved listings (query: search, filters, pagination, sort) |
| GET | `/api/listings/public/:id` | Single approved listing + similar |
| GET | `/api/listings/featured` | Featured (approved, newest) |
| GET | `/api/listings/recent` | Recent approved |
| POST | `/api/listings` | Create listing multipart (Bearer) — status `pending` |
| GET | `/api/listings/mine` | User’s listings (Bearer) |
| PATCH | `/api/listings/mine/:id` | Update own listing (Bearer) — back to `pending` |
| DELETE | `/api/listings/mine/:id` | Delete own listing (Bearer) |
| GET | `/api/admin/stats` | Admin stats (Bearer + admin) |
| GET | `/api/admin/users` | List users |
| GET | `/api/admin/listings` | All listings |
| PATCH | `/api/admin/listings/:id/approve` | Approve |
| PATCH | `/api/admin/listings/:id/reject` | Reject |
| DELETE | `/api/admin/listings/:id` | Delete any listing |

## Project structure

```
uzrent/
├── backend/     # Express API, Mongoose models, JWT, Multer uploads
├── frontend/    # Vite + React + Redux + Tailwind
└── README.md
```

## Notes

- Only **approved** listings appear on public pages.
- Google Maps on the listing page uses an embed URL derived from the address (no API key required for basic embed).
- Change `JWT_SECRET` and admin credentials before deploying.
