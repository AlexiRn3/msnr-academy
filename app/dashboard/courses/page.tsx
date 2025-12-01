import { getStudentCourses, getUnpurchasedCourses, getCurrentUser } from "@/lib/data";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Play, Lock, ArrowRight, Check, Sparkles } from "lucide-react";

export default async function MyCoursesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // 1. On récupère les deux listes
  const myCourses = await getStudentCourses(user.id);
  const availableUpgrades = await getUnpurchasedCourses(user.id);

  const hasPurchased = myCourses.length > 0;

  return (
    <div className="space-y-12 pb-20">
      
      {/* --- SECTION 1 : MES COURS (Seulement si j'en ai) --- */}
      {hasPurchased && (
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tighter text-white">My Courses</h1>
            <p className="text-gray-400">Pick up your learning right where you left off.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map((course) => (
              <div key={course.id} className="group relative overflow-hidden rounded-3xl border border-white/5 bg-neutral-900/50 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300">
                <div className="h-32 w-full bg-gradient-to-br from-blue-900 to-black relative">
                   {course.image ? (
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover opacity-50" />
                   ) : (
                      <div className="absolute inset-0 bg-black/20" />
                   )}
                   <div className="absolute bottom-4 left-4">
                      <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wide bg-white/10 backdrop-blur-md rounded text-white border border-white/10">
                        Purchased
                      </span>
                   </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{course.title}</h3>
                    <p className="text-sm text-gray-400">{course.completedLessons} / {course.totalLessons} Lessons</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-500" 
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
            ))}
          </div>
        </div>
      )}

      {/* --- SECTION 2 : UPGRADES / OFFRES (Si disponible) --- */}
      {availableUpgrades.length > 0 && (
        <div className="space-y-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold tracking-tighter text-white flex items-center gap-2">
              {hasPurchased ? "Let's Upgrade?" : "Start Your Journey"} 
              {!hasPurchased && <Sparkles className="w-5 h-5 text-yellow-500" />}
            </h2>
            <p className="text-gray-400">
              {hasPurchased 
                ? "Take your trading to the next level with these advanced programs."
                : "Choose a program to unlock your institutional trading potential."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {availableUpgrades.map((course) => (
              <div 
                key={course.id} 
                className="relative p-8 rounded-3xl border border-white/5 bg-neutral-900/50 backdrop-blur-sm hover:border-blue-500/50 hover:bg-neutral-900/80 transition-all duration-300 flex flex-col"
              >
                {/* Contenu Haut */}
                <div className="mb-6 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 text-blue-400">
                    <Lock className="w-6 h-6" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">{course.price}€</span>
                    <span className="text-xs text-gray-500 uppercase">/ one-time</span>
                  </div>
                </div>

                {/* Features (Simulation visuelle pour l'instant) */}
                <div className="space-y-3 mb-8 flex-1">
                  <div className="flex items-start gap-3 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Full Access to all modules</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Video resources & PDFs</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Lifetime updates</span>
                  </div>
                </div>

                {/* CTA */}
                <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-blue-600 text-white text-sm font-bold border border-white/10 hover:border-transparent transition-all flex items-center justify-center gap-2 group">
                  Unlock Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}