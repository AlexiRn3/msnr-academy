"use client";
import { motion } from "framer-motion";
import { Play, Clock } from "lucide-react";

export default function MyCoursesPage() {
  return (
    <div className="space-y-8 pb-20">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tighter text-white">My Courses</h1>
        <p className="text-gray-400">Pick up your learning right where you left off.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Course Card 1 (Active) */}
        <CourseCard 
          title="MSNR Emperor"
          module="Module 2: Storyline & Direction"
          progress={35}
          lastAccessed="2 hours ago"
          image="bg-gradient-to-br from-blue-900 to-black"
        />

        {/* Course Card 2 */}
        <CourseCard 
          title="Order Flow Mastery"
          module="Introduction to Footprint"
          progress={10}
          lastAccessed="2 days ago"
          image="bg-gradient-to-br from-amber-900 to-black"
        />
      </div>
    </div>
  );
}

function CourseCard({ title, module, progress, lastAccessed, image }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-3xl border border-white/5 bg-neutral-900/50 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300"
    >
      {/* Cover Image Placeholder */}
      <div className={`h-32 w-full ${image} relative`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-4 left-4">
          <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wide bg-white/10 backdrop-blur-md rounded text-white border border-white/10">
            In Progress
          </span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
          <p className="text-sm text-gray-400">{module}</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-white/5">
          <span className="text-xs text-gray-600 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {lastAccessed}
          </span>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-black hover:bg-blue-500 hover:text-white transition-all">
            <Play className="w-3 h-3 ml-0.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}