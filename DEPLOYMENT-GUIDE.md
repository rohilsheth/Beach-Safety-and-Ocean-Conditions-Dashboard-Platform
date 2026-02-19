# Deployment Guide (Current)

## Production Prerequisites
Set these environment variables in Vercel Project Settings:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

Notes:
- `ADMIN_USERNAME` + `ADMIN_PASSWORD` are required for admin login.
- KV variables are strongly recommended for persistent admin updates/alerts in production.

## Deploy
```bash
vercel --prod
```

## Post-Deploy Validation

### Auth + Admin
- `https://<domain>/admin/login` loads correctly
- Login works with username/password
- `/admin`, `/admin/alerts`, `/admin/analytics` are protected

### Beach Updates Flow
1. In `/admin`, update flag/hazards/advisory for a beach
2. Open `/` in a new tab
3. Confirm updated status appears on user dashboard

### Alerts Flow
1. In `/admin/alerts`, post a beach or county alert
2. Confirm alert appears in active alert list
3. Open `/`, select affected beach, confirm alert displays

### Mobile
- List/map toggle works
- Marker tap opens detail overlay
- Detail overlay is visible above map layers

## Troubleshooting

### Admin changes do not persist in production
- Confirm `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set
- Redeploy after changing env vars
- Check function logs for KV errors

### Login fails in production
- Confirm both `ADMIN_USERNAME` and `ADMIN_PASSWORD`
- Redeploy after env updates

### Alerts not visible on user side
- Confirm alert is active (not expired)
- Confirm language setting matches user language (`en`, `es`, or `both`)

## Security Model (Current)
- Cookie-based auth (`admin_auth` cookie, httpOnly)
- Middleware protects:
  - `/admin/:path*`
  - `POST/DELETE /api/custom-alerts`
  - `/api/admin/:path*`
  - `/api/analytics/stats`

## Current Production URLs
- Public dashboard: `https://beach-safety-and-ocean-conditions-d.vercel.app`
- Admin login: `https://beach-safety-and-ocean-conditions-d.vercel.app/admin/login`
