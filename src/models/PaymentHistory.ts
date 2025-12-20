/**
 * PaymentHistory Mongoose Model
 *
 * Tracks all payment transactions (successful, failed, pending)
 * Generates invoice numbers and stores payment details
 */

import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * PaymentHistory Document Interface
 */
export interface IPaymentHistory extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  subscriptionId?: mongoose.Types.ObjectId; // Reference to subscription (if successful)

  // PayU Details
  payuOrderId: string;
  payuTransactionId: string; // mihpayid from PayU
  payuPaymentId?: string; // Additional PayU payment ID

  // Payment Info
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'pending';
  paymentMethod?: string; // UPI, Card, NetBanking, Wallet, etc.

  // Invoice
  invoiceNumber: string; // Auto-generated: INV-YYYYMM-XXXXXX
  invoiceUrl?: string; // URL to PDF invoice (if generated)

  // PayU Response Data
  bankCode?: string; // Bank code used for payment
  cardType?: string; // Credit/Debit card type
  nameOnCard?: string; // Name on card (if card payment)
  discount?: number; // Discount applied
  netAmountDebit?: number; // Net amount debited from customer

  // Failure Details (if status = 'failed')
  failureReason?: string;
  errorCode?: string;

  // Raw PayU Response (for debugging)
  responseData?: Record<string, any>;

  // Timestamps
  paymentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * PaymentHistory Schema
 */
const PaymentHistorySchema = new Schema<IPaymentHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
    },
    payuOrderId: {
      type: String,
      required: [true, 'PayU order ID is required'],
      index: true,
    },
    payuTransactionId: {
      type: String,
      required: [true, 'PayU transaction ID is required'],
      unique: true, // Prevent duplicate processing
    },
    payuPaymentId: {
      type: String,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'INR',
      required: true,
    },
    status: {
      type: String,
      enum: ['success', 'failed', 'pending'],
      required: true,
      index: true,
    },
    paymentMethod: {
      type: String,
    },
    invoiceNumber: {
      type: String,
      required: [true, 'Invoice number is required'],
      unique: true,
    },
    invoiceUrl: {
      type: String,
    },
    bankCode: {
      type: String,
    },
    cardType: {
      type: String,
    },
    nameOnCard: {
      type: String,
    },
    discount: {
      type: Number,
      default: 0,
    },
    netAmountDebit: {
      type: Number,
    },
    failureReason: {
      type: String,
    },
    errorCode: {
      type: String,
    },
    responseData: {
      type: Schema.Types.Mixed,
    },
    paymentDate: {
      type: Date,
      required: [true, 'Payment date is required'],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes for performance
 */
PaymentHistorySchema.index({ userId: 1, createdAt: -1 }); // User payment history
PaymentHistorySchema.index({ status: 1, createdAt: -1 }); // Filter by status
// PaymentHistorySchema.index({ payuTransactionId: 1 }); // Redundant as payuTransactionId is unique: true

/**
 * Model Interface (with static methods)
 */
interface IPaymentHistoryModel extends Model<IPaymentHistory> {
  generateInvoiceNumber(): Promise<string>;
  createPaymentRecord(data: {
    userId: string | mongoose.Types.ObjectId;
    subscriptionId?: string | mongoose.Types.ObjectId;
    payuOrderId: string;
    payuTransactionId: string;
    amount: number;
    status: 'success' | 'failed' | 'pending';
    paymentMethod?: string;
    paymentDate?: Date;
    failureReason?: string;
    errorCode?: string;
    responseData?: Record<string, any>;
  }): Promise<IPaymentHistory>;
  isTransactionProcessed(payuTransactionId: string): Promise<boolean>;
  getUserPaymentHistory(
    userId: string | mongoose.Types.ObjectId,
    page?: number,
    limit?: number
  ): Promise<IPaymentHistory[]>;
  countUserPayments(
    userId: string | mongoose.Types.ObjectId
  ): Promise<number>;
  getSuccessfulPayments(
    userId: string | mongoose.Types.ObjectId
  ): Promise<IPaymentHistory[]>;
  getPaymentByInvoice(invoiceNumber: string): Promise<IPaymentHistory | null>;
  updatePaymentStatus(
    payuTransactionId: string,
    status: 'success' | 'failed',
    additionalData?: {
      subscriptionId?: string | mongoose.Types.ObjectId;
      paymentMethod?: string;
      failureReason?: string;
      errorCode?: string;
      responseData?: Record<string, any>;
    }
  ): Promise<IPaymentHistory | null>;
}

/**
 * Static Methods
 */

/**
 * Generate unique invoice number
 * Format: INV-YYYYMM-XXXXXX (e.g., INV-202412-000001)
 */
PaymentHistorySchema.statics.generateInvoiceNumber = async function (): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const prefix = `INV-${year}${month}-`;

  // Find the last invoice for this month
  const lastInvoice = await (this as any).findOne({
    invoiceNumber: { $regex: `^${prefix}` },
  })
    .sort({ createdAt: -1 })
    .select('invoiceNumber');

  let sequenceNumber = 1;

  if (lastInvoice) {
    // Extract sequence number from last invoice
    const lastSequence = lastInvoice.invoiceNumber.split('-')[2];
    sequenceNumber = parseInt(lastSequence, 10) + 1;
  }

  // Format sequence with leading zeros (6 digits)
  const sequence = String(sequenceNumber).padStart(6, '0');

  return `${prefix}${sequence}`;
};

/**
 * Create payment record with auto-generated invoice number
 */
PaymentHistorySchema.statics.createPaymentRecord = async function (data: {
  userId: string | mongoose.Types.ObjectId;
  subscriptionId?: string | mongoose.Types.ObjectId;
  payuOrderId: string;
  payuTransactionId: string;
  amount: number;
  status: 'success' | 'failed' | 'pending';
  paymentMethod?: string;
  paymentDate?: Date;
  failureReason?: string;
  errorCode?: string;
  responseData?: Record<string, any>;
}): Promise<IPaymentHistory> {
  // Generate unique invoice number
  const invoiceNumber = await (this as any).generateInvoiceNumber();

  return (this as any).create({
    userId: data.userId,
    subscriptionId: data.subscriptionId,
    payuOrderId: data.payuOrderId,
    payuTransactionId: data.payuTransactionId,
    amount: data.amount,
    currency: 'INR',
    status: data.status,
    paymentMethod: data.paymentMethod,
    invoiceNumber,
    paymentDate: data.paymentDate || new Date(),
    failureReason: data.failureReason,
    errorCode: data.errorCode,
    responseData: data.responseData,
  });
};

/**
 * Check if transaction already processed (idempotency)
 */
PaymentHistorySchema.statics.isTransactionProcessed = async function (
  payuTransactionId: string
): Promise<boolean> {
  const existing = await this.findOne({ payuTransactionId });
  return !!existing;
};

/**
 * Get payment history for a user
 */
PaymentHistorySchema.statics.getUserPaymentHistory = async function (
  userId: string | mongoose.Types.ObjectId,
  page: number = 1,
  limit: number = 10
): Promise<IPaymentHistory[]> {
  const skip = (page - 1) * limit;

  return this.find({
    userId: new mongoose.Types.ObjectId(userId),
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec();
};

/**
 * Count total payments for a user
 */
PaymentHistorySchema.statics.countUserPayments = async function (
  userId: string | mongoose.Types.ObjectId
): Promise<number> {
  return this.countDocuments({
    userId: new mongoose.Types.ObjectId(userId),
  });
};

/**
 * Get successful payments only
 */
PaymentHistorySchema.statics.getSuccessfulPayments = async function (
  userId: string | mongoose.Types.ObjectId
): Promise<IPaymentHistory[]> {
  return this.find({
    userId: new mongoose.Types.ObjectId(userId),
    status: 'success',
  }).sort({ createdAt: -1 });
};

/**
 * Get payment by invoice number
 */
PaymentHistorySchema.statics.getPaymentByInvoice = async function (
  invoiceNumber: string
): Promise<IPaymentHistory | null> {
  return this.findOne({ invoiceNumber });
};

/**
 * Update payment status (for pending payments)
 */
PaymentHistorySchema.statics.updatePaymentStatus = async function (
  payuTransactionId: string,
  status: 'success' | 'failed',
  additionalData?: {
    subscriptionId?: string | mongoose.Types.ObjectId;
    paymentMethod?: string;
    failureReason?: string;
    errorCode?: string;
    responseData?: Record<string, any>;
  }
): Promise<IPaymentHistory | null> {
  return this.findOneAndUpdate(
    { payuTransactionId },
    {
      $set: {
        status,
        ...additionalData,
      },
    },
    { new: true }
  );
};

/**
 * Export Model
 */
if (mongoose.models.PaymentHistory) {
  const existingModel = mongoose.models.PaymentHistory as any;
  existingModel.getUserPaymentHistory = PaymentHistorySchema.statics.getUserPaymentHistory;
  existingModel.countUserPayments = PaymentHistorySchema.statics.countUserPayments;
}

const PaymentHistoryModel: IPaymentHistoryModel =
  (mongoose.models.PaymentHistory as IPaymentHistoryModel) ||
  mongoose.model<IPaymentHistory, IPaymentHistoryModel>(
    'PaymentHistory',
    PaymentHistorySchema
  );

export default PaymentHistoryModel;
