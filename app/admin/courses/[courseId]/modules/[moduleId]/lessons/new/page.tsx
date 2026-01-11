// Fichier: app/admin/courses/[courseId]/modules/[moduleId]/lessons/new/page.tsx
"use client";

import { createLesson } from "@/app/actions/lessons";
import { useState, use } from "react"; // 'use' est nécessaire pour les params dans Next 15 client components
import { Save, Loader2, ArrowLeft, Video, Clock, FileText, Lock, Unlock } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function NewLessonPage() {
  // Dans un composant client, useParams() est le moyen le plus simple de récupérer les IDs
  const params = useParams();
  const courseId = params.courseId as string;
  const moduleId = params.moduleId as string;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    // On appelle l'action
    const result = await createLesson(courseId, moduleId, formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
    // Si succès, la redirection est faite par le serveur
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href={`/admin/courses/${courseId}/modules/${moduleId}`} 
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tighter">New Lesson</h1>
          <p className="text-gray-400 text-sm">Add content to your module.</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 p-6 rounded-3xl border border-white/5 bg-white/5">
            
            {/* Title */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Lesson Title</label>
                <input 
                name="title" 
                type="text" 
                placeholder="ex: Introduction to React Hooks"
                className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-700"
                required
                />
            </div>

            {/* Video URL & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Video URL</label>
                    <div className="relative">
                        <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                            name="videoUrl" 
                            type="url" 
                            placeholder="Vimeo, YouTube, etc."
                            className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-700"
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Duration (minutes)</label>
                    <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                            name="duration" 
                            type="number" 
                            min="0"
                            placeholder="10"
                            className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-700"
                        />
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Description</label>
                <div className="relative">
                    <FileText className="absolute left-4 top-4 w-4 h-4 text-gray-500" />
                    <textarea 
                        name="description" 
                        rows={6}
                        placeholder="Explain what the student will learn in this lesson..."
                        className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-700 resize-none"
                    />
                </div>
            </div>

            {/* Is Free Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-black/20">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                        <Unlock className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm">Free Preview</h3>
                        <p className="text-xs text-gray-400">Allow users to watch this video without purchasing.</p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="isFree" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
            </div>

        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button 
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Create Lesson
          </button>
        </div>
      </form>
    </div>
  );
}