## Context

I'm responding to a government RFP (San Mateo County, California — RFP-Informal No. 2026-RFP-Informal-00253) for a **Beach Safety and Ocean Conditions Dashboard Platform**. I need to build a working product demo that meets the RFP's requirements. This is for a job application take-home project, so it needs to demonstrate systems thinking and be functional — not just look pretty.

## RFP Requirements (Extracted from the actual solicitation)

The County of San Mateo is seeking a vendor to design, develop, deploy, and maintain a **public-facing, web-based Beach Safety and Ocean Conditions Dashboard**. Here are the specific requirements:

### 2.1 Platform Development
- Real-time display of **wave height** per beach
- Real-time display of **rip tide/rip current conditions** per beach
- Real-time display of **wind speed and direction** per beach
- Real-time display of **water temperature** per beach
- **Hazard alert system** with risk designation per beach (color-coded flag system: green/yellow/red)
- Display of **specific hazard information** (rip currents, high surf, jellyfish, sharks, water quality advisories, sneaker waves, etc.)
- County staff must be able to post **timely, location-specific updates and custom alerts**

### 2.2 Data Integration
- Aggregate data from **local sources** (county lifeguard reports, local sensors)
- Aggregate data from **regional sources** (CA State Parks, regional monitoring networks)
- Aggregate data from **national sources** (NOAA, NWS, EPA)
- All data synchronization must be **seamless and automatic** with minimal latency (target: <5 min refresh)

### 2.3 User Experience & Accessibility
- **Easy-to-understand interface** for general public (plain language, visual indicators)
- **Multi-language support** — English and Spanish at minimum
- **WCAG 2.1 Level AA** accessibility compliance
- **Mobile-responsive design** (mobile-first — most beachgoers will use phones)

### 2.4 Maintenance & Hosting
- **99.9% uptime** SLA
- **Data encryption** (TLS 1.3 in transit, AES-256 at rest)
- **Cyber threat protection** (WAF, DDoS mitigation, OWASP Top 10)
- Compliance with **County IT security standards**
- **Analytics reporting** — monthly user engagement metrics (visits, page views, popular beaches, etc.)

### 2.5 Implementation
- **Full launch within 90 days** of contract award
- Phased approach: MVP → Beta → Production

### 2.6 Evaluation Criteria
- Project Approach (20%)
- Firm Qualifications (25%)
- Team Qualifications (20%)
- Price (25%)
- Local Preference (10%)

## What to Build

Build a **Next.js 14 (App Router)** web application deployed on **Vercel** with the following:

### 1. Public Dashboard (Main App — `/`)

**Map View:**
- Interactive map of San Mateo County coastline using **Leaflet** (free, no API key needed) with OpenStreetMap tiles
- Beach markers color-coded by safety flag status (green/yellow/red)
- Click a marker → opens beach detail panel
- Map should show all 10 San Mateo County beaches listed below

**Beach List Sidebar:**
- Scrollable list of all beaches with:
  - Beach name and nickname (if applicable)
  - Current safety flag (green/yellow/red badge)
  - Quick stats: wave height, wind speed, water temp
  - Active hazard icons
- Click a beach → scrolls map to it and opens detail panel
- Filter by: region (North/Central/South), flag status, or search by name

**Beach Detail Panel (when a beach is selected):**
- Full beach name + region
- Safety flag with explanation
- Conditions grid: wave height (ft), wind speed (mph) + direction, water temp (°F), air temp (°F), UV index, tide status
- Active hazards section with icons and descriptions
- Active advisory text (if any) — shown prominently in a colored alert box
- "Last updated" timestamp
- Data source attribution (NOAA, NWS, etc.)

### 2. Admin Panel (`/admin`)

A simple admin interface (can be behind a basic auth gate or just a separate route) where county staff can:
- Select a beach from a dropdown
- Set the current safety flag (green/yellow/red)
- Post a custom advisory message
- Toggle specific hazards on/off for each beach
- See a log of recent updates

This demonstrates the "county customization" requirement from the RFP. Use local state or a simple JSON file — no real database needed for the demo.

### 3. Analytics Page (`/analytics`)

A simple dashboard showing mock analytics:
- Total visits this month (chart)
- Most viewed beaches (bar chart)
- Device breakdown (mobile vs desktop — pie chart)
- Peak usage times (line chart)

This addresses the RFP's analytics reporting requirement. Use **Recharts** for the charts.

## San Mateo County Beaches (Use These Exactly)

```
1. Pacifica State Beach (Linda Mar) — North — 37.5935, -122.5068
2. Rockaway Beach — North — 37.6028, -122.4965
3. Sharp Park Beach — North — 37.6175, -122.4903
4. Montara State Beach — Central — 37.5428, -122.5134
5. Moss Beach / Fitzgerald Marine Reserve — Central — 37.5261, -122.5129
6. Half Moon Bay State Beach — Central — 37.4636, -122.4425
7. Mavericks Beach — Central — 37.4935, -122.4965
8. Pomponio State Beach — South — 37.2924, -122.4057
9. Pescadero State Beach — South — 37.2609, -122.4099
10. Año Nuevo State Beach — South — 37.1085, -122.3379
```

## Mock Data

Seed realistic mock data for the demo. Make it feel real:
- Mavericks should always be RED flag (it's a famous big wave spot — waves 12-20ft)
- Montara should often be RED (known for sneaker waves and drownings)
- Half Moon Bay and Pacifica should be YELLOW (moderate rip currents common)
- Moss Beach, Rockaway, Pomponio should usually be GREEN (sheltered/calmer)
- Año Nuevo should be YELLOW for wildlife (elephant seal season)
- Include realistic wave heights (2-15ft range), water temps (52-58°F for NorCal), wind (5-25mph)

Create a `data/beaches.ts` file with this seeded data that simulates what would come from real APIs. Include a comment block at the top explaining which real APIs would be used in production:
- NOAA NDBC Buoy 46012 (Half Moon Bay) and 46026 (San Francisco)
- NWS API (api.weather.gov) for surf zone forecasts and hazard alerts
- Open-Meteo API for UV index and air temperature
- EPA BEACON for water quality advisories

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Styling:** Tailwind CSS
- **Maps:** React-Leaflet with OpenStreetMap tiles (no API key needed)
- **Charts:** Recharts (for analytics page)
- **Icons:** Lucide React
- **Language:** TypeScript
- **Deployment:** Vercel

## Design Direction

This is a **government platform** — it should look trustworthy, clean, and accessible. NOT startup-flashy.

- **Color palette:** Blue/navy primary (#1e3a5f), with green/yellow/red for safety flags. White/light gray backgrounds. High contrast for accessibility.
- **Typography:** System font stack or a clean sans-serif (no exotic fonts — this is gov)
- **Layout:** Sidebar + map on desktop, stacked on mobile
- **Header:** "San Mateo County Beach Safety Dashboard" with county seal/logo placeholder and a nav with Dashboard | Admin | Analytics
- **Footer:** "Powered by [Your Company Name] | Data sources: NOAA, NWS, EPA | © 2026 County of San Mateo"
- **WCAG 2.1 AA:** Ensure 4.5:1 contrast ratios, keyboard navigable, aria labels on interactive elements, alt text on images

## i18n (English/Spanish)

Add a language toggle (EN/ES) in the header. At minimum, translate:
- Navigation items
- Beach safety flag labels (Low Risk / Bajo Riesgo, Moderate Risk / Riesgo Moderado, High Risk / Alto Riesgo)
- Section headings
- Key UI labels (Wave Height / Altura de Olas, etc.)

Use `next-intl` or a simple context-based approach.

## File Structure

```
/app
  /page.tsx              — Main dashboard (map + beach list + detail panel)
  /admin/page.tsx        — Admin panel
  /analytics/page.tsx    — Analytics dashboard
  /layout.tsx            — Root layout with header/footer/nav
/components
  /Map.tsx               — Leaflet map component (dynamic import, no SSR)
  /BeachList.tsx         — Sidebar beach list with filters
  /BeachDetail.tsx       — Beach detail panel
  /FlagBadge.tsx         — Safety flag badge component
  /HazardChip.tsx        — Hazard indicator chip
  /AdminPanel.tsx        — Admin form component
  /AnalyticsCharts.tsx   — Recharts wrappers
  /LanguageToggle.tsx    — EN/ES toggle
/data
  /beaches.ts            — Beach data + mock conditions
  /translations.ts       — i18n strings
/lib
  /types.ts              — TypeScript types
  /constants.ts          — Shared constants (colors, hazard configs)
```

## Key Implementation Notes

1. **Leaflet must be dynamically imported** with `{ ssr: false }` in Next.js — it requires `window`
2. Use `useEffect` to simulate data refresh every 30 seconds (cycle mock data slightly to show "real-time" feel)
3. The admin panel should update the beach data in client-side state (demonstrate the workflow even without a backend)
4. Make the map the hero element — it should take up most of the screen real estate on desktop
5. On mobile, show the beach list first with a "View Map" toggle button
6. Add a "Last Updated: [timestamp]" indicator that refreshes to show data is live

## Deployment

After building, deploy to Vercel:
```bash
vercel --prod
```

Give me the deployed URL when done. I'll use it in my Loom recording.

## Summary

This demo should show a government buyer that:
1. We understood every requirement in their RFP
2. We can build a real product, not just mockups
3. The system architecture supports real-time data integration
4. The platform is accessible, mobile-friendly, and bilingual
5. There's an admin workflow for county staff
6. Analytics reporting is built in from day one
