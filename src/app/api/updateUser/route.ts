import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, mobileNumber } = body;

    if (!userId || !mobileNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const existingUser = await prisma.user.findFirst({
      where: {
        mobileNumber,
        NOT: { id: userId },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Mobile number is already associated with another account" },
        { status: 409 }
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {mobileNumber:mobileNumber},
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error during user update:", error);
    return NextResponse.json(
      { error: "User update failed" },
      { status: 400 }
    );
  }
}
