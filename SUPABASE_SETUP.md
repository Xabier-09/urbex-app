# Supabase Setup Guide - Urbex App Cloud Integration

## 🚀 Quick Start

This guide will help you set up the Urbex App with Supabase authentication for cloud deployment.

## 📋 Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **GitHub Account**: For hosting the static site
3. **Domain**: Optional, for custom domain setup

## 🔧 Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project:
   - Project name: `urbex-app`
   - Database password: Choose a strong password
   - Region: Choose closest to your users

3. Wait for project initialization (2-3 minutes)

## 🔐 Step 2: Configure Authentication

### Enable Email Authentication
1. Go to **Authentication > Providers**
2. Enable **Email** provider
3. Configure email templates (optional)

### Set up Email Templates (Optional)
1. Go to **Authentication > Email Templates**
2. Customize welcome email, password recovery, etc.

## 🗄️ Step 3: Create Database Tables

### Users Table
1. Go to **SQL Editor**
2. Run this SQL to create users table:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, username, email)
    VALUES (new.id, new.raw_user_meta_data->>'username', new.email);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 🔑 Step 4: Get Supabase Credentials

1. Go to **Settings > API**
2. Copy these values:
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon Key**: Your public API key

## 📝 Step 5: Update Configuration Files

### Update `supabase-config.js`
Replace the placeholder values with your actual credentials:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-actual-anon-key';
```

## 🚀 Step 6: Deploy to GitHub Pages

### Option 1: GitHub Pages (Recommended)
1. Fork this repository
2. Enable GitHub Pages in repository settings
3. Upload your updated files with Supabase credentials

### Option 2: Netlify/Vercel
1. Connect your repository
2. Set environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

## 🧪 Step 7: Test the Application

1. **Register**: Create a new account
2. **Login**: Use your credentials
3. **Password Recovery**: Test email recovery
4. **Logout**: Ensure session management works

## 🔍 Troubleshooting

### Common Issues

**CORS Errors**
- Ensure your Supabase project URL is correct
- Check CORS settings in Supabase dashboard

**Email Not Received**
- Check spam folder
- Verify email configuration in Supabase
- Use a real email address for testing

**Database Connection Issues**
- Verify table creation SQL was executed
- Check RLS policies are correctly configured

## 📊 Monitoring

### Supabase Dashboard
- **Authentication**: Monitor user registrations/logins
- **Database**: Check query performance
- **API**: Monitor usage and errors

### Analytics
- Set up Google Analytics for user tracking
- Monitor page load times and user engagement

## 🔄 Updates

### Automatic Updates
- GitHub Actions can auto-deploy on push
- Set up branch protection for main branch

### Manual Updates
- Update Supabase credentials in `supabase-config.js`
- Test changes in staging environment

## 📞 Support

For issues:
1. Check Supabase documentation
2. Review this setup guide
3. Open an issue in the repository

## 🎯 Next Steps

1. **Custom Domain**: Set up custom domain with SSL
2. **Email Provider**: Configure custom email provider
3. **Advanced Features**: Add social login providers
4. **Database**: Add more tables for user preferences
5. **Analytics**: Implement user analytics

## 🎉 Success!

Your Urbex App is now fully integrated with Supabase and ready for global users!
