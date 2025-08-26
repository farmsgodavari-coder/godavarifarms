This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


---

# Onion Prices Tracker — Quick Start

This project is a Next.js 13 App Router app that tracks daily onion prices with filters and a PostgreSQL backend via Prisma.

## Stack

- Next.js (App Router, TypeScript, Tailwind CSS)
- Prisma ORM with PostgreSQL
- API routes in `src/app/api/*`
- UI components in `src/components/`

## Directory overview

- `src/app/page.tsx` — main page with Filters and PricesTable
- `src/components/Filters.tsx` — filter form (state, mandi, size, quality, packing, date range)
- `src/components/PricesTable.tsx` — results table with pagination
- `src/app/api/meta/states/route.ts` — GET states
- `src/app/api/meta/mandis/route.ts` — GET mandis (optional `stateId`)
- `src/app/api/prices/route.ts` — GET with filters + pagination; POST to upsert price
- `src/lib/prisma.ts` — Prisma client singleton
- `prisma/schema.prisma` — DB schema and enums
- `prisma/seed.js` — seed script
- `docker-compose.yml` — local Postgres service

## Environment

Create `.env.local` in project root. Choose one of the following:

- Local Docker Postgres (see `docker-compose.yml`):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/onion_prices?schema=public"
```

- Hosted Postgres (Neon/Vercel Postgres via Neon) — recommended pooled connection for serverless/Next.js:

```env
# Replace <USER>, <PASSWORD>, <HOST>, <DB>
DATABASE_URL="postgresql://<USER>:<PASSWORD>@<HOST>/<DB>?sslmode=require&pgbouncer=true&connection_limit=1"
```

Notes:
- Prisma works best with pooled connections in serverless. The flags `pgbouncer=true&connection_limit=1` are recommended with Neon PgBouncer.
- On Vercel, set `DATABASE_URL` in Project Settings → Environment Variables.

## Install

```powershell
npm i
npx prisma generate
```

## Database setup

Option A — Hosted Postgres (Neon):

```powershell
npx prisma migrate dev --name init
npm run db:seed
```

Option B — Local Postgres (Docker):

1) Ensure Docker Desktop is running with WSL2 integration.
2) Start DB:

```powershell
docker pull postgres:16-alpine
docker compose up -d
```

3) Migrate and seed:

```powershell
npx prisma migrate dev --name init
npm run db:seed
```

## Run the app

```powershell
npm run dev
```

Open http://localhost:3000

## Admin authentication

Minimal cookie-based admin auth (no third-party dependency):

1) Create `.env.local` with:

```
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
# Optional: Prisma/Postgres
# DATABASE_URL=postgresql://user:pass@host:5432/db?schema=public
```

2) Login at `/admin/login` using the credentials above.

- On success, server sets an HTTP-only cookie `session=valid` (SameSite=Lax, Secure in production) for 7 days.
- Middleware guards `/admin/**` paths and redirects to `/admin/login` when unauthenticated.
- Logout from the sidebar or POST `/api/logout` to clear the cookie.

API endpoints involved:

- `POST /api/login` → sets `session` cookie when credentials match env
- `POST /api/logout` → clears `session` cookie
- `GET  /api/session` → `{ authenticated: boolean }`

Note: legacy routes `/api/admin/login`, `/api/admin/logout`, `/api/auth/session` are deprecated and return 410.

## API usage

- GET states: `/api/meta/states`
- GET mandis: `/api/meta/mandis?stateId=1`
- GET prices (filters): `/api/prices?stateId=&mandiId=&size=&quality=&packing=&dateFrom=&dateTo=&page=&pageSize=`
- POST price `/api/prices` body example:

```json
{
  "date": "2025-08-23",
  "stateId": 1,
  "mandiId": 1,
  "size": "MEDIUM",
  "quality": "MEDIUM",
  "packing": "BAG",
  "minPrice": 1200,
  "avgPrice": 1500,
  "maxPrice": 1800
}
```

Response shape for GET `/api/prices`:

```json
{
  "data": [
    {
      "id": 1,
      "date": "2025-08-23",
      "state": { "id": 1, "name": "Maharashtra" },
      "mandi": { "id": 1, "name": "Lasalgaon" },
      "size": "MEDIUM",
      "quality": "MEDIUM",
      "packing": "BAG",
      "minPrice": "1200",
      "avgPrice": "1500",
      "maxPrice": "1800"
    }
  ],
  "pagination": { "total": 1, "page": 1, "pageSize": 20, "totalPages": 1 }
}
```

## Troubleshooting

- Prisma P1001 (cannot reach database): verify `.env` and DB is running/accessible.
- Docker issues on Windows: restart WSL and Docker Desktop, enable WSL2 integration, retry `docker compose up -d`.
