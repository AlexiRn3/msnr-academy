import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/data";
import { redirect } from "next/navigation";
import { markLessonAsCompleted } from "@/app/actions/progress";
import { CheckCircle, ChevronRight, PlayCircle, Lock } from "lucide-react";
import Link from "next/link";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  const user = await getCurrentUser();

  if (!user) return redirect("/login");

  // 1. Récupérer la leçon et le cours
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { position: "asc" },
        include: { lessons: { orderBy: { position: "asc" } } },
      },
    },
  });

  if (!course) return redirect("/");

  // 2. Trouver la leçon actuelle et gérer la navigation (Next/Prev)
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const lessonIndex = allLessons.findIndex((l) => l.id === lessonId);
  const lesson = allLessons[lessonIndex];

  if (!lesson) return redirect(`/courses/${courseId}`);

  // 3. Vérifier le verrouillage (Security Check)
  const previousLesson = allLessons[lessonIndex - 1];
  if (previousLesson) {
    const isPrevCompleted = await prisma.userProgress.findUnique({
        where: { userId_lessonId: { userId: user.id, lessonId: previousLesson.id } }
    });
    if (!isPrevCompleted && !lesson.isFree) {
        // Si on essaie de tricher avec l'URL, on renvoie à la leçon précédente
        return redirect(`/courses/${courseId}/lessons/${previousLesson.id}`);
    }
  }

  // 4. Calculer la leçon suivante
  const nextLesson = allLessons[lessonIndex + 1];

  // 5. Statut actuel
  const userProgress = await prisma.userProgress.findUnique({
    where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } },
  });
  const isCompleted = !!userProgress?.isCompleted;

  // Fonction pour l'embed video (réutilisée)
  const getEmbedUrl = (url: string | null) => {
    if (!url) return null;
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    return url; // Fallback
  };

  return (
    <div className="flex flex-col max-w-5xl mx-auto pb-20">
      
      {/* VIDEO PLAYER */}
      <div className="w-full aspect-video bg-black border-b border-white/10 relative">
        {lesson.videoUrl ? (
          <iframe
            src={getEmbedUrl(lesson.videoUrl) || ""}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 flex-col gap-2">
            <Lock className="w-10 h-10" />
            <p>No video content</p>
          </div>
        )}
      </div>

      {/* CONTENU & BOUTONS */}
      <div className="p-8 space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-white">{lesson.title}</h1>
          
          {/* Action Button */}
          <form action={async () => {
              "use server";
              await markLessonAsCompleted(lesson.id, course.id);
              if (nextLesson) {
                  redirect(`/courses/${course.id}/lessons/${nextLesson.id}`);
              } else {
                redirect(`/courses/${course.id}`); // Fin du cours
              }
          }}>
             <button 
                type="submit"
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all ${
                    isCompleted 
                    ? "bg-green-600 hover:bg-green-500" 
                    : "bg-blue-600 hover:bg-blue-500"
                }`}
             >
                {isCompleted ? (
                    <>
                        <CheckCircle className="w-5 h-5" /> Completed
                    </>
                ) : (
                    <>
                        Mark as Complete {nextLesson && <ChevronRight className="w-5 h-5" />}
                    </>
                )}
             </button>
          </form>
        </div>

        <div className="prose prose-invert max-w-none">
            <p className="text-gray-400 whitespace-pre-wrap">{lesson.description}</p>
        </div>

      </div>
    </div>
  );
}