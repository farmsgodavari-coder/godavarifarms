# Project Summary (current)

This summarizes the codebase state after auth simplification and cleanup.

## Current status

- **Auth**
  - Minimal cookie-based admin auth in place. `middleware.ts` guards `/admin/**` via `session` cookie.
  - Routes: `POST /api/login`, `POST /api/logout`, `GET /api/session`.
  - Legacy `/api/admin/login`, `/api/admin/logout`, `/api/auth/session` are deprecated and respond 410 (where present) or removed.

- **Firebase**
  - Removed entirely. Files `src/lib/auth/firebaseAdmin.ts` and `src/lib/auth/firebaseClient.ts` deleted.
  - Packages `firebase` and `firebase-admin` uninstalled.

- **Admin APIs**
  - `src/app/api/admin/rates/route.ts` (GET, POST) and `src/app/api/admin/rates/[id]/route.ts` (PUT, DELETE) enforce session.
  - Delete handler returns mock success if `DATABASE_URL` is absent.

- **Public APIs**
  - `src/app/api/rates/*`, `src/app/api/meta/*`, `src/app/api/events/route.ts`, `src/app/api/health/route.ts` are active.

- **Tooling**
  - `npm run typecheck` added; TypeScript passes.
  - ESLint configured. Lint run shows no blocking issues.

- **Assets / server**
  - `public/` only includes `globe.svg` (used by `src/app/page.tsx`).
  - No `server/` directory remains.

## Environment

Create `.env.local` for local development:

```
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
# Optional DB
# DATABASE_URL=postgresql://user:pass@host:5432/db?schema=public
```

## Next recommended steps

- **Routing polish**: Ensure admin pages link back to login/logout and handle unauthorized transitions smoothly.
- **Docs**: README reflects the new auth; keep in sync as features evolve.
- **QA**: Manual verify login, add/update/delete flows under `/admin/*` with and without a real DB.
