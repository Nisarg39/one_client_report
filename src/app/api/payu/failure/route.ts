/**
 * PayU Failure Callback API
 *
 * POST /api/payu/failure
 *
 * Handles failed payment callback from PayU (browser redirect)
 * Logs failure details and creates payment history record
 */

import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import PaymentHistoryModel from '@/models/PaymentHistory';
import { getPayUConfig } from '@/lib/payu/config';
import { verifyResponseHash } from '@/lib/payu/hash';

/**
 * POST /api/payu/failure
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parse form data from PayU
    const formData = await request.formData();

    // Extract all PayU response fields
    const mihpayid = formData.get('mihpayid') as string; // PayU transaction ID
    const mode = formData.get('mode') as string; // Payment mode (UPI, Card, etc.)
    const status = formData.get('status') as string; // Payment status (failed)
    const key = formData.get('key') as string;
    const txnid = formData.get('txnid') as string;
    const amount = formData.get('amount') as string;
    const productinfo = formData.get('productinfo') as string;
    const firstname = formData.get('firstname') as string;
    const email = formData.get('email') as string;
    const hash = formData.get('hash') as string;

    // UDF fields (custom data we sent)
    const udf1 = formData.get('udf1') as string; // userId
    const udf2 = formData.get('udf2') as string; // plan name
    const udf3 = formData.get('udf3') as string; // orderId
    const udf4 = formData.get('udf4') as string; // tier

    // Error information
    const error = formData.get('error') as string;
    const error_Message = formData.get('error_Message') as string;
    const field9 = formData.get('field9') as string; // Error code

    console.log('[PayU Failure] Callback received:', {
      mihpayid,
      txnid,
      status,
      error,
      error_Message,
    });

    // 2. Verify hash (optional for failures, but good practice)
    const payuConfig = getPayUConfig();

    const isValidHash = verifyResponseHash({
      key,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      status,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5: '',
      salt: payuConfig.merchantSalt,
      hash,
    });

    if (!isValidHash) {
      console.warn('[PayU Failure] Hash verification failed for failure callback');
      // Still redirect to failure page (hash verification less critical for failures)
    }

    // 3. Extract user ID and order details from UDF fields
    const userId = udf1;
    const planName = udf2;
    const orderId = udf3;

    // 4. Connect to database
    await connectDB();

    // 5. Check if transaction already logged
    if (mihpayid) {
      const isProcessed = await PaymentHistoryModel.isTransactionProcessed(mihpayid);

      if (isProcessed) {
        console.log('[PayU Failure] Transaction already logged:', mihpayid);
        // Redirect to failure page
        return redirect(
          `/subscribe/failure?txnid=${txnid}&error=${encodeURIComponent(error_Message || error || 'payment_failed')}`
        );
      }
    }

    // 6. Create payment history record for failed payment
    if (userId && orderId && mihpayid) {
      try {
        await PaymentHistoryModel.createPaymentRecord({
          userId,
          payuOrderId: orderId,
          payuTransactionId: mihpayid || `FAILED_${txnid}`, // Fallback if no mihpayid
          amount: parseFloat(amount) || 0,
          status: 'failed',
          paymentMethod: mode,
          paymentDate: new Date(),
          failureReason: error_Message || error || 'Payment failed',
          errorCode: field9,
          responseData: {
            mihpayid,
            mode,
            status,
            txnid,
            error,
            error_Message,
            field9,
          },
        });

        console.log('[PayU Failure] Failed payment logged');
      } catch (dbError: any) {
        console.error('[PayU Failure] Error logging failed payment:', dbError);
        // Continue to redirect even if logging fails
      }
    }

    // 7. Redirect to failure page with error details
    const errorMessage = error_Message || error || 'payment_failed';
    const errorParams = new URLSearchParams({
      txnid: txnid || '',
      error: errorMessage,
      plan: planName || '',
    });

    return redirect(`/subscribe/failure?${errorParams.toString()}`);
  } catch (error: any) {
    console.error('[PayU Failure] Error processing failure callback:', error);

    // Redirect to failure page with generic error
    return redirect(`/subscribe/failure?error=processing_error`);
  }
}

/**
 * GET method - redirect to homepage
 */
export async function GET() {
  return redirect('/');
}
