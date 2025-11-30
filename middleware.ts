// Fichier: middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Récupérer le cookie de session
  const userId = request.cookies.get("userId")?.value;
  
  // 2. Définir les chemins actuels
  const path = request.nextUrl.pathname;

  // 3. LOGIQUE DE REDIRECTION

  // Cas A : L'utilisateur est CONNECTÉ et tente d'accéder aux pages publiques (Login/Register)
  // -> On le renvoie vers le Dashboard (ou Admin selon votre logique, ici Dashboard par défaut)
  const isAuthPage = path.startsWith("/login") || path.startsWith("/register");
  
  if (userId && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Cas B : L'utilisateur n'est PAS connecté et tente d'accéder aux pages protégées (Admin/Dashboard)
  // -> On le renvoie vers Login
  const isProtectedPage = path.startsWith("/dashboard") || path.startsWith("/admin");

  if (!userId && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Sinon, on laisse passer
  return NextResponse.next();
}

// Configuration : Le middleware ne s'active que sur les chemins pertinents (pour ne pas ralentir les images, api, etc.)
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};