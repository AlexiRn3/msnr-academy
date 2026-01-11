"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function markLessonAsCompleted(lessonId: string, courseId: string) {
  const user = await getCurrentUser();

  if (!user) return { error: "Unauthorized" };

  await prisma.userProgress.upsert({
    where: {
      userId_lessonId: {
        userId: user.id,
        lessonId: lessonId,
      },
    },
    update: {
      isCompleted: true,
    },
    create: {
      userId: user.id,
      lessonId: lessonId,
      isCompleted: true,
    },
  });

  revalidatePath(`/courses/${courseId}`);
  return { success: true };
}