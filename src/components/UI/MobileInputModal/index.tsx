"use client";
import React, { useState, useEffect, FormEvent } from "react";
import {
  Modal,
  Input,
  Button,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { firebaseAuth } from "@/libs/firebase/config";

export default function MobileInputModal({
  onClose,
  onMobileSubmit,
}: {
  onClose: () => void;
  onMobileSubmit: (mobileNumber: string) => void;
}) {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<any>()

  useEffect(() => {
    const recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, "recaptcha-container", {
      size: "invisible",
    });
    setRecaptchaVerifier(recaptchaVerifier)
    return () => {
      recaptchaVerifier.clear()
    }
  }, [firebaseAuth]);

  const handleOtpRequest = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);


    if(!recaptchaVerifier) {
      setError("Recaptcha not verified")
      return;
    }

    try {
      const confirmation = await signInWithPhoneNumber(firebaseAuth, mobileNumber,recaptchaVerifier);
      setConfirmationResult(confirmation);
      setSuccess("OTP sent successfully!");
    } catch (err: any) {
      console.log("err", err)
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError(null);
    setIsLoading(true);

    if (!confirmationResult) {
      setError("Please request OTP first.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      console.log("object", user)
      onMobileSubmit(user.phoneNumber);
      setSuccess("Mobile number verified successfully!");
      onClose();
    } catch (err: any) {
      setError("Failed to verify OTP. Please check the OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>Mobile Number Verification</ModalHeader>
        <ModalBody>
          {!confirmationResult ? (
            <form onSubmit={handleOtpRequest}>
              <Input
                type="tel"
                label="Mobile Number"
                placeholder="Enter your mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-2">
                Please enter your number with the country code (e.g., +1 for the US)
              </p>
              <Button type="submit" isDisabled={isLoading}>
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <>
              <Input
                type="text"
                label="OTP"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button onClick={handleVerifyOtp} isDisabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </>
          )}
          <div id="recaptcha-container"></div>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
