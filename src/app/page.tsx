import Image from "next/image";

declare global {
  interface Window {
    Razorpay: any,
  }
}
export default function Home() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      Home Page
    </div>
  );
}
