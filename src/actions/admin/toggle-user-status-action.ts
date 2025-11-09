"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

interface ToggleUserStatusResult {
  success: boolean;
  error?: string;
  message?: string;
}

/**
 * Por enquanto, esta função apenas valida a operação.
 * O campo isActive será implementado futuramente no schema.
 * A validação de pagamentos em atraso será feita no frontend.
 */
export async function toggleUserStatusAction(
  userId: string,
  isActive: boolean,
): Promise<ToggleUserStatusResult> {
  try {
    // Verificar se o usuário existe e não é admin
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, userId),
    });

    if (!user) {
      return {
        success: false,
        error: "Usuário não encontrado",
      };
    }

    if (user.userRole === "admin") {
      return {
        success: false,
        error: "Não é possível desativar usuários administradores",
      };
    }

    // TODO: Implementar atualização quando o campo isActive for adicionado ao schema
    // await db.update(usersTable).set({ isActive }).where(eq(usersTable.id, userId));

    return {
      success: true,
      message: `Usuário ${isActive ? "ativado" : "desativado"} com sucesso`,
    };
  } catch (error) {
    console.error("Erro ao atualizar status do usuário:", error);
    return {
      success: false,
      error: "Erro ao atualizar status do usuário",
    };
  }
}
