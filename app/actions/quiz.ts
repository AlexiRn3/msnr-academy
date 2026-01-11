"use server";

import { prisma } from "@/lib/db";
import { LessonType } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Type pour les données reçues du formulaire
type QuizData = {
  questions: {
    question: string;
    options: {
      text: string;
      isCorrect: boolean;
    }[];
  }[];
};

export async function saveQuiz(lessonId: string, data: QuizData) {
  try {
    // 1. On passe la leçon en mode QUIZ
    await prisma.lesson.update({
      where: { id: lessonId },
      data: { type: LessonType.QUIZ },
    });

    // 2. On supprime les anciennes questions (méthode brutale mais simple pour l'édition)
    await prisma.question.deleteMany({
      where: { lessonId },
    });

    // 3. On recrée tout
    for (const [index, q] of data.questions.entries()) {
      await prisma.question.create({
        data: {
          lessonId,
          question: q.question,
          position: index,
          options: {
            create: q.options.map((opt) => ({
              text: opt.text,
              isCorrect: opt.isCorrect,
            })),
          },
        },
      });
    }

    revalidatePath(`/admin/courses`);
    return { success: true };
  } catch (error) {
    console.error("Error saving quiz:", error);
    return { error: "Failed to save quiz" };
  }
}