'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { AlertCircle, Loader2 } from 'lucide-react';
import { cancelSubscription } from '@/app/actions/subscription/cancelSubscription';
import { useToast } from '@/components/ui/use-toast';

export function CancelSubscriptionButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleCancel = async () => {
        setIsLoading(true);
        try {
            const result = await cancelSubscription();

            if (result.success && result.endDate) {
                const endDate = new Date(result.endDate).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                toast({
                    title: "Subscription Cancelled",
                    description: `Your subscription will remain active until ${endDate}. You will not be charged again.`,
                });
                setIsOpen(false);
                // Refresh page to show updated status
                window.location.reload();
            } else {
                toast({
                    title: "Error",
                    description: result.error || "Failed to cancel subscription",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="h-10 px-6 rounded-xl bg-[#1a1a1a] shadow-neu-raised border border-white/5 text-red-500 font-black uppercase italic tracking-widest text-[10px] hover:shadow-neu-inset transition-all active:scale-95"
                >
                    Termination_Node
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1a1a1a] border border-white/5 shadow-neu-raised text-[#f5f5f5] rounded-[2rem] max-w-md p-0 overflow-hidden">
                <div className="p-8 border-b border-white/5 bg-[#151515]/30 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] shadow-neu-inset border border-white/5 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-black text-white uppercase tracking-tighter italic leading-none mb-1">
                            Cancel Protocol?
                        </DialogTitle>
                        <p className="text-[9px] font-bold text-[#555] uppercase tracking-widest leading-none">ID: TERMINATION_AUTHORIZATION_v1</p>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <DialogDescription className="text-[11px] font-black uppercase italic tracking-widest text-[#666] leading-relaxed">
                        Are you certain you wish to terminate the active commercial synchronization? You will retain all system privileges until the end of the current billing cycle. Automatic renewal will be <span className="text-red-500">deactivated</span>.
                    </DialogDescription>

                    <div className="p-4 rounded-xl bg-[#151515] border border-white/5 shadow-neu-inset">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_red]" />
                            <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Awaiting_Final_Confirmation...</span>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-8 bg-[#151515]/50 border-t border-white/5 flex gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => setIsOpen(false)}
                        disabled={isLoading}
                        className="flex-1 h-12 rounded-xl bg-[#1a1a1a] shadow-neu-raised border border-white/5 text-[#f5f5f5] font-black uppercase italic tracking-widest text-[10px] hover:shadow-neu-inset transition-all"
                    >
                        Abort_Cancellation
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="flex-1 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-white font-black uppercase italic tracking-widest text-[10px] shadow-neu-raised transition-all active:scale-95 disabled:opacity-40 border-none"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Transmitting...
                            </>
                        ) : (
                            'Confirm_Shutdown'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
