# Quick Start Guide - Supabase Authentication

Get SiteForge AI authentication up and running in 5 minutes!

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Supabase Project (2 min)
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - Name: `siteforge-ai`
   - Password: (save this!)
   - Region: (closest to you)
4. Wait for project to be ready

### Step 2: Get API Keys (30 sec)
1. In Supabase dashboard, go to **Settings** → **API**
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJ...`

### Step 3: Configure Environment (30 sec)
Create `.env` file in project root:
```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Step 4: Create Database Tables (1 min)
1. Go to **SQL Editor** in Supabase
2. Copy and run the SQL from `SUPABASE_SETUP.md`
3. Click "Run"

### Step 5: Create First Admin (30 sec)
1. Register through the app (you'll be a regular user)
2. In Supabase → **Table Editor** → **profiles**
3. Find your user, change `role` from `user` to `admin`
4. Save

### Step 6: Test It! (30 sec)
1. Run `npm run dev`
2. Click "Sign In"
3. Login with your credentials
4. You should see your name and admin badge!

## ✅ That's It!

You now have:
- ✅ Email OTP registration
- ✅ Email/password login
- ✅ Admin dashboard
- ✅ Role-based access
- ✅ Persistent sessions

## 📖 Need More Details?

- Full setup: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- Auth overview: [AUTHENTICATION.md](./AUTHENTICATION.md)
- Integration details: [INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)

## 🐛 Common Issues

**OTP not received?**
- Check spam folder
- Verify email in Supabase → Authentication → Email Templates

**Can't login?**
- Check `.env` file has correct values
- Restart dev server
- Clear browser cache

**Not an admin?**
- Check profiles table in Supabase
- Ensure role = 'admin' for your user

---

**Build Status:** ✅ Ready to deploy!
