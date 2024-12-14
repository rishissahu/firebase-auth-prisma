import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Razorpay from "razorpay";

const razropay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_KEY_ID!,
  key_secret: process.env.NEXT_PUBLIC_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const order = await razropay.orders.create({
      amount: 100 * 100,
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    });
    return NextResponse.json({ orderId: order.id }, { status: 200 });
} catch (error) {
    console.error("payment order creation error", error)
    return NextResponse.json({ error: "Error creating an order" }, { status: 500 });
  }
}
