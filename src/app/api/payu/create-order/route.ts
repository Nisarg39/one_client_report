/**
 * PayU Create Order API
 *
 * POST /api/payu/create-order
 *
 * Creates a payment order and generates hash for PayU Checkout Plus
 * Requires authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/adapter';
import { connectDB } from '@/lib/db';
import UserModel from '@/models/User';
import {
  getPayUConfig,
  validatePayUConfig,
  getPlanConfig,
  isValidPlan,
} from '@/lib/payu/config';
import {
  generatePaymentHash,
  generateTransactionId,
  generateOrderId,
  sanitizePaymentData,
  validateAmount,
} from '@/lib/payu/hash';

/**
 * Request body interface
 */
interface CreateOrderRequest {
  plan: 'professional' | 'agency';
}

/**
 * POST /api/payu/create-order
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Parse request body
    const body: CreateOrderRequest = await request.json();
    const { plan } = body;

    // 3. Validate plan parameter
    if (!plan || !isValidPlan(plan)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid plan. Must be "professional" or "agency"',
        },
        { status: 400 }
      );
    }

    // 4. Validate PayU configuration
    try {
      validatePayUConfig();
    } catch (error: any) {
      console.error('[PayU Create Order] Configuration error:', error.message);
      return NextResponse.json(
        {
          success: false,
          error: 'Payment gateway configuration error',
        },
        { status: 500 }
      );
    }

    // 5. Get plan configuration
    const planConfig = getPlanConfig(plan);

    if (!planConfig) {
      return NextResponse.json(
        { success: false, error: 'Plan configuration not found' },
        { status: 404 }
      );
    }

    // 6. Validate amount
    if (!validateAmount(planConfig.amount)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment amount' },
        { status: 400 }
      );
    }

    // 7. Connect to database and get user details
    await connectDB();

    const userDoc = await UserModel.findById(user.id);

    if (!userDoc) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // 8. Get PayU configuration
    const payuConfig = getPayUConfig();

    // 9. Generate unique transaction ID and order ID
    const txnid = generateTransactionId();
    const orderId = generateOrderId();

    // 10. Prepare payment data
    const paymentData = sanitizePaymentData({
      firstname: userDoc.name || 'Customer',
      email: userDoc.email,
      phone: '9999999999', // Required by PayU - using dummy if not available
      productinfo: planConfig.description,
    });

    // 11. Prepare hash data with UDF fields
    // Ensure amount is string with 2 decimals
    const amountStr = planConfig.amount.toFixed(2);

    // UDF fields are used to pass custom data (will be returned in callback)
    const hashData = {
      key: payuConfig.merchantKey,
      txnid,
      amount: amountStr,
      productinfo: paymentData.productinfo,
      firstname: paymentData.firstname,
      email: paymentData.email,
      udf1: user.id, // User ID for callback lookup
      udf2: plan, // Plan name for subscription creation
      udf3: orderId, // Order ID for tracking
      udf4: planConfig.tier, // Tier for subscription
      udf5: '', // Reserved for future use
      salt: payuConfig.merchantSalt,
    };

    // 12. Generate payment hash
    const hash = generatePaymentHash(hashData);

    // 13. Prepare order response
    const orderData = {
      // PayU required fields
      key: payuConfig.merchantKey,
      txnid,
      amount: amountStr, // MUST match hash amount exactly
      productinfo: paymentData.productinfo,
      firstname: paymentData.firstname,
      email: paymentData.email,
      phone: paymentData.phone || '',
      hash,

      // UDF fields (custom data)
      udf1: user.id,
      udf2: plan,
      udf3: orderId,
      udf4: planConfig.tier,
      udf5: '',

      // Callback URLs
      surl: payuConfig.successUrl,
      furl: payuConfig.failureUrl,

      // Additional PayU fields
      service_provider: 'payu_paisa',

      // Order metadata (for frontend display)
      planName: planConfig.displayName,
      planAmount: planConfig.amount,
      currency: planConfig.currency,
      orderId,
    };

    // 14. Return order data to client
    return NextResponse.json({
      success: true,
      data: orderData,
      message: 'Order created successfully',
    });
  } catch (error: any) {
    console.error('[PayU Create Order] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create order',
        message: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * Handle unsupported methods
 */
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  );
}
