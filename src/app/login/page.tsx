import React from "react";
import Link from "next/link";
import GoogleAuthButton from "@/components/UI/GoogleAuthButton";

export default function Login() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
        <p className="pb-2 text-xl font-medium">Log In</p>
        <div className="flex flex-col gap-2">
          <GoogleAuthButton/>
        </div>
        <p className="text-center text-small">
          Need to create an account?&nbsp;
          <Link href="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
