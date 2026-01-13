# Backend (Express + MongoDB)

## Setup

1. Copy env:

```bash
cp .env.example .env
```

2. Edit `.env`:
- `MONGODB_URI` (local or Atlas)
- `JWT_SECRET`
- `CLIENT_ORIGIN` (URL du front)

3. Install + run:

```bash
npm install
npm run dev
```

API: `http://localhost:4000/api`

## Auth routes

- `POST /api/signup` body JSON: `{ firstName, lastName, username, email, password }`
- `POST /api/login` body JSON: `{ email, password }`
- `POST /api/logout`
- `GET /api/me` (protégée, cookie JWT)

## User route

- `DELETE /api/me` (protégée) supprime le compte + **tous les posts** de l’utilisateur

## Post routes

- `GET /api/posts` (public) → trié du plus récent au plus ancien
- `GET /api/posts/:id` (public)
- `POST /api/posts` (protégée) **multipart/form-data**:
  - `image` (file, obligatoire)
  - `description` (text, obligatoire)
- `PUT /api/posts/:id` (protégée) multipart possible (description et/ou nouvelle image)
- `DELETE /api/posts/:id` (protégée)

Uploads servis via: `GET /uploads/<filename>`
