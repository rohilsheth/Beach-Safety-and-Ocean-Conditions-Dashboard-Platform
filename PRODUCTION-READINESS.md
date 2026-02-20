# Production Readiness (Current)

## Implemented

- Cookie-based admin auth with username/password login UI
- Protected admin and sensitive API routes via middleware
- Persistent admin updates + alerts via KV REST in production
- Cache invalidation on beach update/reset
- Public data refresh behavior for returning users (focus/visibility)
- Mobile UX: list/map toggle, full-screen detail overlay, admin icon-only buttons on mobile
- Admin portal fully translated (EN/ES), language toggle in admin header
- WCAG 2.1 AA improvements: skip-to-content, aria-labels, aria-hidden, html lang sync, role="img" on hazard chips, keyboard focus indicators
- Login reliability fix: `window.location.href` instead of `router.push` (avoids middleware cookie race)

## Current Known Tradeoffs

- `/admin/analytics` visuals are demo/mock charts (explicitly labeled); live tracking API exists but not yet wired to charts
- No scheduled PDF/CSV reporting automation
- WCAG improvements implemented but no formal third-party audit completed

## Recommended Next Steps

1. Wire `/admin/analytics` to live `/api/analytics/stats` charts
2. Add monthly export job for engagement + top beaches + alert CTR
3. Add rate limiting for admin write endpoints
4. Complete formal WCAG 2.1 AA audit with screen reader passes

## Go-Live Checklist

- [ ] Vercel env vars set (`ADMIN_USERNAME`, `ADMIN_PASSWORD`, KV vars)
- [ ] Fresh production deploy completed
- [ ] Admin login test pass (single click/enter)
- [ ] Beach update propagation test pass
- [ ] Alert post/display test pass
- [ ] Mobile smoke test pass (EN and ES)
- [ ] Admin header language switch verified on mobile
