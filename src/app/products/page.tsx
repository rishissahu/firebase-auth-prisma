"use client";
import { Button } from "@nextui-org/react";
import Script from "next/script";
import React, { useState } from "react";

function Page() {
  const AMOUNT = 100;
  const [isProcessing, setIsProcessing] = useState(false);

  const orderCreationHandler = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/createOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to create order. Please try again.");

      const data = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_KEY_ID,
        amount: AMOUNT * 100,
        currency: "INR",
        name: "AIR Drop",
        description: "This is a test payment",
        order_id: data.orderId,
        handler: async function (response:any) {
          try {
            const payload = {
              orderCreationId: data.orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            };

            const result = await fetch("/api/verifyPayment", {
              method: "POST",
              body: JSON.stringify(payload),
              headers: { "Content-Type": "application/json" },
            });

            const verifyResponse = await result.json();

            if (verifyResponse.isOk) {
              alert("Payment successful!");
            } else {
              alert("Payment verification failed: " + verifyResponse.message);
            }
          } catch (verificationError) {
            console.error("Payment verification error:", verificationError);
            alert("An error occurred during payment verification. Please try again.");
          }
        },
        modal: {
          ondismiss: function () {
            alert("Payment was canceled by the user.");
          },
        },
        prefill: {
          name: "Rishi", 
          email: "rishi@mail.com",
          contact: "1234567890",
        },
      };

      const rzp1 = new window.Razorpay(options);

      rzp1.on("payment.failed", function (response:any) {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description || "Unknown error"}`);
      });

      rzp1.open();
    } catch (error) {
      console.error("Error during payment initiation:", error);
      alert("An error occurred during the payment process. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <Button disabled={isProcessing} onClick={orderCreationHandler}>
        {isProcessing ? "Processing..." : "Create Order"}
      </Button>
    </div>
  );
}

export default Page;
