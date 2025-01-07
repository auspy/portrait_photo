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
    console.log("headers", headers, restOptions);
    const response = await fetch(`${urlPython}${endpoint}`, {
      headers,
      ...restOptions,
    });
    console.log("response", response);

    // Handle non-JSON responses (like images)
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("image/")) {
      console.log("response.ok", response.ok);
      if (!response.ok) {
        const error = new Error("Failed to fetch image") as ApiError;
        error.status = response.status;
        throw error;
      }
      console.log("response.blob()", response.blob());
      return response.blob() as Promise<T>;
    }

    // For non-image responses, handle JSON
    try {
      const data = await response.json();
      console.log("response.json()", data);

      // Handle API errors
      if (!response.ok) {
        const error = new Error(data.message || "API Error") as ApiError;
        error.status = response.status;
        error.details = data.details;
        throw error;
      }

      return data;
    } catch (parseError: any) {
      // Handle JSON parsing errors
      const error = new Error("Invalid response format") as ApiError;
      error.status = response.status;
      error.details = { parseError: parseError?.message };
      throw error;
    }
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

// Add the utility function for Python backend communication
export async function processPythonBackend(
  image: File,
  borderColor: string,
  borderSize: number,
  user: any,
  userPlan: "free" | "pro"
) {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("border_color", borderColor);
  formData.append("border_size", borderSize.toString());

  const response = await fetch(`${urlPython}/process`, {
    method: "POST",
    headers: {
      Authorization: await getAuthHeader(user.id, userPlan),
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Backend processing failed: ${error}`);
  }

  return await response.blob();
}
