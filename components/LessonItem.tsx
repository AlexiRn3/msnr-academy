"use client";

import { Lesson } from "@prisma/client";
import { ChevronDown, Lock, PlayCircle, Video } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LessonItemProps {
  lesson: Lesson;
  isLocked: boolean;
}

export default function LessonItem({ lesson, isLocked }: LessonItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-none">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-white/5 transition-colors group",
          isOpen && "bg-white/5"
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-full transition-colors",
            isLocked ? "bg-gray-800 text-gray-500" : "bg-blue-500/20 text-blue-400"
          )}>
            {isLocked ? <Lock className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
          </div>
          <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
            {lesson.title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {lesson.isFree && isLocked && (
            <span className="text-xs font-bold text-blue-400 py-1 px-2 rounded bg-blue-500/10">
              Free Preview
            </span>
          )}
          <span className="text-xs text-gray-500">
             {lesson.duration} min
          </span>
          <ChevronDown className={cn("w-4 h-4 text-gray-500 transition-transform", isOpen && "rotate-180")} />
        </div>
      </div>

      {/* Description Area */}
      {isOpen && (
        <div className="px-6 pb-4 pl-16 text-sm text-gray-400 animate-in slide-in-from-top-2 fade-in duration-200">
            <p className="whitespace-pre-wrap">{lesson.description || "No description available."}</p>
            
            {/* Si c'est une preview gratuite, on peut même montrer le player ici plus tard */}
            {lesson.isFree && (
                <div className="mt-3 flex items-center gap-2 text-blue-400 text-xs">
                    <Video className="w-4 h-4" />
                    <span>This lesson allows a free preview.</span>
                </div>
            )}
        </div>
      )}
    </div>
  );
}