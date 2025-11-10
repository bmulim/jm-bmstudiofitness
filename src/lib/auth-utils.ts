import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

import { UserRole } from "@/types/user-roles";

// Configurações JWT
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// Utilitário para hash de senha
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Utilitário para verificar senha
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Gerar JWT token
export function generateToken(
  payload: Omit<JWTPayload, "iat" | "exp">,
): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

// Verificar e decodificar JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    console.log("🔐 Verificando JWT token...");
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
    console.log("✅ JWT válido, payload:", {
      userId: payload.userId,
      role: payload.role,
    });
    return payload;
  } catch (error) {
    console.log("❌ Erro ao verificar JWT:", error);
    return null;
  }
}

// Extrair token do request (header Authorization ou cookie)
export function extractToken(request: NextRequest): string | null {
  // Tentar pegar do header Authorization
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    console.log("🎫 Token encontrado no header Authorization");
    return authHeader.substring(7);
  }

  // Tentar pegar do cookie
  const tokenCookie = request.cookies.get("auth-token");
  if (tokenCookie) {
    console.log(
      "🍪 Token encontrado no cookie:",
      tokenCookie.value.substring(0, 20) + "...",
    );
    return tokenCookie.value;
  }

  console.log("❌ Nenhum token encontrado");
  return null;
}

// Verifica se o usuário é um administrador
export async function adminGuard() {
  const cookieStore = await (await import("next/headers")).cookies();
  const authToken = cookieStore.get("auth-token")?.value;

  if (!authToken) {
    throw new Error("Não autorizado");
  }

  const payload = verifyToken(authToken);
  if (!payload || payload.role !== UserRole.ADMIN) {
    throw new Error("Acesso restrito a administradores");
  }

  return true;
}

// Extrair usuário do request
export function getUserFromRequest(request: NextRequest): {
  role: UserRole;
  id: string;
  email: string;
} | null {
  console.log("🔍 Extraindo usuário do request...");
  const token = extractToken(request);

  if (!token) {
    console.log("❌ Token não encontrado");
    return null;
  }

  console.log("🔓 Verificando token JWT...");
  const payload = verifyToken(token);
  if (!payload) {
    console.log("❌ Token JWT inválido ou expirado");
    return null;
  }

  console.log("✅ Token válido, usuário:", {
    role: payload.role,
    email: payload.email,
  });
  return {
    role: payload.role,
    id: payload.userId,
    email: payload.email,
  };
}
