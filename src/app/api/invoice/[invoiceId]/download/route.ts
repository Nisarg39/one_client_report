
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/adapter';
import { connectDB } from '@/lib/db';
import PaymentHistoryModel from '@/models/PaymentHistory';
import { generateInvoice } from '@/lib/invoice/generate';
import UserModel from '@/models/User';

interface RouteParams {
    params: Promise<{
        invoiceId: string;
    }>;
}

export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        // 1. Authenticate user
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { invoiceId } = await params;

        if (!invoiceId) {
            return NextResponse.json(
                { success: false, error: 'Invoice ID is required' },
                { status: 400 }
            );
        }

        // 2. Connect to DB and fetch payment record
        await connectDB();

        const payment = await PaymentHistoryModel.findOne({
            invoiceNumber: invoiceId,
            userId: user.id
        });

        if (!payment) {
            return NextResponse.json(
                { success: false, error: 'Invoice not found' },
                { status: 404 }
            );
        }

        // 3. Fetch user details for invoice (if needed)
        const userDetails = await UserModel.findById(user.id);

        // 4. Generate Invoice PDF
        const invoiceData = {
            invoiceNumber: payment.invoiceNumber,
            customerName: userDetails?.name || 'Customer',
            customerEmail: userDetails?.email || user.email,
            amount: payment.amount,
            date: payment.paymentDate,
            planName: 'Pro Plan', // You might want to store/fetch plan name dynamically if possible, falling back to generic
            paymentMethod: payment.paymentMethod || 'PayU',
            transactionId: payment.payuTransactionId,
        };

        // If we stored plan/product info in payment history, use it. 
        // For now, inferred or generic based on amount could work, or update PaymentHistory to store 'productInfo'
        // Let's check payment.responseData or just fallback for now.
        if (payment.amount === 299) invoiceData.planName = 'Professional Plan';
        if (payment.amount === 999) invoiceData.planName = 'Agency Plan';


        const pdfBuffer = await generateInvoice(invoiceData);

        // 5. Return PDF
        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        headers.set('Content-Disposition', `attachment; filename=${invoiceId}.pdf`);
        headers.set('Content-Length', pdfBuffer.length.toString());

        return new NextResponse(new Uint8Array(pdfBuffer), {
            status: 200,
            headers,
        });

    } catch (error: any) {
        console.error('[Invoice Download] Error:', error);
        return NextResponse.json(
            { success: false, error: `Failed to download: ${error?.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}
