"use client";

import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useRouter } from 'next/navigation';
import { CreditCard, Calendar, AlertTriangle, CheckCircle, Clock, Activity, FileText, Download, ShieldCheck, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { CancelSubscriptionButton } from '@/components/subscription/CancelSubscriptionButton';
import { Footer } from '@/components/layout/footer';

interface SubscriptionDashboardClientProps {
    activeSubscription: any;
    paymentHistory: any[];
    user: any;
    totalCount: number;
    currentPage: number;
}

export default function SubscriptionDashboardClient({
    activeSubscription,
    paymentHistory,
    user,
    totalCount,
    currentPage
}: SubscriptionDashboardClientProps) {
    const router = useRouter();
    const limit = 10;
    const totalPages = Math.ceil(totalCount / limit);

    // Helper to format date
    const formatDate = (date: any) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            router.push(`/dashboard/subscription?page=${newPage}`);
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="container mx-auto py-10 space-y-12 text-[#f5f5f5]"
            >
                {/* Page Header */}
                <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="px-3 py-1 rounded bg-[#151515] border border-white/5 shadow-neu-inset">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#666]">BILLING_PROTOCOL_v4.2</span>
                        </div>
                        <div className="flex-grow h-px bg-gradient-to-r from-white/5 via-white/5 to-transparent" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[#f5f5f5] uppercase mb-2">
                        Subscription <span className="text-[#6CA3A2] italic">Management</span>
                    </h1>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#555]">
                        Manage your current plan and billing history.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-12 items-start">
                    {/* Service Node Interface (Redesigned from Cards) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-12 xl:col-span-12"
                    >
                        <div className="relative overflow-hidden">
                            {/* Background Technical Grid Overlay */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

                            <div className="relative z-10">
                                {/* System Status Rail - Top Bar */}
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-[#151515] shadow-neu-inset border border-white/5">
                                        <div className={`w-2 h-2 rounded-full ${activeSubscription?.status === 'active' ? 'bg-[#6CA3A2] animate-pulse shadow-[0_0_10px_#6CA3A2]' : 'bg-[#FF8C42] shadow-[0_0_10px_#FF8C42]'}`} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6CA3A2]">Subscription Status: {activeSubscription?.status?.toUpperCase() || 'NO ACTIVE PLAN'}</span>
                                    </div>
                                    <div className="flex-grow h-px bg-gradient-to-r from-white/10 to-transparent" />
                                </div>

                                {activeSubscription ? (
                                    <div className="grid lg:grid-cols-12 gap-1 px-2">
                                        {/* Left Hero: The Core Allocation */}
                                        <div className="lg:col-span-12 lg:mb-12">
                                            <div className="flex flex-col md:flex-row items-end md:items-center gap-8">
                                                <div className="relative group">
                                                    <div className="absolute -inset-4 bg-[#6CA3A2]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <h2 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8]">
                                                        {activeSubscription.usageTier}
                                                    </h2>
                                                </div>

                                                <div className="flex flex-col gap-4 max-w-xs">
                                                    <div className="p-4 rounded-xl bg-[#151515] shadow-neu-inset border border-white/5">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#555] mb-2 leading-none">_Usage_Details</p>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-bold text-white uppercase tracking-tighter">Usage Overview</span>
                                                            <span className="text-[#6CA3A2] text-xs font-black">ACTIVE</span>
                                                        </div>
                                                        <div className="w-full h-1 bg-[#1a1a1a] rounded-full mt-2 overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: '99.8%' }}
                                                                className="h-full bg-[#6CA3A2]"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-[#444]">
                                                        <Zap className="w-4 h-4 text-[#FF8C42]" />
                                                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">Secure Subscription active</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Rails: Technical Data Slots */}
                                        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                                            {/* Cost Rail */}
                                            <div className="relative pl-8 border-l border-white/10 group">
                                                <div className="absolute left-[-1px] top-0 h-4 w-[1px] bg-[#6CA3A2]" />
                                                <div className="absolute left-[-1px] bottom-0 h-4 w-[1px] bg-[#6CA3A2]" />
                                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#444] mb-3 group-hover:text-[#6CA3A2] transition-colors leading-none">MONTHLY_PRICE</p>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-4xl font-black tracking-tighter text-white">₹{activeSubscription.amount}</span>
                                                    <span className="text-[10px] font-bold text-[#555] uppercase tracking-widest">/Month</span>
                                                </div>
                                                <p className="text-[8px] font-bold text-[#333] uppercase mt-2">Next Renewal Verified</p>
                                            </div>

                                            {/* Date Rail */}
                                            <div className="relative pl-8 border-l border-white/10 group">
                                                <div className="absolute left-[-1px] top-0 h-4 w-[1px] bg-[#6CA3A2]" />
                                                <div className="absolute left-[-1px] bottom-0 h-4 w-[1px] bg-[#6CA3A2]" />
                                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#444] mb-3 group-hover:text-[#6CA3A2] transition-colors leading-none">EXPIRY_DATE</p>
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="w-6 h-6 text-[#6CA3A2] opacity-50" />
                                                    <span className="text-4xl font-black tracking-tighter text-white uppercase">
                                                        {new Date(activeSubscription.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                    </span>
                                                </div>
                                                <p className="text-[8px] font-bold text-[#333] uppercase mt-2">End of current period</p>
                                            </div>

                                            {/* Status Rail */}
                                            <div className="relative pl-8 border-l border-white/10 group">
                                                <div className="absolute left-[-1px] top-0 h-4 w-[1px] bg-[#6CA3A2]" />
                                                <div className="absolute left-[-1px] bottom-0 h-4 w-[1px] bg-[#6CA3A2]" />
                                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#444] mb-3 group-hover:text-[#6CA3A2] transition-colors leading-none">PLAN_STATUS</p>
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-3">
                                                        <Activity className={`w-6 h-6 ${activeSubscription.status === 'active' ? 'text-[#6CA3A2]' : 'text-[#FF8C42]'}`} />
                                                        <span className={`text-4xl font-black tracking-tighter uppercase ${activeSubscription.status === 'active' ? 'text-white' : 'text-[#FF8C42] italic'}`}>
                                                            {activeSubscription.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-[8px] font-bold text-[#333] uppercase mt-2">Current Subscription Plan</p>
                                            </div>
                                        </div>

                                        {/* Decommissioning Logic Message - Integrated */}
                                        {activeSubscription.status === 'cancelled' && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="lg:col-span-12 mt-12 overflow-hidden border border-[#FF8C42]/30 rounded-2xl bg-[#FF8C42]/5 relative group"
                                            >
                                                <div className="absolute top-0 left-0 w-1 h-full bg-[#FF8C42] animate-pulse" />
                                                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                    <div className="flex items-start md:items-center gap-6">
                                                        <div className="w-12 h-12 rounded-xl bg-[#FF8C42]/10 border border-[#FF8C42]/20 flex items-center justify-center shrink-0">
                                                            <Activity className="w-6 h-6 text-[#FF8C42]" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#FF8C42]/70 mb-1 leading-none italic">_SUBSCRIPTION_CANCELLED_</p>
                                                            <p className="text-sm font-black text-white/90 uppercase tracking-tighter leading-tight">
                                                                Your subscription has been <span className="italic text-[#FF8C42]">cancelled</span>. You will still have access to your plan until <span className="text-[#6CA3A2]">{formatDate(activeSubscription.endDate)}</span>.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="hidden lg:block px-4 py-2 rounded bg-[#FF8C42]/10 border border-[#FF8C42]/20">
                                                        <span className="text-[9px] font-black text-[#FF8C42] uppercase tracking-widest">CANCELLED_PENDING_EXPIRY</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Action Footnote */}
                                        {activeSubscription.status === 'active' && (
                                            <div className="lg:col-span-12 mt-12 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/5 pt-10">
                                                <div className="flex items-center gap-10">
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] font-black text-[#333] uppercase tracking-widest leading-none">USER_ID</span>
                                                        <span className="text-[10px] font-mono text-[#555] uppercase leading-none mt-1">ID: {user?.id?.slice(-12).toUpperCase()}</span>
                                                    </div>
                                                    <div className="h-8 w-px bg-white/5 hidden md:block" />
                                                    <div className="hidden md:flex flex-col">
                                                        <span className="text-[8px] font-black text-[#333] uppercase tracking-widest leading-none">PLAN_REFERENCE</span>
                                                        <span className="text-[10px] font-mono text-[#555] uppercase leading-none mt-1">REF: {activeSubscription.usageTier}</span>
                                                    </div>
                                                </div>
                                                <CancelSubscriptionButton />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-24 text-center">
                                        <div className="w-24 h-24 rounded-full bg-[#1a1a1a] shadow-neu-raised border border-white/5 flex items-center justify-center mb-8 relative">
                                            <Activity className="w-10 h-10 text-[#6CA3A2]" />
                                            <div className="absolute inset-0 rounded-full border border-[#6CA3A2]/20 animate-ping" />
                                        </div>
                                        <h4 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">No Active Plan</h4>
                                        <p className="text-xs font-black text-[#444] uppercase tracking-[0.3em] max-w-sm mb-12">
                                            You don't have an active subscription at the moment.
                                        </p>
                                        <Button asChild className="h-16 px-16 rounded-full bg-gradient-to-br from-[#FF8C42] to-[#E67A33] text-white font-black uppercase tracking-[0.3em] text-[11px] shadow-neu-raised transition-all hover:scale-105 active:scale-95 border-none">
                                            <Link href="/#pricing">View Pricing Plans</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Telemetry Log Stream (Redesigned from Table/Card) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-12"
                    >
                        <div className="relative">
                            {/* Stream Header Control */}
                            <div className="flex items-center justify-between mb-10 px-4">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-full bg-[#151515] shadow-neu-inset border border-white/5 flex items-center justify-center text-[#6CA3A2]">
                                        <Clock className="w-6 h-6 animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-1">
                                            Payment History
                                        </h3>
                                        <p className="text-[10px] font-black text-[#444] uppercase tracking-[0.4em]">View and download your past invoices</p>
                                    </div>
                                </div>
                                <div className="hidden md:flex items-center gap-6 px-6 py-2 rounded-full bg-[#151515] shadow-neu-inset border border-white/5">
                                    <span className="text-[10px] font-black text-[#333] uppercase tracking-widest">Archive_Integrity: 100%</span>
                                    <div className="w-2 h-2 rounded-full bg-[#6CA3A2] shadow-[0_0_8px_#6CA3A2]" />
                                    <span className="text-[10px] font-black text-[#666] uppercase tracking-widest italic">TOTAL_NODES: {totalCount}</span>
                                </div>
                            </div>

                            {/* The Log Stream */}
                            <div className="space-y-4 relative">
                                {/* Vertical Diagnostic Rail */}
                                <div className="absolute left-[3.4rem] top-0 bottom-0 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent hidden md:block" />

                                {paymentHistory.length > 0 ? (
                                    <AnimatePresence mode="popLayout">
                                        {paymentHistory.map((payment, index) => (
                                            <motion.div
                                                key={payment._id.toString()}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.05 * index }}
                                                className="group relative flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-[2rem] hover:bg-[#151515]/30 transition-all border border-transparent hover:border-white/5"
                                            >
                                                {/* Rail Point Indicator */}
                                                <div className="hidden md:flex w-12 items-center justify-center relative z-10">
                                                    <div className={`w-3 h-3 rounded-full border-2 border-[#1a1a1a] shadow-sm transition-all group-hover:scale-125 ${payment.status === 'success' ? 'bg-[#6CA3A2]' : 'bg-[#FF8C42]'
                                                        }`} />
                                                </div>

                                                {/* Timestamp Rail */}
                                                <div className="flex flex-col min-w-[140px]">
                                                    <span className="text-xl font-black text-white tracking-tighter leading-none mb-1">
                                                        {new Date(payment.paymentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-[#444] uppercase tracking-widest">{new Date(payment.paymentDate).toLocaleTimeString()} IST</span>
                                                </div>

                                                {/* Diagnostic Data Block */}
                                                <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                                    <div className="md:col-span-4">
                                                        <div className="flex items-center gap-4 p-3 rounded-xl bg-[#151515] shadow-neu-inset border border-white/5">
                                                            <FileText className="w-5 h-5 text-[#6CA3A2] opacity-40" />
                                                            <div className="flex flex-col">
                                                                <span className="text-[8px] font-black text-[#333] uppercase leading-none mb-1">ORDER_ID</span>
                                                                <span className="text-[11px] font-mono text-[#888] tracking-wider uppercase">{payment.payuOrderId.slice(0, 16)}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="md:col-span-3">
                                                        <div className="flex flex-col">
                                                            <span className="text-[8px] font-black text-[#333] uppercase tracking-widest leading-none mb-2">AMOUNT</span>
                                                            <span className="text-2xl font-black tracking-tighter text-white">₹{payment.amount}</span>
                                                        </div>
                                                    </div>

                                                    <div className="md:col-span-3">
                                                        <div className="flex flex-col">
                                                            <span className="text-[8px] font-black text-[#333] uppercase tracking-widest leading-none mb-2">PAYMENT_STATUS</span>
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-1.5 h-1.5 rounded-full ${payment.status === 'success' ? 'bg-[#6CA3A2] shadow-[0_0_8px_#6CA3A2]' : 'bg-[#FF8C42] shadow-[0_0_8px_#FF8C42]'}`} />
                                                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${payment.status === 'success' ? 'text-[#6CA3A2]' : 'text-[#FF8C42] italic'}`}>
                                                                    {payment.status === 'success' ? 'SUCCESS' : 'FAILED'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="md:col-span-2 flex justify-end">
                                                        {payment.status === 'success' && payment.invoiceNumber && (
                                                            <Button
                                                                variant="ghost"
                                                                className="h-12 w-full md:w-12 p-0 rounded-2xl bg-[#1a1a1a] shadow-neu-raised border border-white/5 text-[#FF8C42] hover:shadow-neu-inset transition-all active:scale-95 flex items-center justify-center group/dl"
                                                                asChild
                                                            >
                                                                <a href={`/api/invoice/${payment.invoiceNumber}/download`} target="_blank" rel="noopener noreferrer">
                                                                    <Download className="w-5 h-5 group-hover/dl:translate-y-0.5 transition-transform" />
                                                                </a>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                ) : (
                                    <div className="text-center py-32 rounded-[3rem] bg-[#151515]/20 border border-dashed border-white/5">
                                        <Activity className="w-12 h-12 text-[#222] mx-auto mb-6" />
                                        <p className="text-[12px] font-black text-[#333] uppercase tracking-[0.5em]">No payment records found.</p>
                                    </div>
                                )}
                            </div>

                            {/* Stream Pagination Control */}
                            {totalPages > 1 && (
                                <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="px-5 py-2 rounded-full bg-[#151515] border border-white/5 shadow-neu-inset">
                                            <span className="text-[10px] font-black text-white/50 uppercase italic tracking-widest lowercase">
                                                _Stream_Page_ <span className="text-white text-lg mx-2">{currentPage.toString().padStart(2, '0')}</span> _of_ <span className="text-white text-lg mx-2">{totalPages.toString().padStart(2, '0')}</span>
                                            </span>
                                        </div>
                                        <div className="hidden lg:block h-px w-24 bg-white/5" />
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <Button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="h-14 w-14 rounded-2xl bg-[#1a1a1a] shadow-neu-raised border border-white/5 text-[#666] hover:text-[#6CA3A2] disabled:opacity-10 hover:shadow-neu-inset transition-all"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </Button>

                                        <div className="flex gap-2">
                                            {[...Array(totalPages)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${currentPage === i + 1 ? 'bg-[#6CA3A2] shadow-[0_0_10px_#6CA3A2] scale-125' : 'bg-[#222]'
                                                        }`}
                                                />
                                            ))}
                                        </div>

                                        <Button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="h-14 w-14 rounded-2xl bg-[#1a1a1a] shadow-neu-raised border border-white/5 text-[#666] hover:text-[#6CA3A2] disabled:opacity-10 hover:shadow-neu-inset transition-all"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <div className="mt-16 py-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                                <span className="text-[9px] font-black text-[#333] uppercase font-mono tracking-[0.4em]">SECURE_PAYMENT_HISTORY: VERIFIED</span>
                                <span className="text-[9px] font-black text-[#222] uppercase font-mono tracking-[0.4em]">DATA_ENCRYPTION: AES-256</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
            <Footer />
        </>
    );
}
