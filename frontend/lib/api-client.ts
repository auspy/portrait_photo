import { getAuthHeader } from "./auth-token";
import { urlPython } from "@/constants";

interface FetchOptions extends RequestInit {
  userId?: string;
  plan?: "free" | "pro";
}

interface ApiError extends Error {
  status?: number;
  details?: any;
}

/**
 * Common fetch utility for API calls
 */
export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  try {
    const { userId, plan, headers: customHeaders, ...restOptions } = options;

    // Build headers
    const headers = new Headers(customHeaders);

    // Add auth header if userId and plan are provided
    if (userId && plan) {
      headers.set("Authorization", await getAuthHeader(userId, plan));
    }

    // Make the request
    const response = await fetch(`${urlPython}${endpoint}`, {
      headers,
      ...restOptions,
    });

    // Handle non-JSON responses (like images)
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("image/")) {
      return response.blob() as Promise<T>;
    }

    // Parse JSON response
    const data = await response.json();

    // Handle API errors
    if (!response.ok) {
      const error = new Error(data.message || "API Error") as ApiError;
      error.status = response.status;
      error.details = data.details;
      throw error;
    }

    return data;
  } catch (error: any) {
    // Enhance error with more details if needed
    try {
      console.error("API Error:", {
        endpoint,
        error: error?.message || "Unknown error",
        details: error?.details || {},
        stack: error?.stack,
      });
    } catch (loggingError) {
      console.error("Failed to log API error:", loggingError);
    }
    throw error;
  }
}

/**
 * Helper for GET requests
 */
export function apiGet<T>(endpoint: string, options: FetchOptions = {}) {
  return apiFetch<T>(endpoint, {
    method: "GET",
    ...options,
  });
}

/**
 * Helper for POST requests
 */
export function apiPost<T>(
  endpoint: string,
  data?: any,
  options: FetchOptions = {}
) {
  const headers = new Headers(options.headers);
  let body: any = data;

  // Handle FormData separately
  if (!(data instanceof FormData)) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(data);
  }

  return apiFetch<T>(endpoint, {
    method: "POST",
    headers,
    body,
    ...options,
  });
}
