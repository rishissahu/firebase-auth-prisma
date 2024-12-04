"use client";

import React from "react";
import { Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { signInWithGoogle } from "@/libs/firebase/auth";
import { createSession } from "@/actions/auth-actions";

export default function GoogleAuthButton({ onSuccess, isSignUp }:{onSuccess?:()=>void, isSignUp?:boolean}) {
  const handleSignIn = async () => {
    const user = await signInWithGoogle();
    if (user) {
      console.log("user", user);
      const userPayload = {
        name: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified,
        profilePicture: user.photoURL,
      };

      if (isSignUp) {
        const res = await fetch("/api/createUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userPayload),
        });
        console.log("Sign Up Response:", await res.text());
      }

      await createSession(user.uid);
      if (onSuccess) onSuccess();
    }
  };

  return (
    <Button
      startContent={<Icon icon="flat-color-icons:google" width={24} />}
      variant="bordered"
      className="text-black"
      onClick={handleSignIn}
    >
      Continue with Google
    </Button>
  );
}
