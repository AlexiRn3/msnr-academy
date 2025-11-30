"use client";
import { motion } from "framer-motion";
import { Trophy, Flame, Target, Clock } from "lucide-react";

export default function ProgressPage() {
  return (
    <div className="space-y-8 pb-20">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tighter text-white">My Progress</h1>
        <p className="text-gray-400">Track your statistics and consistency.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Hours Learned" value="12.5h" icon={Clock} delay={0} />
        <StatCard label="Lessons Completed" value="24" icon={Target} delay={0.1} />
        <StatCard label="Current Streak" value="3 Days" icon={Flame} delay={0.2} highlight />
        <StatCard label="Certificates" value="0" icon={Trophy} delay={0.3} />
      </div>

      {/* Detailed Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Main Chart Area (Mockup) */}
        <div className="lg:col-span-2 p-8 rounded-3xl border border-white/5 bg-neutral-900/50 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-white mb-6">Learning Activity</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[40, 70, 35, 50, 90, 60, 80].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className={`w-full rounded-t-lg ${i === 4 ? 'bg-blue-500' : 'bg-white/5'} hover:bg-blue-500/50 transition-colors`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-500 font-mono">
            <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
          </div>
        </div>

        {/* Next Achievements */}
        <div className="p-8 rounded-3xl border border-white/5 bg-neutral-900/50 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-white mb-6">Next Achievements</h3>
          <div className="space-y-4">
            <AchievementItem title="First Steps" desc="Complete Module 1" progress={100} done />
            <AchievementItem title="The Analyst" desc="Watch 5h of video" progress={65} />
            <AchievementItem title="MSNR Master" desc="Complete Emperor Course" progress={20} />
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, delay, highlight }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={`p-6 rounded-2xl border ${highlight ? 'border-blue-500/30 bg-blue-500/5' : 'border-white/5 bg-neutral-900/50'}`}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className={`w-5 h-5 ${highlight ? 'text-blue-400' : 'text-gray-400'}`} />
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</div>
    </motion.div>
  );
}

function AchievementItem({ title, desc, progress, done }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${done ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-white/5 border-white/10 text-gray-600'}`}>
        {done ? <Trophy className="w-4 h-4" /> : <Target className="w-4 h-4" />}
      </div>
      <div className="flex-1">
        <h4 className={`text-sm font-bold ${done ? 'text-white' : 'text-gray-400'}`}>{title}</h4>
        <div className="h-1.5 w-full bg-white/5 rounded-full mt-2 overflow-hidden">
          <div className={`h-full rounded-full ${done ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}