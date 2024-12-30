import { SignJWT } from "jose";

// Make sure the secret key exists
const JWT_SECRET = process.env.API_SECRET_KEY;
if (!JWT_SECRET) {
  throw new Error("API_SECRET_KEY environment variable is not set");
}

interface TokenPayload {
  userId: string;
  plan: "free" | "pro";
  [key: string]: any;
}

/**
 * Generate a JWT token for API authentication
 */
export async function generateApiToken(
  userId: string,
  plan: "free" | "pro"
): Promise<string> {
  const payload: TokenPayload = {
    userId,
    plan,
  };

  try {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    if (!userId || !plan) {
      throw new Error("Missing required parameters for token generation");
    }

    // Convert secret to Uint8Array
    const secretKey = new TextEncoder().encode(JWT_SECRET);

    // Create and sign the token
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("5m")
      .sign(secretKey);

    if (!token) {
      throw new Error("Failed to generate token");
    }

    return token;
  } catch (error) {
    console.error("Token generation error:", {
      error: error?.message || "Unknown error",
      userId,
      plan,
      secretExists: !!JWT_SECRET,
    });
    throw new Error("Failed to generate authentication token");
  }
}

/**
 * Format the authorization header with the JWT token
 */
export async function getAuthHeader(
  userId: string,
  plan: "free" | "pro"
): Promise<string> {
  try {
    const token = await generateApiToken(userId, plan);
    return `Bearer ${token}`;
  } catch (error) {
    console.error("Auth header generation error:", error);
    throw error;
  }
}
