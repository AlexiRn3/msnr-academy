import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LessonForm } from "./_components/LessonForm"; 
import { IconBadge } from "@/components/icon-badge"; 
import { ArrowLeft, Video } from "lucide-react";
import Link from "next/link";

const LessonIdPage = async ({
  params
}: {
  params: Promise<{ courseId: string; moduleId: string; lessonId: string }>
}) => {
  // 1. On attend que les paramètres soient résolus
  const { courseId, moduleId, lessonId } = await params;

  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  // 2. On utilise les variables résolues (lessonId, moduleId)
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
      moduleId: moduleId,
    },
  });

  if (!lesson) {
    return redirect("/");
  }

  const requiredFields = [
    lesson.title,
    lesson.description,
    lesson.videoUrl,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/admin/courses/${courseId}/modules/${moduleId}`}
            className="flex items-center text-sm hover:opacity-75 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au module setup
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">
                Édition de la leçon
              </h1>
              <span className="text-sm text-slate-700">
                Complétez tous les champs {completionText}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">
                Personnaliser la leçon
              </h2>
            </div>
            <LessonForm
              initialData={lesson}
              courseId={courseId}
              moduleId={moduleId}
              lessonId={lessonId}
            />
          </div>
        </div>
        <div>
          {/* Composants additionnels */}
        </div>
      </div>
    </div>
  );
}

export default LessonIdPage;