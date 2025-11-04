// Common server action response types

/**
 * Generic server action response structure
 * Use this for ALL server actions to maintain consistency
 *
 * @example
 * // Simple action without data
 * ServerActionResponse
 *
 * // Action returning user data
 * ServerActionResponse<{ userId: string; email: string }>
 *
 * // Action with validation errors
 * ServerActionResponse (with errors as Record<string, string>)
 */
export type ServerActionResponse<T = void> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
};

/**
 * Validation error type - flexible key-value pairs for any form
 */
export type ValidationErrors = Record<string, string>;

/**
 * API error response for external API calls
 */
export type ApiError = {
  success: false;
  message: string;
  code?: string;
  statusCode?: number;
};
