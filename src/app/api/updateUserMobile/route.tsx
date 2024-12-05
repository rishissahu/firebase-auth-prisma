
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { userId, mobileNumber } = req.body;

    if (!userId || !mobileNumber) {
      return res.status(400).json({ error: "userId and mobileNumber are required." });
    }

    try {
      // Update the user's mobile number in the database
      await prisma.user.update({
        where: { id: userId },
        data: { mobileNumber },
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ success: false, error: "Failed to update user." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
