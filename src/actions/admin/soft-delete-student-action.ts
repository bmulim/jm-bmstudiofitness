"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

/**
 * Soft delete de um aluno e todos os dados relacionados
 * Marca o campo deletedAt com a data/hora atual
 */
export async function softDeleteStudentAction(studentId: string) {
  try {
    // Atualiza o campo deletedAt do usuário
    await db
      .update(usersTable)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(usersTable.id, studentId));

    // Revalidate para atualizar a lista de alunos
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: "Aluno desativado com sucesso",
    };
  } catch (error) {
    console.error("Erro ao desativar aluno:", error);
    return {
      success: false,
      message: "Erro ao desativar aluno. Tente novamente.",
    };
  }
}
