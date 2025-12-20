/**
 * PayU Webhook Handler
 *
 * POST /api/payu/webhook
 *
 * Handles server-to-server payment confirmation from PayU
 * More reliable than browser redirect (handles cases where user closes browser)
 * Implements idempotency to prevent duplicate processing
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import UserModel from '@/models/User';
import SubscriptionModel from '@/models/Subscription';
import PaymentHistoryModel from '@/models/PaymentHistory';
import { getPayUConfig } from '@/lib/payu/config';
import { verifyResponseHash } from '@/lib/payu/hash';
import { generateInvoice } from '@/lib/invoice/generate';
import { sendEmail, getSubscriptionSuccessEmailHtml } from '@/lib/email/send';

/**
 * POST /api/payu/webhook
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parse JSON payload from PayU webhook
    let webhookData: any;

    try {
      // PayU webhooks can send either JSON or form data
      const contentType = request.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        webhookData = await request.json();
      } else {
        // Parse as form data
        const formData = await request.formData();
        webhookData = Object.fromEntries(formData.entries());
      }
    } catch (parseError) {
      console.error('[PayU Webhook] Error parsing payload:', parseError);
      return NextResponse.json(
        { status: 'error', message: 'Invalid payload' },
        { status: 400 }
      );
    }

    // 2. Extract webhook data
    const {
      mihpayid, // PayU transaction ID
      mode, // Payment mode
      status, // Payment status
      key,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      hash,
      udf1, // userId
      udf2, // plan name
      udf3, // orderId
      udf4, // tier
      bankcode,
      cardnum,
      name_on_card,
      error,
      error_Message,
    } = webhookData;

    console.log('[PayU Webhook] Received:', {
      mihpayid,
      txnid,
      status,
      amount,
      mode,
    });

    // 3. Verify hash to ensure webhook is from PayU
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
      udf5: webhookData.udf5 || '',
      salt: payuConfig.merchantSalt,
      hash,
    });

    if (!isValidHash) {
      console.error('[PayU Webhook] Hash verification failed!');
      return NextResponse.json(
        { status: 'error', message: 'Invalid hash' },
        { status: 401 }
      );
    }

    // 4. Check if payment status is success
    if (status !== 'success') {
      console.log('[PayU Webhook] Non-success status:', status);

      // Log failed payment
      await connectDB();

      const userId = udf1;
      const orderId = udf3;

      if (userId && orderId && mihpayid) {
        const isProcessed = await PaymentHistoryModel.isTransactionProcessed(mihpayid);

        if (!isProcessed) {
          await PaymentHistoryModel.createPaymentRecord({
            userId,
            payuOrderId: orderId,
            payuTransactionId: mihpayid,
            amount: parseFloat(amount) || 0,
            status: 'failed',
            paymentMethod: mode,
            paymentDate: new Date(),
            failureReason: error_Message || error || 'Payment failed',
            responseData: webhookData,
          });

          console.log('[PayU Webhook] Failed payment logged');
        }
      }

      return NextResponse.json(
        { status: 'success', message: 'Webhook processed (payment failed)' },
        { status: 200 }
      );
    }

    // 5. Connect to database
    await connectDB();

    // 6. Check for duplicate transaction (idempotency)
    const isProcessed = await PaymentHistoryModel.isTransactionProcessed(mihpayid);

    if (isProcessed) {
      console.log('[PayU Webhook] Transaction already processed:', mihpayid);
      return NextResponse.json(
        { status: 'success', message: 'Already processed' },
        { status: 200 }
      );
    }

    // 7. Extract user ID, plan, and order ID from UDF fields
    const userId = udf1;
    const planName = udf2;
    const orderId = udf3;
    const tier = udf4 as 'professional' | 'agency' | 'enterprise';

    if (!userId || !planName || !orderId) {
      console.error('[PayU Webhook] Missing UDF data:', { userId, planName, orderId });
      return NextResponse.json(
        { status: 'error', message: 'Missing UDF data' },
        { status: 400 }
      );
    }

    // 8. Get user from database
    const user = await UserModel.findById(userId);

    if (!user) {
      console.error('[PayU Webhook] User not found:', userId);
      return NextResponse.json(
        { status: 'error', message: 'User not found' },
        { status: 404 }
      );
    }

    // 9. Create subscription
    const subscription = await SubscriptionModel.createSubscription({
      userId: user._id,
      usageTier: tier,
      payuOrderId: orderId,
      payuTransactionId: mihpayid,
      amount: parseFloat(amount),
    });

    console.log('[PayU Webhook] Subscription created:', subscription._id);

    // 10. Update user with subscription details
    user.currentSubscriptionId = subscription._id;
    user.subscriptionStatus = 'active';
    user.subscriptionEndDate = subscription.endDate;
    user.usageTier = tier === 'professional' ? 'pro' : tier; // Map tier to usageTier
    user.hasUsedTrial = true;

    // Update restrictions based on tier
    const tierRestrictions = UserModel.getTierRestrictions(user.usageTier);
    user.restrictions = tierRestrictions;

    await user.save();

    console.log('[PayU Webhook] User updated:', user._id);

    // 11. Create payment history record
    await PaymentHistoryModel.createPaymentRecord({
      userId: user._id,
      subscriptionId: subscription._id,
      payuOrderId: orderId,
      payuTransactionId: mihpayid,
      amount: parseFloat(amount),
      status: 'success',
      paymentMethod: mode,
      paymentDate: new Date(),
      responseData: {
        mihpayid,
        mode,
        status,
        txnid,
        bankcode,
        cardnum,
        name_on_card,
      },
    });


    // 12. Generate Invoice & Send Email (Async, don't block webhook response)
    // We do this in background to return 200 OK fast to PayU
    (async () => {
      try {
        console.log('[PayU Webhook] Starting background invoice/email task');
        const invoiceData = {
          invoiceNumber: `INV-${Date.now()}`,
          customerName: firstname,
          customerEmail: email,
          amount: parseFloat(amount),
          date: new Date(),
          planName: productinfo,
          paymentMethod: mode || 'PayU',
          transactionId: txnid,
        };

        const invoiceBuffer = await generateInvoice(invoiceData);

        const emailHtml = getSubscriptionSuccessEmailHtml(firstname, productinfo, parseFloat(amount));
        await sendEmail({
          to: email,
          subject: `Payment Successful - ${productinfo}`,
          html: emailHtml,
          attachments: [
            {
              filename: `Invoice-${txnid}.pdf`,
              content: invoiceBuffer,
            },
          ],
        });
        console.log('[PayU Webhook] Background email task completed');
      } catch (bgError) {
        console.error('[PayU Webhook] Background task failed:', bgError);
      }
    })();

    // 13. Return success response to PayU
    return NextResponse.json(
      {
        status: 'success',
        message: 'Webhook processed successfully',
        txnid,
        mihpayid,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[PayU Webhook] Error processing webhook:', error);

    // Return 500 error - PayU will retry
    return NextResponse.json(
      {
        status: 'error',
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET method - not allowed
 */
export async function GET() {
  return NextResponse.json(
    { status: 'error', message: 'Method not allowed' },
    { status: 405 }
  );
}
