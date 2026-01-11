"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Edit, Trash, Eye, Globe } from "lucide-react";
import Link from "next/link";
import { deleteCourse } from "@/app/actions/courses";
import { useRouter } from "next/navigation";

interface CourseActionsProps {
  courseId: string;
  isPublished: boolean;
}

export default function CourseActions({ courseId, isPublished }: CourseActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fermer le menu si on clique ailleurs sur la page
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this course? This cannot be undone.")) return;
    
    setIsLoading(true);
    await deleteCourse(courseId);
    setIsLoading(false);
    setIsOpen(false);
    // Optionnel : router.refresh() si le revalidatePath ne suffit pas instantanément
  };

  return (
    <div className="absolute top-4 right-4 z-20" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors shadow-sm"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col text-sm">
            
            {/* Edit */}
            <Link 
              href={`/admin/courses/${courseId}`} 
              className="flex items-center gap-2 px-4 py-3 text-gray-200 hover:bg-white/10 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Course</span>
            </Link>

            {/* Preview (Public Page) */}
            {/* Adaptez le href selon votre route publique réelle, ex: /courses/[id] */}
            <Link 
              href={`/courses/${courseId}`} 
              target="_blank"
              className="flex items-center gap-2 px-4 py-3 text-gray-200 hover:bg-white/10 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Preview as Student</span>
            </Link>

            <div className="h-px bg-white/10 my-1 mx-2" />

            {/* Delete */}
            <button 
              onClick={handleDelete}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full text-left"
            >
              <Trash className="w-4 h-4" />
              <span>{isLoading ? "Deleting..." : "Delete Course"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}