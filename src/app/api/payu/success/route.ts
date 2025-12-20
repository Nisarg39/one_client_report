/**
 * PayU Success Callback API
 *
 * POST /api/payu/success
 *
 * Handles successful payment callback from PayU (browser redirect)
 * Verifies hash, creates subscription, updates user, creates payment history
 */

import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import UserModel from '@/models/User';
import SubscriptionModel from '@/models/Subscription';
import PaymentHistoryModel from '@/models/PaymentHistory';
import { getPayUConfig } from '@/lib/payu/config';
import { verifyResponseHash } from '@/lib/payu/hash';
import { generateInvoice } from '@/lib/invoice/generate';
import { sendEmail, getSubscriptionSuccessEmailHtml } from '@/lib/email/send';

/**
 * POST /api/payu/success
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parse form data from PayU
    const formData = await request.formData();

    // Extract all PayU response fields
    const mihpayid = formData.get('mihpayid') as string; // PayU transaction ID
    const mode = formData.get('mode') as string; // Payment mode (UPI, Card, etc.)
    const status = formData.get('status') as string; // Payment status
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

    // Additional fields
    const bankcode = formData.get('bankcode') as string;
    const cardnum = formData.get('cardnum') as string;
    const name_on_card = formData.get('name_on_card') as string;
    const error = formData.get('error') as string;
    const error_Message = formData.get('error_Message') as string;

    console.log('[PayU Success] Callback received:', {
      mihpayid,
      txnid,
      status,
      amount,
      mode,
    });

    // 2. Verify hash to ensure request is from PayU
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
      console.error('[PayU Success] Hash verification failed!');
      // Redirect to failure page
      return redirect(
        `/subscribe/failure?error=invalid_hash&txnid=${txnid}`
      );
    }

    // 3. Check if payment status is success
    if (status !== 'success') {
      console.error('[PayU Success] Payment not successful:', status);
      return redirect(
        `/subscribe/failure?error=payment_failed&status=${status}&txnid=${txnid}`
      );
    }

    // 4. Connect to database
    await connectDB();

    // 5. Check for duplicate transaction (idempotency)
    const isProcessed = await PaymentHistoryModel.isTransactionProcessed(mihpayid);

    if (isProcessed) {
      console.log('[PayU Success] Transaction already processed:', mihpayid);
      // Redirect to success page (already processed)
      return redirect(`/subscribe/success?txnid=${txnid}`);
    }

    // 6. Extract user ID, plan, and order ID from UDF fields
    const userId = udf1;
    const planName = udf2;
    const orderId = udf3;
    const tier = udf4 as 'professional' | 'agency' | 'enterprise';

    if (!userId || !planName || !orderId) {
      console.error('[PayU Success] Missing UDF data:', { userId, planName, orderId });
      return redirect(
        `/subscribe/failure?error=invalid_data&txnid=${txnid}`
      );
    }

    // 7. Get user from database
    const user = await UserModel.findById(userId);

    if (!user) {
      console.error('[PayU Success] User not found:', userId);
      return redirect(
        `/subscribe/failure?error=user_not_found&txnid=${txnid}`
      );
    }

    // 8. Create subscription
    const subscription = await SubscriptionModel.createSubscription({
      userId: user._id,
      usageTier: tier,
      payuOrderId: orderId,
      payuTransactionId: mihpayid,
      amount: parseFloat(amount),
    });

    console.log('[PayU Success] Subscription created:', subscription._id);

    // 9. Update user with subscription details
    user.currentSubscriptionId = subscription._id;
    user.subscriptionStatus = 'active';
    user.subscriptionEndDate = subscription.endDate;
    user.usageTier = tier === 'professional' ? 'pro' : tier; // Map tier to usageTier
    user.hasUsedTrial = true;

    // Update restrictions based on tier
    const tierRestrictions = UserModel.getTierRestrictions(user.usageTier);
    user.restrictions = tierRestrictions;

    await user.save();

    console.log('[PayU Success] User updated:', user._id);

    // 10. Create payment history record
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

    console.log('[PayU Success] Payment history created');

    // 7. Generate Invoice
    let invoiceBuffer: Buffer | null = null;
    try {
      const invoiceData = {
        invoiceNumber: `INV-${Date.now()}`, // Simple invoice number logic
        customerName: firstname,
        customerEmail: email,
        amount: parseFloat(amount),
        date: new Date(),
        planName: productinfo,
        paymentMethod: mode || 'PayU',
        transactionId: txnid,
      };
      invoiceBuffer = await generateInvoice(invoiceData);
      console.log('[PayU Success] Invoice generated');
    } catch (invError) {
      console.error('[PayU Success] Failed to generate invoice:', invError);
      // Continue even if invoice fails
    }

    // 8. Send Confirmation Email
    try {
      if (invoiceBuffer) {
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
        console.log('[PayU Success] Confirmation email sent');
      }
    } catch (emailError) {
      console.error('[PayU Success] Failed to send email:', emailError);
    }

    // 9. Redirect to success page
    const successUrl = new URL('/subscribe/success', request.url);
    successUrl.searchParams.set('txnid', txnid);
    successUrl.searchParams.set('plan', productinfo);

    return NextResponse.redirect(successUrl);
  } catch (error: any) {
    console.error('[PayU Success] Error processing callback:', error);

    // In case of error, redirect to failure page with error message
    const failureUrl = new URL('/subscribe/failure', request.url);
    failureUrl.searchParams.set('error', error.message || 'Processing failed');
    return NextResponse.redirect(failureUrl);
  }
}

/**
 * GET method - redirect to homepage
 */
export async function GET() {
  return redirect('/');
}
