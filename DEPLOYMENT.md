# Deployment Guide

## Quick Deploy to Vercel

### Option 1: Vercel CLI (Recommended for Demo)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to project directory:**
   ```bash
   cd "/Users/rohilsheth/Beach Safety and Ocean Conditions Dashboard Platform"
   ```

3. **Deploy to production:**
   ```bash
   vercel --prod
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? **beach-safety-dashboard** (or your preferred name)
   - In which directory is your code located? **./** (press Enter)
   - Want to modify settings? **N**

5. **Get your URL:**
   - Vercel will provide a production URL like: `https://beach-safety-dashboard.vercel.app`
   - Copy this URL for your Loom recording

### Option 2: Vercel Dashboard (GitHub Integration)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Beach Safety Dashboard"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure project:
     - Framework Preset: **Next.js**
     - Root Directory: **./** (leave default)
     - Build Command: `npm run build` (auto-detected)
     - Output Directory: `.next` (auto-detected)
   - Click "Deploy"

3. **Auto-deployment:**
   - Every push to `main` branch will trigger automatic deployment
   - Preview deployments for pull requests

## Environment Configuration

For production deployment, you may want to add these environment variables in Vercel:

```env
# Optional: Analytics tracking
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Optional: Custom domain
NEXT_PUBLIC_DOMAIN=beaches.smcgov.org
```

## Custom Domain Setup (Optional)

1. In Vercel Dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain (e.g., `beaches.smcgov.org`)
4. Update DNS records as instructed:
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or A record pointing to Vercel's IP addresses

## Performance Optimization

The application is already optimized for production:

- ✅ Static page generation where possible
- ✅ Automatic code splitting
- ✅ Image optimization (if images added)
- ✅ Edge network CDN
- ✅ Gzip/Brotli compression
- ✅ HTTP/2 and HTTP/3 support

## Post-Deployment Checklist

- [ ] Visit the deployed URL and test all three pages:
  - [ ] Dashboard (main page with map)
  - [ ] Admin panel (/admin)
  - [ ] Analytics (/analytics)
- [ ] Test on mobile device or browser dev tools
- [ ] Test language toggle (EN/ES)
- [ ] Verify map loads correctly
- [ ] Check all beach markers on map
- [ ] Test beach selection and detail panel
- [ ] Test admin panel updates
- [ ] Verify analytics charts display

## Troubleshooting

### Build Fails
- Check `npm run build` locally first
- Verify all dependencies are in package.json
- Check Node.js version compatibility (18+)

### Map Doesn't Load
- Leaflet requires client-side rendering (already configured with `ssr: false`)
- Check browser console for errors
- Verify OpenStreetMap tiles are accessible

### Blank Page on Mobile
- Ensure viewport meta tag is present (already in layout.tsx)
- Check mobile responsiveness in dev tools
- Verify Tailwind breakpoints are correct

## Security Notes

- No API keys required (using OpenStreetMap and mock data)
- All pages are publicly accessible (no authentication needed for demo)
- In production, add authentication for /admin route
- Enable Vercel's built-in DDoS protection
- SSL/TLS automatically enabled by Vercel

## Monitoring

Vercel provides built-in analytics:
- Web Vitals (Core Web Vitals)
- Real-time logs
- Error tracking
- Function execution metrics

Access at: `vercel.com/[your-username]/beach-safety-dashboard/analytics`

## Next Steps for Production

For a full production deployment, you would:

1. **Integrate Real APIs:**
   - NOAA NDBC API for wave/wind data
   - NWS API for weather alerts
   - EPA BEACON for water quality
   - County lifeguard reporting system

2. **Add Database:**
   - Store beach conditions history
   - Admin user management
   - Analytics data persistence

3. **Authentication:**
   - Protect /admin route with Auth0, NextAuth, or similar
   - Role-based access control

4. **Real-time Updates:**
   - WebSocket connection for live updates
   - Push notifications for critical alerts

5. **Testing:**
   - Unit tests (Jest)
   - Integration tests (Playwright)
   - Accessibility audits (axe-core)

---

**Ready to deploy? Run `vercel --prod` now!**
