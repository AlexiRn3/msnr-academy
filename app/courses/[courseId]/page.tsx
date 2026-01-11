import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle, Lock, PlayCircle, Video } from "lucide-react";

// On force le rendu dynamique pour avoir les infos à jour (prix, modules...)
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ courseId: string }>;
};

export default async function CourseIdPage(props: Props) {
  const params = await props.params;
  
  // 1. Récupérer le cours avec ses modules et leçons
  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    include: {
      modules: {
        orderBy: { position: "asc" },
        include: {
          lessons: {
            orderBy: { position: "asc" },
          },
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  // 2. Vérifier si l'utilisateur est connecté et s'il a acheté le cours
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  
  let hasPurchased = false;
  
  if (userId) {
    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: course.id,
        },
      },
    });
    hasPurchased = !!purchase;
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4 sm:px-6">
      
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 py-10">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl">
              {course.title}
            </h1>
            <p className="text-lg text-gray-400">
              {course.description}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {hasPurchased ? (
               <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-3 w-full sm:w-auto">
                 <CheckCircle className="w-5 h-5" />
                 <span className="font-bold">You own this course</span>
               </div>
            ) : (
               <div className="text-3xl font-bold text-white">
                 {course.price === 0 ? "Free" : `€${course.price}`}
               </div>
            )}
          </div>

          {/* Call to Action */}
          <div>
            {hasPurchased ? (
              <Link href={`/dashboard/courses`}>
                <button className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  Continue Learning
                </button>
              </Link>
            ) : (
              // Ici vous mettrez votre composant d'achat plus tard, pour l'instant un lien simple
              <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/25">
                Enroll Now
              </button>
            )}
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900">
           {course.image ? (
             <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
           ) : (
             <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 gap-2">
               <Video className="w-16 h-16 opacity-20" />
               <span className="text-sm font-medium">No cover image</span>
             </div>
           )}
        </div>
      </div>

      {/* Curriculum Section */}
      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-bold text-white">Course Curriculum</h2>
        
        <div className="grid gap-4">
          {course.modules.length === 0 ? (
            <p className="text-gray-500 italic">No modules published yet.</p>
          ) : (
            course.modules.map((module) => (
              <div key={module.id} className="border border-white/10 rounded-xl overflow-hidden bg-white/5">
                <div className="px-6 py-4 bg-white/5 border-b border-white/5 font-bold text-white flex justify-between items-center">
                   <span>{module.title}</span>
                   <span className="text-xs text-gray-500 font-normal">{module.lessons.length} lessons</span>
                </div>
                <div className="divide-y divide-white/5">
                  {module.lessons.map((lesson) => (
                    <div key={lesson.id} className="px-6 py-3 flex items-center justify-between hover:bg-white/5 transition-colors group">
                      <div className="flex items-center gap-3">
                         <div className={`p-1.5 rounded-full ${lesson.isFree || hasPurchased ? "bg-blue-500/20 text-blue-400" : "bg-gray-700/50 text-gray-500"}`}>
                           <PlayCircle className="w-4 h-4" />
                         </div>
                         <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                           {lesson.title}
                         </span>
                      </div>
                      
                      {/* Status Icon */}
                      <div>
                        {lesson.isFree || hasPurchased ? (
                           <span className="text-xs font-bold text-blue-400 py-1 px-2 rounded bg-blue-500/10">
                             {hasPurchased ? "Start" : "Free Preview"}
                           </span>
                        ) : (
                           <Lock className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}