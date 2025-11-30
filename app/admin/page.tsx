import { DollarSign, Users, BookOpen } from "lucide-react";
import { getAdminStats } from "@/lib/data";

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Overview</h2>
        <p className="text-gray-400">Welcome to the MSNR control center.</p>
      </div>

      {/* Stats Cards avec VRAIES données */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Total Revenue" 
          value={`${stats.revenue.toLocaleString()} €`} 
          icon={DollarSign} 
          color="text-accent" 
        />
        <StatCard 
          label="Active Students" 
          value={stats.students.toString()} 
          icon={Users} 
          color="text-blue-400" 
        />
        <StatCard 
          label="Published Courses" 
          value={stats.courses.toString()} 
          icon={BookOpen} 
          color="text-green-400" 
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="p-6 bg-[#121212] border border-white/5 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-400">{label}</span>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}