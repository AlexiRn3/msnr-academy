"use client";
import Link from "next/link";
import { Twitter, Youtube, Instagram, Github, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-black pt-20 pb-10 overflow-hidden">
      
      {/* Lueur d'ambiance en bas de page */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          
          {/* Colonne 1 : Brand & Mission */}
          <div className="space-y-6 md:col-span-2">
            <div className="text-2xl font-bold tracking-tighter text-white">
              MSNR <span className="text-blue-500">ACADEMY</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              La plateforme de référence pour les traders particuliers souhaitant adopter une approche institutionnelle. Maîtrisez le Price Action, l'Order Flow et validez vos capitaux.
            </p>
            <div className="flex gap-4">
              <SocialLink href="#" icon={Twitter} />
              <SocialLink href="#" icon={Youtube} />
              <SocialLink href="#" icon={Instagram} />
              <SocialLink href="#" icon={Github} />
            </div>
          </div>

          {/* Colonne 2 : Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-6">Plateforme</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><FooterLink href="#">Formations</FooterLink></li>
              <li><FooterLink href="#">Mentoring</FooterLink></li>
              <li><FooterLink href="#">Blog Trading</FooterLink></li>
              <li><FooterLink href="#">Connexion Membre</FooterLink></li>
            </ul>
          </div>

          {/* Colonne 3 : Légal & Support */}
          <div>
            <h4 className="text-white font-semibold mb-6">Informations</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><FooterLink href="#">Conditions Générales</FooterLink></li>
              <li><FooterLink href="#">Politique de Confidentialité</FooterLink></li>
              <li><FooterLink href="#">Mentions Légales</FooterLink></li>
              <li><FooterLink href="#">Support Client</FooterLink></li>
            </ul>
          </div>
        </div>

        {/* Séparateur */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Disclaimer Risques & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500 text-center md:text-left">
          <p className="max-w-2xl">
            <span className="text-gray-400 font-bold">Avertissement sur les risques :</span> Le trading de produits financiers (Futures, Forex, CFD) comporte un niveau de risque élevé et peut ne pas convenir à tous les investisseurs. Vous ne devez engager que du capital que vous êtes prêt à perdre. MSNR Academy est une plateforme éducative et ne fournit pas de conseils en investissement.
          </p>
          <div className="whitespace-nowrap">
            &copy; {new Date().getFullYear()} MSNR Academy. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
}

// Petits composants utilitaires pour garder le code propre
function SocialLink({ href, icon: Icon }: { href: string; icon: any }) {
  return (
    <Link 
      href={href} 
      className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
    >
      <Icon className="w-4 h-4" />
    </Link>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group flex items-center gap-1 hover:text-blue-400 transition-colors">
      {children}
      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
    </Link>
  );
}