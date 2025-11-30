// Fichier: app/actions/courses.ts
"use server";

import { prisma } from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const CourseSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  description: z.string().min(10, "Description is too short"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  image: z.string().url().optional().or(z.literal("")),
  isPublished: z.boolean().optional(),
});

export async function createCourse(formData: FormData) {
  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    image: formData.get("image"),
    isPublished: formData.get("isPublished") === "on", // Checkbox returns "on" if checked
  };

  const validation = CourseSchema.safeParse(rawData);

  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const { title, description, price, image, isPublished } = validation.data;

  try {
    await prisma.course.create({
      data: {
        title,
        description,
        price,
        image: image || null,
        isPublished: isPublished || false,
      },
    });
  } catch (error) {
    return { error: "Failed to create course in database." };
  }

  revalidatePath("/admin/courses");
  redirect("/admin/courses");
}