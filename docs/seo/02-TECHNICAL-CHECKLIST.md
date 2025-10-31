# SEO Technical Implementation Checklist

> **Quick reference guide for implementing SEO improvements**
> **Project:** OneReport
> **Status Tracking:** ✅ Done | ⏳ In Progress | ❌ Not Started

---

## 1. Next.js Configuration Files

### `next.config.ts` Updates
- [ ] ❌ Enable compression (`compress: true`)
- [ ] ❌ Configure image optimization formats (AVIF, WebP)
- [ ] ❌ Add security headers (`X-Frame-Options`, etc.)
- [ ] ❌ Remove `X-Powered-By` header
- [ ] ❌ Enable SWC minification
- [ ] ❌ Configure redirects for old URLs
- [ ] ❌ Set up trailing slash handling

**File Location:** `/next.config.ts`

---

## 2. Sitemap & Robots

### Create `sitemap.ts`
- [ ] ❌ Create `src/app/sitemap.ts`
- [ ] ❌ Add all current pages
- [ ] ❌ Set proper priorities (homepage = 1.0)
- [ ] ❌ Set change frequencies
- [ ] ❌ Add lastModified dates
- [ ] ❌ Test sitemap at `/sitemap.xml`
- [ ] ❌ Submit to Google Search Console
- [ ] ❌ Submit to Bing Webmaster Tools

**File Location:** `/src/app/sitemap.ts`
**URL:** `https://onereport.in/sitemap.xml`

### Create `robots.ts`
- [ ] ❌ Create `src/app/robots.ts`
- [ ] ❌ Allow all pages except /api/, /admin/
- [ ] ❌ Reference sitemap.xml
- [ ] ❌ Set crawl delay for different bots
- [ ] ❌ Test robots.txt at `/robots.txt`

**File Location:** `/src/app/robots.ts`
**URL:** `https://onereport.in/robots.txt`

---

## 3. Metadata Enhancements

### Global Metadata (`layout.tsx`)
- [ ] ✅ Basic title and description
- [ ] ✅ Keywords array
- [ ] ✅ OpenGraph tags
- [ ] ✅ Twitter Card tags
- [ ] ❌ Add verification tags (Google, Bing)
- [ ] ❌ Add geographic metadata (geo.region, geo.position)
- [ ] ❌ Update to Indian pricing in description (₹ instead of $)
- [ ] ❌ Add alternate language tags if multilingual
- [ ] ❌ Configure template for page titles

**File Location:** `/src/app/layout.tsx`

### Page-Specific Metadata
- [ ] ❌ Create `/src/app/pricing/page.tsx` with custom metadata
- [ ] ❌ Create `/src/app/features/page.tsx` with custom metadata
- [ ] ❌ Create `/src/app/blog/page.tsx` with custom metadata
- [ ] ❌ Create `/src/app/contact/page.tsx` with custom metadata
- [ ] ❌ Ensure each page has unique title & description

---

## 4. Open Graph Images

### Required Images
- [ ] ❌ Create homepage OG image (1200x630px)
  - **Path:** `/public/og-image.jpg`
  - **Specs:** 1200x630px, < 300KB, JPG/PNG
  - **Content:** Logo + tagline + brand colors

- [ ] ❌ Create Twitter Card image (1200x600px)
  - **Path:** `/public/twitter-image.jpg`
  - **Specs:** 1200x600px, < 300KB, JPG/PNG

- [ ] ❌ Create logo for social sharing (512x512px)
  - **Path:** `/public/og-logo.png`
  - **Specs:** 512x512px, transparent background, PNG

### Validation
- [ ] ❌ Test with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [ ] ❌ Test with [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] ❌ Test with [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

---

## 5. Schema Markup Implementation

### Create Schema Components

#### Organization Schema
- [ ] ❌ Create `/src/components/schema/organization-schema.tsx`
- [ ] ❌ Add to `layout.tsx`
- [ ] ❌ Include: name, url, logo, address, contactPoint
- [ ] ❌ Validate with Google Rich Results Test

#### LocalBusiness Schema
- [ ] ❌ Create `/src/components/schema/localbusiness-schema.tsx`
- [ ] ❌ Add to homepage
- [ ] ❌ Include: geo coordinates (Pune: 18.5204, 73.8567)
- [ ] ❌ Add opening hours (24/7 for SaaS)
- [ ] ❌ Add price range (₹₹)
- [ ] ❌ Validate with Google Rich Results Test

#### SoftwareApplication Schema
- [ ] ❌ Create `/src/components/schema/software-schema.tsx`
- [ ] ❌ Add to homepage
- [ ] ❌ Include: applicationCategory, operatingSystem
- [ ] ❌ Add pricing offers in INR
- [ ] ❌ Add aggregate rating (when available)
- [ ] ❌ Validate with Google Rich Results Test

#### FAQ Schema
- [ ] ❌ Create `/src/components/schema/faq-schema.tsx`
- [ ] ❌ Add to FAQ section component
- [ ] ❌ Extract FAQs from FAQ section
- [ ] ❌ Validate with Google Rich Results Test

#### Breadcrumb Schema
- [ ] ❌ Create `/src/components/schema/breadcrumb-schema.tsx`
- [ ] ❌ Create breadcrumb UI component
- [ ] ❌ Add to all pages (except homepage)
- [ ] ❌ Validate with Google Rich Results Test

### Schema Validation
- [ ] ❌ Test all schemas with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] ❌ Test with [Schema Markup Validator](https://validator.schema.org/)
- [ ] ❌ Fix any errors or warnings
- [ ] ❌ Verify in Google Search Console after deployment

---

## 6. Image Optimization

### Global Image Settings
- [ ] ❌ Update all `<img>` tags to Next.js `<Image>` component
- [ ] ❌ Add proper `alt` text to all images
- [ ] ❌ Set width and height to prevent CLS
- [ ] ❌ Enable lazy loading (`loading="lazy"`)
- [ ] ❌ Set appropriate quality (85 for photos, 100 for logos)
- [ ] ❌ Add blur placeholders for above-fold images

### Convert Images to Modern Formats
- [ ] ❌ Convert PNG images to WebP (50-80% smaller)
- [ ] ❌ Convert JPG images to WebP/AVIF
- [ ] ❌ Keep original PNGs for transparency needs
- [ ] ❌ Compress all images (target < 100KB each)

**Tools:** TinyPNG, Squoosh.app, ImageOptim

### Image Alt Text Guidelines
Format: `[Action] + [Subject] + [Context]`

Examples:
- ✅ "OneReport dashboard showing automated client reports with AI insights"
- ✅ "Marketing agency team reviewing monthly reports in OneReport platform"
- ❌ "Dashboard image"
- ❌ "IMG_1234"

---

## 7. Performance Optimization

### Core Web Vitals Targets
- [ ] ❌ Achieve LCP < 2.5s
- [ ] ❌ Achieve FID < 100ms
- [ ] ❌ Achieve CLS < 0.1
- [ ] ❌ Achieve FCP < 1.8s
- [ ] ❌ Achieve TTI < 3.8s

### Optimization Tasks
- [ ] ❌ Implement code splitting for heavy components
- [ ] ❌ Use dynamic imports for below-fold content
- [ ] ❌ Optimize font loading (swap display mode)
- [ ] ❌ Minimize CSS (remove unused styles)
- [ ] ❌ Minimize JavaScript bundles
- [ ] ❌ Enable brotli compression
- [ ] ❌ Implement service worker for caching (optional)
- [ ] ❌ Optimize third-party scripts (async/defer)

### Lighthouse Audit
- [ ] ❌ Run Lighthouse audit (target score: 90+)
- [ ] ❌ Fix all major performance issues
- [ ] ❌ Fix accessibility issues
- [ ] ❌ Fix SEO issues
- [ ] ❌ Fix best practices issues

**Run:** Chrome DevTools > Lighthouse > Generate Report

---

## 8. Internal Linking Structure

### Navigation Links
- [ ] ❌ Add proper navigation menu (Home, Pricing, Features, Blog, Contact)
- [ ] ❌ Add footer with links to all major pages
- [ ] ❌ Implement breadcrumb navigation
- [ ] ❌ Add "Related Articles" section in blog posts
- [ ] ❌ Add contextual links within content

### Link Guidelines
- **Minimum 3 internal links** per page
- Use **descriptive anchor text** (not "click here")
- Link to **relevant, related content**
- Ensure **no broken links**

### Check for Broken Links
- [ ] ❌ Use Screaming Frog or similar tool
- [ ] ❌ Fix all 404 errors
- [ ] ❌ Create custom 404 page
- [ ] ❌ Set up redirects for moved pages

---

## 9. Mobile Optimization

### Mobile-First Checks
- [ ] ✅ Responsive design implemented
- [ ] ❌ Test on real devices (iOS + Android)
- [ ] ❌ Test on different screen sizes (mobile, tablet)
- [ ] ❌ Ensure touch targets are 48x48px minimum
- [ ] ❌ No horizontal scrolling
- [ ] ❌ Readable font sizes (16px minimum)
- [ ] ❌ Fast mobile load time (< 3s)

### Mobile SEO
- [ ] ❌ Verify mobile-friendliness in Google Search Console
- [ ] ❌ Test with [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [ ] ❌ Fix any mobile usability issues

---

## 10. Analytics & Tracking Setup

### Google Analytics 4
- [ ] ❌ Create GA4 property
- [ ] ❌ Install GA4 tracking code in `layout.tsx`
- [ ] ❌ Set up conversion goals:
  - [ ] Form submissions
  - [ ] CTA button clicks
  - [ ] Scroll depth
  - [ ] Time on page
  - [ ] Download clicks
- [ ] ❌ Configure events tracking
- [ ] ❌ Set up enhanced ecommerce (if applicable)
- [ ] ❌ Test tracking with GA4 DebugView

### Google Search Console
- [ ] ❌ Add property for `https://onereport.in`
- [ ] ❌ Verify ownership (DNS/HTML verification)
- [ ] ❌ Submit sitemap.xml
- [ ] ❌ Monitor for index coverage issues
- [ ] ❌ Check for manual actions
- [ ] ❌ Monitor search performance

### Google Tag Manager (Optional)
- [ ] ❌ Create GTM account
- [ ] ❌ Install GTM container
- [ ] ❌ Move GA4 to GTM
- [ ] ❌ Set up event tracking via GTM

---

## 11. Local SEO (India)

### Google Business Profile
- [ ] ❌ Create Google Business Profile
- [ ] ❌ Choose category: "Software Company"
- [ ] ❌ Add business name: "OneReport"
- [ ] ❌ Add address (Pune, Maharashtra, India)
- [ ] ❌ Add phone: +91 8888215802
- [ ] ❌ Add website: https://onereport.in
- [ ] ❌ Upload 10+ high-quality photos
- [ ] ❌ Add business hours (24/7 for SaaS)
- [ ] ❌ Write compelling business description
- [ ] ❌ Get verified
- [ ] ❌ Collect reviews (target: 10+ reviews)
- [ ] ❌ Post weekly updates

### Local Citations
- [ ] ❌ JustDial (India)
- [ ] ❌ Sulekha (India)
- [ ] ❌ IndiaMART
- [ ] ❌ Bing Places
- [ ] ❌ Yelp
- [ ] ❌ Clutch
- [ ] ❌ G2
- [ ] ❌ Capterra
- [ ] ❌ GetApp
- [ ] ❌ SoftwareSuggest (India)

**NAP Consistency:** Ensure Name, Address, Phone are identical across all platforms

---

## 12. Content Checklist

### Homepage
- [ ] ✅ H1 tag present (only one)
- [ ] ✅ Meta title optimized
- [ ] ✅ Meta description optimized
- [ ] ❌ Hero image has alt text
- [ ] ❌ All images optimized
- [ ] ❌ Clear CTA above the fold
- [ ] ❌ Internal links to key pages
- [ ] ❌ FAQ section present
- [ ] ❌ Schema markup added

### Blog Setup
- [ ] ❌ Create `/src/app/blog/page.tsx`
- [ ] ❌ Create blog layout template
- [ ] ❌ Add Article schema for blog posts
- [ ] ❌ Add author information
- [ ] ❌ Add publish/update dates
- [ ] ❌ Add reading time
- [ ] ❌ Add table of contents (long articles)
- [ ] ❌ Add social share buttons
- [ ] ❌ Add related articles section

### First 10 Blog Posts (Priority)
- [ ] ❌ "How to Create Professional Client Reports in 5 Minutes"
- [ ] ❌ "Why Indian Agencies Need Affordable Reporting Software"
- [ ] ❌ "AgencyAnalytics vs OneReport: Cost Comparison for India"
- [ ] ❌ "Automating Marketing Reports: A Guide for Freelancers"
- [ ] ❌ "Top 10 Marketing Metrics Every Agency Should Track"
- [ ] ❌ "White Label Reporting: Building Your Agency Brand"
- [ ] ❌ "How to Present Data to Clients Effectively"
- [ ] ❌ "The Complete Guide to Client Communication for Agencies"
- [ ] ❌ "AI-Powered Insights: The Future of Client Reporting"
- [ ] ❌ "Marketing Dashboard Tools: Complete Comparison Guide"

---

## 13. URL Structure

### URL Best Practices
- [ ] ✅ Use HTTPS
- [ ] ❌ Use lowercase letters
- [ ] ❌ Use hyphens (not underscores)
- [ ] ❌ Keep URLs short and descriptive
- [ ] ❌ Include target keyword in URL
- [ ] ❌ Avoid dynamic parameters when possible

### URL Structure Plan
```
https://onereport.in/                       (Homepage)
https://onereport.in/pricing                (Pricing)
https://onereport.in/features               (Features)
https://onereport.in/blog                   (Blog listing)
https://onereport.in/blog/[slug]            (Blog posts)
https://onereport.in/contact                (Contact)
https://onereport.in/for-freelancers        (Landing page)
https://onereport.in/for-agencies           (Landing page)
https://onereport.in/alternatives/agency-analytics  (Comparison)
```

---

## 14. Security & HTTPS

### SSL Certificate
- [ ] ❌ Install SSL certificate (via Vercel - auto)
- [ ] ❌ Force HTTPS redirects
- [ ] ❌ Test with [SSL Labs](https://www.ssllabs.com/ssltest/)
- [ ] ❌ Update all internal links to HTTPS
- [ ] ❌ Add HSTS header

### Security Headers
- [ ] ❌ X-Frame-Options: SAMEORIGIN
- [ ] ❌ X-Content-Type-Options: nosniff
- [ ] ❌ X-XSS-Protection: 1; mode=block
- [ ] ❌ Referrer-Policy: strict-origin-when-cross-origin
- [ ] ❌ Content-Security-Policy (if applicable)

---

## 15. Monitoring & Maintenance

### Weekly Tasks
- [ ] Check Google Search Console for errors
- [ ] Monitor keyword rankings
- [ ] Review traffic analytics
- [ ] Check Core Web Vitals
- [ ] Monitor uptime

### Monthly Tasks
- [ ] Comprehensive SEO audit
- [ ] Content performance review
- [ ] Backlink analysis
- [ ] Competitor analysis
- [ ] Update old content
- [ ] Build 5-10 quality backlinks
- [ ] Publish 2-4 new blog posts

### Quarterly Tasks
- [ ] Technical SEO audit (Screaming Frog)
- [ ] Keyword gap analysis
- [ ] Update SEO strategy based on results
- [ ] A/B test titles and meta descriptions
- [ ] Review and update schema markup

---

## 16. Validation & Testing

### Pre-Launch Validation
- [ ] ❌ Google Rich Results Test (all pages)
- [ ] ❌ Google Mobile-Friendly Test
- [ ] ❌ PageSpeed Insights (Desktop + Mobile)
- [ ] ❌ Lighthouse Audit (all pages)
- [ ] ❌ W3C HTML Validator
- [ ] ❌ Schema Markup Validator
- [ ] ❌ Facebook Sharing Debugger
- [ ] ❌ Twitter Card Validator
- [ ] ❌ Check robots.txt
- [ ] ❌ Check sitemap.xml
- [ ] ❌ Test all internal links
- [ ] ❌ Test all forms

### Tools to Use
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Schema Markup Validator](https://validator.schema.org/)
- [W3C Markup Validator](https://validator.w3.org/)

---

## Priority Order

### Phase 1: Critical (Week 1)
1. Create sitemap.ts
2. Create robots.ts
3. Generate OG images
4. Add verification tags
5. Set up Google Analytics
6. Set up Google Search Console

### Phase 2: High Priority (Week 2-3)
1. Implement all schema markup
2. Optimize all images
3. Add alt text to all images
4. Improve Core Web Vitals
5. Create 404 page
6. Fix any broken links

### Phase 3: Medium Priority (Week 4-6)
1. Create blog section
2. Write first 5 blog posts
3. Set up Google Business Profile
4. Create local citations
5. Build initial backlinks
6. Optimize internal linking

### Phase 4: Ongoing
1. Publish regular blog content
2. Monitor analytics
3. Build backlinks
4. Update old content
5. Respond to reviews
6. Track competitor changes

---

**Last Updated:** November 1, 2025
**Next Review:** November 15, 2025
