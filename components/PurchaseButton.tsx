"use client";

import { useState } from "react";
import { createCheckoutSession } from "@/app/actions/payment"; // On utilise la vraie action Stripe
import { Loader2, ArrowRight, CreditCard } from "lucide-react";

interface PurchaseButtonProps {
  courseId: string;
  price: number;
}

export default function PurchaseButton({ courseId, price }: PurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append("courseId", courseId);

    // Cette action va rediriger l'utilisateur vers Stripe
    const result = await createCheckoutSession(formData);

    if (result?.error) {
      alert(result.error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePurchase}
      disabled={isLoading}
      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Redirecting...
        </>
      ) : (
        <>
          Buy Now {price}€ <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </button>
  );
}