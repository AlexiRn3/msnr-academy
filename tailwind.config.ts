// Fichier: tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#121212",
        primary: "#3B82F6",
        accent: "#EAB308",
        text: {
          main: "#EDEDED",
          muted: "#A1A1AA"
        }
      },
      fontFamily: {
        // C'est ici que la magie opère : on lie la variable créée dans layout.tsx
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'], 
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};
export default config;