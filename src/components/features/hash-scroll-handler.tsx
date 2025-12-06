/**
 * Hash Scroll Handler
 * 
 * Ensures that when the page loads with a hash in the URL (e.g., /#pricing),
 * it scrolls to the corresponding element smoothly.
 */

'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // Only run on homepage
    if (pathname !== '/') return;

    // Wait for page to fully render
    const timer = setTimeout(() => {
      const hash = window.location.hash;
      
      if (hash) {
        // Remove the # symbol
        const elementId = hash.substring(1);
        const element = document.getElementById(elementId);
        
        if (element) {
          // Scroll to element with smooth behavior
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }
    }, 100); // Small delay to ensure DOM is ready

    return () => clearTimeout(timer);
  }, [pathname]);

  return null; // This component doesn't render anything
}







