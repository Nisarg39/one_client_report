"use client";

import { useState, useEffect } from "react";
import { getDashboardStats, getRecentContacts } from "@/backend/server_actions/adminActions";
import { Users, Mail, Clock, AlertCircle, TrendingUp } from "lucide-react";

interface DashboardStats {
  total: number;
  today: number;
  thisWeek: number;
  unread: number;
}

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResult, contactsResult] = await Promise.all([
        getDashboardStats(),
        getRecentContacts(),
      ]);

      if (statsResult.success && statsResult.data) {
        setStats(statsResult.data);
      }

      if (contactsResult.success && contactsResult.data) {
        setRecentContacts(contactsResult.data);
      }
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF8C42] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#c0c0c0] text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center text-red-400">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" />
          <p className="text-lg">{error}</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      label: "Total Contacts",
      value: stats?.total || 0,
      icon: Users,
      color: "#6CA3A2",
    },
    {
      label: "Today",
      value: stats?.today || 0,
      icon: TrendingUp,
      color: "#FF8C42",
    },
    {
      label: "This Week",
      value: stats?.thisWeek || 0,
      icon: Clock,
      color: "#5a9493",
    },
    {
      label: "Unread",
      value: stats?.unread || 0,
      icon: Mail,
      color: "#E67A33",
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#1a1a1a]">
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-[#2a2a2a]">
          <h1 className="text-3xl md:text-4xl font-bold text-[#f5f5f5] mb-2">Dashboard Overview</h1>
          <p className="text-sm md:text-base text-[#999999]">Welcome back to your admin panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="
                  bg-[#1a1a1a] rounded-3xl p-6
                  shadow-[-12px_-12px_24px_rgba(90,90,90,0.5),12px_12px_24px_rgba(0,0,0,0.9)]
                  transition-all duration-300
                  hover:shadow-[-14px_-14px_28px_rgba(90,90,90,0.6),14px_14px_28px_rgba(0,0,0,1)]
                  border border-[#2a2a2a]
                "
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="p-3 rounded-2xl bg-[#151515]
                      shadow-[inset_8px_8px_16px_rgba(0,0,0,0.8),inset_-8px_-8px_16px_rgba(70,70,70,0.4)]"
                  >
                    <Icon className="w-6 h-6" style={{ color: card.color }} />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-[#999999] mb-1">{card.label}</h3>
                <p className="text-4xl font-bold text-[#f5f5f5]">{card.value}</p>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div
          className="
            bg-[#1a1a1a] rounded-3xl p-6
            shadow-[-12px_-12px_24px_rgba(90,90,90,0.5),12px_12px_24px_rgba(0,0,0,0.9)]
            border border-[#2a2a2a]
          "
        >
          <h2 className="text-2xl font-bold text-[#f5f5f5] mb-6">Recent Activity</h2>

          {recentContacts.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 text-[#999999] mx-auto mb-4" />
              <p className="text-[#999999]">No contact submissions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentContacts.map((contact) => (
                <div
                  key={contact._id}
                  className="
                    bg-[#151515] rounded-2xl p-5
                    shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(70,70,70,0.3)]
                    hover:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.8),inset_-8px_-8px_16px_rgba(70,70,70,0.4)]
                    transition-all duration-200
                    border border-[#2a2a2a]
                  "
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-base text-[#f5f5f5]">{contact.name}</h3>
                        <span
                          className={`
                            px-3 py-1 rounded-full text-xs font-semibold capitalize
                            ${
                              contact.status === "unread"
                                ? "bg-[#FF8C42] text-black shadow-[-4px_-4px_8px_rgba(255,140,66,0.3),4px_4px_8px_rgba(0,0,0,0.8)]"
                                : contact.status === "read"
                                ? "bg-[#6CA3A2] text-black shadow-[-4px_-4px_8px_rgba(108,163,162,0.3),4px_4px_8px_rgba(0,0,0,0.8)]"
                                : "bg-[#5a9493] text-black shadow-[-4px_-4px_8px_rgba(90,148,147,0.3),4px_4px_8px_rgba(0,0,0,0.8)]"
                            }
                          `}
                        >
                          {contact.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-[#6CA3A2]">{contact.email}</p>
                    </div>
                    <span className="text-xs text-[#999999] whitespace-nowrap ml-4">
                      {formatDate(contact.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-[#c0c0c0] leading-relaxed line-clamp-2">
                    {contact.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}