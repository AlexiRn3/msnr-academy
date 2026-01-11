// Fichier: app/actions/lessons.ts
"use server";

import { prisma } from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const LessonSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  duration: z.coerce.number().min(0).optional(), // Convertit le texte en nombre
  isFree: z.boolean().optional(),
});

export async function createLesson(courseId: string, moduleId: string, formData: FormData) {
  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    videoUrl: formData.get("videoUrl"),
    duration: formData.get("duration"),
    isFree: formData.get("isFree") === "on", // Checkbox HTML standard
  };

  const validation = LessonSchema.safeParse(rawData);

  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const { title, description, videoUrl, duration, isFree } = validation.data;

  try {
    // 1. Trouver la dernière position pour mettre la leçon à la fin
    const lastLesson = await prisma.lesson.findFirst({
      where: { moduleId },
      orderBy: { position: 'desc' },
    });

    const newPosition = lastLesson ? lastLesson.position + 1 : 1;

    // 2. Créer la leçon
    await prisma.lesson.create({
      data: {
        title,
        description: description || "",
        videoUrl: videoUrl || "",
        duration: duration || 0,
        isFree: isFree || false,
        position: newPosition,
        moduleId,
      },
    });
  } catch (error) {
    console.error(error); // Utile pour le debug serveur
    return { error: "Failed to create lesson." };
  }

  // 3. Rafraîchir et rediriger vers la page du module
  revalidatePath(`/admin/courses/${courseId}/modules/${moduleId}`);
  redirect(`/admin/courses/${courseId}/modules/${moduleId}`);
}