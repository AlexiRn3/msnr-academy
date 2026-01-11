"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ModuleSchema = z.object({
  title: z.string().min(2),
});

export async function createModule(courseId: string, formData: FormData) {
  const title = formData.get("title");
  
  const validation = ModuleSchema.safeParse({ title });
  if (!validation.success) return { error: "Invalid title" };

  // On trouve la dernière position pour placer le module à la fin
  const lastModule = await prisma.module.findFirst({
    where: { courseId },
    orderBy: { position: 'desc' },
  });
  const newPosition = lastModule ? lastModule.position + 1 : 1;

  await prisma.module.create({
    data: {
      title: validation.data.title,
      courseId,
      position: newPosition,
    }
  });

  revalidatePath(`/admin/courses/${courseId}`);
}