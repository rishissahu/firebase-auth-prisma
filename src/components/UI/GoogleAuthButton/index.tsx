"use client";
import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { signInWithGoogle } from "@/libs/firebase/auth";
import { createSession } from "@/actions/auth-actions";
import MobileInputModal from "../MobileInputModal";

export default function GoogleAuthButton({
  onSuccess,
  isSignUp,
}: {
  onSuccess?: () => void;
  isSignUp?: boolean;
}) {
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const handleSignIn = async () => {
    const user = await signInWithGoogle();
    if (user) {
      const userPayload = {
        name: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified,
        profilePicture: user.photoURL,
      };
      const res = await fetch("/api/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload),
      });

      const responseData = await res.json();

      if (!responseData.mobileNumber) {
        setUserId(user.uid);
        setShowMobileModal(true);
      } else {
        await createSession(user.uid);
      }
      if (onSuccess) onSuccess();
    }
  };

  const handleMobileSubmit = async (mobileNumber: string) => {
    try {
      const res = await fetch("/api/updateUserMobile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, mobileNumber }),
      });

      if (res.ok) {
        setShowMobileModal(false);
        await createSession(userId!);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error("Failed to update mobile number:", err);
    }
  };

  return (
    <>
      <Button
        startContent={<Icon icon="flat-color-icons:google" width={24} />}
        variant="bordered"
        className="text-black"
        onClick={handleSignIn}
      >
        Continue with Google
      </Button>
      {showMobileModal && (
        <MobileInputModal
          onClose={() => setShowMobileModal(false)}
          onMobileSubmit={handleMobileSubmit}
        />
      )}
    </>
  );
}
