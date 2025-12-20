import Link from 'next/link';
import { CheckCircle, ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuccessPageProps {
    searchParams: Promise<{
        txnid?: string;
        plan?: string;
    }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
    const { txnid, plan } = await searchParams;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#1a1a1a] px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-md text-center">
                <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-[-6px_-6px_16px_rgba(70,70,70,0.3),6px_6px_16px_rgba(0,0,0,0.8)]">
                        <CheckCircle className="h-12 w-12 text-[#6CA3A2]" />
                    </div>
                </div>

                <h2
                    className="mt-8 text-3xl font-extrabold text-[#f5f5f5]"
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
                >
                    Payment Successful!
                </h2>

                <div className="mt-2 text-sm text-[#999]">
                    <p>Thank you for subscribing{plan ? ` to the ${plan} plan` : ''}.</p>
                    {txnid && <p className="mt-1 font-mono text-xs">Transaction ID: {txnid}</p>}
                </div>

                <div className="mt-8 rounded-3xl bg-[#1a1a1a] p-8 shadow-[-12px_-12px_24px_rgba(70,70,70,0.3),12px_12px_24px_rgba(0,0,0,0.7)] border border-[#2a2a2a]/20">
                    <p className="text-[#c0c0c0]">
                        Your subscription is now active. You have full access to all features included in your plan.
                    </p>

                    <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 text-center justify-center">
                        <Button
                            className="h-12 rounded-2xl bg-gradient-to-br from-[#FF8C42] to-[#E67A33] text-white shadow-[-4px_-4px_12px_rgba(70,70,70,0.3),4px_4px_12px_rgba(0,0,0,0.7)] border-none hover:opacity-90 transition-all font-semibold"
                            asChild
                        >
                            <Link href="/chat">
                                Start Chatting <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>

                        <Button
                            variant="outline"
                            className="h-12 rounded-2xl border-[#333] bg-[#1a1a1a] text-[#c0c0c0] hover:bg-[#222] hover:text-white"
                            asChild
                        >
                            <Link href="/dashboard/subscription">
                                View Subscription
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="mt-8">
                    <Button variant="ghost" size="sm" className="text-[#6CA3A2] hover:text-[#5a9493] hover:bg-transparent" asChild>
                        <Link href="/dashboard/subscription">
                            <Download className="mr-2 h-4 w-4" /> Download Invoice
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
