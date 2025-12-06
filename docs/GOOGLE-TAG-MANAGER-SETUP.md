# Google Tag Manager Setup Guide

This guide explains how to configure Google Tag Manager (GTM) for Google Analytics tracking in the OneReport project.

## Overview

Google Tag Manager has been integrated into the project to manage analytics and tracking tags. GTM allows you to:
- Manage all your tracking tags in one place
- Add/update tags without code changes
- Track events, conversions, and user behavior
- Integrate with Google Analytics 4 (GA4)

## Setup Instructions

### 1. Create a Google Tag Manager Account

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Sign in with your Google account
3. Click **Create Account**
4. Fill in the account details:
   - **Account Name**: OneReport (or your preferred name)
   - **Country**: India (or your country)
5. Click **Continue**

### 2. Create a Container

1. **Container Name**: Enter a name (e.g., "OneReport Website")
2. **Target Platform**: Select **Web**
3. Click **Create**

### 3. Get Your GTM Container ID

After creating the container, you'll see your GTM Container ID in the format: `GTM-XXXXXXX`

Copy this ID - you'll need it for the next step.

### 4. Configure Environment Variable

Add the GTM Container ID to your environment variables:

**For local development** (`.env.local`):
```bash
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

**For production** (set in your hosting platform):
- Vercel: Add to Environment Variables in project settings
- Other platforms: Add to your environment configuration

> **Note**: The `NEXT_PUBLIC_` prefix is required for Next.js to expose the variable to the browser.

### 5. Verify Installation

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser's Developer Tools (F12)
3. Go to the **Network** tab
4. Refresh the page
5. Look for requests to `googletagmanager.com` - this confirms GTM is loading

### 6. Test with GTM Preview Mode

1. In Google Tag Manager, click **Preview**
2. Enter your website URL (e.g., `http://localhost:3000` or `https://onereport.in`)
3. Click **Connect**
4. You should see the GTM debug console showing tags firing

## Setting Up Google Analytics 4 in GTM

### Option 1: Use GTM's Built-in GA4 Tag

1. In GTM, go to **Tags** → **New**
2. Click **Tag Configuration** → Select **Google Analytics: GA4 Configuration**
3. Enter your **Measurement ID** (format: `G-XXXXXXXXXX`)
   - Get this from your Google Analytics 4 property
4. Configure trigger: **All Pages**
5. Save and publish

### Option 2: Use GA4 Configuration Tag + Event Tags

1. Create a **GA4 Configuration** tag (as above)
2. Create additional **GA4 Event** tags for specific events:
   - Button clicks
   - Form submissions
   - Scroll depth
   - Video plays
   - etc.

## Recommended Events to Track

Based on the OneReport project, consider tracking:

### Page Views
- Already tracked automatically by GA4 Configuration tag

### User Interactions
- **CTA Button Clicks**: Track clicks on "Get Started", "View Demo", etc.
- **Form Submissions**: Contact form, signup form
- **Platform Connections**: When users connect Google Analytics, Google Ads, etc.

### Engagement
- **Scroll Depth**: 25%, 50%, 75%, 100%
- **Time on Page**: Track engagement
- **Video Plays**: If you add video content

### Conversions
- **Sign-ups**: User registration
- **Trial Starts**: When users start free trial
- **Report Generations**: When users generate reports

## Implementation Details

### Component Location

The GTM component is located at:
```
src/components/analytics/GoogleTagManager.tsx
```

### Integration Points

GTM is integrated in:
```
src/app/layout.tsx
```

The component includes:
- **Script tag**: Loads in the `<head>` section
- **Noscript tag**: Loads immediately after `<body>` for users with JavaScript disabled

### Loading Strategy

GTM uses Next.js `afterInteractive` strategy, which means:
- Scripts load after the page becomes interactive
- Doesn't block initial page render
- Optimizes Core Web Vitals

## Troubleshooting

### GTM Not Loading

1. **Check environment variable**:
   ```bash
   echo $NEXT_PUBLIC_GTM_ID
   ```
   Or check your `.env.local` file

2. **Verify container ID format**: Should be `GTM-XXXXXXX`

3. **Check browser console**: Look for errors in Developer Tools

4. **Verify in GTM Preview**: Use GTM's preview mode to debug

### Tags Not Firing

1. **Check GTM Preview Mode**: See which tags are firing
2. **Verify triggers**: Make sure triggers are correctly configured
3. **Check dataLayer**: Use browser console to inspect `window.dataLayer`
4. **Verify GA4 Measurement ID**: Ensure it's correct in GTM

### Development vs Production

- GTM will only load if `NEXT_PUBLIC_GTM_ID` is set
- In development, you'll see a console warning if GTM ID is missing
- This prevents errors in local development without GTM configured

## Best Practices

1. **Use GTM Preview Mode** before publishing changes
2. **Test in staging** before deploying to production
3. **Document custom events** you create
4. **Use descriptive tag names** in GTM
5. **Set up version control** in GTM for important changes
6. **Monitor tag performance** to ensure they don't slow down the site

## Additional Resources

- [Google Tag Manager Documentation](https://support.google.com/tagmanager)
- [GA4 Setup Guide](https://support.google.com/analytics/answer/9304153)
- [GTM Best Practices](https://support.google.com/tagmanager/answer/6102821)
- [Next.js Script Component](https://nextjs.org/docs/app/api-reference/components/script)

## Support

If you encounter issues:
1. Check this documentation
2. Review GTM Preview Mode for debugging
3. Check browser console for errors
4. Verify environment variables are set correctly

---

**Last Updated**: December 2024
**Maintained By**: Development Team


