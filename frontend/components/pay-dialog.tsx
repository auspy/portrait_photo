"use client";

import * as React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

// Define a type for the plan
interface Plan {
  userDetails: any;
  userEmail: string;
  title: string;
  description: string;
  price: string;
  features: string[];
}

interface PayDialogProps {
  userDetails: any;
  userEmail: string;
  isOpen: boolean;
  onClose: () => void;
}

const PlanCard: React.FC<Plan> = ({
  userDetails,
  userEmail,
  title,
  description,
  price,
  features,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);

  const handleDirectToPaymentLink = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/create-payment", {
        planType: "monthly",
      });

      if (response.data.paymentUrl) {
        router.push(response.data.paymentUrl);
      } else {
        throw new Error("No payment URL received");
      }
    } catch (error) {
      console.error("Error creating payment link:", error);
      toast({
        title: "Error",
        description: "Failed to create payment link",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscription_id: userDetails.subscription_id }),
      });

      if (!response.ok) {
        throw new Error("Failed to cancel subscription");
      }

      // Handle successful cancellation (e.g., update UI, show a success message)
      toast({
        title: "Your subscription has been cancelled",
      });
      window.location.reload();
    } catch (error) {
      console.error("Error cancelling subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        className={title.includes("Pro") ? "border border-emerald-400" : ""}
      >
        <CardHeader className="flex flex-col items-start space-y-2">
          <div className="flex flex-col items-start space-y-2">
            <CardTitle className="font-bold">{title}</CardTitle>
            <CardDescription className="text-sm font-normal">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-start space-y-4">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-semibold">{price}</span>
            <span className="text-sm font-medium opacity-50">/month</span>
          </div>
          <ul className="grid gap-2 text-left">
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="flex justify-center">
          {title.includes("Free") ? (
            userDetails.paid ? (
              <Button
                onClick={() => setIsConfirmDialogOpen(true)}
                disabled={false}
              >
                {loading ? "Please wait" : "Cancel Subscription"}
              </Button>
            ) : (
              <Button disabled={true}>
                {loading ? "Please wait" : "Current Plan"}
              </Button>
            )
          ) : title.includes("Pro") ? (
            userDetails.paid ? (
              <Button disabled={true}>
                {loading ? "Please wait" : "Current Plan"}
              </Button>
            ) : (
              <Button onClick={handleDirectToPaymentLink} disabled={loading}>
                {loading ? "Please wait" : "Upgrade"}
              </Button>
            )
          ) : null}
        </CardFooter>
      </Card>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your plan? This will cancel your
              current subscription.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={handleCancelSubscription}
              disabled={loading}
              variant={"destructive"}
            >
              {loading ? "Please wait" : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Define the PayDialog component
const PayDialog: React.FC<PayDialogProps> = ({
  userDetails,
  userEmail,
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Picture Outline Generator Plans</DialogTitle>
          <DialogDescription>
            Choose a plan to enhance your image outlines
          </DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-6 max-w-sm md:max-w-none">
          <PlanCard
            userDetails={userDetails}
            userEmail={userEmail}
            title="Free"
            description="Basic outline generation with limitations"
            price="$0"
            features={[
              "2 image generations per month",
              "Basic outline colors",
              "Standard border thickness options",
              "PNG/JPG support",
            ]}
          />
          <PlanCard
            userDetails={userDetails}
            userEmail={userEmail}
            title="Pro ✨"
            description="Professional outline generation with advanced features"
            price="$9"
            features={[
              "Unlimited image generations",
              "Custom RGB color selection",
              "Adjustable border thickness",
              "Priority processing",
              "API access for integration",
            ]}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PayDialog;
