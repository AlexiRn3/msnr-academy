// Fichier: app/admin/page.tsx
import { DollarSign, Users, BookOpen } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Vue d'ensemble</h2>
        <p className="text-text-muted">Bienvenue sur le centre de contrôle MSNR.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Chiffre d'Affaires", value: "0,00 €", icon: DollarSign, color: "text-accent" },
          { label: "Étudiants Actifs", value: "0", icon: Users, color: "text-blue-400" },
          { label: "Formations en ligne", value: "0", icon: BookOpen, color: "text-green-400" },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-surface border border-white/5 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-400">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Section Vide pour l'instant */}
      <div className="p-12 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-gray-500">
        Graphique des ventes à venir...
      </div>
    </div>
  );
}