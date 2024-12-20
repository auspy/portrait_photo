import { NextResponse } from "next/server";

export enum ErrorType {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  PROCESSING_ERROR = "PROCESSING_ERROR",
  FILE_ERROR = "FILE_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  NOT_FOUND = "NOT_FOUND",
  RATE_LIMIT_ERROR = "RATE_LIMIT_ERROR",
  UNAUTHORIZED = "UNAUTHORIZED",
}

export interface ApiError {
  type: ErrorType;
  message: string;
  details?: string;
  metadata?: Record<string, any>;
}

interface ErrorResponse {
  error: ApiError;
  status: number;
}

const ERROR_STATUS_CODES: Record<ErrorType, number> = {
  [ErrorType.VALIDATION_ERROR]: 400,
  [ErrorType.FILE_ERROR]: 400,
  [ErrorType.UNAUTHORIZED]: 401,
  [ErrorType.NOT_FOUND]: 404,
  [ErrorType.RATE_LIMIT_ERROR]: 429,
  [ErrorType.PROCESSING_ERROR]: 500,
  [ErrorType.SERVER_ERROR]: 500,
};

function createErrorResponse(
  type: ErrorType,
  message: string,
  details?: string,
  metadata?: Record<string, any>
): ErrorResponse {
  return {
    error: {
      type,
      message,
      details,
      metadata,
    },
    status: ERROR_STATUS_CODES[type],
  };
}

export function createApiError(
  type: ErrorType,
  message: string,
  details?: string,
  metadata?: Record<string, any>
): NextResponse {
  const errorResponse = createErrorResponse(type, message, details, metadata);
  return NextResponse.json(errorResponse.error, {
    status: errorResponse.status,
  });
}

// Helper functions for specific error types
export function validationError(message: string, details?: string) {
  return createApiError(ErrorType.VALIDATION_ERROR, message, details);
}

export function fileError(message: string, details?: string) {
  return createApiError(ErrorType.FILE_ERROR, message, details);
}

export function unauthorizedError(message = "Unauthorized access") {
  return createApiError(ErrorType.UNAUTHORIZED, message);
}

export function notFoundError(message: string, details?: string) {
  return createApiError(ErrorType.NOT_FOUND, message, details);
}

export function rateLimitError(
  message: string,
  metadata?: Record<string, any>
) {
  return createApiError(
    ErrorType.RATE_LIMIT_ERROR,
    message,
    undefined,
    metadata
  );
}

export function processingError(message: string, details?: string) {
  return createApiError(ErrorType.PROCESSING_ERROR, message, details);
}

export function serverError(
  message = "Internal server error",
  details?: string
) {
  return createApiError(ErrorType.SERVER_ERROR, message, details);
}

// Error handler for catching and formatting errors
export function handleApiError(error: unknown): NextResponse {
  console.error("[API_ERROR]", error);

  if (error instanceof Error) {
    // Check for connection refused error
    const cause = (error as any).cause;
    if (cause?.code === "ECONNREFUSED") {
      return processingError(
        "Unable to connect to image processing service",
        "The image processing service appears to be offline. Please ensure the Python backend is running on port 8000."
      );
    }

    // Handle specific error types if needed
    if (error.message.includes("rate limit")) {
      return rateLimitError(error.message);
    }

    return processingError("Failed to process image", error.message);
  }

  return serverError("An unexpected error occurred");
}
