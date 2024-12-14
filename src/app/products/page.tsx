"use client";
import { Button } from "@nextui-org/react";
import Script from "next/script";
import React, { useState } from "react";

function page() {
  const AMOUNT = 100;
  const [isProcessing, setIsProcessing] = useState(false);

  const orderCreationHandler = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/createOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res?.json();

      const options = {
        key: process.env.NEXT_PUBLIC_KEY_ID,
        secret: process.env.NEXT_PUBLIC_KEY_SECRET,
        amount: AMOUNT * 100,
        name: "AIR Drop",
        description: "This is test payment",
        order_id: data.orderId,
        handler: async function (response: any) {
          console.log("payment successfull", response);
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
            alert("payment succeed");
          } else {
            alert(verifyResponse.message);
          }
        },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("error in payment", error);
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <div>
      <Button disabled={isProcessing} onClick={orderCreationHandler}>
        Create order
      </Button>
    </div>
  );
}

export default page;
