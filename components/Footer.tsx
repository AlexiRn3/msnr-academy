"use client";
import Link from "next/link";
import { Twitter, Youtube, Instagram, Github, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-black pt-20 pb-10 overflow-hidden">
      
      {/* Ambient glow at the bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          
          {/* Column 1: Brand & Mission */}
          <div className="space-y-6 md:col-span-2">
            <div className="text-2xl font-bold tracking-tighter text-white">
              MSNR <span className="text-blue-500">ACADEMY</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              The premier platform for retail traders adopting an institutional approach. Master Price Action, Order Flow, and get funded.
            </p>
            <div className="flex gap-4">
              <SocialLink href="#" icon={Twitter} />
              <SocialLink href="#" icon={Youtube} />
              <SocialLink href="#" icon={Instagram} />
              <SocialLink href="#" icon={Github} />
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><FooterLink href="#">Courses</FooterLink></li>
              <li><FooterLink href="#">Mentoring</FooterLink></li>
              <li><FooterLink href="#">Trading Blog</FooterLink></li>
              <li><FooterLink href="#">Member Login</FooterLink></li>
            </ul>
          </div>

          {/* Column 3: Legal & Support */}
          <div>
            <h4 className="text-white font-semibold mb-6">Information</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><FooterLink href="#">Terms & Conditions</FooterLink></li>
              <li><FooterLink href="#">Privacy Policy</FooterLink></li>
              <li><FooterLink href="#">Legal Notice</FooterLink></li>
              <li><FooterLink href="#">Support</FooterLink></li>
            </ul>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Risk Disclaimer & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500 text-center md:text-left">
          <p className="max-w-2xl">
            <span className="text-gray-400 font-bold">Risk Warning:</span> Trading financial products (Futures, Forex, CFDs) involves a high level of risk and may not be suitable for all investors. You should only trade with capital you can afford to lose. MSNR Academy is an educational platform and does not provide investment advice.
          </p>
          <div className="whitespace-nowrap">
            &copy; {new Date().getFullYear()} MSNR Academy. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

// Utility components to keep code clean
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