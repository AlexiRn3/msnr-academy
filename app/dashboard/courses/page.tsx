import { getStudentCourses, getCurrentUser } from "@/lib/data";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Play, Clock } from "lucide-react";

export default async function MyCoursesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const courses = await getStudentCourses(user.id);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tighter text-white">My Courses</h1>
        <p className="text-gray-400">Pick up your learning right where you left off.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? (
            <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
        ) : (
            courses.map((course) => (
            <div key={course.id} className="group relative overflow-hidden rounded-3xl border border-white/5 bg-neutral-900/50 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300">
                <div className="h-32 w-full bg-gradient-to-br from-blue-900 to-black relative">
                <div className="absolute inset-0 bg-black/20" />
                </div>

                <div className="p-6 space-y-4">
                <div>
                    <h3 className="text-xl font-bold text-white mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-400">{course.completedLessons} / {course.totalLessons} Lessons</p>
                </div>

                {/* Real Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${course.progress}%` }} 
                    />
                    </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-white/5">
                    <Link href={`/dashboard/courses/${course.id}`} className="w-full">
                        <button className="w-full py-2 flex items-center justify-center gap-2 rounded-lg bg-white text-black hover:bg-blue-500 hover:text-white transition-all text-sm font-bold">
                        <Play className="w-3 h-3" /> Continue
                        </button>
                    </Link>
                </div>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
}