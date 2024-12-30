export async function POST(req) {
  try {
    const { planType } = await req.json();

    // You can store your payment URLs in server-side environment variables
    let paymentUrl;
    if (planType === "lifetime") {
      paymentUrl = process.env.LIFETIME_URL;
    } else if (planType === "monthly") {
      paymentUrl = process.env.MONTHLY_URL;
    } else if (planType === "yearly") {
      paymentUrl = process.env.YEARLY_URL;
    }

    return Response.json({ paymentUrl });
  } catch (error) {
    console.error("Payment creation error:", error);
    return Response.json(
      { error: "Failed to create payment link" },
      { status: 500 }
    );
  }
}
