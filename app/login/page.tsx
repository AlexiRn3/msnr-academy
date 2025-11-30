"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Mail, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    // Simulation d'un appel API (à connecter plus tard avec NextAuth/Supabase)
    setTimeout(() => setIsLoading(false), 2000);
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      
      {/* --- BACKGROUND DYNAMIQUE (Même style que la Home) --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-white [mask-image:linear-gradient(to_bottom,transparent,black,transparent)] opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* --- BOUTON RETOUR --- */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-8 left-8 z-20"
      >
        <Link href="/" className="group flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <div className="p-2 rounded-full bg-white/5 border border-white/5 group-hover:border-white/10 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span>Retour à l'accueil</span>
        </Link>
      </motion.div>

      {/* --- CARTE DE CONNEXION --- */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="rounded-3xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl p-8 shadow-2xl shadow-black/50">
          
          {/* Header de la carte */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold tracking-tighter text-white mb-2">
              MSNR <span className="text-blue-500">ACADEMY</span>
            </h1>
            <p className="text-sm text-gray-400">
              Connectez-vous pour accéder à votre dashboard.
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input Email */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">
                Adresse Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="email"
                  placeholder="nom@exemple.com"
                  className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-600"
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Mot de passe
                </label>
                <Link href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  Oublié ?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-600"
                  required
                />
              </div>
            </div>

            {/* Bouton Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative overflow-hidden bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-200 focus:ring-4 focus:ring-white/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span>Se connecter</span>
                )}
              </div>
            </button>
          </form>

          {/* Footer de la carte */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-gray-500">
              Pas encore membre ?{" "}
              <Link href="#" className="text-white font-medium hover:underline decoration-blue-500 decoration-2 underline-offset-4">
                Créer un compte
              </Link>
            </p>
          </div>

        </div>
      </motion.div>
    </main>
  );
}