
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/adapter';
import { connectDB } from '@/lib/db';
import SubscriptionModel from '@/models/Subscription';
import PaymentHistoryModel from '@/models/PaymentHistory';
import SubscriptionDashboardClient from '@/components/dashboard/SubscriptionDashboardClient';

export const dynamic = 'force-dynamic';

export default async function SubscriptionDashboard({
    searchParams
}: {
    searchParams: { page?: string }
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/auth/signin?callbackUrl=/dashboard/subscription');
    }

    await connectDB();

    const page = parseInt(searchParams.page || '1', 10);
    const limit = 10;

    const activeSubscription = await SubscriptionModel.getActiveSubscription(user.id);
    const paymentHistory = await PaymentHistoryModel.getUserPaymentHistory(user.id, page, limit);
    const totalPayments = await PaymentHistoryModel.countUserPayments(user.id);

    return (
        <SubscriptionDashboardClient
            activeSubscription={activeSubscription ? JSON.parse(JSON.stringify(activeSubscription)) : null}
            paymentHistory={paymentHistory ? JSON.parse(JSON.stringify(paymentHistory)) : []}
            totalCount={totalPayments}
            currentPage={page}
            user={{ id: user.id }}
        />
    );
}
