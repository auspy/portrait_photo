import { NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";
import { getWebhookCollection } from "@/adapters/webhook.db";
import {
  activateSubscription,
  deactivateSubscription,
} from "@/lib/user-subscription";
import {
  validateWebhookHeaders,
  validateSubscriptionActiveWebhook,
  validateSubscriptionCancelledWebhook,
  validateSubscriptionExpiredWebhook,
  validateSubscriptionFailedWebhook,
  validateRefundSucceededWebhook,
} from "@/lib/dodo/dodo-webhook.validation";

export async function POST(request) {
  try {
    console.log("🔔 DODO webhook received");
    const payload = await request.text();
    const headers = {
      "webhook-id": request.headers.get("webhook-id"),
      "webhook-timestamp": request.headers.get("webhook-timestamp"),
      "webhook-signature": request.headers.get("webhook-signature"),
    };
    const webhookId = headers["webhook-id"];

    console.log(`[${webhookId}] 📦 Raw webhook payload:`, payload);
    console.log(`[${webhookId}] 📋 Webhook headers:`, headers);

    // Validate headers
    try {
      console.log(`[${webhookId}] 🔍 Validating webhook headers...`);
      validateWebhookHeaders(headers);
      console.log(`[${webhookId}] ✅ Headers validation successful`);
    } catch (error) {
      console.error(`[${webhookId}] ❌ Invalid webhook headers:`, error.errors);
      return NextResponse.json(
        { success: false, error: "Invalid headers" },
        { status: 400 }
      );
    }

    // Verify webhook ID exists
    if (!webhookId) {
      console.error(`❌ Missing webhook ID`);
      return NextResponse.json({ success: false }, { status: 200 });
    }

    // Check for duplicate webhook
    console.log(`[${webhookId}] 🔍 Checking for duplicate webhook:`, webhookId);
    const webhookCollection = await getWebhookCollection();
    const existingWebhook = await webhookCollection.findOne({ webhookId });

    if (existingWebhook) {
      console.log(`[${webhookId}] ⚠️ Webhook already processed, skipping`);
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Verify signature
    console.log(`[${webhookId}] 🔐 Verifying webhook signature...`);
    const webhook = new Webhook(process.env.DODO_WEBHOOK_SECRET);
    const event = webhook.verify(payload, headers);
    console.log(`[${webhookId}] ✅ Signature verification successful`);

    // Process the webhook based on type
    const { type } = event;
    console.log(`[${webhookId}] 📝 Processing webhook event:`, type);
    let status = "success";

    try {
      switch (type) {
        case "subscription.active": {
          const validatedSub = validateSubscriptionActiveWebhook(payload);
          const {
            data: {
              customer: { email, customer_id },
              subscription_id,
              next_billing_date,
            },
          } = validatedSub;

          // Update user to pro plan with subscription details
          console.log(
            `[${webhookId}] 🔄 Updating user plan to pro for:`,
            email
          );
          await activateSubscription(
            customer_id,
            subscription_id,
            customer_id,
            next_billing_date
          );
          console.log(
            `[${webhookId}] ✅ Successfully updated to pro plan for:`,
            email
          );
          break;
        }

        case "subscription.cancelled":
        case "subscription.expired": {
          const validator =
            type === "subscription.cancelled"
              ? validateSubscriptionCancelledWebhook
              : validateSubscriptionExpiredWebhook;

          const validatedSub = validator(payload);
          const {
            data: {
              customer: { email, customer_id },
            },
          } = validatedSub;

          console.log(
            `[${webhookId}] 🔔 Processing subscription ${type} for ${email}`
          );

          // Update user back to free plan
          console.log(
            `[${webhookId}] 🔄 Updating user plan to free for:`,
            email
          );
          await deactivateSubscription(customer_id);
          console.log(
            `[${webhookId}] ✅ Successfully updated to free plan for:`,
            email
          );
          break;
        }

        case "subscription.failed": {
          const validatedSub = validateSubscriptionFailedWebhook(payload);
          const {
            data: {
              customer: { email, customer_id },
            },
          } = validatedSub;

          console.log(
            `[${webhookId}] 🔔 Processing subscription failure for ${email}`
          );

          // Update user back to free plan
          console.log(
            `[${webhookId}] 🔄 Updating user plan to free for:`,
            email
          );
          await deactivateSubscription(customer_id);
          console.log(
            `[${webhookId}] ✅ Successfully updated to free plan for:`,
            email
          );
          break;
        }

        case "refund.succeeded": {
          const validatedRefund = validateRefundSucceededWebhook(payload);
          const {
            data: {
              subscription_id,
              customer: { email, customer_id },
            },
          } = validatedRefund;

          console.log(`[${webhookId}] 🔔 Processing refund for ${email}`);

          // Update user back to free plan if it was a subscription refund
          if (subscription_id) {
            console.log(
              `[${webhookId}] 🔄 Updating user plan to free for:`,
              email
            );
            await deactivateSubscription(customer_id);
            console.log(
              `[${webhookId}] ✅ Successfully updated to free plan for:`,
              email
            );
          }
          break;
        }

        default: {
          console.log(`[${webhookId}] 🔔 Unhandled webhook event:`, type);
          break;
        }
      }
    } catch (error) {
      status = "error";
      throw error;
    } finally {
      // Record webhook processing
      console.log(`[${webhookId}] 💾 Recording webhook processing...`);
      await webhookCollection.insertOne({
        webhookId,
        eventType: type || "unknown",
        processedAt: new Date(),
        status,
        payload: JSON.parse(payload),
      });
      console.log(`[${webhookId}] ✅ Webhook processing recorded`);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error.name === "WebhookVerificationError") {
      console.error("❌ Webhook verification failed:", error.message);
    } else if (error.code === 121) {
      // MongoDB validation error
      console.error("❌ MongoDB validation error:", {
        failingDocumentId: error.errInfo?.failingDocumentId,
        details: JSON.stringify(error.errInfo?.details, null, 2),
        validationErrors: JSON.stringify(
          error.errInfo?.details?.schemaRulesNotSatisfied,
          null,
          2
        ),
        fullError: JSON.stringify(error, null, 2),
      });
    } else {
      console.error("❌ Webhook error:", {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
    }
    // Still return 200 to acknowledge receipt
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
