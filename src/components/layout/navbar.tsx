"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "#integrations", label: "Integrations" },
    { href: "#about", label: "About" },
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-sm">
      {/* Main navbar */}
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link
                href="/"
                className="flex items-center space-x-2 sm:space-x-3 group"
                aria-label="OneReport Home"
              >
                {/* Logo icon with neumorphic effect */}
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center shadow-[-6px_-6px_16px_rgba(70,70,70,0.4),6px_6px_16px_rgba(0,0,0,0.8),inset_-1px_-1px_3px_rgba(0,0,0,0.2)] transition-all duration-300 group-hover:shadow-[-4px_-4px_12px_rgba(70,70,70,0.4),4px_4px_12px_rgba(0,0,0,0.8)]"
                >
                  <Image
                    src="/one_report_icon.png"
                    alt="OneReport Logo"
                    width={32}
                    height={32}
                    className="w-7 h-7 sm:w-8 sm:h-8"
                  />
                </div>
                <span
                  className="text-lg sm:text-xl font-bold tracking-tight"
                  style={{
                    textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  <span className="text-[#6CA3A2]">O</span>
                  <span className="text-[#f5f5f5]">ne</span>
                  <span className="text-[#FF8C42]">R</span>
                  <span className="text-[#f5f5f5]">eport</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links + Sign In */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 lg:px-4 py-2 rounded-2xl text-sm lg:text-base font-medium text-[#c0c0c0] hover:text-[#6CA3A2] transition-all duration-200 hover:shadow-[-4px_-4px_12px_rgba(70,70,70,0.3),4px_4px_12px_rgba(0,0,0,0.7)] focus:outline-none focus:ring-2 focus:ring-[#6CA3A2] focus:ring-offset-2 focus:ring-offset-[#1a1a1a]"
                  style={{
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                  }}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#login"
                className="px-3 lg:px-4 py-2 rounded-2xl text-sm lg:text-base font-medium text-[#6CA3A2] hover:text-[#5a9493] transition-all duration-200 hover:shadow-[-4px_-4px_12px_rgba(70,70,70,0.3),4px_4px_12px_rgba(0,0,0,0.7)] focus:outline-none focus:ring-2 focus:ring-[#6CA3A2] focus:ring-offset-2 focus:ring-offset-[#1a1a1a]"
                style={{
                  textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                }}
              >
                Sign In
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-2xl bg-[#1a1a1a] text-[#c0c0c0] hover:text-[#6CA3A2] shadow-[-6px_-6px_16px_rgba(70,70,70,0.4),6px_6px_16px_rgba(0,0,0,0.8)] hover:shadow-[-4px_-4px_12px_rgba(70,70,70,0.4),4px_4px_12px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(60,60,60,0.4)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6CA3A2] focus:ring-offset-2 focus:ring-offset-[#1a1a1a]"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-[#1a1a1a] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(60,60,60,0.3)]"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 rounded-2xl text-base font-medium text-[#c0c0c0] hover:text-[#6CA3A2] hover:bg-[#151515] transition-all duration-200 shadow-[-4px_-4px_12px_rgba(70,70,70,0.3),4px_4px_12px_rgba(0,0,0,0.7)] hover:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(60,60,60,0.3)] focus:outline-none focus:ring-2 focus:ring-[#6CA3A2] focus:ring-offset-2 focus:ring-offset-[#1a1a1a]"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                  }}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4">
                <a
                  href="#login"
                  className="block px-4 py-3 rounded-2xl text-base font-medium text-center text-[#6CA3A2] bg-[#1a1a1a] shadow-[-6px_-6px_16px_rgba(70,70,70,0.4),6px_6px_16px_rgba(0,0,0,0.8)] hover:shadow-[-4px_-4px_12px_rgba(70,70,70,0.4),4px_4px_12px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(60,60,60,0.4)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6CA3A2] focus:ring-offset-2 focus:ring-offset-[#1a1a1a]"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                  }}
                >
                  Sign In
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
