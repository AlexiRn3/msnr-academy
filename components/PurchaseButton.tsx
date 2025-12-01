"use client";

import { useState } from "react";
import { purchaseCourseAction } from "@/app/actions/payment";
import { Loader2, ArrowRight, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

interface PurchaseButtonProps {
  courseId: string;
  price: number;
}

export default function PurchaseButton({ courseId, price }: PurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePurchase = async () => {
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append("courseId", courseId);

    const result = await purchaseCourseAction(formData);

    if (result.success) {
      // Petit délai pour voir l'animation de succès (optionnel mais satisfaisant)
      router.refresh();
    } else {
      alert(result.error || "Error during purchase");
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePurchase}
      disabled={isLoading}
      className="w-full py-3 rounded-xl bg-white/5 hover:bg-blue-600 text-white text-sm font-bold border border-white/10 hover:border-transparent transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          Unlock Now (0€ Test) <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </button>
  );
}