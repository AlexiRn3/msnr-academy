"use client";

import { createCheckoutSession } from "@/app/actions/payment";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface PurchaseButtonProps {
  courseId: string;
}

export default function PurchaseButton({ courseId }: PurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEnroll = async () => {
    setIsLoading(true);
    try {
        const result = await createCheckoutSession(courseId);
        if (result.url) {
            router.push(result.url); // Redirection vers Stripe ou Dashboard
        } else if (result.error) {
            alert(result.error);
            setIsLoading(false);
        }
    } catch (error) {
        console.error(error);
        setIsLoading(false);
        alert("Something went wrong");
    }
  };

  return (
    <button 
      onClick={handleEnroll}
      disabled={isLoading}
      className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
      Enroll Now
    </button>
  );
}