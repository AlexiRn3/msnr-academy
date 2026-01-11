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

// Ajoutez ceci à la fin de app/actions/courses.ts
export async function updateCourse(courseId: string, formData: FormData) {
  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    image: formData.get("image"),
    isPublished: formData.get("isPublished") === "on",
  };

  const validation = CourseSchema.safeParse(rawData);

  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const { title, description, price, image, isPublished } = validation.data;

  try {
    await prisma.course.update({
      where: { id: courseId },
      data: {
        title,
        description,
        price,
        image,
        isPublished,
      },
    });
  } catch (error) {
    return { error: "Update failed." };
  }

  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath("/admin/courses");
  return { success: true };
}

export async function deleteCourse(courseId: string) {
  try {
    await prisma.course.delete({
      where: { id: courseId },
    });
    revalidatePath("/admin/courses");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete course." };
  }
}