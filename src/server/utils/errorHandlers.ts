import { TRPCError } from '@trpc/server';

/**
 * Error handler for AI service configuration
 */
export function handleConfigError(): never {
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'AI service configuration is missing',
  });
}

/**
 * Error handler for HTTP response status
 * @param status HTTP status code
 * @param statusText HTTP status text
 */
export function handleHttpError(status: number, statusText: string): never {
  if (status === 401 || status === 403) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authorized to access AI service',
    });
  }

  if (status === 404) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'AI service endpoint not found',
    });
  }

  if (status >= 500) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'AI service encountered an error',
    });
  }

  throw new TRPCError({
    code: 'BAD_REQUEST',
    message: `AI service call failed: ${statusText}`,
  });
}

/**
 * Generic error handler for AI service calls
 * @param error The caught error
 * @param context Error context for the message
 */
export function handleServiceError(error: unknown, context: string): never {
  if (error instanceof TRPCError) {
    throw error;
  }

  console.error(`Error during ${context}:`, error);
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: `Failed to ${context}`,
    cause: error,
  });
}

/**
 * Input validation error handler
 * @param message Error message for invalid input
 */
export function handleInputError(message: string): never {
  throw new TRPCError({
    code: 'BAD_REQUEST',
    message,
  });
}

/**
 * Validates required string input
 * @param input String to validate
 * @param fieldName Name of the field for error message
 */
export function validateRequiredInput(input: string, fieldName: string): void {
  if (!input?.trim()) {
    handleInputError(`${fieldName} is required`);
  }
}
