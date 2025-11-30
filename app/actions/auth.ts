// File: app/actions/auth.ts
"use server";

import { prisma } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  name: z.string().optional(),
});

export async function registerAction(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = AuthSchema.safeParse(data);

  if (!parsed.success) {
    return { error: "Invalid data." };
  }

  const { email, password, name } = parsed.data;

  // 1. Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "An account already exists with this email address." };
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Create user
  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || "",
        role: "STUDENT",
      },
    });
    return { success: true };
  } catch (error) {
    return { error: "An error occurred during registration." };
  }
}

export async function loginAction(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = AuthSchema.safeParse({ ...data, name: "LoginUser" });

  if (!parsed.success) return { error: "Invalid data format." };

  const { email, password } = parsed.data;

  // 1. Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "No account found with this email address." };
  }

  // 2. Verify password
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return { error: "Incorrect password." };
  }

  // 3. Create Session
  const cookieStore = await cookies();
  await cookieStore.set("userId", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });

  return { success: true, userId: user.id, role: user.role };
}