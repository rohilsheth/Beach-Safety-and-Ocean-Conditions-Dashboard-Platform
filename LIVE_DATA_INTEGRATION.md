# Live Data Integration Guide (Current)

## Overview
The dashboard serves unified beach conditions by combining multiple live feeds with resilient fallback behavior.

## Source Adapters
- `lib/api/noaa.ts` - NDBC buoy reads and unit conversions
- `lib/api/tides.ts` - CO-OPS tide station mapping and status derivation
- `lib/api/openmeteo.ts` - per-coordinate weather/marine fetches
- `lib/api/nws.ts` - active hazard alert retrieval/filtering

## Aggregator
- File: `lib/api/aggregator.ts`
- Provides:
  - `aggregateBeachData()`
  - `getCachedBeachData()`
  - `getBeachById()`
  - `invalidateBeachDataCache()`

## Data Flow
Public dashboard -> `/api/beaches` -> aggregator -> external adapters + admin overrides.

## Update Behavior
- API cache: 5 minutes
- Client auto-refresh: 5 minutes
- Client also refreshes when tab/window regains focus

## Admin Override Integration
Admin writes via `/api/admin/beach-update` are persisted and invalidate aggregator cache, so public data can reflect changes immediately.

## Production Persistence Requirement
For reliable production writes, configure KV env vars:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

Without KV in serverless production, filesystem persistence is not guaranteed.
