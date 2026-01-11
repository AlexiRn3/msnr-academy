"use server";

import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe"; // Assurez-vous d'avoir configuré stripe dans lib/stripe.ts
import { getCurrentUser } from "@/lib/data";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createCheckoutSession(courseId: string) {
  const user = await getCurrentUser();

  if (!user || !user.email) {
    return { error: "You must be logged in to enroll." };
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    return { error: "Course not found." };
  }

  // 1. GESTION DES COURS GRATUITS
  // Si le prix est nul ou 0, on inscrit l'utilisateur directement
  if (!course.price || course.price === 0) {
    const existingPurchase = await prisma.purchase.findUnique({
        where: {
            userId_courseId: { userId: user.id, courseId: course.id }
        }
    });

    if (!existingPurchase) {
        await prisma.purchase.create({
            data: {
                userId: user.id,
                courseId: course.id,
                amount: 0,
            }
        });
    }

    revalidatePath(`/courses/${course.id}`);
    return { url: `/dashboard/courses` }; // Redirection vers le dashboard
  }

  const line_items = [
    {
      quantity: 1,
      price_data: {
        currency: "EUR",
        product_data: {
          name: course.title,
          description: course.description!,
        },
        unit_amount: Math.round(course.price * 100), // Stripe attend des centimes
      },
    },
  ];

  let stripeCustomer = await prisma.stripeCustomer.findUnique({
    where: { userId: user.id },
    select: { stripeCustomerId: true },
  });

  if (!stripeCustomer) {
    const customer = await stripe.customers.create({
      email: user.email,
    });

    stripeCustomer = await prisma.stripeCustomer.create({
      data: {
        userId: user.id,
        stripeCustomerId: customer.id,
      },
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomer.stripeCustomerId,
    line_items,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/courses?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
    metadata: {
      courseId: course.id,
      userId: user.id,
    },
  });

  return { url: session.url };
}