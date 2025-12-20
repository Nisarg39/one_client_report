/**
 * PayU Hash Generation & Verification Utilities
 *
 * SECURITY CRITICAL: This file must be server-side only!
 * NEVER import this in client components.
 *
 * Uses SHA-512 for hash generation as per PayU requirements
 */

import crypto from 'crypto';

/**
 * Payment Request Data Interface
 */
export interface PaymentRequestData {
  key: string;
  txnid: string;
  amount: string | number;
  productinfo: string;
  firstname: string;
  email: string;
  phone?: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  salt: string;
}

/**
 * Payment Response Data Interface (from PayU callback)
 */
export interface PaymentResponseData {
  key: string;
  txnid: string;
  amount: string | number;
  productinfo: string;
  firstname: string;
  email: string;
  status: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  salt: string;
  hash?: string; // Response hash from PayU
}

/**
 * Generate SHA-512 hash
 */
function sha512(str: string): string {
  return crypto.createHash('sha512').update(str).digest('hex');
}

/**
 * Generate payment request hash
 *
 * Format: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
 *
 * Note: The additional pipes (||||||) are mandatory empty UDF fields (udf6-udf10)
 *
 * @param data - Payment request data
 * @returns SHA-512 hash string
 */
export function generatePaymentHash(data: PaymentRequestData): string {
  const {
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    udf1 = '',
    udf2 = '',
    udf3 = '',
    udf4 = '',
    udf5 = '',
    salt,
  } = data;

  // Convert amount to string with 2 decimal places
  const amountStr = typeof amount === 'number' ? amount.toFixed(2) : amount;

  // Build hash string: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
  const hashString = [
    key,
    txnid,
    amountStr,
    productinfo,
    firstname,
    email,
    udf1,
    udf2,
    udf3,
    udf4,
    udf5,
    '', // udf6
    '', // udf7
    '', // udf8
    '', // udf9
    '', // udf10
    salt,
  ].join('|');

  return sha512(hashString);
}

/**
 * Verify payment response hash
 *
 * Format (REVERSE ORDER): SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
 *
 * @param data - Payment response data from PayU
 * @returns true if hash is valid, false otherwise
 */
export function verifyResponseHash(data: PaymentResponseData): boolean {
  const {
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    status,
    udf1 = '',
    udf2 = '',
    udf3 = '',
    udf4 = '',
    udf5 = '',
    salt,
    hash: receivedHash,
  } = data;

  if (!receivedHash) {
    console.error('[PayU Hash] No hash provided in response');
    return false;
  }

  // Convert amount to string with 2 decimal places
  const amountStr = typeof amount === 'number' ? amount.toFixed(2) : amount;

  // Build hash string in REVERSE order
  const hashString = [
    salt,
    status,
    '', // udf10
    '', // udf9
    '', // udf8
    '', // udf7
    '', // udf6
    udf5,
    udf4,
    udf3,
    udf2,
    udf1,
    email,
    firstname,
    productinfo,
    amountStr,
    txnid,
    key,
  ].join('|');

  const calculatedHash = sha512(hashString);

  const isValid = calculatedHash === receivedHash;

  if (!isValid) {
    console.error('[PayU Hash] Hash verification failed!');
    console.error('[PayU Hash] Calculated:', calculatedHash);
    console.error('[PayU Hash] Received:', receivedHash);
  }

  return isValid;
}

/**
 * Generate unique transaction ID
 * Format: TXN_YYYYMMDDHHMMSS_RANDOM
 *
 * @returns Unique transaction ID
 */
export function generateTransactionId(): string {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[-:]/g, '')
    .replace('T', '')
    .split('.')[0]; // YYYYMMDDHHMMSS

  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `TXN_${timestamp}_${random}`;
}

/**
 * Generate unique order ID
 * Format: ORD_YYYYMMDDHHMMSS_RANDOM
 *
 * @returns Unique order ID
 */
export function generateOrderId(): string {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[-:]/g, '')
    .replace('T', '')
    .split('.')[0]; // YYYYMMDDHHMMSS

  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `ORD_${timestamp}_${random}`;
}

/**
 * Sanitize user input for payment (prevent injection)
 */
export function sanitizePaymentData(data: {
  firstname: string;
  email: string;
  phone?: string;
  productinfo: string;
}): {
  firstname: string;
  email: string;
  phone?: string;
  productinfo: string;
} {
  return {
    firstname: data.firstname.trim().substring(0, 50), // Max 50 chars
    email: data.email.trim().toLowerCase().substring(0, 100),
    phone: data.phone?.trim().substring(0, 15),
    productinfo: data.productinfo.trim().substring(0, 100),
  };
}

/**
 * Validate payment amount
 */
export function validateAmount(amount: number): boolean {
  if (typeof amount !== 'number') return false;
  if (isNaN(amount)) return false;
  if (amount <= 0) return false;
  if (amount > 1000000) return false; // Max 10 lakh INR
  return true;
}
