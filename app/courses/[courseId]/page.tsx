import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import PurchaseButton from "@/components/PurchaseButton";

export const dynamic = "force-dynamic";

export default async function CourseIdPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { position: "asc" },
        include: {
          lessons: {
            orderBy: { position: "asc" },
            include: {
                userProgress: true 
            }
          },
        },
      },
    },
  });

  if (!course) return redirect("/");

  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  
  let hasPurchased = false;
  if (userId) {
    const purchase = await prisma.purchase.findUnique({
      where: { userId_courseId: { userId: userId, courseId: course.id } },
    });
    hasPurchased = !!purchase;
  }

  // CALCULS
  const allLessons = course.modules.flatMap(m => m.lessons);
  
  // Trouver la prochaine leçon à faire (la première non finie)
  const firstUncompletedLesson = allLessons.find(l => 
     !l.userProgress.some(p => p.userId === userId && p.isCompleted)
  );
  
  const nextLessonId = firstUncompletedLesson?.id || allLessons[0]?.id;
  
  // Est-ce que le cours est commencé ?
  const isCourseStarted = allLessons.some(l => l.userProgress.some(p => p.userId === userId && p.isCompleted));


  return (
    <div className="max-w-5xl mx-auto pb-20 px-4 sm:px-6">
      
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 py-10">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl">{course.title}</h1>
          <p className="text-lg text-gray-400">{course.description}</p>

          <div className="flex items-center gap-4">
            {hasPurchased ? (
               <div className="flex flex-col gap-4 w-full sm:w-auto">
                 <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-3">
                   <CheckCircle className="w-5 h-5" />
                   <span className="font-bold">You own this course</span>
                 </div>
                 
                 {nextLessonId && (
                   <Link href={`/courses/${course.id}/lessons/${nextLessonId}`}>
                     <button className="w-full px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                       <PlayCircle className="w-5 h-5" />
                       {isCourseStarted ? "Continue Learning" : "Start Learning"}
                     </button>
                   </Link>
                 )}
               </div>
            ) : (
               <PurchaseButton courseId={course.id} /> 
            )}
          </div>
        </div>
        
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900">
           {course.image ? <img src={course.image} className="w-full h-full object-cover" /> : <div className="bg-white/5 w-full h-full" />}
        </div>
      </div>

      {/* Curriculum Section */}
      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-bold text-white">Course Curriculum</h2>
        
        <div className="grid gap-4">
          {course.modules.map((module) => (
            <div key={module.id} className="border border-white/10 rounded-xl overflow-hidden bg-white/5">
                <div className="px-6 py-4 bg-white/5 border-b border-white/5 font-bold text-white flex justify-between items-center">
                   <span>{module.title}</span>
                </div>
                <div>
                  {module.lessons.map((lesson) => {
                     // 1. Est-ce que CETTE leçon est finie ?
                     const isCompleted = lesson.userProgress.some(p => p.userId === userId && p.isCompleted);

                     // 2. Logique de verrouillage
                     const lessonIndex = allLessons.findIndex(l => l.id === lesson.id);
                     const previousLesson = allLessons[lessonIndex - 1];
                     
                     // Si pas acheté : bloqué sauf si gratuit ou preview (et précédent fini)
                     const isLocked = !lesson.isFree && !hasPurchased && (!previousLesson || !previousLesson.userProgress.some(p => p.userId === userId && p.isCompleted));
                     
                     // Si acheté : bloqué seulement si précédent pas fini
                     const isLockedForOwner = hasPurchased && previousLesson && !previousLesson.userProgress.some(p => p.userId === userId && p.isCompleted);
                     
                     const finalLocked = hasPurchased ? isLockedForOwner : isLocked;

                     return (
                        <div key={lesson.id} className="flex items-center justify-between px-6 py-4 border-b border-white/5 last:border-none hover:bg-white/5 transition-colors group">
                           <div className="flex items-center gap-3">
                              {/* --- MODIFICATION ICI : Gestion de l'icône --- */}
                              {finalLocked ? (
                                <Lock className="w-4 h-4 text-gray-600" />
                              ) : isCompleted ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <PlayCircle className="w-4 h-4 text-blue-400" />
                              )}
                              
                              <span className={finalLocked ? "text-gray-500" : isCompleted ? "text-gray-300" : "text-white"}>
                                {lesson.title}
                              </span>
                           </div>

                           {/* Bouton Play : On le cache si la leçon est déjà finie (ou on met "Review") */}
                           {!finalLocked && (
                               <Link href={`/courses/${course.id}/lessons/${lesson.id}`}>
                                   <button className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                                     isCompleted 
                                      ? "bg-white/10 text-white hover:bg-white/20" 
                                      : "bg-blue-600 text-white hover:bg-blue-500"
                                   }`}>
                                       {isCompleted ? "Review" : "Play"}
                                   </button>
                               </Link>
                           )}
                        </div>
                     )
                  })}
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}