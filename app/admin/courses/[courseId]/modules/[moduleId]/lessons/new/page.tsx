"use client";

import { createLesson } from "@/app/actions/lessons";
import { useState } from "react";
import { Save, Loader2, ArrowLeft, Video, Clock, FileText, Unlock, Eye } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function NewLessonPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const moduleId = params.moduleId as string;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // États pour la prévisualisation en temps réel
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isFree, setIsFree] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createLesson(courseId, moduleId, formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  // Fonction utilitaire pour détecter et transformer les liens vidéos en embed
  function getEmbedUrl(url: string) {
    if (!url) return null;
    
    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Vimeo
    const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // Si c'est un lien mp4 direct ou autre, on le retourne tel quel (on essaiera un iframe ou video tag)
    return url;
  }

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="max-w-[1600px] mx-auto pb-20 px-4">
      
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* COLONNE GAUCHE : Formulaire */}
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
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
                            rows={8}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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
                        <input 
                          type="checkbox" 
                          name="isFree" 
                          checked={isFree}
                          onChange={(e) => setIsFree(e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                </div>

            </div>

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

        {/* COLONNE DROITE : Prévisualisation */}
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-xl font-bold text-white">
                <Eye className="w-5 h-5 text-green-400" />
                <h2>Live Preview</h2>
            </div>
            
            {/* Simulation de la carte de cours / player */}
            <div className="sticky top-8 rounded-3xl border border-white/10 bg-neutral-900 overflow-hidden shadow-2xl">
                
                {/* Zone Vidéo */}
                <div className="aspect-video w-full bg-black flex items-center justify-center relative border-b border-white/5">
                    {embedUrl ? (
                         <iframe 
                            src={embedUrl} 
                            className="w-full h-full" 
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                         />
                    ) : (
                        <div className="flex flex-col items-center gap-3 text-gray-600">
                            <Video className="w-12 h-12 opacity-50" />
                            <p className="text-sm">Enter a video URL to preview</p>
                        </div>
                    )}
                    
                    {/* Badge Free/Locked en preview */}
                    <div className="absolute top-4 left-4 z-10">
                        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full border backdrop-blur-md ${
                            isFree 
                                ? "bg-green-500/10 text-green-400 border-green-500/20" 
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}>
                            {isFree ? "Free Preview" : "Locked Content"}
                        </span>
                    </div>
                </div>

                {/* Contenu Texte */}
                <div className="p-8 space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            {title || "Lesson Title Preview"}
                        </h1>
                    </div>

                    <div className="prose prose-invert max-w-none">
                        {description ? (
                            <p className="text-gray-400 whitespace-pre-wrap leading-relaxed">{description}</p>
                        ) : (
                            <p className="text-gray-700 italic">Description will appear here...</p>
                        )}
                    </div>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
}