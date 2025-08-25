# Changelog

## 2025-08-24

- Replace deprecated simple auth with minimal cookie-based auth
  - /api/login: validates ADMIN_USERNAME/PASSWORD and sets session=valid cookie (HTTP-only, Lax, Secure in prod, 7d)
  - /api/logout: clears session cookie
  - /api/session: returns { authenticated }
- Middleware guards /admin/** by checking session cookie; redirects to /admin/login
- AdminSidebar logout now posts to /api/logout
- Deprecated old routes (return 410):
  - /api/admin/login
  - /api/admin/logout
  - /api/auth/session
- Admin API routes now enforce session via getSessionUser(); removed legacy bypass/header logic
- Added env.example with ADMIN_USERNAME/ADMIN_PASSWORD
- Added package.json script: typecheck
