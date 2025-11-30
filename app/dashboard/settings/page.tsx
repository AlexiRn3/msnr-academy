"use client";
import { useState } from "react";
import { updateProfile } from "@/app/actions/settings";
import { User, Lock, Save, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else if (result.success) {
      setMessage({ type: 'success', text: result.success as string });
      // Reset password fields
      (e.target as HTMLFormElement).reset();
    }
    setIsLoading(false);
  }

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      <h1 className="text-3xl font-bold text-white">Settings</h1>

      {message && (
        <div className={`p-4 rounded-xl text-sm ${message.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Section */}
        <section className="space-y-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" /> Public Profile
          </h2>
          <div className="p-8 rounded-3xl border border-white/10 bg-neutral-900/50 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <InputGroup name="name" label="Full Name" placeholder="Your Name" />
              <InputGroup name="email" label="Email Address" placeholder="email@example.com" />
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="space-y-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-500" /> Security
          </h2>
          <div className="p-8 rounded-3xl border border-white/10 bg-neutral-900/50 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <InputGroup name="password" label="New Password" placeholder="••••••••" type="password" />
              <InputGroup name="confirmPassword" label="Confirm Password" placeholder="••••••••" type="password" />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
           <button 
             disabled={isLoading}
             className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors disabled:opacity-50">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4" />}
              Save Changes
           </button>
        </div>
      </form>
    </div>
  );
}

function InputGroup({ label, placeholder, type = "text", name }: any) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-600"
      />
    </div>
  );
}