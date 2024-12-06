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
  const [firebaseId, setFirebaseId] = useState<string>("");

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
      if (!responseData.user.mobileNumber) {
        setFirebaseId(user.uid)
        setUserId(responseData.user.id);
        setShowMobileModal(true);
      } else {
        await createSession(user.uid);
      }
      if (onSuccess) onSuccess();
    }
  };

  const handleMobileSubmit = async (mobileNumber: string) => {
    try {
      const res = await fetch("/api/updateUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, mobileNumber }),
      });
  
      if (res.ok) {
        const data = await res.json();
        console.log("User updated successfully:", data);
      } else {
        const errorData = await res.json();
        console.error("Failed to update user:", errorData.error);
      }
    } catch (err) {
      console.error("Error during update:", err);
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
          onClose={() => {
            setShowMobileModal(false)
            createSession(firebaseId)
          }}
          onMobileSubmit={handleMobileSubmit}
        />
      )}
    </>
  );
}
