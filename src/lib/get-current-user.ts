import { eq } from "drizzle-orm";

import { db } from "@/db";
import { personalDataTable, usersTable } from "@/db/schema";
import { verifyToken } from "@/lib/auth-utils";

export async function getCurrentUser(request: Request) {
  // Obter token da requisição
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return null;
  }

  try {
    // Validar token JWT
    const payload = verifyToken(token);
    if (!payload) {
      return null;
    }

    // Buscar usuário com dados pessoais
    const [user] = await db
      .select({
        id: usersTable.id,
        email: personalDataTable.email,
        role: usersTable.userRole,
      })
      .from(usersTable)
      .leftJoin(personalDataTable, eq(usersTable.id, personalDataTable.userId))
      .where(eq(usersTable.id, payload.userId))
      .limit(1);

    return user;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
}
