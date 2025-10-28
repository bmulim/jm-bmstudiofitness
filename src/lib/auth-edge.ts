import { jwtVerify, SignJWT } from "jose";
import { NextRequest } from "next/server";

// Configurações JWT para Edge Runtime
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ||
    "sua-chave-secreta-jwt-aqui-mude-em-producao-123456789",
);

export interface JWTPayload {
  userId: string;
  email: string;
  role: "admin" | "professor" | "aluno";
  iat?: number;
  exp?: number;
}

// Gerar JWT token compatível com Edge Runtime
export async function generateTokenEdge(
  payload: Omit<JWTPayload, "iat" | "exp">,
): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

// Verificar JWT token compatível com Edge Runtime
export async function verifyTokenEdge(
  token: string,
): Promise<JWTPayload | null> {
  try {
    console.log("🔐 Verificando JWT token com Edge Runtime...");
    const { payload } = await jwtVerify(token, JWT_SECRET);
    console.log("✅ JWT válido, payload:", {
      userId: payload.userId,
      role: payload.role,
    });

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as "admin" | "professor" | "aluno",
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch (error) {
    console.log("❌ Erro ao verificar JWT:", error);
    return null;
  }
}

// Extrair token do request (header Authorization ou cookie)
export function extractTokenEdge(request: NextRequest): string | null {
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

// Extrair usuário do request para Edge Runtime
export async function getUserFromRequestEdge(request: NextRequest): Promise<{
  role: "admin" | "professor" | "aluno";
  id: string;
  email: string;
} | null> {
  console.log("🔍 Extraindo usuário do request (Edge Runtime)...");
  const token = extractTokenEdge(request);

  if (!token) {
    console.log("❌ Token não encontrado");
    return null;
  }

  console.log("🔓 Verificando token JWT...");
  const payload = await verifyTokenEdge(token);
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
