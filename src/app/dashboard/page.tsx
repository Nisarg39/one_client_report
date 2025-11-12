"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  FileText,
  Users,
  Settings,
  CreditCard,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
} from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { icon: Home, label: "Home", href: "/dashboard", active: true },
    { icon: FileText, label: "Reports", href: "/dashboard/reports", active: false },
    { icon: Users, label: "Clients", href: "/dashboard/clients", active: false },
    { icon: Settings, label: "Settings", href: "/dashboard/settings", active: false },
    { icon: CreditCard, label: "Billing", href: "/dashboard/billing", active: false },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[#2a2a2a] bg-[#1a1a1a] p-6">
        {/* Logo */}
        <Link href="/" className="mb-8">
          <h1
            className="text-2xl font-bold text-[#f5f5f5]"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}
          >
            <span className="text-[#6CA3A2]">One</span>Report
          </h1>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all ${
                item.active
                  ? "bg-[#1a1a1a] text-[#6CA3A2] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(60,60,60,0.4)]"
                  : "text-[#999] hover:text-[#c0c0c0] hover:bg-[#1a1a1a] hover:shadow-[-4px_-4px_8px_rgba(70,70,70,0.3),4px_4px_8px_rgba(0,0,0,0.6)]"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={() => router.push("/login")}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-[#999] hover:text-red-400 hover:bg-[#1a1a1a] hover:shadow-[-4px_-4px_8px_rgba(70,70,70,0.3),4px_4px_8px_rgba(0,0,0,0.6)] transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      {/* Sidebar - Mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
          <aside
            className="absolute left-0 top-0 bottom-0 w-64 bg-[#1a1a1a] p-6 border-r border-[#2a2a2a]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <h1
                className="text-2xl font-bold text-[#f5f5f5]"
                style={{ textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}
              >
                <span className="text-[#6CA3A2]">One</span>Report
              </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-xl text-[#999] hover:text-[#c0c0c0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all ${
                    item.active
                      ? "bg-[#1a1a1a] text-[#6CA3A2] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(60,60,60,0.4)]"
                      : "text-[#999] hover:text-[#c0c0c0]"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
            </nav>

            <button
              onClick={() => router.push("/login")}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-[#999] hover:text-red-400 transition-all mt-4"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="border-b border-[#2a2a2a] bg-[#1a1a1a] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-[#c0c0c0] hover:bg-[#1a1a1a] hover:shadow-[-4px_-4px_8px_rgba(70,70,70,0.3),4px_4px_8px_rgba(0,0,0,0.6)] transition-all"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                <input
                  type="text"
                  placeholder="Search reports, clients..."
                  className="w-80 pl-10 pr-4 py-2 rounded-2xl bg-[#1a1a1a] text-[#f5f5f5] text-sm border-none shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(60,60,60,0.4)] focus:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.7),inset_-8px_-8px_16px_rgba(70,70,70,0.5)] transition-all outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 rounded-xl text-[#c0c0c0] hover:bg-[#1a1a1a] hover:shadow-[-4px_-4px_8px_rgba(70,70,70,0.3),4px_4px_8px_rgba(0,0,0,0.6)] transition-all relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF8C42] rounded-full"></span>
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6CA3A2] to-[#5a9493] shadow-[-6px_-6px_12px_rgba(70,70,70,0.3),6px_6px_12px_rgba(0,0,0,0.6)] flex items-center justify-center text-white font-bold">
                U
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Message */}
            <div className="mb-8">
              <h1
                className="text-3xl font-bold text-[#f5f5f5] mb-2"
                style={{ textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}
              >
                Welcome back!
              </h1>
              <p className="text-[#c0c0c0]">
                Here&apos;s what&apos;s happening with your marketing reports today.
              </p>
            </div>

            {/* Placeholder Content */}
            <div className="bg-[#1a1a1a] p-12 rounded-3xl shadow-[-12px_-12px_24px_rgba(70,70,70,0.4),12px_12px_24px_rgba(0,0,0,0.8)] text-center">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#6CA3A2] to-[#5a9493] shadow-[-10px_-10px_24px_rgba(70,70,70,0.4),10px_10px_24px_rgba(0,0,0,0.8)] mb-4">
                  <Home className="w-10 h-10 text-white" />
                </div>
                <h2
                  className="text-2xl font-bold text-[#f5f5f5]"
                  style={{ textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}
                >
                  Dashboard Coming Soon
                </h2>
                <p className="text-[#c0c0c0] leading-relaxed">
                  Your dashboard is being built! This is where you&apos;ll see an
                  overview of all your reports, recent activity, and quick stats.
                  For now, explore other sections using the sidebar.
                </p>
                <div className="pt-6 flex gap-4 justify-center">
                  <Link
                    href="/demo"
                    className="px-6 py-3 rounded-2xl font-medium bg-[#1a1a1a] text-[#6CA3A2] shadow-[-8px_-8px_20px_rgba(70,70,70,0.4),8px_8px_20px_rgba(0,0,0,0.8)] hover:shadow-[-6px_-6px_16px_rgba(70,70,70,0.4),6px_6px_16px_rgba(0,0,0,0.8)] active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.6),inset_-6px_-6px_12px_rgba(60,60,60,0.4)] transition-all"
                  >
                    View Demo Report
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
