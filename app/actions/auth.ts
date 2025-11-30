// Fichier: app/actions/auth.ts
"use server";

import { prisma } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

// Schéma de validation
const AuthSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().optional(),
});

export async function registerAction(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = AuthSchema.safeParse(data);

  if (!parsed.success) {
    return { error: "Invalid data. Please check your inputs." };
  }

  const { email, password, name } = parsed.data;

  // 1. Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "User already exists." };
  }

  // 2. Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Créer l'utilisateur
  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || "",
        role: "STUDENT",
      },
    });
  } catch (error) {
    return { error: "Something went wrong. Please try again." };
  }

  // 4. Redirection (ou connexion automatique)
  redirect("/login?registered=true");
}

export async function loginAction(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = AuthSchema.safeParse({ ...data, name: "placeholder" }); // Hack rapide pour valider juste email/pass

  if (!parsed.success) return { error: "Invalid credentials." };

  const { email, password } = parsed.data;

  // 1. Chercher l'utilisateur
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) return { error: "Invalid credentials." };

  // 2. Vérifier le mot de passe
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) return { error: "Invalid credentials." };

  // NOTE: Ici, dans une vraie app, on créerait une Session (avec NextAuth ou IronSession).
  // Pour l'instant, on simule le succès.
  return { success: true, userId: user.id, role: user.role };
}