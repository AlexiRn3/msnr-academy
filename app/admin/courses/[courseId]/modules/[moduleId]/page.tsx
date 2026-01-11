import { prisma } from "@/lib/db";
import { ArrowLeft, Video, Plus, Edit, Trash } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

// On force le rendu dynamique pour éviter les soucis de cache
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ courseId: string; moduleId: string }>;
};

export default async function ModuleEditPage(props: Props) {
  const params = await props.params;
  
  const moduleData = await prisma.module.findUnique({
    where: {
      id: params.moduleId,
      courseId: params.courseId,
    },
    include: {
      lessons: {
        orderBy: { position: 'asc' },
      },
    },
  });

  if (!moduleData) {
    redirect(`/admin/courses/${params.courseId}`);
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-8">
      {/* Header avec retour */}
      <div className="flex items-center gap-4">
        <Link 
          href={`/admin/courses/${params.courseId}`} 
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Module</h1>
          <p className="text-gray-400 text-sm">Manage lessons and settings for this section.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* COLONNE GAUCHE : Infos du Module */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-white/5 bg-white/5 space-y-4">
            <h2 className="text-lg font-bold text-white">Module Settings</h2>
            
            {/* Formulaire simple pour renommer (Server Action à créer si besoin, ou utiliser un client component comme pour Course) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Module Title</label>
              <input 
                defaultValue={moduleData.title}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                disabled // Pour l'instant en lecture seule, on fera l'action d'update après si vous validez
              />
              <p className="text-xs text-gray-500">To rename the module, we will add an action later.</p>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : Les Leçons (Contenu) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-purple-500" />
              Lessons
            </h2>
            <Link href={`/admin/courses/${params.courseId}/modules/${params.moduleId}/lessons/new`}>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors border border-white/5">
                <Plus className="w-4 h-4" /> Add Lesson
              </button>
            </Link>
          </div>

          <div className="space-y-3">
            {moduleData.lessons.length === 0 ? (
              <div className="text-sm text-gray-500 text-center py-8 border border-dashed border-white/10 rounded-xl bg-white/5">
                No lessons in this module yet.
              </div>
            ) : (
              moduleData.lessons.map((lesson) => (
                <div key={lesson.id} className="group flex items-center justify-between p-4 rounded-xl border border-white/10 bg-black/20 hover:border-white/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{lesson.title}</h3>
                      <p className="text-xs text-gray-500">{lesson.isFree ? "Free Preview" : "Locked"}</p>
                    </div>
                  </div>
                  
                  <Link href={`/admin/courses/${params.courseId}/modules/${params.moduleId}/lessons/${lesson.id}`}>
                    <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}