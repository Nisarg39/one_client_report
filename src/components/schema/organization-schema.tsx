export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "OneReport",
    "alternateName": "One Report",
    "url": "https://onereport.in",
    "logo": "https://onereport.in/og-logo.png",
    "description": "AI-Powered Client Reporting Software for Freelancers and Marketing Agencies in India",
    "email": "shah.nisarg39@gmail.com",
    "telephone": "+91-8888215802",
    "foundingDate": "2024",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Pune",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
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
        "email": "shah.nisarg39@gmail.com",
        "contactType": "customer support",
        "areaServed": "Worldwide",
        "availableLanguage": "English"
      }
    ],
    "sameAs": [
      "https://twitter.com/onereport",
      "https://linkedin.com/company/onereport",
      "https://facebook.com/onereport"
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
