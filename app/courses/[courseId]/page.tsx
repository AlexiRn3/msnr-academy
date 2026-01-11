import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle, PlayCircle, Video } from "lucide-react";
import LessonItem from "@/components/LessonItem"; // <--- Import 1
import PurchaseButton from "@/components/PurchaseButton"; // <--- Import 2

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ courseId: string }>;
};

export default async function CourseIdPage(props: Props) {
  const params = await props.params;
  
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
              // Utilisation du nouveau bouton fonctionnel
              <PurchaseButton courseId={course.id} /> 
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
                <div>
                  {module.lessons.map((lesson) => (
                    // Utilisation du composant LessonItem pour l'accordéon
                    <LessonItem 
                      key={lesson.id} 
                      lesson={lesson} 
                      isLocked={!lesson.isFree && !hasPurchased} 
                    />
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