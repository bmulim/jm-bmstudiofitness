"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { UserRole } from "@/types/user-roles";

export async function deleteStudentAction(userId: string) {
  try {
    // Verificar se o usuário existe e não é admin
    const user = await db
      .select({ userRole: usersTable.userRole })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (user.length === 0) {
      return {
        success: false,
        error: "Usuário não encontrado",
      };
    }

    if (user[0].userRole === UserRole.ADMIN) {
      return {
        success: false,
        error: "Não é permitido excluir usuários administradores",
      };
    }

    // Soft delete - apenas marca como deletado
    await db
      .update(usersTable)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(usersTable.id, userId));

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Aluno excluído com sucesso",
    };
  } catch (error) {
    console.error("Erro ao excluir aluno:", error);
    return {
      success: false,
      error: "Erro ao excluir aluno. Tente novamente.",
    };
  }
}

// Função para restaurar um usuário deletado (soft delete reverso)
export async function restoreStudentAction(userId: string) {
  try {
    await db
      .update(usersTable)
      .set({
        deletedAt: null,
      })
      .where(eq(usersTable.id, userId));

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Aluno restaurado com sucesso",
    };
  } catch (error) {
    console.error("Erro ao restaurar aluno:", error);
    return {
      success: false,
      error: "Erro ao restaurar aluno. Tente novamente.",
    };
  }
}
