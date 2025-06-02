/**
 * Custom error utility for consistent error handling across the application
 * This helps standardize error objects and provides better context for debugging
 */

/**
 * Options for creating a custom error
 */
export interface ErrorOptions {
  /** User-friendly error message */
  message: string;
  /** Original error that caused this error */
  cause?: Error;
  /** Additional context information for debugging */
  context?: Record<string, unknown>;
  /** HTTP status code (for API errors) */
  status?: number;
  /** Error code for categorizing errors */
  code?: string;
}

/**
 * Extended Error class with additional properties
 */
export class AppError extends Error {
  /** Error name - overrides base Error.name */
  override name: string;
  /** Error message - overrides base Error.message */
  override message: string;
  /** Error stack trace - overrides base Error.stack */
  override stack!: string;
  /** Original error that caused this error */
  cause?: Error;
  /** Additional context information for debugging */
  context?: Record<string, unknown>;
  /** HTTP status code (for API errors) */
  status?: number;
  /** Error code for categorizing errors */
  code?: string;

  constructor(options: ErrorOptions) {
    super(options.message);
    this.name = 'AppError';
    this.cause = options.cause;
    this.context = options.context;
    this.status = options.status;
    this.code = options.code;

    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }

    // Preserve the original error's stack if available
    if (options.cause?.stack) {
      this.stack = `${this.stack}\nCaused by: ${options.cause.stack}`;
    }
  }

  /**
   * Convert the error to a JSON object for logging
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      context: this.context,
      cause: this.cause instanceof Error ? {
        name: this.cause.name,
        message: this.cause.message,
        stack: this.cause.stack
      } : this.cause,
      stack: this.stack
    };
  }
}

/**
 * Create a standardized error object
 * @param options Error options
 * @returns AppError instance
 */
export function error(options: ErrorOptions): AppError {
  return new AppError(options);
}

/**
 * Check if an error is an instance of AppError
 * @param err Error to check
 * @returns True if the error is an AppError
 */
export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}

/**
 * Extract a user-friendly message from any error
 * @param err Error to extract message from
 * @returns User-friendly error message
 */
export function getErrorMessage(err: unknown): string {
  if (isAppError(err)) {
    return err.message;
  }
  
  if (err instanceof Error) {
    return err.message;
  }
  
  return String(err);
}

/**
 * Log an error with consistent formatting
 * @param err Error to log
 * @param prefix Optional prefix for the log message
 */
export function logError(err: unknown, prefix = 'Error:'): void {
  if (isAppError(err)) {
    console.error(prefix, JSON.stringify(err.toJSON(), null, 2));
  } else if (err instanceof Error) {
    console.error(prefix, {
      name: err.name,
      message: err.message,
      stack: err.stack
    });
  } else {
    console.error(prefix, err);
  }
}
