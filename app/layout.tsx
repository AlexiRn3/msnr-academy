import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google"; // Import de la police
import "./globals.css";
import Footer from "@/components/Footer";

// Configuration de la police
const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // On charge les graisses utiles
  variable: "--font-body", // On crée une variable CSS pour Tailwind
  display: "swap",
});

export const metadata: Metadata = {
  title: "MSNR Academy | Trading Institutionnel",
  description: "Formation avancée sur la stratégie MSNR et l'Order Flow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${fontSans.variable} font-sans antialiased bg-background text-text-main`}>
        {children}
      </body>
    </html>
  );
}