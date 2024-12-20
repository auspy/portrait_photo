import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";

export type UserPlan = "free" | "pro";

// Get user's current plan from auth session
export async function getUserPlan(userId: string): Promise<UserPlan> {
  if (!userId) return "free";

  try {
    const user = await currentUser();
    return (user?.publicMetadata?.plan as UserPlan) || "free";
  } catch (error) {
    console.error("Error fetching user plan:", error);
    return "free";
  }
}

// Update user's plan in metadata
export async function updateUserPlan(plan: UserPlan) {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("No user found");

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        plan,
        updatedAt: new Date().toISOString(),
      },
    });
    return true;
  } catch (error) {
    console.error("Error updating user plan:", error);
    return false;
  }
}
