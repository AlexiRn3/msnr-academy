"use client";
import { User, Lock, Bell, CreditCard } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-8 pb-20">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tighter text-white">Settings</h1>
        <p className="text-gray-400">Manage your account and preferences.</p>
      </div>

      {/* Profile Section */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-blue-500" /> Public Profile
        </h2>
        <div className="p-8 rounded-3xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
              AL
            </div>
            <div>
              <button className="px-4 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors">
                Change Avatar
              </button>
              <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. 1MB max.</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <InputGroup label="Full Name" placeholder="Alexis" />
            <InputGroup label="Email Address" placeholder="alexis@example.com" disabled />
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-blue-500" /> Security
        </h2>
        <div className="p-8 rounded-3xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <InputGroup label="New Password" placeholder="••••••••" type="password" />
            <InputGroup label="Confirm Password" placeholder="••••••••" type="password" />
          </div>
          <div className="flex justify-end">
             <button className="px-6 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-500 transition-colors">
                Update Password
             </button>
          </div>
        </div>
      </section>

      {/* Billing (Static for now) */}
      <section className="space-y-6 opacity-50 pointer-events-none">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-gray-500" /> Billing (Coming Soon)
        </h2>
        <div className="p-6 rounded-xl border border-white/5 bg-white/5 text-center text-sm text-gray-500">
          Subscription management will be available soon.
        </div>
      </section>

    </div>
  );
}

function InputGroup({ label, placeholder, type = "text", disabled = false }: any) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">{label}</label>
      <input
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}