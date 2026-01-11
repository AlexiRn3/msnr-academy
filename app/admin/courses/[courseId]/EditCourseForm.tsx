// File: app/admin/courses/[courseId]/EditCourseForm.tsx
"use client";

import { useState } from "react";
import { updateCourse } from "@/app/actions/courses";
import { Save, Loader2, LayoutList } from "lucide-react";
import { Course } from "@prisma/client"; // Assurez-vous d'avoir généré le client prisma

interface EditCourseFormProps {
  course: Course;
}

export default function EditCourseForm({ course }: EditCourseFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    // On appelle l'action manuellement ici pour récupérer le résultat
    const result = await updateCourse(course.id, formData);

    if (result?.error) {
      setError(result.error);
    }
    
    setIsLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xl font-bold text-white">
        <LayoutList className="w-5 h-5 text-blue-500" />
        <h2>Course Details</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-3xl border border-white/5 bg-white/5">
        
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Title</label>
          <input 
            name="title" 
            defaultValue={course.title} 
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
          <textarea 
            name="description" 
            rows={4} 
            defaultValue={course.description} 
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Price (€)</label>
          <input 
            name="price" 
            type="number" 
            step="0.01" 
            defaultValue={course.price} 
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Image URL</label>
          <input 
            name="image" 
            defaultValue={course.image || ""} 
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
          />
        </div>

        <div className="flex items-center gap-2 py-2">
          <input 
            type="checkbox" 
            name="isPublished" 
            defaultChecked={course.isPublished} 
            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500" 
          />
          <label className="text-sm text-gray-300">Published</label>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
          Save Details
        </button>
      </form>
    </div>
  );
}