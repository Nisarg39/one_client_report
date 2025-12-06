"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Twitter, Linkedin, Youtube, Github, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const navigation = {
    product: [
      { name: "Features", href: "/features" },
      { name: "Products", href: "/products" },
      { name: "Pricing", href: "#pricing" },
      { name: "Integrations", href: "#integrations" },
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "#blog" },
      { name: "Contact", href: "/contact" },
    ],
    resources: [
      { name: "Help Center", href: "#help" },
      { name: "Documentation", href: "#docs" },
      { name: "Guides", href: "#guides" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Refund Policy", href: "/refund-policy" },
      { name: "Cancellation Policy", href: "/cancellation-policy" },
      { name: "Shipping Policy", href: "/shipping-policy" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "LinkedIn", href: "#", icon: Linkedin },
    { name: "YouTube", href: "#", icon: Youtube },
    { name: "GitHub", href: "#", icon: Github },
  ];

  return (
    <footer className="relative bg-[#0f0f0f]">
      {/* Smooth gradient transition from contact section */}
      <div className="absolute top-0 left-0 right-0 h-48 sm:h-64 bg-gradient-to-b from-[#1a1a1a] via-[#151515] to-transparent pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-8 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="col-span-2 lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center space-x-3 group mb-4"
                aria-label="OneReport Home"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center shadow-[-6px_-6px_16px_rgba(40,40,40,0.3),6px_6px_16px_rgba(0,0,0,0.8)] transition-all duration-300 group-hover:shadow-[-4px_-4px_12px_rgba(40,40,40,0.3),4px_4px_12px_rgba(0,0,0,0.8)]">
                  <Image
                    src="/one_report_icon.png"
                    alt="OneReport Logo"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                </div>
                <span
                  className="text-xl font-bold tracking-tight"
                  style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
                >
                  <span className="text-[#6CA3A2]">O</span>
                  <span className="text-[#f5f5f5]">ne</span>
                  <span className="text-[#FF8C42]">R</span>
                  <span className="text-[#f5f5f5]">eport</span>
                </span>
              </Link>

              <p
                className="text-sm text-[#c0c0c0] mb-6 leading-relaxed max-w-xs"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
              >
                Beautiful, AI-powered marketing reports in 5 minutes, not 5
                hours.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-3 hidden">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-[-4px_-4px_12px_rgba(40,40,40,0.3),4px_4px_12px_rgba(0,0,0,0.7)] hover:shadow-[-6px_-6px_16px_rgba(40,40,40,0.4),6px_6px_16px_rgba(0,0,0,0.8)] transition-all duration-300 group"
                      aria-label={social.name}
                    >
                      <Icon
                        className="w-5 h-5 text-[#c0c0c0] group-hover:text-[#6CA3A2] transition-colors duration-300"
                        aria-hidden="true"
                      />
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Product Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-1"
          >
            <h3
              className="text-sm font-semibold text-[#f5f5f5] mb-4"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
            >
              Product
            </h3>
            <ul className="space-y-3">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  {item.href.startsWith("/") ? (
                    <Link
                      href={item.href}
                      className="text-sm text-[#c0c0c0] hover:text-[#6CA3A2] transition-colors duration-200"
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      className="text-sm text-[#c0c0c0] hover:text-[#6CA3A2] transition-colors duration-200"
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                    >
                      {item.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-1"
          >
            <h3
              className="text-sm font-semibold text-[#f5f5f5] mb-4"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
            >
              Company
            </h3>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  {item.href.startsWith("/") ? (
                    <Link
                      href={item.href}
                      className="text-sm text-[#c0c0c0] hover:text-[#6CA3A2] transition-colors duration-200"
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      className="text-sm text-[#c0c0c0] hover:text-[#6CA3A2] transition-colors duration-200"
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                    >
                      {item.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="col-span-1"
          >
            <h3
              className="text-sm font-semibold text-[#f5f5f5] mb-4"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
            >
              Resources
            </h3>
            <ul className="space-y-3">
              {navigation.resources.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm text-[#c0c0c0] hover:text-[#6CA3A2] transition-colors duration-200"
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="col-span-1"
          >
            <h3
              className="text-sm font-semibold text-[#f5f5f5] mb-4"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
            >
              Legal
            </h3>
            <ul className="space-y-3">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  {item.href.startsWith("/") ? (
                    <Link
                      href={item.href}
                      className="text-sm text-[#c0c0c0] hover:text-[#6CA3A2] transition-colors duration-200"
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      className="text-sm text-[#c0c0c0] hover:text-[#6CA3A2] transition-colors duration-200"
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                    >
                      {item.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-12 pb-12 border-b border-[#2a2a2a]"
        >
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-[-4px_-4px_12px_rgba(40,40,40,0.3),4px_4px_12px_rgba(0,0,0,0.7)]">
                <Mail className="w-5 h-5 text-[#6CA3A2]" aria-hidden="true" />
              </div>
              <h3
                className="text-lg font-semibold text-[#f5f5f5]"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
              >
                Subscribe to our newsletter
              </h3>
            </div>
            <p
              className="text-sm text-[#c0c0c0] mb-4"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
            >
              Get the latest updates, tips, and insights delivered to your
              inbox.
            </p>
            <form className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-12 px-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-[#f5f5f5] placeholder:text-[#666] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(40,40,40,0.2)] focus:outline-none focus:ring-2 focus:ring-[#6CA3A2] focus:border-[#6CA3A2] transition-all text-sm"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                aria-label="Email address"
              />
              <button
                type="submit"
                className="px-6 h-12 rounded-xl font-semibold text-sm bg-gradient-to-br from-[#FF8C42] to-[#E67A33] text-white shadow-[-8px_-8px_20px_rgba(40,40,40,0.4),8px_8px_20px_rgba(0,0,0,0.8),inset_-2px_-2px_6px_rgba(0,0,0,0.3),inset_2px_2px_6px_rgba(255,140,66,0.3)] hover:shadow-[-6px_-6px_16px_rgba(40,40,40,0.4),6px_6px_16px_rgba(0,0,0,0.8),inset_-2px_-2px_6px_rgba(0,0,0,0.3),inset_2px_2px_6px_rgba(255,140,66,0.4)] active:shadow-[inset_8px_8px_16px_rgba(179,87,28,0.7),inset_-8px_-8px_16px_rgba(255,140,66,0.2)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF8C42] focus:ring-offset-2 focus:ring-offset-[#0f0f0f]"
                aria-label="Subscribe to newsletter"
                style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p
            className="text-sm text-[#999]"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
          >
            &copy; {currentYear} OneReport. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy"
              className="text-sm text-[#999] hover:text-[#6CA3A2] transition-colors duration-200"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-[#999] hover:text-[#6CA3A2] transition-colors duration-200"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
            >
              Terms
            </Link>
            <Link
              href="/refund-policy"
              className="text-sm text-[#999] hover:text-[#6CA3A2] transition-colors duration-200"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
            >
              Refund
            </Link>
            <Link
              href="/cancellation-policy"
              className="text-sm text-[#999] hover:text-[#6CA3A2] transition-colors duration-200"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
            >
              Cancellation
            </Link>
            <Link
              href="/shipping-policy"
              className="text-sm text-[#999] hover:text-[#6CA3A2] transition-colors duration-200"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
            >
              Shipping
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
