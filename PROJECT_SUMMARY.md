# Project Summary (Current)

## Project
San Mateo County Beach Safety Dashboard built on Next.js 14 with a public dashboard and authenticated admin portal.

## Core Delivered Capabilities
- Public dashboard (`/`) with map, list, and detail panel
- Real-time/fallback condition aggregation from NOAA/NWS/Open-Meteo/NOAA tides
- Risk flags + hazard indicators + advisories
- Admin beach overrides (`/admin`)
- Admin custom alerts (`/admin/alerts`)
- Admin analytics page (`/admin/analytics`) with demo/mock visuals
- EN/ES language toggle
- Mobile-specific UX with list/map toggle and full-screen detail overlay

## Authentication + Security
- Login at `/admin/login` using `ADMIN_USERNAME` + `ADMIN_PASSWORD`
- Cookie-based session (`httpOnly`, secure in production)
- Middleware protection for admin pages and sensitive APIs

## Persistence
- Production: KV REST-backed persistence for admin updates/alerts
- Local development: file persistence fallback under `data/*.json`

## Important Routes
- Public: `/`
- Admin: `/admin`, `/admin/alerts`, `/admin/analytics`, `/admin/login`
- APIs: `/api/beaches`, `/api/beaches/[id]`, `/api/alerts`, `/api/admin/beach-update`, `/api/custom-alerts`, `/api/analytics/*`, `/api/auth/*`

## Current Analytics State
- Event collection endpoints exist and support real stats.
- Admin analytics UI is intentionally demo/mock (with disclaimer) per project direction.

## Deployment
- Current alias: `https://beach-safety-and-ocean-conditions-d.vercel.app`
- Deploy command: `vercel --prod`
