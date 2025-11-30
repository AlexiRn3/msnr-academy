// File: app/admin/courses/page.tsx
import Link from "next/link";
import { Plus, MoreVertical, Edit, Trash } from "lucide-react";
import { prisma } from "@/lib/db";

export default async function AdminCoursesPage() {
  // Fetch courses from the database
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { purchases: true, modules: true }
      }
    }
  });

  return (
    <div className="space-y-8 pb-20">
      
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tighter text-white">Courses Management</h1>
          <p className="text-gray-400">Create, edit, and manage your training programs.</p>
        </div>
        <Link href="/admin/courses/new">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(59,130,246,0.4)]">
            <Plus className="w-4 h-4" />
            New Course
          </button>
        </Link>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/5">
            <p className="text-gray-400 mb-4">No courses available yet.</p>
            <Link href="/admin/courses/new" className="text-blue-500 hover:underline">
              Create your first course
            </Link>
          </div>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="group relative overflow-hidden rounded-3xl border border-white/5 bg-neutral-900/50 backdrop-blur-sm hover:border-white/10 transition-all duration-300">
              
              {/* Status Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full border backdrop-blur-md ${
                  course.isPublished 
                    ? "bg-green-500/10 text-green-400 border-green-500/20" 
                    : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                }`}>
                  {course.isPublished ? "Published" : "Draft"}
                </span>
              </div>

              {/* Action Menu (Mockup) */}
              <button className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Course Cover Placeholder */}
              <div className="h-40 w-full bg-gradient-to-b from-white/5 to-transparent" />

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{course.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{course._count.modules} Modules</span>
                    <span>{course._count.purchases} Students</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-lg font-bold text-white">
                    {course.price > 0 ? `€${course.price}` : "Free"}
                  </span>
                  <Link href={`/admin/courses/${course.id}`}>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg transition-colors border border-white/5">
                      <Edit className="w-3 h-3" /> Edit
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