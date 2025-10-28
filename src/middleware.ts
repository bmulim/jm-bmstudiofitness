import { NextRequest, NextResponse } from "next/server";

import { getUserFromRequestEdge } from "@/lib/auth-edge";
import { UserRole } from "@/types/user-roles";

// Rotas protegidas que requerem autenticação
const protectedPaths = ["/admin", "/admin/admin", "/admin/professor"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log("🛡️ Middleware executado para:", pathname);

  // Verifica se a rota está protegida
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (!isProtected) {
    console.log("📖 Rota pública, permitindo acesso:", pathname);
    return NextResponse.next();
  }

  console.log("🔒 Rota protegida, verificando autenticação...");

  // Verifica autenticação usando Edge Runtime
  const user = await getUserFromRequestEdge(request);

  if (!user) {
    console.log("❌ Usuário não autenticado, redirecionando para login");
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Verifica permissões por rota
  if (pathname.startsWith("/admin/admin") && user.role !== "admin") {
    console.log("❌ Usuário sem permissão para área de admin");
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (
    pathname.startsWith("/admin/professor") &&
    !["admin", "professor"].includes(user.role)
  ) {
    console.log("❌ Usuário sem permissão para área de professor");
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  console.log("✅ Usuário autenticado e autorizado:", user.email);
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
