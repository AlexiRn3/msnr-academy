import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google"; // Import de la police
import "./globals.css";

// Configuration de la police
const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // On charge les graisses utiles
  variable: "--font-body", // On crée une variable CSS pour Tailwind
  display: "swap",
});

export const metadata: Metadata = {
  title: "MSNR Academy | Trading Strategy",
  description: "Avanced formation with Malaysian Support & Resistance.",
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