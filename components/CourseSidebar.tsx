import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/data";
import { Lock, PlayCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils"; // Assurez-vous d'avoir ce fichier ou retirez cn()

interface CourseSidebarProps {
  courseId: string;
  currentLessonId?: string;
}

export default async function CourseSidebar({ courseId, currentLessonId }: CourseSidebarProps) {
  const user = await getCurrentUser();

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { position: "asc" },
        include: {
          lessons: {
            orderBy: { position: "asc" },
            include: {
              userProgress: {
                where: { userId: user?.id },
              },
            },
          },
        },
      },
    },
  });

  if (!course) return null;

  // LOGIQUE DE DÉBLOCAGE SÉQUENTIEL
  // On met toutes les leçons à plat pour vérifier l'ordre
  const allLessons = course.modules.flatMap((m) => m.lessons);

  return (
    <div className="h-full border-r border-white/10 bg-black/40 overflow-y-auto w-80 flex-shrink-0 hidden lg:block">
      <div className="p-6 border-b border-white/10">
        <h2 className="font-bold text-white line-clamp-2">{course.title}</h2>
      </div>

      <div className="flex flex-col w-full">
        {course.modules.map((module) => (
          <div key={module.id} className="flex flex-col">
            <div className="p-4 bg-white/5 font-bold text-sm text-gray-300 border-b border-white/5">
              {module.title}
            </div>
            
            {module.lessons.map((lesson) => {
              // Vérification du statut (Lock/Unlock)
              const lessonIndex = allLessons.findIndex((l) => l.id === lesson.id);
              const previousLesson = allLessons[lessonIndex - 1];
              const isCompleted = lesson.userProgress?.[0]?.isCompleted || false;
              
              // La leçon est verrouillée si :
              // 1. Ce n'est pas la première leçon
              // 2. ET la leçon précédente n'est pas finie
              const isLocked = !lesson.isFree && previousLesson && !previousLesson.userProgress?.[0]?.isCompleted;
              
              const isActive = lesson.id === currentLessonId;

              return (
                <Link
                  key={lesson.id}
                  href={isLocked ? "#" : `/courses/${courseId}/lessons/${lesson.id}`}
                  className={cn(
                    "flex items-center gap-3 p-4 text-sm transition-colors border-b border-white/5",
                    isActive ? "bg-blue-500/10 border-l-4 border-l-blue-500 text-white" : "hover:bg-white/5 text-gray-400",
                    isLocked && "opacity-50 cursor-not-allowed hover:bg-transparent"
                  )}
                >
                  {isLocked ? (
                    <Lock className="w-4 h-4 flex-shrink-0" />
                  ) : isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <PlayCircle className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-blue-500" : "")} />
                  )}
                  
                  <span className="line-clamp-2">{lesson.title}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}