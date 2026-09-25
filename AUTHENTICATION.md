# SiteForge AI - Supabase Authentication Integration

This document provides a complete guide to the Supabase authentication system integrated into SiteForge AI.

## 🎯 Overview

SiteForge AI now includes a complete authentication system powered by Supabase with:

- ✅ **Email OTP Registration** - Users register via email and receive a one-time password
- ✅ **Email/Password Login** - Traditional login with email and password
- ✅ **Role-Based Access Control** - Admin and regular user roles
- ✅ **Admin Dashboard** - Manage users and assign roles
- ✅ **Protected Routes** - Secure access to features based on authentication state
- ✅ **Persistent Sessions** - Users stay logged in across browser sessions

## 📁 New Files Created

### Authentication Components
- `src/lib/supabase.ts` - Supabase client configuration and auth helpers
- `src/components/AuthModal.tsx` - Login/Register/OTP verification modal
- `src/components/AuthProvider.tsx` - React context for auth state management
- `src/components/UserMenu.tsx` - User profile dropdown with sign out
- `src/components/AdminDashboard.tsx` - Admin panel for user management

### Documentation
- `SUPABASE_SETUP.md` - Complete setup guide for Supabase
- `AUTHENTICATION.md` - This file (authentication overview)

## 🔐 Authentication Flow

### Registration Flow (Email OTP)
1. User clicks "Sign Up" on the landing page
2. Enters full name, email, and password
3. Supabase creates the user account
4. System sends a 6-digit OTP code to the user's email
5. User enters the OTP code to verify their email
6. Upon successful verification, user is logged in automatically
7. A profile is automatically created in the `profiles` table with role='user'

### Login Flow (Email/Password)
1. User clicks "Sign In" on the landing page
2. Enters email and password
3. Supabase validates credentials
4. User is logged in and redirected to the dashboard
5. User profile is loaded from the `profiles` table

### Session Persistence
- Supabase automatically manages session tokens
- Users stay logged in across page refreshes
- Sessions persist until explicitly signed out
- Auth state is managed via React Context (AuthProvider)

## 👥 User Roles

### Regular User (role: 'user')
- Can create and manage their own websites
- Access to all builder features
- Can view their project dashboard
- Cannot access admin features

### Admin User (role: 'admin')
- All regular user permissions
- Access to Admin Dashboard
- Can view all users in the system
- Can change user roles (promote/demote)
- Can manage the platform

## 🎨 UI Components

### AuthModal
A beautiful, responsive modal that handles three states:
- **Login** - Email and password form
- **Register** - Full name, email, and password form
- **Verify OTP** - 6-digit code input with resend option

Features:
- Form validation
- Loading states
- Error messages
- Success notifications
- Smooth transitions between states
- Responsive design

### UserMenu
Dropdown menu shown when user is logged in:
- User avatar with initial
- User name and email
- Admin badge (if applicable)
- Admin Dashboard link (for admins only)
- Sign out button

### AdminDashboard
Full-featured admin panel:
- User statistics (total users, admins, regular users)
- User table with search and filtering
- Role management (change user roles)
- Refresh button to reload data
- Responsive table design

## 🗄️ Database Schema

### profiles Table
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS)
- Users can view their own profile
- Users can update their own profile
- Admins can view all profiles
- Admins can update all profiles

### Automatic Profile Creation
A database trigger automatically creates a profile when a new user signs up:
```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Important:** 
- Get these values from your Supabase dashboard
- Never commit `.env` to version control
- The `.env` file is already in `.gitignore`

### Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL schema (see `SUPABASE_SETUP.md`)
3. Configure email templates for OTP
4. Enable email authentication provider
5. Copy your project URL and anon key to `.env`

## 🚀 Usage Examples

### Check if User is Logged In
```typescript
import { useAuth } from './components/AuthProvider';

function MyComponent() {
  const { user, profile, isAdmin } = useAuth();
  
  if (!user) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome, {profile.full_name}!</div>;
}
```

### Show Admin-Only Content
```typescript
import { useAuth } from './components/AuthProvider';

function AdminPanel() {
  const { isAdmin } = useAuth();
  
  if (!isAdmin) {
    return <div>Access denied</div>;
  }
  
  return <div>Admin content here</div>;
}
```

### Sign Out
```typescript
import { useAuth } from './components/AuthProvider';

function SignOutButton() {
  const { signOut } = useAuth();
  
  return <button onClick={signOut}>Sign Out</button>;
}
```

## 🎯 Features Implemented

### ✅ Authentication
- [x] Email OTP registration
- [x] Email/password login
- [x] Session persistence
- [x] Sign out functionality
- [x] Password reset (via Supabase)

### ✅ User Management
- [x] User profiles with full name
- [x] Role-based access control
- [x] Admin dashboard
- [x] User role management
- [x] User statistics

### ✅ Security
- [x] Row Level Security (RLS)
- [x] Protected routes
- [x] Secure session tokens
- [x] Email verification
- [x] Password hashing (Supabase managed)

### ✅ UI/UX
- [x] Beautiful auth modal
- [x] Loading states
- [x] Error handling
- [x] Success notifications
- [x] Responsive design
- [x] User menu dropdown
- [x] Admin badge

## 🔒 Security Best Practices

1. **Never expose the service role key** - Only use the anon key in the frontend
2. **Enable RLS** - All tables should have Row Level Security enabled
3. **Use strong passwords** - Enforce minimum password length (already set to 6)
4. **Verify emails** - OTP verification ensures email ownership
5. **Limit admin access** - Only trusted users should have admin role
6. **Monitor auth logs** - Check Supabase dashboard for suspicious activity
7. **Rate limiting** - Supabase has built-in rate limiting for auth endpoints

## 🐛 Troubleshooting

### OTP Not Received
- Check spam folder
- Verify email is correctly configured in Supabase
- Check Supabase logs for delivery errors
- Try resending the OTP

### "Invalid API key" Error
- Verify `.env` file exists and has correct values
- Restart your development server
- Clear browser cache and localStorage

### Can't Access Admin Dashboard
- Verify your user has `role = 'admin'` in the profiles table
- Check browser console for errors
- Ensure you're logged in

### Profile Not Created
- Check if the database trigger is working
- Verify the `handle_new_user()` function exists
- Check Supabase logs for trigger errors

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)

## 🎉 Next Steps

1. ✅ Set up Supabase project
2. ✅ Configure environment variables
3. ✅ Run database schema
4. ✅ Test authentication flows
5. ⏭️ Create your first admin user
6. ⏭️ Customize email templates
7. ⏭️ Deploy to production
8. ⏭️ Configure custom domain
9. ⏭️ Set up monitoring

## 💡 Tips

- **First Admin User**: After setting up the database, manually update your user's role to 'admin' in the profiles table
- **Testing**: Use Supabase's built-in email testing in development mode
- **Production**: Configure a custom SMTP server for better email deliverability
- **Monitoring**: Use Supabase's dashboard to monitor auth events and user activity

---

For detailed setup instructions, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
