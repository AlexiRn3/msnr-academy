"use client";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
  return (
    <>
      <main className="min-h-screen bg-background pt-32 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-6">Mon Espace Membre</h1>
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-gray-400">
              Welcome to your MSNR Academy space. Your training courses will appear here.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}