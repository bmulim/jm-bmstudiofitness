"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

/**
 * Reativa um aluno desativado (remove soft delete)
 * Define o campo deletedAt como null
 */
export async function reactivateStudentAction(studentId: string) {
  try {
    // Remove o soft delete definindo deletedAt como null
    await db
      .update(usersTable)
      .set({
        deletedAt: null,
      })
      .where(eq(usersTable.id, studentId));

    // Revalidate para atualizar a lista de alunos
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: "Aluno reativado com sucesso",
    };
  } catch (error) {
    console.error("Erro ao reativar aluno:", error);
    return {
      success: false,
      message: "Erro ao reativar aluno. Tente novamente.",
    };
  }
}
