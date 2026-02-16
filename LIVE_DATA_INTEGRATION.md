# Live Data Integration Guide

## Overview

The Beach Safety Dashboard now integrates with **real-time data sources** from NOAA, National Weather Service, Open-Meteo, and EPA. This replaces the mock data with actual ocean conditions, weather alerts, and water quality information.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│                     /app/page.tsx                            │
└────────────────────────┬────────────────────────────────────┘
                         │ fetch('/api/beaches')
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js API Routes                        │
│            /app/api/beaches/route.ts                         │
│            /app/api/alerts/route.ts                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│               Data Aggregation Service                       │
│              /lib/api/aggregator.ts                          │
│   • Combines data from multiple sources                      │
│   • Applies business logic (flag status, hazards)            │
│   • 5-minute caching layer                                   │
└────┬──────────┬────────────┬─────────────┬─────────────────┘
     │          │            │             │
     ▼          ▼            ▼             ▼
┌─────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐
│  NOAA   │ │  NWS   │ │  Open-   │ │   EPA    │
│  NDBC   │ │  API   │ │  Meteo   │ │  BEACON  │
│ (Buoys) │ │(Alerts)│ │ (Weather)│ │ (Water)  │
└─────────┘ └────────┘ └──────────┘ └──────────┘
```

## Data Sources

### 1. NOAA NDBC (National Data Buoy Center)

**What it provides:**
- Wave height (meters → converted to feet)
- Wind speed (m/s → converted to mph)
- Wind direction (degrees → cardinal directions)
- Water temperature (celsius → fahrenheit)
- Air temperature (celsius → fahrenheit)

**Buoy Stations:**
- **46012** - Half Moon Bay (37.361°N 122.881°W) - Primary
- **46026** - San Francisco (37.759°N 122.833°W) - Fallback

**Update Frequency:** Hourly

**Implementation:** `/lib/api/noaa.ts`

**Example Request:**
```
https://www.ndbc.noaa.gov/data/realtime2/46012.txt
```

**Data Format:** Space-delimited text file with header rows

### 2. National Weather Service API

**What it provides:**
- Active weather alerts (Rip Current Statements, High Surf Advisories, etc.)
- Marine forecasts
- Alert severity, certainty, urgency
- Detailed instructions and descriptions

**Coverage:** San Mateo County coast (CAZ509 - San Francisco Peninsula Coast)

**Update Frequency:** Real-time

**Implementation:** `/lib/api/nws.ts`

**Example Request:**
```
https://api.weather.gov/alerts/active/zone/CAZ509
```

**Alert Types Monitored:**
- Rip Current Statement
- High Surf Advisory / Warning
- Beach Hazards Statement
- Coastal Flood Advisory / Warning
- Small Craft Advisory
- Gale Warning / Storm Warning

### 3. Open-Meteo API

**What it provides:**
- Local air temperature (already in fahrenheit)
- UV index
- Wind speed and direction (backup for buoy data)

**Coverage:** Per-beach coordinates

**Update Frequency:** Hourly

**Implementation:** `/lib/api/openmeteo.ts`

**Example Request:**
```
https://api.open-meteo.com/v1/forecast
  ?latitude=37.5935
  &longitude=-122.5068
  &current=temperature_2m,uv_index,windspeed_10m,winddirection_10m
  &temperature_unit=fahrenheit
  &windspeed_unit=mph
```

**Advantages:**
- No API key required (free)
- Per-beach granularity
- Reliable global coverage

### 4. EPA BEACON (Water Quality)

**What it provides:**
- Beach closure status
- Water quality advisories
- Advisory descriptions and dates

**Coverage:** California beaches (San Mateo County)

**Update Frequency:** Daily or as advisories posted

**Implementation:** `/lib/api/epa.ts`

**Note:** EPA BEACON doesn't have a simple REST API. The current implementation returns mock data. For production, integrate with:
- MyCoast California API (https://mycoast.org/ca)
- California Water Quality Monitoring Council
- EPA BEACON GIS services

## API Routes

### GET `/api/beaches`

Returns all beach data with live conditions.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "pacifica-linda-mar",
      "name": "Pacifica State Beach",
      "nickname": "Linda Mar",
      "region": "North",
      "coordinates": { "lat": 37.5935, "lng": -122.5068 },
      "flagStatus": "yellow",
      "conditions": {
        "waveHeight": 4.5,
        "windSpeed": 12,
        "windDirection": "NW",
        "waterTemp": 54,
        "airTemp": 62,
        "uvIndex": 5,
        "tideStatus": "Rising"
      },
      "hazards": ["rip-currents"],
      "advisory": "Moderate rip currents...",
      "lastUpdated": "2026-02-16T..."
    }
  ],
  "timestamp": "2026-02-16T...",
  "sources": {
    "buoy": "NOAA NDBC (46012, 46026)",
    "alerts": "National Weather Service (CAZ509)",
    "weather": "Open-Meteo API",
    "waterQuality": "EPA BEACON"
  }
}
```

### GET `/api/beaches/[id]`

Returns specific beach data.

### GET `/api/alerts`

Returns active NWS alerts for San Mateo County coast.

## Business Logic

### Flag Status Determination

The aggregator applies this logic to determine each beach's flag status:

1. **Start with base status** from beach configuration
2. **Check NWS alerts:**
   - Extreme/Severe severity → RED
   - Moderate severity → YELLOW
3. **Check conditions:**
   - Wave height > 8ft → Add "high-surf" hazard
   - Wind speed > 20mph → Add "strong-winds" hazard
4. **Override with most severe status**

### Hazard Detection

Hazards are automatically added based on:

- **NWS Alerts:** Rip current statements, high surf advisories
- **Buoy Data:** Wave height thresholds
- **Wind Data:** Strong wind thresholds
- **Water Quality:** EPA advisories
- **Manual:** County staff via admin panel (persisted separately)

### Caching Strategy

- **API Route Level:** `revalidate: 300` (5 minutes)
- **Aggregator Level:** In-memory cache with 5-minute TTL
- **Frontend:** Refetches every 5 minutes

This ensures:
- ✅ Minimal API calls to external services
- ✅ Fast response times for users
- ✅ Data stays reasonably fresh (5-min is acceptable for beach conditions)

## Error Handling & Fallbacks

The system is designed to be **resilient**:

### 1. External API Failures

Each data source fetch is wrapped in try/catch:
- NOAA buoy down? → Use fallback buoy or previous data
- NWS API error? → No alerts shown (safe default)
- Open-Meteo unavailable? → Use mock data for that beach

### 2. Aggregator Fallback

If the entire aggregation fails, return original mock beach data from `/data/beaches.ts`.

### 3. Frontend Fallback

The dashboard page:
- Shows "LIVE" indicator when using real data
- Shows "(Mock Data)" indicator when using fallback
- Displays yellow warning banner if API errors occur
- Continues functioning with mock data if API is unreachable

### 4. CORS & Rate Limiting

All APIs used are CORS-enabled and free/public:
- NOAA: No authentication required
- NWS: Requires User-Agent header (already implemented)
- Open-Meteo: Free tier, no key required
- EPA: Public data

## Testing the Integration

### 1. Local Development

```bash
npm run dev
```

Open http://localhost:3000 and check:
- Browser console for "✅ Live data loaded from:" message
- "LIVE" indicator in the top status bar
- Beach conditions updating with real buoy data

### 2. Check API Endpoints

```bash
# Test beaches API
curl http://localhost:3000/api/beaches

# Test alerts API
curl http://localhost:3000/api/alerts

# Test specific beach
curl http://localhost:3000/api/beaches/pacifica-linda-mar
```

### 3. Monitor Data Sources

Check if external APIs are responding:

```bash
# NOAA Buoy (Half Moon Bay)
curl https://www.ndbc.noaa.gov/data/realtime2/46012.txt

# NWS Alerts (San Mateo)
curl -H "User-Agent: test" https://api.weather.gov/alerts/active/zone/CAZ509

# Open-Meteo
curl "https://api.open-meteo.com/v1/forecast?latitude=37.59&longitude=-122.50&current=temperature_2m,uv_index"
```

## Production Deployment

### Environment Variables

No environment variables needed! All APIs are public and keyless.

### Vercel Configuration

The API routes use Next.js caching:
```typescript
export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 minutes
```

Vercel will automatically:
- Cache API responses at the edge
- Revalidate every 5 minutes
- Handle concurrent requests efficiently

### Monitoring

Add these checks to your monitoring:

1. **API Health:** Monitor `/api/beaches` response time
2. **External API Status:** Track NOAA/NWS uptime
3. **Error Rates:** Watch for aggregation failures
4. **Cache Hit Ratio:** Ensure caching is working

## Known Limitations & Future Improvements

### Current Limitations

1. **EPA Water Quality:** Currently returns mock data
   - **Fix:** Integrate with MyCoast California API or CA Water Quality Portal

2. **Tide Status:** Uses simple time-based estimation
   - **Fix:** Integrate with NOAA CO-OPS Tides API
   - Example: https://tidesandcurrents.noaa.gov/api/

3. **Beach-Specific Buoy Data:** Uses regional buoys for all beaches
   - **Fix:** Implement interpolation based on distance to multiple buoys

4. **No Historical Data:** Only shows current conditions
   - **Fix:** Store conditions in database for trending

### Future Enhancements

1. **WebSockets for Real-Time Updates**
   - Push updates to clients when conditions change
   - No need for 5-minute polling

2. **Predictive Alerts**
   - ML model to predict flag changes based on forecasts
   - "High surf expected in 2 hours" warnings

3. **User Notifications**
   - Email/SMS alerts for favorite beaches
   - Push notifications for critical condition changes

4. **Lifeguard Integration**
   - Direct feed from county lifeguard stations
   - On-the-ground condition overrides

## Files Modified/Created

### New Files
- `/lib/api/types.ts` - TypeScript types for API responses
- `/lib/api/noaa.ts` - NOAA NDBC buoy integration
- `/lib/api/nws.ts` - National Weather Service integration
- `/lib/api/openmeteo.ts` - Open-Meteo weather API
- `/lib/api/epa.ts` - EPA water quality (mock)
- `/lib/api/aggregator.ts` - Data aggregation service
- `/app/api/beaches/route.ts` - Beach data API endpoint
- `/app/api/beaches/[id]/route.ts` - Individual beach endpoint
- `/app/api/alerts/route.ts` - Alerts API endpoint

### Modified Files
- `/app/page.tsx` - Updated to fetch from API
- Added error handling and live data indicator

## Support

For issues or questions:
- Check browser console for detailed error messages
- Verify external API status (NOAA, NWS endpoints)
- Check Next.js server logs for aggregation errors

---

**🎉 You now have a fully integrated live data system!**
