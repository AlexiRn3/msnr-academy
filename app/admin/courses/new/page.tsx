// Fichier: app/admin/courses/new/page.tsx
"use client";
import { createCourse } from "@/app/actions/courses";
import { useState } from "react";
import { Save, Loader2, ArrowLeft, Image as ImageIcon, Euro } from "lucide-react";
import Link from "next/link";

export default function NewCoursePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createCourse(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
    // Si succès, la redirection est gérée par le serveur
  }

  return (
    <div className="max-w-2xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/courses" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tighter">Create New Course</h1>
          <p className="text-gray-400 text-sm">Add a new training program to the catalog.</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Title & Price */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Course Title</label>
            <input 
              name="title" 
              type="text" 
              placeholder="ex: MSNR Emperor Masterclass"
              className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-700"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Price (€)</label>
            <div className="relative">
              <Euro className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                name="price" 
                type="number" 
                placeholder="197"
                step="0.01"
                className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                required
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Description</label>
          <textarea 
            name="description" 
            rows={6}
            placeholder="Detailed description of the course content..."
            className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-700 resize-none"
            required
          />
        </div>

        {/* Image URL */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Cover Image URL</label>
          <div className="relative">
            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              name="image" 
              type="url" 
              placeholder="https://..."
              className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-700"
            />
          </div>
        </div>

        {/* Publish Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
          <div>
            <h3 className="text-white font-bold">Publish Immediately</h3>
            <p className="text-xs text-gray-400">Make this course visible to students right now.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" name="isPublished" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button 
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Course
          </button>
        </div>
      </form>
    </div>
  );
}