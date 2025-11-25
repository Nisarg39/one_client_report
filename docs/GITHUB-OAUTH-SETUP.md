# GitHub OAuth Setup Guide

This guide will help you set up GitHub OAuth authentication for your OneReport application.

---

## Prerequisites

- GitHub account
- OneReport application running locally or deployed

---

## Step 1: Create a GitHub OAuth App

1. **Navigate to GitHub Developer Settings:**
   - Go to [https://github.com/settings/developers](https://github.com/settings/developers)
   - Or: GitHub → Settings → Developer settings → OAuth Apps

2. **Click "New OAuth App"**

3. **Fill in Application Details:**

   ### For Development (Local):
   ```
   Application name: OneReport (Development)
   Homepage URL: http://localhost:3000
   Application description: OneReport marketing analytics platform
   Authorization callback URL: http://localhost:3000/api/auth/callback/github
   ```

   ### For Production:
   ```
   Application name: OneReport
   Homepage URL: https://yourdomain.com
   Application description: OneReport marketing analytics platform
   Authorization callback URL: https://yourdomain.com/api/auth/callback/github
   ```

4. **Click "Register application"**

---

## Step 2: Get Your OAuth Credentials

1. After creating the app, you'll see your **Client ID** - copy this

2. **Generate a Client Secret:**
   - Click "Generate a new client secret"
   - **IMPORTANT:** Copy the secret immediately - you won't be able to see it again!
   - If you lose it, you'll need to generate a new one

3. **Save your credentials:**
   ```
   Client ID: Looks like: Iv1.abc123def456
   Client Secret: Looks like: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
   ```

---

## Step 3: Add Credentials to Your Application

1. **Open your `.env.local` file** (create it if it doesn't exist)

2. **Add the GitHub OAuth credentials:**
   ```bash
   # GitHub OAuth
   GITHUB_OAUTH_CLIENT_ID=your_client_id_here
   GITHUB_OAUTH_CLIENT_SECRET=your_client_secret_here
   ```

3. **Replace** `your_client_id_here` and `your_client_secret_here` with your actual credentials

4. **Save the file**

---

## Step 4: Restart Your Development Server

```bash
# Stop your current server (Ctrl+C)

# Restart
npm run dev
```

---

## Step 5: Test GitHub OAuth

1. **Navigate to the sign-in page:**
   ```
   http://localhost:3000/signin
   ```

2. **Click "Continue with GitHub"**

3. **Authorize the application:**
   - You'll be redirected to GitHub
   - Review the permissions requested
   - Click "Authorize [Your App Name]"

4. **Success!**
   - You should be redirected back to your application
   - New users: Redirected to `/onboarding`
   - Returning users: Redirected to `/chat`

---

## Troubleshooting

### "Redirect URI Mismatch" Error

**Problem:** GitHub shows an error about redirect URI not matching.

**Solution:**
1. Check that your callback URL in GitHub OAuth App settings **exactly** matches:
   ```
   http://localhost:3000/api/auth/callback/github  (for development)
   ```
2. No trailing slash!
3. Must be HTTP (not HTTPS) for localhost
4. Port number must match (3000 by default)

### "Client ID not found" Error

**Problem:** Application can't find GitHub OAuth credentials.

**Solution:**
1. Verify `.env.local` has the correct variable names:
   ```bash
   GITHUB_OAUTH_CLIENT_ID=...
   GITHUB_OAUTH_CLIENT_SECRET=...
   ```
2. Restart your development server after adding credentials
3. Check for typos in variable names

### GitHub Authorization Page Doesn't Load

**Problem:** Clicking "Continue with GitHub" does nothing or shows an error.

**Solution:**
1. Check browser console for errors
2. Verify NextAuth is properly configured
3. Ensure `GithubProvider` is added to `authOptions` in `/api/auth/[...nextauth]/route.ts`

### User Gets Created but Can't Sign In Again

**Problem:** First sign-in works, but subsequent sign-ins fail.

**Solution:**
1. Check that `upsertFromOAuth` method in User model handles existing users
2. Verify database connection is working
3. Check MongoDB for duplicate user entries

---

## Production Deployment

When deploying to production:

1. **Create a separate OAuth App for production:**
   - Follow Step 1 again but use production URLs
   - Keep development and production OAuth apps separate

2. **Update environment variables on your hosting platform:**
   - Vercel: Settings → Environment Variables
   - Add `GITHUB_OAUTH_CLIENT_ID` and `GITHUB_OAUTH_CLIENT_SECRET`
   - **IMPORTANT:** Mark as "Production" environment

3. **Update callback URL:**
   ```
   https://yourdomain.com/api/auth/callback/github
   ```

4. **Test thoroughly:**
   - Test new user sign-up
   - Test returning user sign-in
   - Test account linking (if user exists with same email from Google OAuth)

---

## Security Best Practices

✅ **DO:**
- Keep client secrets in environment variables, never commit to git
- Use separate OAuth apps for development and production
- Regenerate secrets if accidentally exposed
- Review OAuth app access regularly in GitHub settings

❌ **DON'T:**
- Commit `.env.local` to git
- Share client secrets in public channels
- Use production credentials in development
- Reuse the same OAuth app across multiple environments

---

## Additional Resources

- [GitHub OAuth Documentation](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
- [NextAuth.js GitHub Provider Docs](https://next-auth.js.org/providers/github)
- [OAuth 2.0 Explained](https://oauth.net/2/)

---

## Need Help?

If you encounter issues:

1. Check the troubleshooting section above
2. Review GitHub OAuth App settings
3. Check Next.js server console for error messages
4. Verify all environment variables are set correctly
5. Create an issue in the project repository

---

**Setup complete!** 🎉

Your users can now sign in with both Google and GitHub OAuth.
