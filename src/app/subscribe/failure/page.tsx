import Link from 'next/link';
import { XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FailurePageProps {
    searchParams: Promise<{
        error?: string;
        txnid?: string;
        status?: string;
    }>;
}

export default async function FailurePage({ searchParams }: FailurePageProps) {
    const { error, txnid } = await searchParams;

    let errorMessage = "We couldn't process your payment.";
    if (error === 'payment_failed') errorMessage = "The payment transaction failed.";
    if (error === 'invalid_hash') errorMessage = "Security verification failed.";
    if (error === 'user_not_found') errorMessage = "User account issue identified.";

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#1a1a1a] px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-md text-center">
                <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-[-6px_-6px_16px_rgba(70,70,70,0.3),6px_6px_16px_rgba(0,0,0,0.8)]">
                        <XCircle className="h-12 w-12 text-[#ef4444]" />
                    </div>
                </div>

                <h2
                    className="mt-8 text-3xl font-extrabold text-[#f5f5f5]"
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
                >
                    Payment Failed
                </h2>

                <div className="mt-2 text-sm text-[#999]">
                    <p>{errorMessage}</p>
                    {txnid && <p className="mt-1 font-mono text-xs">Transaction ID: {txnid}</p>}
                </div>

                <div className="mt-8 rounded-3xl bg-[#1a1a1a] p-8 shadow-[-12px_-12px_24px_rgba(70,70,70,0.3),12px_12px_24px_rgba(0,0,0,0.7)] border border-[#2a2a2a]/20">
                    <p className="text-[#c0c0c0]">
                        Don't worry, you haven't been charged. You can try again or contact support if the issue persists.
                    </p>

                    <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 text-center justify-center">
                        <Button
                            className="h-12 rounded-2xl bg-gradient-to-br from-[#FF8C42] to-[#E67A33] text-white shadow-[-4px_-4px_12px_rgba(70,70,70,0.3),4px_4px_12px_rgba(0,0,0,0.7)] border-none hover:opacity-90 transition-all font-semibold"
                            asChild
                        >
                            <Link href="/#pricing">
                                <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                            </Link>
                        </Button>

                        <Button
                            variant="outline"
                            className="h-12 rounded-2xl border-[#333] bg-[#1a1a1a] text-[#c0c0c0] hover:bg-[#222] hover:text-white"
                            asChild
                        >
                            <Link href="/contact">
                                Contact Support
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
