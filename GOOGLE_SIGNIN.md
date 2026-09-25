# Google Sign-In Integration Guide

This guide explains how to set up and use Google Sign-In (OAuth) in SiteForge AI.

## 🎯 Overview

SiteForge AI now supports Google Sign-In, allowing users to quickly authenticate using their Google accounts. This provides a seamless login experience and reduces friction during registration.

## ✨ Features

- ✅ **One-Click Authentication** - Users can sign in with a single click
- ✅ **Automatic Profile Creation** - User profiles are created automatically
- ✅ **Email Verification** - Google handles email verification
- ✅ **Secure OAuth 2.0** - Industry-standard authentication protocol
- ✅ **Seamless Integration** - Works alongside email/password and OTP authentication

## 🔧 Setup Instructions

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**

#### Configure OAuth Consent Screen (if prompted)

1. Choose **External** for user type
2. Fill in the required app information:
   - **App name**: SiteForge AI (or your preferred name)
   - **User support email**: Your email address
   - **Developer contact email**: Your email address
3. Click **Save and Continue**
4. On the **Scopes** page, click **Save and Continue** (no scopes needed)
5. On the **Test users** page, add your Google account email for testing
6. Click **Save and Continue**, then **Back to Dashboard**

#### Create OAuth Client ID

1. Click **Create Credentials** → **OAuth client ID**
2. Select **Web application** as the application type
3. Enter a name: `SiteForge AI Client`
4. Under **Authorized redirect URIs**, add:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```
   **Important**: Replace `your-project-id` with your actual Supabase project ID
   
   Example:
   ```
   https://abcdefghijklmnop.supabase.co/auth/v1/callback
   ```
5. Click **Create**
6. Copy your **Client ID** and **Client Secret** (you'll need these in the next step)

### Step 2: Configure Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find and click on **Google**
5. Toggle **Enable Google provider** to ON
6. Paste your **Client ID** from Google Cloud Console
7. Paste your **Client Secret** from Google Cloud Console
8. Click **Save**

### Step 3: Test Google Sign-In

1. Start your development server: `npm run dev`
2. Go to your app's login or register page
3. Click the **Continue with Google** button
4. You should be redirected to Google's consent screen
5. Select your Google account
6. Grant permission to the app
7. You should be redirected back to your app and logged in automatically

## 🔄 How It Works

### Authentication Flow

```
User clicks "Continue with Google"
         ↓
Redirected to Google OAuth consent screen
         ↓
User grants permission
         ↓
Google redirects to Supabase callback URL
         ↓
Supabase creates/updates user in auth.users
         ↓
Database trigger creates profile in profiles table
         ↓
User is redirected back to your app
         ↓
AuthProvider detects session and updates UI
```

### User Profile Creation

When a user signs in with Google for the first time:

1. Supabase creates a user record in `auth.users`
2. The database trigger `handle_new_user()` automatically creates a profile
3. The profile is populated with:
   - `id`: User's UUID from Supabase
   - `email`: User's Google email
   - `full_name`: User's Google display name
   - `role`: Default value 'user'
   - `created_at`: Current timestamp
   - `updated_at`: Current timestamp

### Existing Users

If a user signs in with Google and their email already exists in your database:

- Supabase links the Google identity to the existing account
- The user can now sign in with either Google or email/password
- The profile remains unchanged

## 🎨 UI Implementation

The Google Sign-In button appears on both the login and register pages:

```tsx
<button
  type="button"
  onClick={handleGoogleSignIn}
  disabled={loading}
  className="w-full bg-white border border-neutral-300 text-neutral-700 py-2.5 rounded-lg font-medium hover:bg-neutral-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
>
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    {/* Google "G" logo SVG paths */}
  </svg>
  Continue with Google
</button>
```

The button includes:
- Official Google "G" logo with correct colors
- Clean, professional design
- Loading state when authentication is in progress
- Disabled state during form submission

## 🔒 Security Considerations

### OAuth 2.0 Security

- **Secure Protocol**: Uses HTTPS for all OAuth communications
- **Token Validation**: Supabase validates all tokens from Google
- **Scope Limitation**: Only requests basic profile information (email, name)
- **State Parameter**: Supabase handles CSRF protection automatically

### Best Practices

1. **Keep Client Secret Secure**: Never expose your Google Client Secret in client-side code
2. **Use HTTPS**: Always use HTTPS in production (Supabase handles this automatically)
3. **Restrict Redirect URIs**: Only add your actual Supabase callback URL
4. **Test Users**: During development, only add trusted test users
5. **Monitor Usage**: Check Google Cloud Console for unusual activity

## 🐛 Troubleshooting

### "Redirect URI mismatch" Error

**Problem**: Google shows an error about redirect URI mismatch

**Solution**: 
- Verify the redirect URI in Google Cloud Console exactly matches:
  ```
  https://your-project-id.supabase.co/auth/v1/callback
  ```
- Make sure there are no trailing slashes or extra characters
- Check that you're using the correct Supabase project ID

### "Access blocked: Authorization Error"

**Problem**: Google shows "Access blocked: Authorization Error"

**Solution**:
- Make sure your app is published or you're using a test account
- Check that your OAuth consent screen is properly configured
- Verify your email is added as a test user (if app is not published)

### User Not Created in Database

**Problem**: User signs in with Google but no profile is created

**Solution**:
- Check that the database trigger `handle_new_user()` exists
- Verify the trigger is active: 
  ```sql
  SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
  ```
- Check Supabase logs for trigger errors
- Manually create the profile if needed

### "Invalid Client" Error

**Problem**: Google shows "Error 401: invalid_client"

**Solution**:
- Verify your Client ID and Client Secret are correct in Supabase
- Make sure the OAuth client is not deleted or disabled
- Check that the client is for the correct Google Cloud project

## 📊 Code Reference

### signInWithGoogle Function

Located in `src/lib/supabase.ts`:

```typescript
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  return { data, error };
};
```

### handleGoogleSignIn Function

Located in `src/components/AuthModal.tsx`:

```typescript
const handleGoogleSignIn = async () => {
  setError('');
  setLoading(true);

  try {
    const { error } = await signInWithGoogle();
    
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    
    // Google OAuth will redirect the user
    // AuthProvider will detect the session change
  } catch (err) {
    setError('Failed to sign in with Google');
    setLoading(false);
  }
};
```

## 🚀 Production Deployment

### Environment Variables

No additional environment variables are needed for Google Sign-In. The configuration is stored in Supabase.

### Redirect URI

Make sure your production Supabase URL is added to Google Cloud Console:

```
https://your-project-id.supabase.co/auth/v1/callback
```

### Testing vs Production

- **Development**: Use test users in Google OAuth consent screen
- **Production**: Publish your app in Google Cloud Console to allow all users

To publish your app:
1. Go to Google Cloud Console → OAuth consent screen
2. Click **PUBLISH APP**
3. Fill in any additional required information
4. Submit for verification (if required)

## 📚 Additional Resources

- [Supabase Google Auth Documentation](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Supabase Auth Hooks](https://supabase.com/docs/guides/auth/auth-hooks)

## ✅ Checklist

Before going live with Google Sign-In:

- [ ] Google OAuth credentials created
- [ ] Redirect URI configured correctly
- [ ] Supabase Google provider enabled
- [ ] Client ID and Secret added to Supabase
- [ ] Test sign-in flow works in development
- [ ] Database trigger creates profiles correctly
- [ ] OAuth consent screen configured
- [ ] Test users added (for development)
- [ ] App published (for production)
- [ ] Production redirect URI added

## 🎉 Success Criteria

Google Sign-In is working correctly when:

1. ✅ Users can click "Continue with Google" button
2. ✅ Google OAuth consent screen appears
3. ✅ Users can select their Google account
4. ✅ Users are redirected back to your app
5. ✅ User profile is created in the database
6. ✅ User is logged in automatically
7. ✅ User can see their name and email in the UserMenu

---

**Need Help?** Check the [Supabase Setup Guide](./SUPABASE_SETUP.md) for complete authentication setup instructions.
