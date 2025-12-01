// Fichier: app/actions/payment.ts
"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/data";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

export async function createCheckoutSession(formData: FormData) {
  const courseId = formData.get("courseId") as string;
  const user = await getCurrentUser();

  if (!user || !user.email) {
    return { error: "Unauthorized" };
  }

  // 1. Récupérer le cours
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    return { error: "Course not found" };
  }

  // 2. Vérifier si déjà acheté
  const existingPurchase = await prisma.purchase.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
  });

  if (existingPurchase) {
    return { error: "Already purchased" };
  }

  // 3. Créer la session Stripe
  let session;
  try {
    session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: course.title,
              description: course.description ? course.description.slice(0, 100) + "..." : undefined,
              images: course.image ? [course.image] : [],
            },
            unit_amount: Math.round(course.price * 100), // Stripe est en centimes !
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/courses?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/courses?canceled=1`,
      // Métadonnées cruciales pour le Webhook
      metadata: {
        courseId: course.id,
        userId: user.id,
      },
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    return { error: "Failed to create payment session" };
  }

  // 4. Rediriger vers Stripe
  if (session.url) {
    redirect(session.url);
  }
}