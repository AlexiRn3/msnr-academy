import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/data";
import { redirect } from "next/navigation";
import { markLessonAsCompleted } from "@/app/actions/progress";
import { CheckCircle, ChevronRight, Lock } from "lucide-react";
import StudentQuiz from "@/components/StudentQuiz"; 

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  const user = await getCurrentUser();

  if (!user) return redirect("/login");

  // 1. Récupérer le cours, la leçon, et les questions (si c'est un quiz)
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { position: "asc" },
        include: { 
            lessons: { 
                orderBy: { position: "asc" },
                include: {
                    // Important : On récupère les questions et options pour le mode Quiz
                    questions: {
                        orderBy: { position: 'asc' },
                        include: { options: true }
                    }
                }
            } 
        },
      },
    },
  });

  if (!course) return redirect("/");

  // 2. Trouver la leçon actuelle
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const lessonIndex = allLessons.findIndex((l) => l.id === lessonId);
  const lesson = allLessons[lessonIndex];

  if (!lesson) return redirect(`/courses/${courseId}`);

  // 3. Vérifier le verrouillage (SÉCURITÉ)
  const previousLesson = allLessons[lessonIndex - 1];
  if (previousLesson) {
    const isPrevCompleted = await prisma.userProgress.findUnique({
        where: { userId_lessonId: { userId: user.id, lessonId: previousLesson.id } }
    });
    
    // Si la leçon précédente n'est pas finie et que celle-ci n'est pas gratuite -> Redirection
    if ((!isPrevCompleted || !isPrevCompleted.isCompleted) && !lesson.isFree) {
        return redirect(`/courses/${courseId}/lessons/${previousLesson.id}`);
    }
  }

  // 4. Calculer la leçon suivante (pour le bouton "Next")
  const nextLesson = allLessons[lessonIndex + 1];

  // 5. Vérifier si CETTE leçon est déjà terminée
  const userProgress = await prisma.userProgress.findUnique({
    where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } },
  });
  const isCompleted = !!userProgress?.isCompleted;

  // Utilitaire pour transformer les liens YouTube/Vimeo en embed
  const getEmbedUrl = (url: string | null) => {
    if (!url) return null;
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    return url;
  };

  // --- AFFICHAGE : MODE QUIZ ---
  if (lesson.type === 'QUIZ') {
    return (
        <div className="flex flex-col pb-20">
            <div className="max-w-5xl mx-auto w-full p-8 space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-white">Quiz: {lesson.title}</h1>
                    <p className="text-gray-400">Answer all questions correctly to complete this lesson.</p>
                </div>
                
                <div className="h-px bg-white/10 w-full my-6" />

                <StudentQuiz 
                    lessonId={lesson.id}
                    courseId={course.id}
                    nextLessonId={nextLesson?.id}
                    questions={lesson.questions}
                />
            </div>
        </div>
    );
  }

  // --- AFFICHAGE : MODE VIDÉO (Défaut) ---
  return (
    <div className="flex flex-col pb-20">
      
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

      {/* CONTENU TEXTE & BOUTON */}
      <div className="max-w-5xl mx-auto w-full p-8 space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-white">{lesson.title}</h1>
          
          {/* Bouton de validation (Server Action) */}
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