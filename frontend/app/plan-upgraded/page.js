"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supportEmail } from "@/constants";
import Logo from "@/components/Logo";

export default function PaymentStatus() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkPayment = async () => {
      try {
        const paymentStatus = searchParams.get("status");
        const sessionId = searchParams.get("session_id");

        if (!paymentStatus) {
          setStatus("error");
          setError("Invalid payment session");
          return;
        }

        switch (paymentStatus) {
          case "success":
          case "active":
            setStatus("success");
            break;
          case "failed":
            setStatus("error");
            setError("Payment failed. Please try again.");
            break;
          case "cancelled":
            setStatus("error");
            setError("Payment was cancelled.");
            break;
          default:
            setStatus("error");
            setError("Unknown payment status");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setStatus("error");
        setError("Failed to verify payment status");
      }
    };

    checkPayment();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center space-y-6">
          <Logo />

          {status === "loading" && (
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
              <h2 className="text-xl font-semibold">Verifying Payment</h2>
              <p className="text-gray-600">
                Just a moment while we confirm your upgrade...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center space-y-6">
              <div className="rounded-full bg-green-100 p-3 mx-auto w-fit">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-green-600">
                  Plan Upgraded Successfully!
                </h2>
                <p className="text-gray-600">
                  Your account has been upgraded to the Pro plan. You now have
                  access to all premium features.
                </p>
              </div>
              <div className="space-y-3 pt-4">
                <Link
                  href="/app"
                  className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Start Using Pro Features
                </Link>
                <Link
                  href="/"
                  className="block w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Return Home
                </Link>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="text-center space-y-6">
              <div className="rounded-full bg-red-100 p-3 mx-auto w-fit">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-red-600">
                  Payment Failed
                </h2>
                <p className="text-gray-600">{error}</p>
              </div>
              <div className="space-y-3 pt-4">
                <Link
                  href="/"
                  className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Try Again
                </Link>
                <a
                  href={`mailto:${supportEmail}`}
                  className="block w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Contact Support
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
