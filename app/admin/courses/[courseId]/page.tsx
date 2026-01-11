// File: app/admin/courses/[courseId]/page.tsx
import { prisma } from "@/lib/db";
import { createModule } from "@/app/actions/modules";
import { ArrowLeft, Plus, Video, Edit } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import EditCourseForm from "./EditCourseForm"; // <--- Import du composant

export default async function CourseEditPage({ params }: { params: Promise<{ courseId: string }> }) {


    const { courseId } = await params;

    const course = await prisma.course.findUnique({
    where: { id: courseId }, // Maintenant courseId aura la bonne valeur
    include: {
      modules: {
        orderBy: { position: 'asc' },
        include: { lessons: true }
      }
    }
  });

  if (!course) {
    redirect("/admin/courses");
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-8">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/courses" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Course</h1>
          <p className="text-gray-400 text-sm">{course.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* COLONNE GAUCHE : Formulaire d'édition (Client Component) */}
        <EditCourseForm course={course} />

        {/* COLONNE DROITE : Modules & Leçons */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xl font-bold text-white">
              <Video className="w-5 h-5 text-purple-500" />
              <h2>Curriculum</h2>
            </div>
          </div>

          <div className="space-y-4">
             {/* Remplacement dans app/admin/courses/[courseId]/page.tsx */}
            {course.modules.map((module) => (
            <div key={module.id} className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-black/20">
                <div className="flex-1">
                    <h3 className="font-bold text-white">{module.title}</h3>
                    <span className="text-xs text-gray-500">{module.lessons.length} lessons</span>
                </div>
                
                <div className="flex items-center gap-2">
                    {/* Lien vers la page de gestion du module */}
                    <Link href={`/admin/courses/${course.id}/modules/${module.id}`}>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg transition-colors border border-white/5">
                        <Edit className="w-3 h-3" /> Edit Content
                    </button>
                    </Link>
                </div>
            </div>
            ))}

             {/* Formulaire Module: 
                Pour éviter l'erreur TypeScript ici sans faire un autre fichier, 
                on enveloppe l'appel dans une fonction serveur inline qui retourne void.
             */}
             <form action={async (formData) => {
                "use server"
                await createModule(course.id, formData)
             }} className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-dashed border-white/20">
                <input name="title" placeholder="New Module Name (ex: Introduction)" className="flex-1 bg-transparent border-none text-white focus:outline-none text-sm px-2" required />
                <button type="submit" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
                   <Plus className="w-4 h-4" />
                </button>
             </form>
          </div>
        </div>

      </div>
    </div>
  );
}