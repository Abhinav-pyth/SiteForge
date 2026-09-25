# Supabase Setup Guide for SiteForge AI

This guide will help you set up Supabase authentication for SiteForge AI with email OTP registration, email/password login, and role-based access control (admin/user).

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "New Project"
3. Fill in the project details:
   - **Name**: SiteForge AI (or your preferred name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose the closest region to your users
4. Click "Create new project"
5. Wait for the project to be provisioned (takes ~2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: A long string starting with `eyJ...`

## Step 3: Configure Environment Variables

Create a `.env` file in the root of your project:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

**Important**: 
- Replace `your-project-id` with your actual Supabase project ID
- Replace `your-anon-public-key-here` with your actual anon key
- Never commit `.env` to Git (it's already in `.gitignore`)

## Step 4: Create Database Tables

Go to **SQL Editor** in your Supabase dashboard and run the following SQL:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Only admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Only admins can update all profiles
CREATE POLICY "Admins can update all profiles"
  ON public.profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

## Step 5: Configure Email Templates (Optional)

To customize the OTP email template:

1. Go to **Authentication** → **Email Templates**
2. Select "Magic Link" template
3. Customize the email content:

```html
<h2>Your SiteForge AI Verification Code</h2>
<p>Your OTP code is: <strong>{{ .Token }}</strong></p>
<p>This code will expire in 1 hour.</p>
<p>If you didn't request this, please ignore this email.</p>
```

## Step 6: Configure Authentication Settings

1. Go to **Authentication** → **Providers**
2. Ensure **Email** provider is enabled
3. Configure email settings:
   - Confirm email: Enabled
   - OTP expiry: 3600 seconds (1 hour)

## Step 7: Create Your First Admin User

After setting up the database, you'll need to create your first admin user:

1. Register a new account through the app
2. Go to **Table Editor** in Supabase
3. Open the `profiles` table
4. Find your user and change the `role` from `user` to `admin`
5. Save the changes

Alternatively, run this SQL (replace with your email):

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

## Step 8: Test the Authentication Flow

### Registration Flow (Email OTP):
1. Click "Sign Up" on the landing page
2. Enter your full name, email, and password
3. Check your email for the OTP code
4. Enter the 6-digit OTP code
5. You'll be logged in automatically

### Login Flow (Email/Password):
1. Click "Sign In" on the landing page
2. Enter your email and password
3. You'll be logged in immediately

### Admin Features:
1. Log in as an admin user
2. Navigate to the Admin Dashboard
3. View all users and their roles
4. Change user roles (promote to admin or demote to user)

## Step 9: Security Best Practices

### Enable 2FA (Optional but Recommended)
1. Go to **Authentication** → **Settings**
2. Enable Multi-factor authentication
3. Configure TOTP (Time-based One-Time Password)

### Set Up Custom SMTP (For Production)
1. Go to **Authentication** → **Email Templates** → **Settings**
2. Configure your custom SMTP server:
   - Host: `smtp.your-provider.com`
   - Port: 587
   - User: `your-email@domain.com`
   - Password: `your-smtp-password`

### Rate Limiting
Supabase has built-in rate limiting, but you can configure it:
1. Go to **Authentication** → **Rate Limits**
2. Set appropriate limits for your use case

## Troubleshooting

### Issue: OTP not received
- Check spam folder
- Verify email is correctly configured in Supabase
- Check Supabase logs for errors

### Issue: "Invalid API key" error
- Verify `.env` file exists and has correct values
- Restart your development server
- Clear browser cache

### Issue: "User not found" error
- Ensure the user exists in `auth.users` table
- Check if profile was created in `public.profiles` table
- Verify the trigger is working correctly

### Issue: Can't access admin dashboard
- Verify your user has `role = 'admin'` in the profiles table
- Check browser console for errors
- Ensure RLS policies are correctly configured

## Production Deployment

Before deploying to production:

1. **Update Environment Variables**:
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your hosting platform
   - Vercel: Settings → Environment Variables
   - Netlify: Site settings → Environment variables

2. **Configure Custom Domain** (Optional):
   - Go to **Authentication** → **URL Configuration**
   - Add your custom domain to "Site URL"
   - Add redirect URLs for OAuth providers

3. **Enable Production Features**:
   - Custom SMTP for better email deliverability
   - 2FA for enhanced security
   - Audit logs for compliance

## Database Schema Overview

### `profiles` Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | References auth.users(id) |
| email | TEXT | User's email (unique) |
| full_name | TEXT | User's full name |
| role | TEXT | 'admin' or 'user' |
| created_at | TIMESTAMP | Account creation time |
| updated_at | TIMESTAMP | Last update time |

### Row Level Security (RLS) Policies
- Users can view their own profile
- Users can update their own profile
- Admins can view all profiles
- Admins can update all profiles

## API Reference

### Authentication Functions

```typescript
// Sign up with email/password
signUp(email: string, password: string, fullName: string)

// Sign in with email/password
signIn(email: string, password: string)

// Sign out
signOut()

// Send OTP to email
sendOTP(email: string)

// Verify OTP code
verifyOTP(email: string, token: string)

// Get current user
getCurrentUser()

// Get user profile
getUserProfile(userId: string)

// Update user role (admin only)
updateUserRole(userId: string, role: UserRole)
```

## Support

For issues or questions:
- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- GitHub Issues: https://github.com/supabase/supabase/issues

## Next Steps

1. ✅ Set up Supabase project
2. ✅ Configure environment variables
3. ✅ Create database tables
4. ✅ Test authentication flows
5. ⏭️ Deploy to production
6. ⏭️ Configure custom domain
7. ⏭️ Set up monitoring and analytics
