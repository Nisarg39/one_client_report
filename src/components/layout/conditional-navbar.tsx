"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";

export function ConditionalNavbar() {
  const pathname = usePathname();

  // Don't show navbar on admin routes or chat page
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/chat")) {
    return null;
  }

  return <Navbar />;
}
