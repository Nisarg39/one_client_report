import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/adapter';
import PayuCheckout from '@/components/payment/PayuCheckout';
import { Check } from 'lucide-react';

interface SubscribePageProps {
    params: Promise<{
        plan: string;
    }>;
}

export default async function SubscribePage({ params }: SubscribePageProps) {
    const user = await getCurrentUser();
    const { plan: rawPlan } = await params;

    if (!user) {
        redirect('/auth/signin?callbackUrl=/subscribe/' + rawPlan);
    }

    const plan = rawPlan.toLowerCase();

    // Validate plan
    if (plan !== 'professional' && plan !== 'agency') {
        // Enterprise handles differently (contact form), others are invalid
        if (plan === 'enterprise') {
            redirect('/#get-in-touch');
        }
        notFound();
    }

    const isProfessional = plan === 'professional';
    const planName = isProfessional ? 'Professional' : 'Agency';
    const price = isProfessional ? '299' : '999';

    const features = isProfessional
        ? [
            'Up to 10 Client Profiles',
            '150 AI Messages / Day',
            'Advanced Analytics',
            'Priority Support',
            'Export to PDF'
        ]
        : [
            'Up to 25 Client Profiles',
            '300 AI Messages / Day',
            'White-label Reports',
            'API Access',
            'Dedicated Account Manager'
        ];

    return (
        <div className="min-h-screen bg-[#1a1a1a] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <div className="text-center mb-12">
                    <h1
                        className="text-3xl font-extrabold text-[#f5f5f5] sm:text-4xl"
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}
                    >
                        Upgrade to {planName}
                    </h1>
                    <p
                        className="mt-4 text-lg text-[#c0c0c0]"
                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                    >
                        Complete your subscription to unlock premium features.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Plan Details */}
                    {/* Plan Details */}
                    <div className="overflow-hidden rounded-3xl bg-[#1a1a1a] shadow-[-12px_-12px_24px_rgba(70,70,70,0.3),12px_12px_24px_rgba(0,0,0,0.7)] border border-[#2a2a2a]/20">
                        <div className="p-8">
                            <h2 className="text-xl font-bold text-[#f5f5f5] mb-6 border-b border-[#333] pb-4">Order Summary</h2>
                            <div className="flex items-baseline">
                                <span className="text-5xl font-black tracking-tight text-[#f5f5f5]" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
                                    ₹{price}
                                </span>
                                <span className="ml-1 text-xl font-medium text-[#999]">/month</span>
                            </div>
                            <p className="mt-2 text-sm text-[#999]">
                                Billed monthly. Cancel anytime.
                            </p>

                            <div className="mt-8">
                                <h3 className="text-sm font-semibold text-[#f5f5f5] uppercase tracking-wider mb-4">What layout included:</h3>
                                <ul className="space-y-4">
                                    {features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <div className="flex-shrink-0 mt-0.5">
                                                <div className="w-5 h-5 rounded-full bg-[#151515] flex items-center justify-center shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(60,60,60,0.3)]">
                                                    <Check className="h-3 w-3 text-[#6CA3A2] stroke-[3]" aria-hidden="true" />
                                                </div>
                                            </div>
                                            <p className="ml-3 text-sm font-medium text-[#c0c0c0]">{feature}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div className="flex flex-col justify-center">
                        <PayuCheckout
                            plan={plan as 'professional' | 'agency'}
                            user={{
                                name: user.name || '',
                                email: user.email || '',
                            }}
                        />
                        <div className="mt-6 text-center text-xs text-[#666]">
                            <p>By subscribing, you agree to our Terms of Service and Privacy Policy.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
