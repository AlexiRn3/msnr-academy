"use server";

import { prisma } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const SettingsSchema = z.object({
  userId: z.string(),
  name: z.string().min(2, "Name too short"),
  email: z.string().email(),
  password: z.string().optional(), // Optionnel : on ne le change que si rempli
  confirmPassword: z.string().optional()
}).refine((data) => {
  if (data.password && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export async function updateProfile(formData: FormData) {
  const rawData = Object.fromEntries(formData);
  
  // On récupère l'ID utilisateur depuis le cookie (sécurité)
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  
  if (!userId) return { error: "Unauthorized" };

  // Validation
  const validatedData = SettingsSchema.safeParse({
    ...rawData,
    userId
  });

  if (!validatedData.success) {
    return { error: validatedData.error.issues[0].message };
  }

  const { name, email, password } = validatedData.data;

  try {
    const updateData: any = { name, email };
    
    // Si un nouveau mot de passe est fourni, on le hash et on l'ajoute
    if (password && password.length >= 6) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    revalidatePath("/dashboard/settings");
    return { success: "Profile updated successfully!" };
  } catch (error) {
    return { error: "Failed to update profile. Email might be taken." };
  }
}