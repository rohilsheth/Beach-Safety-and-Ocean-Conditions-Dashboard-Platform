# Integration Summary (Current)

## External Data Integrations
- NOAA NDBC: buoy data (wave/wind/water temp fallback)
- NOAA CO-OPS: tide predictions via nearest station mapping
- Open-Meteo: per-beach weather + marine conditions
- NWS: active coastal hazard alerts

## Aggregation Model
`/api/beaches` calls `lib/api/aggregator.ts` to merge sources with priority:
1. Admin overrides
2. Live external data
3. Static fallback beach data

## Caching + Refresh
- Server-side cache duration: 5 minutes
- Cache invalidation on admin update/reset
- Frontend refresh interval: 5 minutes
- Frontend refresh on focus/visibility return

## Alerts + Overrides Persistence
- Production: KV REST (`KV_REST_API_URL`, `KV_REST_API_TOKEN`)
- Local: filesystem fallback (`data/admin-updates.json`, `data/custom-alerts.json`)

## Current Limitation
- Admin analytics page is demo/mock visuals even though tracking APIs exist.
