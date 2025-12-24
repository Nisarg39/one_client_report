"use client";

import { useState, useEffect } from "react";
import { verifyAdminSession } from "@/backend/server_actions/adminActions";
import AdminSidebar from "./admin-sidebar";
import AdminDashboard from "./admin-dashboard";
import AdminSignInHome from "./admin-sign-in/admin-sign-in-home";
import ContactList from "./admin-contacts/contact-list";
import UserList from "./admin-users/user-list";

export default function AdminHome() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeView, setActiveView] = useState<string>("overview");

  // Check session on component mount
  useEffect(() => {
    const checkSession = async () => {
      const isValid = await verifyAdminSession();
      setIsAuthenticated(isValid);
    };

    checkSession();
  }, []);

  // Loading state while checking session
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF8C42] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#c0c0c0] text-lg">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show login page
  if (!isAuthenticated) {
    return <AdminSignInHome onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // Render active view based on navigation
  const renderView = () => {
    switch (activeView) {
      case "overview":
        return <AdminDashboard />;
      case "contacts":
        return <ContactList />;
      case "users":
        return <UserList />;
      default:
        return <AdminDashboard />;
    }
  };

  // Authenticated - show admin dashboard
  return (
    <div className="flex min-h-screen bg-[#1a1a1a]">
      <AdminSidebar activeView={activeView} onNavigate={setActiveView} />
      {renderView()}
    </div>
  );
}