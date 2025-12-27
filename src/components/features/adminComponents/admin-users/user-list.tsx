"use client";

import { useState, useEffect, useCallback } from "react";
import { getAllUsers, deleteUser, updateUserStatus, getUserAnalytics } from "@/backend/server_actions/adminActions";
import { Search, User as UserIcon, Shield, CreditCard, Trash2, CheckCircle, XCircle, AlertTriangle, BarChart2, MessageSquare, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    usageTier: 'free' | 'pro' | 'agency' | 'enterprise' | 'student';
    status: 'active' | 'inactive' | 'suspended';
    subscriptionStatus: string;
    createdAt: string;
    image?: string;
}

export default function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filter state
    const [searchQuery, setSearchQuery] = useState("");
    const [tierFilter, setTierFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Analytics state
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [analytics, setAnalytics] = useState<{ totalConversations: number; totalMessages: number } | null>(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);
    const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        const result = await getAllUsers({
            page: currentPage,
            limit: 10,
            search: searchQuery,
            usageTier: tierFilter,
            status: statusFilter,
        });

        if (result.success && result.data) {
            setUsers(result.data.users);
            setTotal(result.data.total);
            setTotalPages(result.data.totalPages);
        }
        setLoading(false);
    }, [currentPage, searchQuery, tierFilter, statusFilter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDeleteUser = async (userId: string, email: string) => {
        if (!confirm(`Are you absolutely sure you want to delete user ${email}? This action cannot be undone.`)) return;

        const result = await deleteUser(userId);
        if (result.success) {
            fetchUsers();
        } else {
            alert(result.message);
        }
    };

    const handleUpdateStatus = async (userId: string, status: 'active' | 'suspended' | 'inactive') => {
        const result = await updateUserStatus(userId, status);
        if (result.success) {
            fetchUsers();
        } else {
            alert(result.message);
        }
    };

    const handleFetchAnalytics = async (user: User) => {
        setSelectedUser(user);
        setAnalyticsLoading(true);
        setShowAnalyticsModal(true);

        const result = await getUserAnalytics(user._id);
        if (result.success && result.data) {
            setAnalytics(result.data);
        } else {
            console.error(result.message);
        }
        setAnalyticsLoading(false);
    };

    const closeAnalyticsModal = () => {
        setShowAnalyticsModal(false);
        setAnalytics(null);
        setSelectedUser(null);
    };

    const getTierColor = (tier: string) => {
        switch (tier) {
            case "student": return "text-[#6CA3A2] border-[#6CA3A2]/20 bg-[#6CA3A2]/5";
            case "pro": return "text-[#FF8C42] border-[#FF8C42]/20 bg-[#FF8C42]/5";
            case "agency": return "text-purple-400 border-purple-400/20 bg-purple-400/5";
            case "enterprise": return "text-yellow-400 border-yellow-400/20 bg-yellow-400/5";
            default: return "text-gray-400 border-gray-400/20 bg-gray-400/5";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "active": return <CheckCircle className="w-3 h-3 text-[#10B981]" />;
            case "suspended": return <AlertTriangle className="w-3 h-3 text-[#FF8C42]" />;
            case "inactive": return <XCircle className="w-3 h-3 text-red-400" />;
            default: return null;
        }
    };

    if (loading && users.length === 0) {
        return (
            <div className="flex-1 p-8 flex items-center justify-center bg-[#1a1a1a]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#6CA3A2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[#c0c0c0] text-lg font-medium">Synchronizing user data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-[#1a1a1a]">
            <div className="p-6 md:p-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="px-3 py-1 rounded bg-[#151515] border border-white/5 shadow-neu-inset">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6CA3A2]">USER_REGISTRY_v1.0</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-[#f5f5f5] uppercase tracking-tighter">
                            User <span className="text-[#6CA3A2] italic">Management</span>
                        </h1>
                        <p className="text-[#999999] text-sm mt-3 font-medium uppercase tracking-[0.1em]">
                            Monitor and manage {total} registered users in the ecosystem
                        </p>
                    </div>

                    <div className="flex items-center gap-4 text-[#444]">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#555]">ACTIVE_NODES</span>
                            <span className="text-2xl font-black text-[#6CA3A2]">{total}</span>
                        </div>
                        <div className="w-px h-10 bg-white/5" />
                        <Shield className="w-8 h-8 opacity-20" />
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="mb-8 grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-6 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#444] group-focus-within:text-[#6CA3A2] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search users by name or email hash..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="
                w-full pl-12 pr-4 py-4 rounded-2xl
                bg-[#151515] text-[#f5f5f5]
                placeholder:text-[#444]
                shadow-[inset_6px_6px_12px_rgba(0,0,0,0.8),inset_-6px_-6px_12px_rgba(70,70,70,0.3)]
                border border-[#2a2a2a]
                focus:outline-none focus:border-[#6CA3A2]/50
                transition-all duration-300 font-medium
              "
                        />
                    </div>

                    <div className="md:col-span-3">
                        <select
                            value={tierFilter}
                            onChange={(e) => setTierFilter(e.target.value)}
                            className="
                w-full px-4 py-4 rounded-2xl
                bg-[#151515] text-[#c0c0c0]
                shadow-[inset_6px_6px_12px_rgba(0,0,0,0.8),inset_-6px_-6px_12px_rgba(70,70,70,0.3)]
                border border-[#2a2a2a]
                focus:outline-none focus:border-[#6CA3A2]/50
                transition-all duration-300 font-bold uppercase text-[10px] tracking-widest
              "
                        >
                            <option value="all">ALL USAGE TIERS</option>
                            <option value="student">STUDENT</option>
                            <option value="pro">PRO</option>
                            <option value="agency">AGENCY</option>
                            <option value="enterprise">ENTERPRISE</option>
                        </select>
                    </div>

                    <div className="md:col-span-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="
                w-full px-4 py-4 rounded-2xl
                bg-[#151515] text-[#c0c0c0]
                shadow-[inset_6px_6px_12px_rgba(0,0,0,0.8),inset_-6px_-6px_12px_rgba(70,70,70,0.3)]
                border border-[#2a2a2a]
                focus:outline-none focus:border-[#6CA3A2]/50
                transition-all duration-300 font-bold uppercase text-[10px] tracking-widest
              "
                        >
                            <option value="all">ALL STATUS</option>
                            <option value="active">ACTIVE</option>
                            <option value="suspended">SUSPENDED</option>
                            <option value="inactive">INACTIVE</option>
                        </select>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-[#151515]/50 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#555]">User Profile</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#555]">Usage Tier</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#555]">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#555]">Joined Date</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#555] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <AnimatePresence mode="popLayout">
                                    {users.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <UserIcon className="w-16 h-16 text-[#222]" />
                                                    <p className="text-[#333] font-black uppercase tracking-widest text-sm">No users found in current scope</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <motion.tr
                                                key={user._id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="group hover:bg-white/[0.02] transition-all duration-300"
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-[#1a1a1a] shadow-neu-raised flex items-center justify-center overflow-hidden border border-white/5">
                                                            {user.image ? (
                                                                <img src={user.image} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <UserIcon className="w-6 h-6 text-[#444]" />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="text-sm font-bold text-white uppercase tracking-tight truncate">{user.name}</span>
                                                            <span className="text-xs text-[#6CA3A2] font-medium truncate">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className={`
                            inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border font-black text-[9px] uppercase tracking-widest
                            ${getTierColor(user.usageTier)}
                          `}>
                                                        <CreditCard className="w-3 h-3" />
                                                        {user.usageTier}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        {getStatusIcon(user.status)}
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${user.status === 'active' ? 'text-white' : 'text-[#444]'
                                                            }`}>
                                                            {user.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-[#c0c0c0] uppercase tracking-tighter">
                                                            {new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </span>
                                                        <span className="text-[9px] font-mono text-[#444] uppercase tracking-widest">
                                                            {new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center justify-end gap-2 translate-x-2 group-hover:translate-x-0 transition-transform duration-300">
                                                        <button
                                                            onClick={() => handleFetchAnalytics(user)}
                                                            title="User Analytics"
                                                            className="p-3 rounded-xl bg-[#1a1a1a] border border-white/5 text-[#6CA3A2] shadow-neu-raised hover:shadow-neu-inset transition-all"
                                                        >
                                                            <BarChart2 className="w-4 h-4" />
                                                        </button>
                                                        {user.status === 'active' ? (
                                                            <button
                                                                onClick={() => handleUpdateStatus(user._id, 'suspended')}
                                                                title="Suspend User"
                                                                className="p-3 rounded-xl bg-[#1a1a1a] border border-white/5 text-[#FF8C42] shadow-neu-raised hover:shadow-neu-inset transition-all"
                                                            >
                                                                <AlertTriangle className="w-4 h-4" />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleUpdateStatus(user._id, 'active')}
                                                                title="Activate User"
                                                                className="p-3 rounded-xl bg-[#1a1a1a] border border-white/5 text-[#10B981] shadow-neu-raised hover:shadow-neu-inset transition-all"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteUser(user._id, user.email)}
                                                            title="Delete User"
                                                            className="p-3 rounded-xl bg-[#1a1a1a] border border-white/5 text-red-400 shadow-neu-raised hover:shadow-neu-inset transition-all"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Section */}
                {totalPages > 1 && (
                    <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                        <div className="flex items-center gap-4">
                            <div className="px-4 py-2 rounded-xl bg-[#151515] border border-white/5 shadow-neu-inset">
                                <span className="text-[10px] font-black text-[#555] uppercase tracking-widest lowercase">
                                    Page <span className="text-[#f5f5f5] text-lg mx-1">{currentPage}</span> of {totalPages}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="
                  px-6 py-3 rounded-2xl bg-[#1a1a1a] text-sm font-black uppercase tracking-[0.2em]
                  text-[#c0c0c0] border border-[#252525]
                  shadow-[-8px_-8px_16px_rgba(90,90,90,0.4),8px_8px_16px_rgba(0,0,0,0.9)]
                  hover:shadow-[-10px_-10px_20px_rgba(90,90,90,0.5),10px_10px_20px_rgba(0,0,0,1)]
                  disabled:opacity-20 disabled:cursor-not-allowed
                  transition-all duration-300
                "
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="
                  px-6 py-3 rounded-2xl bg-[#1a1a1a] text-sm font-black uppercase tracking-[0.2em]
                  text-[#c0c0c0] border border-[#252525]
                  shadow-[-8px_-8px_16px_rgba(90,90,90,0.4),8px_8px_16px_rgba(0,0,0,0.9)]
                  hover:shadow-[-10px_-10px_20px_rgba(90,90,90,0.5),10px_10px_20px_rgba(0,0,0,1)]
                  disabled:opacity-20 disabled:cursor-not-allowed
                  transition-all duration-300
                "
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* User Analytics Modal */}
            <AnimatePresence>
                {showAnalyticsModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#151515] border border-white/10 rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl"
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-[#1a1a1a] shadow-neu-raised flex items-center justify-center overflow-hidden border border-white/5">
                                            {selectedUser?.image ? (
                                                <img src={selectedUser.image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <UserIcon className="w-6 h-6 text-[#444]" />
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-white uppercase tracking-tight">{selectedUser?.name}</h2>
                                            <p className="text-[#6CA3A2] text-xs font-medium">{selectedUser?.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={closeAnalyticsModal}
                                        className="p-2 rounded-xl bg-[#1a1a1a] border border-white/5 text-[#444] hover:text-white transition-colors shadow-neu-raised"
                                    >
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                </div>

                                {analyticsLoading ? (
                                    <div className="py-20 flex flex-col items-center justify-center">
                                        <div className="w-12 h-12 border-4 border-[#6CA3A2] border-t-transparent rounded-full animate-spin mb-4"></div>
                                        <p className="text-[#444] font-black uppercase tracking-widest text-xs">Retrieving neural metrics...</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="p-6 rounded-3xl bg-[#1a1a1a] border border-white/5 shadow-neu-inset">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 rounded-lg bg-[#6CA3A2]/10 text-[#6CA3A2]">
                                                    <List className="w-5 h-5" />
                                                </div>
                                                <span className="text-[10px] font-black text-[#555] uppercase tracking-widest">Conversations</span>
                                            </div>
                                            <div className="text-3xl font-black text-white">{analytics?.totalConversations || 0}</div>
                                            <div className="text-[9px] font-bold text-[#444] uppercase tracking-tighter mt-1">Total count</div>
                                        </div>

                                        <div className="p-6 rounded-3xl bg-[#1a1a1a] border border-white/5 shadow-neu-inset">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 rounded-lg bg-[#FF8C42]/10 text-[#FF8C42]">
                                                    <MessageSquare className="w-5 h-5" />
                                                </div>
                                                <span className="text-[10px] font-black text-[#555] uppercase tracking-widest">Messages</span>
                                            </div>
                                            <div className="text-3xl font-black text-white">{analytics?.totalMessages || 0}</div>
                                            <div className="text-[9px] font-bold text-[#444] uppercase tracking-tighter mt-1">Total user inputs</div>
                                        </div>
                                    </div>
                                )}

                                <div className="p-4 rounded-2xl bg-[#1a1a1a] border border-white/5 border-dashed">
                                    <p className="text-[10px] text-[#444] text-center font-medium uppercase tracking-widest">
                                        Metrics are calculated based on all active and archived interactions.
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 bg-[#1a1a1a]/50 border-t border-white/5 flex justify-end">
                                <button
                                    onClick={closeAnalyticsModal}
                                    className="px-8 py-3 rounded-xl bg-[#1a1a1a] text-xs font-black uppercase tracking-widest text-[#6CA3A2] border border-[#6CA3A2]/20 shadow-neu-raised hover:shadow-neu-inset transition-all"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
}
