# San Mateo County Beach Safety Dashboard

Production-ready Next.js 14 application for San Mateo County beach conditions, hazards, and county-managed alerts.

## Current Status
- Public dashboard is live at `/`
- Admin portal is at `/admin` (auth required)
- Admin alerts are at `/admin/alerts` (auth required)
- Admin analytics are at `/admin/analytics` (auth required, demo/mock visuals)

## Features

### Public Dashboard
- Interactive Leaflet map + beach list
- Beach-level conditions: wave height, wind, water temp, air temp, UV, tide
- Risk flag system: green/yellow/red
- Hazard chips + advisory panel
- County custom alerts shown on beach detail
- EN/ES language toggle
- Mobile flow: list/map toggle + full-screen detail overlay

### Admin Portal
- Username/password login at `/admin/login`
- Beach condition overrides: flag, hazards, advisory
- Custom alerts CRUD with priority, duration, language
- "Open User View" button in admin header for quick validation

### Data + APIs
- Primary live data sources:
  - NOAA NDBC
  - NOAA CO-OPS (tides)
  - NWS alerts
  - Open-Meteo
- Server-side aggregation with fallback data
- 5-minute cache + manual invalidation on admin updates

### Persistence
- Production persistence uses KV REST when configured:
  - `KV_REST_API_URL`
  - `KV_REST_API_TOKEN`
- Local dev falls back to file persistence in `data/*.json`

## Authentication
- Required env vars:
  - `ADMIN_USERNAME` (defaults to `admin` if omitted)
  - `ADMIN_PASSWORD`
- Auth cookie is httpOnly, secure in production, 8-hour session

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

After deploy, verify in Vercel project settings that env vars are set and redeploy if changed.

## API Routes
- `GET /api/beaches`
- `GET /api/beaches/[id]`
- `GET /api/alerts`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET|POST|DELETE /api/admin/beach-update` (auth)
- `GET|POST|DELETE /api/custom-alerts` (`POST/DELETE` auth)
- `POST /api/analytics/track`
- `GET /api/analytics/stats` (auth)

## Analytics Note
- `/admin/analytics` currently presents mock/demo charts (clearly labeled), including a mock alert CTR chart.
- Real tracking endpoints exist (`/api/analytics/track`, `/api/analytics/stats`) and can be wired into live charts when needed.

## Documentation Index
- `QUICK_START.md` - fastest setup/test path
- `DEPLOYMENT-GUIDE.md` - production deployment and env setup
- `LIVE_DATA_INTEGRATION.md` - data source integration details
- `RFP-COMPLIANCE-REPORT.md` - requirement mapping summary
