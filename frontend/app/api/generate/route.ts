import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  checkUserCanGenerate,
  consumeRateLimit,
  rateLimiter,
  getIdentifier,
} from "@/lib/rate-limit";
import type { UserPlan } from "@/lib/user-plan";
import { urlPython } from "@/constants";
import {
  validationError,
  unauthorizedError,
  rateLimitError,
  handleApiError,
  fileError,
} from "@/lib/api-errors";

// Helper function to format reset time
function formatResetTime(seconds: number): string {
  if (!seconds) return "now";

  const now = new Date();
  const resetDate = new Date(now.getTime() + seconds);

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  const isToday = now.toDateString() === resetDate.toDateString();

  if (!isToday) {
    return resetDate.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year:
        now.getFullYear() !== resetDate.getFullYear() ? "numeric" : undefined,
      ...timeOptions,
    });
  }

  return resetDate.toLocaleString("en-US", timeOptions);
}

export async function HEAD(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return unauthorizedError();
    }

    const user = await currentUser();
    const plan = (user?.publicMetadata?.plan as UserPlan) || "free";

    if (plan === "pro") {
      return new NextResponse(null, {
        headers: {
          "X-RateLimit-Remaining": "Infinity",
          "X-RateLimit-Reset": "0",
        },
      });
    }

    const remaining = await checkUserCanGenerate(userId, plan);

    return new NextResponse(null, {
      headers: {
        "X-RateLimit-Remaining": remaining.toString(),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return unauthorizedError();
    }

    const user = await currentUser();
    const plan = (user?.publicMetadata?.plan as UserPlan) || "free";

    const remaining = await checkUserCanGenerate(userId, plan);

    if (remaining === 0) {
      const identifier = getIdentifier(userId, plan);
      const { reset } = await rateLimiter.limit(identifier, {
        rate: 0,
      });
      return rateLimitError(
        `Rate limit exceeded. Resets at ${formatResetTime(reset)}`,
        {
          remaining,
          reset,
          plan,
        }
      );
    }

    const formData = await req.formData();
    const image = formData.get("image");
    const borderColor = formData.get("border_color");
    const borderSize = formData.get("border_size");

    if (!image || !(image instanceof Blob)) {
      return fileError("Invalid image data", "No image file was provided");
    }

    if (!borderColor || typeof borderColor !== "string") {
      return validationError(
        "Invalid border color",
        "Border color must be a valid color string"
      );
    }

    if (!borderSize || typeof borderSize !== "string") {
      return validationError(
        "Invalid border size",
        "Border size must be a valid number"
      );
    }

    try {
      const url = `${urlPython}/process`;
      console.log("Fetching from", url);

      // Create a new FormData and append all fields
      const newFormData = new FormData();
      newFormData.append("image", image);
      newFormData.append("border_color", borderColor);
      newFormData.append("border_size", borderSize);

      const backendResponse = await fetch(url, {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: newFormData,
      });

      if (!backendResponse.ok) {
        const error = await backendResponse.text();
        throw new Error(`Backend processing failed: ${error}`);
      }

      const processedImageBlob = await backendResponse.blob();

      if (processedImageBlob.size > 0 && plan === "free") {
        await consumeRateLimit(userId, plan);
      }

      return new NextResponse(processedImageBlob, {
        headers: {
          "Content-Type": processedImageBlob.type,
          "Content-Disposition":
            backendResponse.headers.get("Content-Disposition") || "attachment",
        },
      });
    } catch (error) {
      return handleApiError(error);
    }
  } catch (error) {
    return handleApiError(error);
  }
}
