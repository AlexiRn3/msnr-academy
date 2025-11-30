// File: app/admin/settings/page.tsx
"use client";
import { Save, CreditCard, Lock, Globe } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl space-y-8 pb-20">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tighter text-white">Platform Settings</h1>
        <p className="text-gray-400">Configure global settings for MSNR Academy.</p>
      </div>

      {/* General Settings */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-500" /> General
        </h2>
        <div className="p-8 rounded-3xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
             <div>
                <h3 className="text-white font-bold">Maintenance Mode</h3>
                <p className="text-xs text-gray-400">Disable access to the platform for students.</p>
             </div>
             <ToggleSwitch />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
             <InputGroup label="Platform Name" placeholder="MSNR Academy" />
             <InputGroup label="Support Email" placeholder="support@msnr.com" />
          </div>
        </div>
      </section>

      {/* Payment Settings */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-500" /> Stripe Configuration
        </h2>
        <div className="p-8 rounded-3xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm space-y-6">
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-sm mb-4">
             Stripe keys are managed via environment variables (.env).
          </div>
          <div className="grid gap-6">
             <InputGroup label="Stripe Public Key" placeholder="pk_test_..." disabled />
             <InputGroup label="Stripe Secret Key" placeholder="sk_test_..." disabled type="password" />
          </div>
        </div>
      </section>

      <div className="flex justify-end pt-4">
        <button className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all">
            <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

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

function ToggleSwitch() {
    return (
        <div className="w-12 h-6 bg-white/10 rounded-full p-1 cursor-pointer transition-colors hover:bg-white/20">
            <div className="w-4 h-4 bg-gray-400 rounded-full shadow-md transform transition-transform"></div>
        </div>
    )
}