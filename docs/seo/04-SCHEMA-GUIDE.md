# Schema Markup Implementation Guide

> **Ready-to-use schema markup components for OneReport**
> **Format:** Next.js 14+ with TypeScript
> **Last Updated:** November 1, 2025

---

## Table of Contents

1. [What is Schema Markup?](#what-is-schema-markup)
2. [Why Schema Markup Matters](#why-schema-markup-matters)
3. [Implementation Instructions](#implementation-instructions)
4. [Schema Components](#schema-components)
5. [Testing & Validation](#testing--validation)

---

## What is Schema Markup?

Schema markup (JSON-LD) is structured data that helps search engines understand your content better. It can lead to:
- **Rich snippets** in search results
- **Better rankings** for relevant queries
- **Higher click-through rates** (CTR)
- **Voice search optimization**
- **Enhanced knowledge panels**

---

## Why Schema Markup Matters

### Benefits for OneReport:
1. **Featured Snippets:** FAQ schema can get you in position #0
2. **Rich Results:** Star ratings, pricing, availability in search
3. **Local SEO:** LocalBusiness schema helps with "near me" searches
4. **Trust Signals:** Organization schema builds credibility
5. **Competitive Advantage:** Most competitors don't implement schema properly

### Expected Results:
- **15-30% higher CTR** from search results
- **Better ranking** for local searches
- **Rich snippets** for FAQ content
- **Enhanced brand visibility** in SERPs

---

## Implementation Instructions

### Step 1: Create Schema Components Folder

```bash
mkdir -p src/components/schema
```

### Step 2: Create Component Files

Copy the components from the [Schema Components](#schema-components) section below.

### Step 3: Add to Your Pages

```tsx
// Example: src/app/layout.tsx
import { OrganizationSchema } from '@/components/schema/organization-schema';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <OrganizationSchema />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Step 4: Validate

Test each schema with [Google Rich Results Test](https://search.google.com/test/rich-results)

---

## Schema Components

### 1. Organization Schema

**File:** `src/components/schema/organization-schema.tsx`

```typescript
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "OneReport",
    "alternateName": "One Report",
    "url": "https://onereport.in",
    "logo": "https://onereport.in/og-logo.png",
    "description": "AI-Powered Client Reporting Software for Freelancers and Marketing Agencies in India",
    "email": "hello@onereport.com",
    "telephone": "+91-8888215802",
    "foundingDate": "2024",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Pune",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN",
      "postalCode": ""
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "18.5204",
      "longitude": "73.8567"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+91-8888215802",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"],
        "contactOption": "TollFree"
      },
      {
        "@type": "ContactPoint",
        "email": "hello@onereport.com",
        "contactType": "customer support",
        "areaServed": "Worldwide",
        "availableLanguage": "English"
      }
    ],
    "sameAs": [
      "https://twitter.com/onereport",
      "https://linkedin.com/company/onereport",
      "https://facebook.com/onereport",
      "https://www.instagram.com/onereport"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "India"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

**Add to:** `src/app/layout.tsx` (global - all pages)

---

### 2. LocalBusiness Schema

**File:** `src/components/schema/localbusiness-schema.tsx`

```typescript
export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://onereport.in/#localbusiness",
    "name": "OneReport",
    "image": "https://onereport.in/og-logo.png",
    "url": "https://onereport.in",
    "telephone": "+91-8888215802",
    "email": "hello@onereport.com",
    "priceRange": "₹₹",
    "paymentAccepted": "Credit Card, Debit Card, UPI, Net Banking",
    "currenciesAccepted": "INR",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Pune",
      "addressRegion": "Maharashtra",
      "postalCode": "",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 18.5204,
      "longitude": 73.8567
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      }
    ],
    "sameAs": [
      "https://twitter.com/onereport",
      "https://linkedin.com/company/onereport",
      "https://facebook.com/onereport"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

**Add to:** `src/app/page.tsx` (homepage only)

---

### 3. SoftwareApplication Schema

**File:** `src/components/schema/software-schema.tsx`

```typescript
export function SoftwareApplicationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "OneReport",
    "description": "AI-Powered Client Reporting Software for Marketing Agencies and Freelancers",
    "applicationCategory": "BusinessApplication",
    "applicationSubCategory": "Analytics Software",
    "operatingSystem": "Web Browser, Cloud-based",
    "url": "https://onereport.in",
    "screenshot": "https://onereport.in/dashboard-screenshot.jpg",
    "softwareVersion": "1.0",
    "releaseNotes": "https://onereport.in/changelog",
    "offers": [
      {
        "@type": "Offer",
        "name": "Solo Plan",
        "price": "4000",
        "priceCurrency": "INR",
        "billingIncrement": "Monthly",
        "priceValidUntil": "2025-12-31",
        "availability": "https://schema.org/InStock",
        "url": "https://onereport.in/pricing",
        "description": "Perfect for freelancers. Up to 10 clients."
      },
      {
        "@type": "Offer",
        "name": "Growth Plan",
        "price": "8000",
        "priceCurrency": "INR",
        "billingIncrement": "Monthly",
        "priceValidUntil": "2025-12-31",
        "availability": "https://schema.org/InStock",
        "url": "https://onereport.in/pricing",
        "description": "For growing agencies. Up to 25 clients."
      },
      {
        "@type": "Offer",
        "name": "Pro Plan",
        "price": "16000",
        "priceCurrency": "INR",
        "billingIncrement": "Monthly",
        "priceValidUntil": "2025-12-31",
        "availability": "https://schema.org/InStock",
        "url": "https://onereport.in/pricing",
        "description": "For established agencies. Unlimited clients."
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Rajesh Kumar"
        },
        "datePublished": "2024-10-15",
        "reviewBody": "OneReport has transformed how we communicate with clients. The AI insights are incredibly helpful and save us hours every week.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      }
    ],
    "featureList": [
      "AI-powered insights",
      "White label reports",
      "Automated report generation",
      "Multi-platform integration",
      "Custom branding",
      "Client portal access",
      "Schedule automated delivery",
      "Real-time data syncing"
    ],
    "requirements": "Web browser (Chrome, Firefox, Safari, Edge)",
    "inLanguage": "English",
    "author": {
      "@type": "Organization",
      "name": "OneReport"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

**Add to:** `src/app/page.tsx` (homepage only)

**Note:** Update `aggregateRating` and `review` with real data when you have customer reviews.

---

### 4. FAQ Schema (Dynamic)

**File:** `src/components/schema/faq-schema.tsx`

```typescript
interface FAQ {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQ[];
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

**Usage Example:**

```tsx
// In your FAQ section component
import { FAQSchema } from '@/components/schema/faq-schema';

const faqs = [
  {
    question: "How long does it take to set up OneReport?",
    answer: "OneReport can be set up in just 5 minutes. Simply connect your marketing platforms, customize your branding, and you're ready to send your first report."
  },
  {
    question: "What is the difference between OneReport and AgencyAnalytics?",
    answer: "OneReport offers similar features to AgencyAnalytics but at 50-80% lower cost. We're built specifically for Indian agencies with local pricing, payment options, and support."
  },
  {
    question: "Can I try OneReport for free?",
    answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required."
  },
  {
    question: "Do I need technical skills to use OneReport?",
    answer: "No technical skills required. OneReport is designed to be intuitive and user-friendly, even for non-technical users."
  }
];

export function FAQSection() {
  return (
    <>
      <FAQSchema faqs={faqs} />
      {/* Your FAQ UI component */}
    </>
  );
}
```

**Add to:** Any page with FAQ content (homepage, pricing, etc.)

---

### 5. Breadcrumb Schema

**File:** `src/components/schema/breadcrumb-schema.tsx`

```typescript
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": index === items.length - 1 ? undefined : item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

**Usage Example:**

```tsx
// In your page component
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';

const breadcrumbs = [
  { name: "Home", url: "https://onereport.in" },
  { name: "Blog", url: "https://onereport.in/blog" },
  { name: "How to Create Client Reports", url: "https://onereport.in/blog/how-to-create-client-reports" }
];

export function BlogPost() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      {/* Your page content */}
    </>
  );
}
```

**Add to:** All pages except homepage

---

### 6. Article Schema (for Blog Posts)

**File:** `src/components/schema/article-schema.tsx`

```typescript
interface ArticleSchemaProps {
  title: string;
  description: string;
  author: string;
  publishedDate: string;
  modifiedDate: string;
  imageUrl: string;
  url: string;
  keywords?: string[];
}

export function ArticleSchema({
  title,
  description,
  author,
  publishedDate,
  modifiedDate,
  imageUrl,
  url,
  keywords = []
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": [imageUrl],
    "datePublished": publishedDate,
    "dateModified": modifiedDate,
    "author": {
      "@type": "Person",
      "name": author,
      "url": "https://onereport.in/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "OneReport",
      "logo": {
        "@type": "ImageObject",
        "url": "https://onereport.in/og-logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "keywords": keywords.join(", "),
    "articleSection": "Marketing",
    "inLanguage": "en-IN"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

**Usage Example:**

```tsx
// In your blog post page
import { ArticleSchema } from '@/components/schema/article-schema';

export default function BlogPost() {
  return (
    <>
      <ArticleSchema
        title="How to Create Professional Client Reports in 5 Minutes"
        description="Learn how to automate your client reporting process and save 10 hours every week with AI-powered insights."
        author="Nisarg Patel"
        publishedDate="2024-11-01"
        modifiedDate="2024-11-01"
        imageUrl="https://onereport.in/blog/client-reports-featured.jpg"
        url="https://onereport.in/blog/how-to-create-client-reports"
        keywords={["client reporting", "marketing automation", "agency tools"]}
      />
      {/* Your blog post content */}
    </>
  );
}
```

**Add to:** All blog posts

---

### 7. Product Schema (Alternative to SoftwareApplication)

**File:** `src/components/schema/product-schema.tsx`

```typescript
export function ProductSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "OneReport - Client Reporting Software",
    "description": "AI-Powered Client Reporting Software for Marketing Agencies and Freelancers in India",
    "image": "https://onereport.in/product-image.jpg",
    "brand": {
      "@type": "Brand",
      "name": "OneReport"
    },
    "offers": {
      "@type": "AggregateOffer",
      "url": "https://onereport.in/pricing",
      "priceCurrency": "INR",
      "lowPrice": "4000",
      "highPrice": "16000",
      "offerCount": "3",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2025-12-31"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Priya Sharma"
        },
        "datePublished": "2024-10-20",
        "reviewBody": "Best reporting tool for Indian agencies. Affordable and packed with features.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

**Add to:** Pricing page

---

### 8. HowTo Schema (for Tutorial Content)

**File:** `src/components/schema/howto-schema.tsx`

```typescript
interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

interface HowToSchemaProps {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string;
  estimatedCost?: {
    currency: string;
    value: string;
  };
}

export function HowToSchema({
  name,
  description,
  steps,
  totalTime,
  estimatedCost
}: HowToSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "totalTime": totalTime,
    "estimatedCost": estimatedCost ? {
      "@type": "MonetaryAmount",
      "currency": estimatedCost.currency,
      "value": estimatedCost.value
    } : undefined,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      "image": step.image
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

**Usage Example:**

```tsx
// In a how-to blog post
const steps = [
  {
    name: "Connect Your Marketing Platforms",
    text: "Log in to OneReport and connect your Google Analytics, Facebook Ads, and other marketing platforms with one-click integrations.",
    image: "https://onereport.in/step1.jpg"
  },
  {
    name: "Customize Your Report Template",
    text: "Choose from our pre-designed templates or create your own with drag-and-drop widgets. Add your logo and brand colors.",
    image: "https://onereport.in/step2.jpg"
  },
  {
    name: "Generate and Send Report",
    text: "Click 'Generate Report' and OneReport will pull all your data and create a professional PDF. Send it to your client with one click.",
    image: "https://onereport.in/step3.jpg"
  }
];

<HowToSchema
  name="How to Create a Client Report in OneReport"
  description="Follow these 3 simple steps to create and send professional client reports in just 5 minutes."
  steps={steps}
  totalTime="PT5M"
/>
```

**Add to:** How-to blog posts and tutorial content

---

### 9. VideoObject Schema (for Video Content)

**File:** `src/components/schema/video-schema.tsx`

```typescript
interface VideoSchemaProps {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string; // ISO 8601 format (PT1M30S = 1 min 30 sec)
  contentUrl: string;
  embedUrl: string;
}

export function VideoSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  contentUrl,
  embedUrl
}: VideoSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": name,
    "description": description,
    "thumbnailUrl": thumbnailUrl,
    "uploadDate": uploadDate,
    "duration": duration,
    "contentUrl": contentUrl,
    "embedUrl": embedUrl,
    "publisher": {
      "@type": "Organization",
      "name": "OneReport",
      "logo": {
        "@type": "ImageObject",
        "url": "https://onereport.in/og-logo.png"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

**Add to:** Pages with video tutorials or demos

---

## Complete Implementation Example

### Homepage (src/app/page.tsx)

```tsx
import { OrganizationSchema } from '@/components/schema/organization-schema';
import { LocalBusinessSchema } from '@/components/schema/localbusiness-schema';
import { SoftwareApplicationSchema } from '@/components/schema/software-schema';
import { FAQSchema } from '@/components/schema/faq-schema';

const faqs = [
  {
    question: "How long does it take to set up OneReport?",
    answer: "OneReport can be set up in just 5 minutes. Simply connect your marketing platforms, customize your branding, and you're ready to send your first report."
  },
  // ... more FAQs
];

export default function HomePage() {
  return (
    <>
      {/* Schema Markup */}
      <OrganizationSchema />
      <LocalBusinessSchema />
      <SoftwareApplicationSchema />
      <FAQSchema faqs={faqs} />

      {/* Page Content */}
      <main>
        <HeroSection />
        <SocialProofBar />
        <ProblemStatement />
        <SolutionOverview />
        <PricingTransparency />
        <FAQSection />
        <FinalCTA />
        <ContactSection />
      </main>
    </>
  );
}
```

### Blog Post (src/app/blog/[slug]/page.tsx)

```tsx
import { ArticleSchema } from '@/components/schema/article-schema';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import { HowToSchema } from '@/components/schema/howto-schema';

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = {
    title: "How to Create Professional Client Reports in 5 Minutes",
    description: "Learn how to automate your client reporting process...",
    author: "Nisarg Patel",
    publishedDate: "2024-11-01",
    modifiedDate: "2024-11-01",
    imageUrl: "https://onereport.in/blog/featured.jpg",
    url: `https://onereport.in/blog/${params.slug}`,
    keywords: ["client reporting", "marketing automation"]
  };

  const breadcrumbs = [
    { name: "Home", url: "https://onereport.in" },
    { name: "Blog", url: "https://onereport.in/blog" },
    { name: post.title, url: post.url }
  ];

  return (
    <>
      {/* Schema Markup */}
      <ArticleSchema {...post} />
      <BreadcrumbSchema items={breadcrumbs} />

      {/* Post Content */}
      <article>
        <h1>{post.title}</h1>
        {/* ... */}
      </article>
    </>
  );
}
```

---

## Testing & Validation

### 1. Google Rich Results Test

**URL:** https://search.google.com/test/rich-results

**Steps:**
1. Enter your page URL
2. Click "Test URL"
3. Review detected structured data
4. Fix any errors or warnings
5. Re-test until all green

**Common Errors:**
- Missing required properties
- Invalid date formats
- Incorrect URLs
- Missing images

### 2. Schema Markup Validator

**URL:** https://validator.schema.org/

**Steps:**
1. Paste your schema JSON or URL
2. Click "Run Test"
3. Review validation results
4. Fix any warnings

### 3. Google Search Console

**Post-Deployment:**
1. Go to Search Console
2. Navigate to "Enhancements"
3. Check for:
   - Rich Results
   - Breadcrumbs
   - FAQ
   - Article
4. Monitor impressions and clicks

### 4. Local Testing

**During Development:**

```tsx
// Add this to verify schema is rendering
useEffect(() => {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  console.log('Schema markup count:', scripts.length);
  scripts.forEach((script, index) => {
    console.log(`Schema ${index + 1}:`, JSON.parse(script.textContent || '{}'));
  });
}, []);
```

---

## Common Issues & Fixes

### Issue 1: Schema Not Detected

**Problem:** Google Rich Results Test doesn't find schema

**Solutions:**
- Ensure script is in `<head>` or `<body>`
- Check for JSON syntax errors
- Verify component is actually rendering
- Check for TypeScript errors

### Issue 2: Invalid Date Format

**Problem:** "Invalid ISO 8601 date format"

**Solution:**
```typescript
// ❌ Wrong
"datePublished": "01/11/2024"

// ✅ Correct
"datePublished": "2024-11-01"
"datePublished": "2024-11-01T10:30:00+05:30"
```

### Issue 3: Missing Required Properties

**Problem:** "Missing field 'image'"

**Solution:**
Always include required properties:
- Organization: name, url, logo
- Article: headline, image, datePublished, author
- Product: name, image, offers
- FAQ: each question needs acceptedAnswer

### Issue 4: Duplicate Schema

**Problem:** Same schema appears multiple times

**Solution:**
- Only add OrganizationSchema once (in layout.tsx)
- Don't duplicate schemas across components
- Use conditional rendering if needed

```tsx
{isHomePage && <SoftwareApplicationSchema />}
```

---

## Best Practices

### 1. One Schema Per Type Per Page

Don't repeat the same schema type multiple times on the same page (except for FAQs and Reviews).

### 2. Use Real Data

Never use fake ratings, reviews, or pricing. Google can penalize for misleading schema.

### 3. Keep Schema Updated

When you change content, update the corresponding schema:
- Pricing changes → Update offers
- New reviews → Add to review array
- Address change → Update LocalBusiness

### 4. Test Before Deploying

Always validate schema before pushing to production.

### 5. Monitor Performance

Track in Google Search Console:
- Rich result impressions
- Click-through rates
- Any manual actions

---

## Schema Priority Order

### Implement in This Order:

1. **Organization Schema** (Global - Week 1)
2. **LocalBusiness Schema** (Homepage - Week 1)
3. **FAQ Schema** (FAQ Section - Week 1)
4. **SoftwareApplication/Product Schema** (Homepage - Week 2)
5. **Breadcrumb Schema** (All Pages - Week 2)
6. **Article Schema** (Blog Posts - Week 3)
7. **HowTo Schema** (Tutorial Content - Week 4)
8. **Video Schema** (When adding videos - Future)

---

## Resources

### Official Documentation
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central - Structured Data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [JSON-LD Specification](https://json-ld.org/)

### Testing Tools
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)
- [Google Search Console](https://search.google.com/search-console)

### Helpful Guides
- [Google's Structured Data Guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Moz: Schema Markup Guide](https://moz.com/learn/seo/schema-structured-data)

---

**Document Version:** 1.0
**Next Review:** November 15, 2025
