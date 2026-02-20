# San Mateo County Beach Safety Dashboard

Production-ready Next.js 14 application for San Mateo County beach conditions, hazards, and county-managed alerts.

## Current Status

- Public dashboard: `/`
- Admin portal: `/admin` (auth required)
- Admin alerts: `/admin/alerts` (auth required)
- Admin analytics: `/admin/analytics` (auth required, demo/mock visuals)

## Features

### Public Dashboard
- Interactive Leaflet map + beach list
- Beach-level conditions: wave height, wind, water temp, air temp, UV, tide
- Risk flag system: green/yellow/red
- Hazard chips + advisory panel
- County custom alerts shown on beach detail
- EN/ES language toggle (updates page language + html lang attribute)
- Mobile flow: list/map toggle + full-screen detail overlay

### Admin Portal
- Username/password login at `/admin/login`
- Language toggle in admin header (EN/ES, icon-only on mobile)
- Beach condition overrides: flag, hazards, advisory
- Custom alerts CRUD with priority, duration, language targeting
- "Open User View" button for quick public-side validation

### Accessibility (WCAG 2.1 Level AA)
- Skip-to-content link in public header
- `html lang` attribute updated dynamically on language switch
- `aria-label` on all interactive elements; `aria-hidden` on decorative icons/emoji
- `role="img"` on hazard chips (avoids inappropriate live region announcements)
- Keyboard focus indicators on beach list items

### Data + APIs
- Live sources: NOAA NDBC, NOAA CO-OPS (tides), NWS alerts, Open-Meteo
- Server-side aggregation with static fallback data
- 5-minute server cache + client auto-refresh + focus/visibility refresh
- Cache invalidation on admin updates

### Persistence
- Production: KV REST (`KV_REST_API_URL`, `KV_REST_API_TOKEN`)
- Local dev: file fallback in `data/*.json`

## Authentication

| Env var | Default | Purpose |
|---|---|---|
| `ADMIN_USERNAME` | `admin` | Admin login username |
| `ADMIN_PASSWORD` | (required) | Admin login password |

Auth cookie: `httpOnly`, secure in production, 8-hour session.
Login uses `window.location.href` redirect (avoids middleware race condition with `router.push`).

## Environment Variables

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
KV_REST_API_URL=
KV_REST_API_TOKEN=
```

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy

```bash
vercel --prod
```

After deploying, verify env vars are set in Vercel project settings and redeploy if changed.

## API Routes

| Method | Route | Auth |
|---|---|---|
| GET | `/api/beaches` | — |
| GET | `/api/beaches/[id]` | — |
| GET | `/api/alerts` | — |
| POST | `/api/auth/login` | — |
| POST | `/api/auth/logout` | — |
| GET/POST/DELETE | `/api/admin/beach-update` | Required |
| GET | `/api/custom-alerts` | — |
| POST/DELETE | `/api/custom-alerts` | Required |
| POST | `/api/analytics/track` | — |
| GET | `/api/analytics/stats` | Required |

## Analytics Note

`/admin/analytics` currently shows demo/mock charts (clearly labeled). Live tracking endpoints (`/api/analytics/track`, `/api/analytics/stats`) exist and can be wired to live charts when needed.

## Documentation

- [QUICK_START.md](QUICK_START.md) — fastest setup/test path
- [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) — production deployment and env setup
- [LIVE_DATA_INTEGRATION.md](LIVE_DATA_INTEGRATION.md) — data source integration details
- [RFP-COMPLIANCE-REPORT.md](RFP-COMPLIANCE-REPORT.md) — requirement mapping against RFP 2026-RFP-Informal-00253
- [PRODUCTION-READINESS.md](PRODUCTION-READINESS.md) — go-live checklist and known tradeoffs
