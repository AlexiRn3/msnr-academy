// Fichier: lib/stripe.ts
import Stripe from "stripe";

// On s'assure que la clé est présente, sinon on bloque le build (sécurité)
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing in .env");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-11-17.clover", // Utilise la version stable récente
  typescript: true,
});