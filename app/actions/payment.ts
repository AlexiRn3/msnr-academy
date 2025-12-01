"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function purchaseCourseAction(formData: FormData) {
  const courseId = formData.get("courseId") as string;
  const user = await getCurrentUser();

  if (!user) {
    return { error: "You must be logged in to purchase." };
  }

  try {
    // 1. Vérifier si l'utilisateur a déjà acheté ce cours
    const existingPurchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId,
        },
      },
    });

    if (existingPurchase) {
      return { error: "You already own this course." };
    }

    // 2. Simuler le paiement (Création de l'achat en BDD)
    // On enregistre un montant de 0 pour le test
    await prisma.purchase.create({
      data: {
        userId: user.id,
        courseId: courseId,
        amount: 0, // Gratuit pour le test
      },
    });

    // 3. Rafraîchir la page pour afficher le cours débloqué
    revalidatePath("/dashboard/courses");
    return { success: true };

  } catch (error) {
    console.error("Payment error:", error);
    return { error: "Transaction failed. Please try again." };
  }
}