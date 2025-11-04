"use client";

import { useState } from "react";
import { adminLogout } from "@/backend/server_actions/adminActions";
import { LayoutDashboard, Users, LogOut, Menu, X } from "lucide-react";

interface AdminSidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export default function AdminSidebar({ activeView, onNavigate }: AdminSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await adminLogout();
    window.location.href = "/admin";
  };

  const navigationItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      id: "guest-actions",
      label: "Guest Actions",
      icon: Users,
      submenu: [
        {
          id: "contacts",
          label: "Contact Submissions",
        },
      ],
    },
  ];

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="p-6 border-b border-[#2a2a2a]">
        <h1 className="text-xl font-bold text-[#f5f5f5]">
          Admin Panel
        </h1>
        <p className="text-xs text-[#999999] mt-1">OneReport Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-3">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          // Check if this item or any of its submenu items is active
          const isActive =
            activeView === item.id ||
            (item.submenu?.some(sub => sub.id === activeView) ?? false);

          return (
            <div key={item.id}>
              {/* Main Nav Item */}
              <button
                onClick={() => {
                  // If item has submenu, navigate to first submenu item
                  if (item.submenu && item.submenu.length > 0) {
                    onNavigate(item.submenu[0].id);
                  } else {
                    onNavigate(item.id);
                  }
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-2xl
                  font-medium text-sm transition-all duration-300
                  ${
                    isActive
                      ? "bg-[#151515] text-[#6CA3A2] shadow-[inset_8px_8px_16px_rgba(0,0,0,0.8),inset_-8px_-8px_16px_rgba(70,70,70,0.4)] border border-[#2a2a2a]"
                      : "bg-[#1a1a1a] text-[#c0c0c0] shadow-[-8px_-8px_16px_rgba(90,90,90,0.4),8px_8px_16px_rgba(0,0,0,0.9)] border border-[#252525] hover:shadow-[-10px_-10px_20px_rgba(90,90,90,0.5),10px_10px_20px_rgba(0,0,0,1)] hover:border-[#2a2a2a]"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>

              {/* Submenu */}
              {item.submenu && isActive && (
                <div className="mt-2 ml-4 space-y-1">
                  {item.submenu.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => onNavigate(subItem.id)}
                      className={`
                        w-full text-left px-4 py-2 rounded-xl
                        text-xs transition-all duration-200
                        ${
                          activeView === subItem.id
                            ? "text-[#6CA3A2] bg-[#151515] font-medium"
                            : "text-[#999999] hover:text-[#6CA3A2] hover:bg-[#151515]"
                        }
                      `}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-[#2a2a2a]">
        <button
          onClick={handleLogout}
          className="
            w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl
            font-semibold text-sm text-[#c0c0c0]
            bg-[#1a1a1a] border border-[#252525]
            shadow-[-8px_-8px_16px_rgba(90,90,90,0.4),8px_8px_16px_rgba(0,0,0,0.9)]
            hover:shadow-[-10px_-10px_20px_rgba(90,90,90,0.5),10px_10px_20px_rgba(0,0,0,1)]
            hover:border-[#2a2a2a]
            active:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.7),inset_-8px_-8px_16px_rgba(70,70,70,0.4)]
            transition-all duration-300
          "
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="
          fixed top-4 left-4 z-50 md:hidden
          p-3 rounded-xl
          bg-[#1a1a1a] text-[#6CA3A2]
          shadow-[-6px_-6px_16px_rgba(70,70,70,0.4),6px_6px_16px_rgba(0,0,0,0.8)]
          active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.6),inset_-4px_-4px_8px_rgba(60,60,60,0.4)]
          transition-all duration-200
        "
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-64 bg-[#1a1a1a] flex flex-col
          shadow-[10px_0_30px_rgba(0,0,0,1)]
          border-r border-[#2a2a2a]
          transform transition-transform duration-300 md:transform-none
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <SidebarContent />
      </aside>
    </>
  );
}