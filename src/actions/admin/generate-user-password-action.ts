"use server";

import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

/**
 * Gera uma nova senha aleatória para o usuário
 * Retorna a senha gerada em texto plano (para o admin copiar)
 */
export async function generateUserPasswordAction(userId: string) {
  try {
    // Gerar senha aleatória segura de 12 caracteres
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";
    const password = Array.from({ length: 12 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length)),
    ).join("");

    // Hash da senha
    const hashedPassword = await hash(password, 10);

    // Atualizar senha no banco
    await db
      .update(usersTable)
      .set({
        password: hashedPassword,
      })
      .where(eq(usersTable.id, userId));

    return {
      success: true,
      password, // Retornar senha em texto plano para o admin copiar
      message: "Senha gerada com sucesso",
    };
  } catch (error) {
    console.error("Erro ao gerar senha:", error);
    return {
      success: false,
      password: null,
      message: "Erro ao gerar senha. Tente novamente.",
    };
  }
}
