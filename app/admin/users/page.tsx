// File: app/admin/users/page.tsx
import { prisma } from "@/lib/db";
import { Search, Mail, Shield, Calendar } from "lucide-react";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50 // Limit to 50 for now
  });

  return (
    <div className="space-y-8 pb-20">
      
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tighter text-white">Students & Users</h1>
          <p className="text-gray-400">Manage user access and permissions.</p>
        </div>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
                type="text" 
                placeholder="Search email..." 
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all w-64"
            />
        </div>
      </div>

      <div className="rounded-3xl border border-white/5 bg-neutral-900/50 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 text-gray-200 uppercase font-bold text-xs">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-900 to-slate-900 flex items-center justify-center text-xs font-bold text-white border border-white/10">
                        {user.email[0].toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{user.name || "No Name"}</span>
                        <span className="text-xs flex items-center gap-1">
                           <Mail className="w-3 h-3" /> {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                      user.role === "ADMIN" 
                        ? "bg-red-500/10 text-red-400 border-red-500/20" 
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`}>
                      {user.role === "ADMIN" && <Shield className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-400 hover:text-white transition-colors font-medium text-xs">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}