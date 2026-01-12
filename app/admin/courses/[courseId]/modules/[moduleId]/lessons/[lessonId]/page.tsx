import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LessonForm } from "./_components/LessonForm"; // Assurez-vous d'avoir ce composant ou adaptez le chemin
import { IconBadge } from "@/components/icon-badge"; // Vérifiez le chemin de vos composants
import { ArrowLeft, Video } from "lucide-react";
import Link from "next/link";

const LessonIdPage = async ({
  params
}: {
  params: { courseId: string; moduleId: string; lessonId: string }
}) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  // Récupérer la leçon
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: params.lessonId,
      moduleId: params.moduleId, // Sécurité supplémentaire
    },
  });

  if (!lesson) {
    return redirect("/");
  }

  // Champs obligatoires pour la completion (exemple)
  const requiredFields = [
    lesson.title,
    lesson.description,
    lesson.videoUrl,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/admin/courses/${params.courseId}/modules/${params.moduleId}`}
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
            {/* Vous devez réutiliser le formulaire que vous utilisez probablement dans 'new/page.tsx' 
                mais en lui passant les 'initialData' */}
            <LessonForm
              initialData={lesson}
              courseId={params.courseId}
              moduleId={params.moduleId}
              lessonId={params.lessonId}
            />
          </div>
        </div>
        <div>
          {/* Ajoutez ici d'autres composants comme la gestion vidéo (Mux) ou les pièces jointes */}
        </div>
      </div>
    </div>
  );
}

export default LessonIdPage;