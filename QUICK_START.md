# Quick Start Guide

## 🚀 Run the Dashboard

```bash
cd "/Users/rohilsheth/Beach Safety and Ocean Conditions Dashboard Platform"
npm run dev
```

**Dashboard:** http://localhost:3000

**Look for:** "LIVE" indicator at the top (green dot = real data!)

## 📡 API Endpoints

### All Beaches (Live Data)
```bash
curl http://localhost:3000/api/beaches | jq '.'
```

### Active Weather Alerts
```bash
curl http://localhost:3000/api/alerts | jq '.'
```

### Specific Beach
```bash
curl http://localhost:3000/api/beaches/pacifica-linda-mar | jq '.'
```

## 🌊 External Data Sources (Direct)

### NOAA Buoy (Half Moon Bay)
```bash
curl https://www.ndbc.noaa.gov/data/realtime2/46012.txt
```

### NWS Alerts (San Mateo County)
```bash
curl -H "User-Agent: test" https://api.weather.gov/alerts/active/zone/CAZ509
```

### Open-Meteo (Pacifica Beach)
```bash
curl "https://api.open-meteo.com/v1/forecast?latitude=37.59&longitude=-122.50&current=temperature_2m,uv_index,windspeed_10m&temperature_unit=fahrenheit&windspeed_unit=mph"
```

## 🏗️ Build & Deploy

### Local Build
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
vercel --prod
```

## 📊 Current Live Data (as of Feb 16, 2026)

- **Wave Height:** 6.9 ft (from buoy 46012)
- **Wind:** 7 mph SW
- **Water Temp:** 57°F
- **Air Temp:** 50-53°F (varies by beach)
- **UV Index:** 1-2
- **Active Alerts:** 0 (no alerts currently)

## 🔍 Check Integration Status

### Browser Console
Look for:
```
✅ Live data loaded from: {...}
```

### Dashboard Indicator
- 🟢 **LIVE** = Real-time data ✅
- 🟡 **(Mock Data)** = Fallback mode

### Test All APIs
```bash
# Test beaches API
curl -s http://localhost:3000/api/beaches | jq '.success'
# Should return: true

# Test alerts API
curl -s http://localhost:3000/api/alerts | jq '.success'
# Should return: true

# Check NOAA buoy directly
curl -s https://www.ndbc.noaa.gov/data/realtime2/46012.txt | head -3
# Should return data table
```

## 📁 Key Files

### API Integration
- `/lib/api/noaa.ts` - NOAA buoy fetcher
- `/lib/api/nws.ts` - Weather alerts
- `/lib/api/openmeteo.ts` - Local weather
- `/lib/api/aggregator.ts` - Combines all sources

### API Routes
- `/app/api/beaches/route.ts`
- `/app/api/beaches/[id]/route.ts`
- `/app/api/alerts/route.ts`

### Frontend
- `/app/page.tsx` - Main dashboard (fetches from API)

## 📚 Documentation

- `LIVE_DATA_INTEGRATION.md` - Full technical guide
- `INTEGRATION_SUMMARY.md` - What was built
- `DEPLOYMENT.md` - Deploy to production
- `README.md` - Project overview

## 🐛 Troubleshooting

### Shows "Mock Data" instead of "LIVE"
1. Check internet connection
2. Verify NOAA buoy is online: https://www.ndbc.noaa.gov/station_page.php?station=46012
3. Check browser console for errors
4. Wait 5 minutes (cache refresh)

### API returns 500 error
1. Check Next.js server logs
2. Test external APIs directly (see URLs above)
3. Restart dev server: `npm run dev`

### No alerts showing
- This is normal! It means no active beach safety alerts
- Check NWS directly: https://api.weather.gov/alerts/active/zone/CAZ509

## ✅ Verification Checklist

- [ ] Dev server running on http://localhost:3000
- [ ] Dashboard shows "LIVE" indicator
- [ ] API `/api/beaches` returns success: true
- [ ] Wave height matches NOAA buoy data (~6-7 ft currently)
- [ ] Build succeeds with `npm run build`
- [ ] Ready to deploy with `vercel --prod`

---

**Need help?** Check the detailed docs in `LIVE_DATA_INTEGRATION.md`
