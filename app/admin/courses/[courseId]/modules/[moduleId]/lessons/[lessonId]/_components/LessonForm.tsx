"use client";

import { useState } from "react";
import { Save, Loader2, Video, Clock, FileText, Unlock, Eye, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios"; // Assurez-vous d'avoir axios: npm install axios
import { Lesson } from "@prisma/client";

interface LessonFormProps {
  initialData: Lesson;
  courseId: string;
  moduleId: string;
  lessonId: string;
}

export const LessonForm = ({
  initialData,
  courseId,
  moduleId,
  lessonId
}: LessonFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // États initialisés avec les données existantes
  const [title, setTitle] = useState(initialData.title);
  const [videoUrl, setVideoUrl] = useState(initialData.videoUrl || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [isFree, setIsFree] = useState(initialData.isFree);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // On utilise axios pour le patch, ou vous pouvez créer une Server Action updateLesson
      await axios.patch(`/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, {
        title,
        videoUrl,
        description,
        isFree
      });
      
      alert("Leçon mise à jour !");
      router.refresh();
    } catch {
      alert("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction utilitaire pour l'embed (copiée de votre new/page.tsx)
  function getEmbedUrl(url: string) {
    if (!url) return null;
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    
    const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[1]) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    
    return url;
  }

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Formulaire */}
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 p-6 rounded-3xl border border-white/5 bg-white/5">
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Titre</label>
                <input 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-4 focus:outline-none"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Vidéo URL</label>
                <input 
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-4 focus:outline-none"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                <textarea 
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-4 focus:outline-none"
                />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-black/20">
                <div className="text-white text-sm font-bold">Aperçu Gratuit</div>
                <input 
                    type="checkbox" 
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="w-5 h-5" 
                />
            </div>
        </div>

        <button 
            disabled={isLoading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all"
        >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Enregistrer les modifications"}
        </button>
      </form>

      {/* Preview */}
      <div className="space-y-6">
        <div className="sticky top-8 rounded-3xl border border-white/10 bg-neutral-900 overflow-hidden shadow-2xl">
            <div className="aspect-video w-full bg-black flex items-center justify-center relative">
                {embedUrl ? (
                    <iframe src={embedUrl} className="w-full h-full" allowFullScreen />
                ) : (
                    <Video className="w-12 h-12 opacity-50 text-white" />
                )}
            </div>
            <div className="p-8">
                <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
                <p className="text-gray-400 whitespace-pre-wrap">{description}</p>
            </div>
        </div>
      </div>
    </div>
  );
}