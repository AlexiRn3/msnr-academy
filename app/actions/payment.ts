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

  // 3. Créer la session Stripe (VRAI STRIPE)
  let session;
  try {
    // NOTE: Stripe refuse les montants < 0.50€.
    // Pour le test, si le cours est à 0€, on force 1€ (100 centimes) en mode test.
    const stripeAmount = Math.max(100, Math.round(course.price * 100));

    session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: course.title,
              description: course.description ? course.description.slice(0, 100) + "..." : undefined,
              // images: course.image ? [course.image] : [], // Décommentez si vos images sont des URL valides (https)
            },
            unit_amount: stripeAmount, // Prix en centimes (ex: 19700 pour 197€)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // URLs de redirection après paiement (Adaptez l'URL de base si besoin)
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/courses?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/courses?canceled=1`,
      // Métadonnées CRUCIALES pour le Webhook
      metadata: {
        courseId: course.id,
        userId: user.id,
      },
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    return { error: "Failed to create payment session" };
  }

  // 4. Rediriger vers l'URL de paiement Stripe
  if (session.url) {
    redirect(session.url);
  }
}