# Quick Start

## 1) Install and run
```bash
cd "/Users/rohilsheth/Beach Safety and Ocean Conditions Dashboard Platform"
npm install
npm run dev
```

Open:
- Public dashboard: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`

## 2) Required env vars
Create/update `.env.local`:
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_password
# Optional local KV (usually blank in local dev)
KV_REST_API_URL=
KV_REST_API_TOKEN=
```

## 3) Verify core flows
1. Login to admin with username + password.
2. Update a beach flag/hazards/advisory in `/admin`.
3. Open `/` and verify updates reflect.
4. Post an alert in `/admin/alerts`.
5. Open a beach detail on `/` and verify alert shows.

## 4) Useful API checks
```bash
curl -s http://localhost:3000/api/beaches | jq '.success'
curl -s http://localhost:3000/api/alerts | jq '.count'
curl -s http://localhost:3000/api/beaches/pacifica-linda-mar | jq '.data.name'
```

## 5) Deploy
```bash
vercel --prod
```

After deployment, ensure Vercel env vars are set and redeploy if changed.
