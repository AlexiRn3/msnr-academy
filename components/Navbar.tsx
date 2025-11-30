"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-6"
    >
      <div className="flex items-center justify-between w-full max-w-5xl bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 shadow-lg shadow-black/20">
        
        {/* Logo */}
        <div className="text-xl font-bold tracking-tighter text-white">
          MSNR <span className="text-blue-500">ACADEMY</span>
        </div>

        {/* Menu (Desktop) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <Link href="#" className="hover:text-white transition-colors">The Strategy</Link>
          <Link href="#" className="hover:text-white transition-colors">Courses</Link>
          <Link href="#" className="hover:text-white transition-colors">Testimonials</Link>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-white hover:text-gray-300 transition-colors hidden sm:block">
            Login
          </Link>
          <Link href="/register" className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition-all">
            Get Started
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}