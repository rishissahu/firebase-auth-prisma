"use client";

import React from "react";
import GoogleAuthButton from "@/components/UI/GoogleAuthButton";
import Link from "next/link";

export default function SignUp() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
        <p className="pb-2 text-xl font-medium">Sign Up</p>
        <div className="flex flex-col gap-2">
          <GoogleAuthButton isSignUp={true}/>
        </div>
        <p className="text-center text-small">
          Already have an account?&nbsp;
          <Link href="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
