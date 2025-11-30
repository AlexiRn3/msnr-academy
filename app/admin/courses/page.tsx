// Fichier: app/admin/courses/page.tsx
import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db"; // On créera ce fichier juste après

export default async function CoursesPage() {
  // On récupère les cours depuis la base de données (Server Component)
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Mes Formations</h2>
        <Link href="/admin/courses/new">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-600 text-white font-medium rounded-lg transition-all">
            <Plus className="w-4 h-4" />
            Nouveau Cours
          </button>
        </Link>
      </div>

      {/* Liste des cours */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            Aucune formation pour le moment. Créez votre première formation MSNR.
          </div>
        ) : (
          courses.map((course: typeof courses[number]) => (
            <div key={course.id} className="group p-5 bg-surface border border-white/5 hover:border-primary/50 rounded-xl transition-all cursor-pointer">
              <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
            {course.title}
              </h3>
              <p className="text-sm text-gray-400 mt-2 line-clamp-2">
            {course.description || "Pas de description"}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs font-medium">
            <span className="bg-white/5 px-2 py-1 rounded text-gray-300">
              {course.price > 0 ? `${course.price} €` : "Gratuit"}
            </span>
            <span className={course.isPublished ? "text-green-400" : "text-yellow-500"}>
              {course.isPublished ? "Publié" : "Brouillon"}
            </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}