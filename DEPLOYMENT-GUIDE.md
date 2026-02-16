# Deployment Guide - Authentication Enabled

## ✅ What Was Implemented

### Admin Authentication
- **Type:** HTTP Basic Authentication
- **Protected Routes:** All `/admin/*` pages
- **Username:** `admin`
- **Password:** Set via environment variable

### Files Added
1. `middleware.ts` - Authentication middleware
2. `.env.local` - Local development password
3. `.env.example` - Template for environment variables

---

## 🔒 How Authentication Works

When accessing any `/admin` route:
1. Browser prompts for username and password
2. Username must be: `admin`
3. Password must match `ADMIN_PASSWORD` environment variable
4. Valid credentials = access granted
5. Invalid credentials = 401 error

---

## 💻 Local Development

### Current Password
```
Username: admin
Password: BeachSafety2026!
```

**Location:** `.env.local` file (gitignored)

### Testing Authentication
1. Start dev server:
   ```bash
   npm run dev
   ```

2. Visit: http://localhost:3000/admin

3. Enter credentials when prompted:
   - Username: `admin`
   - Password: `BeachSafety2026!`

4. You should see the admin page ✅

### Changing Local Password
Edit `.env.local`:
```env
ADMIN_PASSWORD=YourNewPasswordHere
```

Restart dev server for changes to take effect.

---

## 🚀 Vercel Deployment

### Step 1: Add Environment Variable

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name:** `ADMIN_PASSWORD`
   - **Value:** Your secure production password
   - **Environments:** Check all (Production, Preview, Development)

Example production password:
```
SMC-BeachSafety-2026-SecurePass!@#
```

**IMPORTANT:** Use a different password than development!

### Step 2: Redeploy

After adding the environment variable:
```bash
# Option A: Push to trigger auto-deploy
git add .
git commit -m "Add admin authentication"
git push

# Option B: Manual redeploy in Vercel Dashboard
# Go to Deployments → ... → Redeploy
```

### Step 3: Test Production

1. Visit: https://your-domain.vercel.app/admin
2. Enter production credentials
3. Verify access works ✅

---

## 👥 Sharing Access with County Staff

### Credentials to Share
```
URL: https://your-domain.vercel.app/admin
Username: admin
Password: [Your ADMIN_PASSWORD value]
```

### Security Best Practices

1. **Share Securely**
   - Don't email password in plain text
   - Use password manager
   - Share via secure channel (in-person, encrypted message)

2. **Change Password If:**
   - Staff member leaves
   - Password is compromised
   - Switching from development to production

3. **Monitor Access**
   - Check Vercel logs for admin access
   - Review admin update history
   - Watch for suspicious activity

---

## 🔄 Changing Production Password

### Step 1: Update Vercel
1. Vercel Dashboard → Settings → Environment Variables
2. Click edit on `ADMIN_PASSWORD`
3. Enter new password
4. Save

### Step 2: Redeploy
- Vercel will automatically redeploy
- Or manually trigger redeploy

### Step 3: Notify Staff
- Share new credentials
- Old password stops working immediately

---

## 🧪 Testing Checklist

### Before Going Live
- [ ] Test admin login works locally
- [ ] Test admin login fails with wrong password
- [ ] Set production password in Vercel
- [ ] Deploy to production
- [ ] Test production admin login
- [ ] Share credentials with authorized staff
- [ ] Test beach status update
- [ ] Test custom alert posting
- [ ] Test reset to automatic
- [ ] Verify public pages still work (no auth required)

### Quick Test Script
```bash
# 1. Start local server
npm run dev

# 2. Try accessing admin (should prompt for password)
open http://localhost:3000/admin

# 3. Enter correct credentials → Should work ✅
# 4. Refresh and enter wrong password → Should fail ❌

# 5. Try public page (should not ask for password)
open http://localhost:3000
```

---

## 🛠️ Troubleshooting

### Problem: Login prompt doesn't appear
**Solution:**
- Clear browser cache
- Try incognito/private window
- Check middleware.ts is deployed

### Problem: Correct password doesn't work
**Solution:**
- Verify `ADMIN_PASSWORD` in Vercel environment variables
- Check for typos (case-sensitive)
- Redeploy after changing environment variable
- Clear browser's saved credentials

### Problem: Can't cancel login prompt
**Solution:**
- Click "Cancel" or press ESC
- Browser will remember cancellation
- Clear cookies to see prompt again

### Problem: Need to logout
**Solution:**
HTTP Basic Auth doesn't have logout button. To "logout":
1. Close all browser tabs
2. Clear cookies for the site
3. Reopen in incognito window
4. Or use different browser

---

## 📊 What's Protected vs Public

### Protected (Requires Authentication)
- ✅ `/admin` - Beach status updates
- ✅ `/admin/alerts` - Custom alert management
- ✅ `/api/admin/*` - Admin API endpoints

### Public (No Authentication)
- ✅ `/` - Main dashboard
- ✅ `/analytics` - Analytics dashboard
- ✅ `/api/beaches` - Beach data API
- ✅ `/api/custom-alerts` - Public alert viewing
- ✅ `/api/analytics/*` - Analytics APIs

**Note:** Analytics dashboard is currently public. To protect it, add to middleware matcher:
```typescript
export const config = {
  matcher: ['/admin/:path*', '/analytics/:path*'],
};
```

---

## 🔐 Security Notes

### Current Security Level: ⚠️ BASIC
- Single password for all staff
- No user tracking
- No password expiration
- No rate limiting
- No audit logs

### Good For:
- Small team (< 10 people)
- Quick deployment
- Short-term solution
- Internal use only

### Not Recommended For:
- Large team
- High-security requirements
- Regulatory compliance
- Long-term production use

### Upgrade Path
For better security, see [PRODUCTION-READINESS.md](PRODUCTION-READINESS.md) for:
- Next-Auth with Google SSO
- User-specific accounts
- Activity logging
- Password policies

---

## 🆘 Emergency Access

### If Password Is Lost

1. **Local Development:**
   - Check `.env.local` file
   - Or set new password: `ADMIN_PASSWORD=NewPass123`

2. **Production (Vercel):**
   - Log into Vercel Dashboard
   - Go to Environment Variables
   - View `ADMIN_PASSWORD` value
   - Or set new password and redeploy

### If Locked Out
- No backdoor - password is required
- Must have Vercel account access
- Contact Vercel support if dashboard access is lost

---

## ✅ Deployment Complete!

Your admin pages are now protected with authentication.

**Next Steps:**
1. Set production password in Vercel ✅
2. Test authentication works ✅
3. Share credentials with staff ✅
4. Monitor for issues ✅

**Production URLs:**
- Dashboard: https://your-domain.vercel.app
- Admin: https://your-domain.vercel.app/admin (password required)
- Analytics: https://your-domain.vercel.app/analytics

---

## 📞 Support

**Questions?**
- Check [PRODUCTION-READINESS.md](PRODUCTION-READINESS.md) for full guide
- Review [README.md](README.md) for project overview
- Contact developer for assistance

**Vercel Resources:**
- Docs: https://vercel.com/docs
- Environment Variables: https://vercel.com/docs/environment-variables
- Support: https://vercel.com/support

---

*Last Updated: February 2026*
