// Fichier: app/page.tsx
"use client";
import Navbar from "@/components/Navbar";
import PurchaseButton from "@/components/PurchaseButton"; // Assure-toi que ce composant existe ou retire-le si tu utilises le bouton statique
import { motion } from "framer-motion";
import { ArrowRight, Check, Layers, ShieldCheck, Zap, Star, Quote, TrendingUp } from "lucide-react";

// NOTE: Si tu n'as pas encore le composant PurchaseButton en version "publique" (sans userId),
// tu peux utiliser un simple bouton <button> ou Link vers /register pour cette page.
// Pour cet exemple, je vais utiliser des boutons "Get Access" qui mènent au register.
import Link from "next/link";

export default function Home() {
  return (
    <>
      
      <main className="relative flex min-h-screen flex-col items-center pt-32 pb-20 px-6 overflow-hidden selection:bg-blue-500/30">
        
        {/* Background Grille + Glow */}
        <div className="absolute inset-0 bg-grid-white [mask-image:linear-gradient(to_bottom,transparent,black,transparent)] z-0" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] opacity-20 z-0 pointer-events-none" />

        {/* --- HERO SECTION --- */}
        <div className="z-10 max-w-5xl w-full text-center space-y-8 mt-10 mb-32">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <span className="px-4 py-1.5 text-xs font-semibold tracking-wide border border-blue-500/30 bg-blue-500/10 text-blue-400 rounded-full uppercase shadow-[0_0_10px_rgba(59,130,246,0.2)]">
              Institutional Trading Concepts
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[1.1]"
          >
            Master the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-500">
              Surgical Precision
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Stop gambling. Learn the <strong>MSNR logic</strong>, liquidity zones, and institutional Order Flow to pass your Prop Firm challenges.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
          >
            <Link href="/register">
              <button className="group relative px-8 py-4 bg-white text-black font-bold rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                <span className="relative z-10 flex items-center gap-2">
                  Join the Academy <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Link>
            <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 hover:border-white/20 transition-all">
              Explore Curriculum
            </button>
          </motion.div>
        </div>

        {/* --- FEATURES / STRATEGY SECTION (ID ajoutée) --- */}
        <div id="strategy" className="z-10 py-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full scroll-mt-20">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative p-8 rounded-3xl border border-white/5 bg-neutral-900/50 backdrop-blur-sm hover:bg-neutral-900/80 transition-all duration-300 hover:border-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- STATS / PROOF SECTION --- */}
        <div className="w-full max-w-6xl py-20 border-y border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Active Students", value: "1,200+" },
              { label: "Funded Traders", value: "450+" },
              { label: "Community Messages", value: "10k+" },
              { label: "Success Rate", value: "89%" },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-4xl font-bold text-white tracking-tight">{stat.value}</div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* --- PRICING / COURSES SECTION (ID ajoutée) --- */}
        <div id="courses" className="z-10 py-32 w-full max-w-6xl scroll-mt-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter">
              Invest in your <span className="text-blue-500">Edge</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Programs designed to transform your trading, from market understanding to capital validation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {offers.map((offer, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-8 rounded-3xl border backdrop-blur-sm transition-all duration-300 flex flex-col
                  ${offer.popular 
                    ? 'bg-blue-900/10 border-blue-500/50 shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)] z-10 scale-105' 
                    : 'bg-neutral-900/50 border-white/5 hover:border-white/10 hover:bg-neutral-900/80'
                  }`}
              >
                {offer.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-white text-xs font-bold uppercase tracking-wide rounded-full shadow-lg">
                    Recommended
                  </div>
                )}

                <div className="space-y-4 mb-8">
                  <h3 className="text-xl font-bold text-white">{offer.title}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{offer.price}€</span>
                    <span className="text-sm text-gray-500">/one-time</span>
                  </div>
                  <p className="text-sm text-gray-400 min-h-[40px]">{offer.desc}</p>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                  {offer.features.map((feat, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <div className={`mt-1 p-0.5 rounded-full ${offer.popular ? 'bg-blue-500' : 'bg-white/10'}`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-gray-300">{feat}</span>
                    </div>
                  ))}
                </div>

                <Link href="/register" className="w-full">
                  <button className={`w-full py-3 rounded-xl text-sm font-bold transition-all
                    ${offer.popular 
                      ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg' 
                      : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
                    }`}>
                    Get Access Now
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- TESTIMONIALS SECTION (NOUVEAU) --- */}
        <div id="testimonials" className="z-10 py-20 w-full max-w-6xl scroll-mt-20">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter">
              What Traders <span className="text-blue-500">Say</span>
            </h2>
            <p className="text-gray-400">
              Real results from our community members trading Futures and Forex.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl border border-white/5 bg-neutral-900/30 backdrop-blur-sm hover:border-white/10 transition-colors"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 relative">
                  <Quote className="w-8 h-8 text-white/5 absolute -top-4 -left-4" />
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-bold text-white text-xs">
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{testimonial.name}</div>
                    <div className="text-xs text-blue-400">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        

      </main>
    </>
    
  );
}

// --- DATA ---

const features = [
  {
    title: "Storyline & Direction",
    desc: "Stop trading against the trend. Learn to read the Weekly/Daily narrative for high win rates.",
    icon: Layers,
  },
  {
    title: "Precision Setups",
    desc: "Master 'Sniper' entries (A-Shape, V-Shape, Gap SnR) with explosive Risk/Reward ratios.",
    icon: Zap,
  },
  {
    title: "Prop Firm Management",
    desc: "A mathematical risk approach designed specifically to pass TopStep and FundedNext without stress.",
    icon: ShieldCheck,
  },
];

const offers = [
  {
    title: "Starter Pack",
    price: 97,
    desc: "The fundamentals to understand market structure and SnR zones.",
    popular: false,
    features: [
      "Introduction to MSNR",
      "Understanding SnR (A-Shape, V-Shape)",
      "Fresh vs Unfresh Zones",
      "Community Discord Access",
      "Email Support"
    ]
  },
  {
    title: "MSNR Emperor",
    price: 197,
    desc: "The complete strategy to pass Prop Firm challenges and achieve profitability.",
    popular: true,
    features: [
      "Everything in Starter",
      "Storyline Module (Weekly/Daily)",
      "Advanced Setups (Engulfing, Breakout)",
      "Prop Firm Risk Management",
      "Trader Psychology Module",
      "Access to Live Session Replays"
    ]
  },
  {
    title: "Order Flow Mastery",
    price: 297,
    desc: "For traders who want to see what institutions actually see.",
    popular: false,
    features: [
      "Everything in Emperor",
      "Cumulative Delta (CVD) Analysis",
      "Footprint & Heatmap Reading",
      "Group Mentoring Sessions",
      "Losing Trades Analysis",
      "VIP Discord Access"
    ]
  }
];

const testimonials = [
  {
    name: "Thomas R.",
    role: "Funded TopStep 50k",
    content: "The Storyline concept completely changed how I view the charts. I stopped taking random trades and focused on Daily Direction. Passed my combine in 12 days.",
    initials: "TR"
  },
  {
    name: "Sarah L.",
    role: "Forex Trader",
    content: "I was skeptical about 'another strategy', but MSNR is just pure logic. No lagging indicators, just price action. The Fresh/Unfresh rule saved me from so many losses.",
    initials: "SL"
  },
  {
    name: "David K.",
    role: "FundedNext Trader",
    content: "The risk management module for Prop Firms is gold. It's not just about entries, it's about keeping the account. Highly recommend the Emperor pack.",
    initials: "DK"
  }
];