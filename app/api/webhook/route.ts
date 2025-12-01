// Fichier: app/api/webhook/route.ts
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // On écoute uniquement l'événement "Paiement réussi"
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // On récupère nos métadonnées (envoyées à l'étape 3)
    const userId = session.metadata?.userId;
    const courseId = session.metadata?.courseId;

    if (userId && courseId) {
      // On crée l'achat en base de données (Sécurisé)
      await prisma.purchase.create({
        data: {
          userId: userId,
          courseId: courseId,
          amount: session.amount_total ? session.amount_total / 100 : 0, // On stocke le vrai prix payé
        },
      });
    }
  }

  return new NextResponse(null, { status: 200 });
}