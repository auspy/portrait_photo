import { clerkClient } from "@clerk/nextjs/server";

// Extend Clerk's metadata types
interface UserPublicMetadata {
  plan: "free" | "pro";
  updatedAt: string;
  [key: string]: any; // Allow other properties as per Clerk's requirements
}

interface UserPrivateMetadata {
  subscriptionId: string;
  customerId: string;
  currentPeriodEnd: string;
  [key: string]: any; // Allow other properties as per Clerk's requirements
}

/**
 * Update user metadata when subscription becomes active
 */
export async function activateSubscription(
  userId: string,
  subscriptionId: string,
  customerId: string,
  currentPeriodEnd: string
) {
  try {
    const publicMetadata: UserPublicMetadata = {
      plan: "pro",
      updatedAt: new Date().toISOString(),
    };

    const privateMetadata: UserPrivateMetadata = {
      subscriptionId,
      customerId,
      currentPeriodEnd,
    };

    await clerkClient.users.updateUser(userId, {
      publicMetadata,
      privateMetadata,
    });

    return true;
  } catch (error) {
    console.error("Failed to activate subscription:", error);
    throw error;
  }
}

/**
 * Update user metadata when subscription ends (cancelled/expired/failed)
 */
export async function deactivateSubscription(userId: string) {
  try {
    const publicMetadata: UserPublicMetadata = {
      plan: "free",
      updatedAt: new Date().toISOString(),
    };

    // Keep private metadata for reference, just update public plan
    await clerkClient.users.updateUser(userId, {
      publicMetadata,
    });

    return true;
  } catch (error) {
    console.error("Failed to deactivate subscription:", error);
    throw error;
  }
}

/**
 * Verify if a user's subscription is active
 */
export async function verifySubscription(userId: string): Promise<boolean> {
  try {
    const user = await clerkClient.users.getUser(userId);

    // If no private metadata or not pro plan, subscription is not active
    if (!user.privateMetadata || user.publicMetadata?.plan !== "pro") {
      return false;
    }

    const privateMetadata = user.privateMetadata as UserPrivateMetadata;

    // Check if subscription period is still valid
    return new Date(privateMetadata.currentPeriodEnd) > new Date();
  } catch (error) {
    console.error("Failed to verify subscription:", error);
    return false;
  }
}

/**
 * Get user's subscription details
 */
export async function getSubscriptionDetails(
  userId: string
): Promise<UserPrivateMetadata | null> {
  try {
    const user = await clerkClient.users.getUser(userId);

    if (!user.privateMetadata || user.publicMetadata?.plan !== "pro") {
      return null;
    }

    return user.privateMetadata as UserPrivateMetadata;
  } catch (error) {
    console.error("Failed to get subscription details:", error);
    return null;
  }
}
