'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface PayuCheckoutProps {
  plan: 'professional' | 'agency';
  user: {
    name: string;
    email: string;
    phone?: string;
  };
}

declare global {
  interface Window {
    payu: any;
    Bolt: any;
  }
}

export default function PayuCheckout({ plan, user }: PayuCheckoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [payuLoaded, setPayuLoaded] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(user.phone || '');
  const [showPhoneInput, setShowPhoneInput] = useState(!user.phone);

  // Determine PayU URL based on environment (handled by script loader usually, but for Bolt we need the script)
  // For Checkout Plus, we often use the bolt script. 
  // NOTE: In a real scenario, we'd check if we are in test or prod to load the correct script.
  // Using test script for now as per requirements.
  const payuScriptUrl = 'https://jssdk.payu.in/bolt/bolt.min.js'; // Production URL often works for test with test keys, but let's check.
  // Actually documentation says: https://jssdk.payu.in/bolt/bolt.min.js for both envs.
  // The mode (test/prod) depends on the key/salt used.

  const initiatePayment = async () => {
    if (!payuLoaded) {
      toast.error('Payment gateway implementation not loaded yet. Please refresh.');
      return;
    }

    if (!phoneNumber) {
      toast.error('Please enter your phone number to proceed');
      setShowPhoneInput(true);
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on server
      const response = await fetch('/api/payu/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan, phone: phoneNumber }),
      });
      // ... rest of the function remains same until catch block
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to create order');
      }

      const order = data.data;

      // 2. Launch PayU Bolt
      // @ts-ignore
      if (typeof window.bolt === 'undefined') {
        throw new Error('PayU Bolt SDK not loaded');
      }

      const paymentData = {
        key: order.key,
        txnid: order.txnid,
        hash: order.hash,
        amount: order.amount,
        firstname: order.firstname,
        email: order.email,
        phone: order.phone,
        productinfo: order.productinfo,
        surl: order.surl,
        furl: order.furl,
        mode: 'dropout', // 'dropout' for modal (Checkout Plus)
        udf1: order.udf1,
        udf2: order.udf2,
        udf3: order.udf3,
        udf4: order.udf4,
        udf5: order.udf5,
      };

      console.log('Launching PayU Bolt with:', paymentData);

      // @ts-ignore
      window.bolt.launch(paymentData, {
        responseHandler: function (BOLT: any) {
          console.log('Bolt Response:', BOLT);

          if (BOLT.response.txnStatus === 'SUCCESS') {
            // Payment successful
            toast.success('Payment successful! Verifying...');
          } else {
            // Payment failed or cancelled
            toast.error('Payment failed or cancelled.');
          }
        },
        catchException: function (BOLT: any) {
          console.error('Bolt Exception:', BOLT);
          toast.error('Payment system error. Please try again.');
        }
      });

    } catch (error: any) {
      console.error('Payment initiation error:', error);
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://jssdk.payu.in/bolt/bolt.min.js"
        strategy="lazyOnload"
        onLoad={() => setPayuLoaded(true)}
      />

      <div className="rounded-3xl bg-[#1a1a1a] p-6 sm:p-8 shadow-[-12px_-12px_24px_rgba(70,70,70,0.3),12px_12px_24px_rgba(0,0,0,0.7)] border-none">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#f5f5f5]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
            Secure Payment
          </h3>
          <ShieldCheck className="h-6 w-6 text-[#6CA3A2]" />
        </div>

        <div className="space-y-6">
          <div className="rounded-xl bg-[#151515] p-5 shadow-[inset_6px_6px_12px_rgba(0,0,0,0.5),inset_-6px_-6px_12px_rgba(40,40,40,0.3)]">
            <div className="flex justify-between text-base">
              <span className="text-[#999]">Plan</span>
              <span className="font-semibold capitalize text-[#f5f5f5]">{plan}</span>
            </div>
            <div className="mt-3 flex justify-between text-base">
              <span className="text-[#999]">Total Amount</span>
              <span className="font-bold text-[#f5f5f5] text-xl">₹{plan === 'professional' ? '299' : '999'}</span>
            </div>
          </div>

          {/* Simple Phone Input if missing */}
          <div>
            <label className="block text-sm text-[#999] mb-1 pl-1">Phone Number (Required)</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full h-12 rounded-xl bg-[#151515] border border-[#333] px-4 text-[#f5f5f5] placeholder-[#666] focus:outline-none focus:border-[#FF8C42] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6)]"
            />
          </div>

          <Button
            className="w-full h-14 rounded-3xl text-base font-bold bg-gradient-to-br from-[#FF8C42] to-[#E67A33] text-white shadow-[-6px_-6px_16px_rgba(70,70,70,0.4),6px_6px_16px_rgba(0,0,0,0.8),inset_-2px_-2px_6px_rgba(0,0,0,0.3),inset_2px_2px_6px_rgba(255,140,66,0.3)] hover:shadow-[-4px_-4px_12px_rgba(70,70,70,0.5),4px_4px_12px_rgba(0,0,0,0.9),inset_-2px_-2px_6px_rgba(0,0,0,0.3),inset_2px_2px_6px_rgba(255,140,66,0.4)] active:shadow-[inset_4px_4px_12px_rgba(0,0,0,0.6),inset_-4px_-4px_12px_rgba(60,60,60,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0.5 border-none"
            size="lg"
            onClick={initiatePayment}
            disabled={loading || !payuLoaded}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-5 w-5" />
                Pay Now
              </>
            )}
          </Button>

          <p className="text-center text-xs text-[#666] flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" /> Secured by PayU. 128-bit SSL Encrypted.
          </p>
        </div>
      </div>
    </>
  );
}
