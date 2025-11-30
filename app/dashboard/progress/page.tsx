import { getStudentGlobalProgress, getCurrentUser } from "@/lib/data";
import { redirect } from "next/navigation";
import { Trophy, Clock, Target } from "lucide-react";

export default async function ProgressPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const stats = await getStudentGlobalProgress(user.id);

  return (
    <div className="space-y-8 pb-20">
      <h1 className="text-3xl font-bold tracking-tighter text-white">My Progress</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Time Spent" value={stats.timeSpent} icon={Clock} />
        <StatCard label="Lessons Completed" value={stats.completedCount.toString()} icon={Target} />
        <StatCard label="Certificates" value="0" icon={Trophy} />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: any) {
  return (
    <div className="p-6 rounded-2xl border border-white/5 bg-neutral-900/50">
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-5 h-5 text-blue-400" />
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</div>
    </div>
  );
}