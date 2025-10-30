"use server";

import bcrypt from "bcryptjs";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import {
  personalDataTable,
  userConfirmationTokensTable,
  usersTable,
} from "@/db/schema";

// Schema de validação para confirmação
const confirmUserSchema = z
  .object({
    token: z.string().min(1, "Token é obrigatório"),
    email: z.string().email("E-mail deve ter formato válido"),
    cpf: z.string().regex(/^\d{11}$/, "CPF deve ter 11 dígitos"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export interface ConfirmUserState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  userData?: {
    name: string;
    email: string;
    cpf: string;
  };
}

export async function confirmUserAction(
  prevState: ConfirmUserState,
  formData: FormData,
): Promise<ConfirmUserState> {
  try {
    const rawData = {
      token: formData.get("token") as string,
      email: formData.get("email") as string,
      cpf: formData.get("cpf") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    // Validar dados
    const validatedData = confirmUserSchema.parse(rawData);

    // Buscar token de confirmação válido
    const [tokenRecord] = await db
      .select({
        token: userConfirmationTokensTable,
        user: usersTable,
        personalData: personalDataTable,
      })
      .from(userConfirmationTokensTable)
      .innerJoin(
        usersTable,
        eq(userConfirmationTokensTable.userId, usersTable.id),
      )
      .innerJoin(personalDataTable, eq(usersTable.id, personalDataTable.userId))
      .where(
        and(
          eq(userConfirmationTokensTable.token, validatedData.token),
          eq(userConfirmationTokensTable.used, false),
        ),
      )
      .limit(1);

    if (!tokenRecord) {
      return {
        success: false,
        message: "Token inválido ou já utilizado",
      };
    }

    // Verificar se o token não expirou
    if (new Date() > new Date(tokenRecord.token.expiresAt)) {
      return {
        success: false,
        message: "Token expirado. Solicite um novo cadastro.",
      };
    }

    // Verificar se e-mail e CPF coincidem
    if (
      tokenRecord.personalData.email !== validatedData.email ||
      tokenRecord.personalData.cpf !== validatedData.cpf
    ) {
      return {
        success: false,
        message: "E-mail ou CPF não coincidem com os dados cadastrados",
        userData: {
          name: tokenRecord.user.name,
          email: tokenRecord.personalData.email,
          cpf: tokenRecord.personalData.cpf,
        },
      };
    }

    // Fazer hash da senha
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Atualizar usuário com senha e marcar token como usado
    await db.transaction(async (tx) => {
      // Atualizar senha do usuário
      await tx
        .update(usersTable)
        .set({ password: hashedPassword })
        .where(eq(usersTable.id, tokenRecord.user.id));

      // Marcar token como usado
      await tx
        .update(userConfirmationTokensTable)
        .set({ used: true })
        .where(eq(userConfirmationTokensTable.id, tokenRecord.token.id));
    });

    return {
      success: true,
      message: "Conta confirmada com sucesso! Você já pode fazer login.",
    };
  } catch (error) {
    console.error("Erro ao confirmar usuário:", error);

    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        if (!errors[field]) errors[field] = [];
        errors[field].push(issue.message);
      });

      return {
        success: false,
        message: "Dados inválidos. Verifique os campos destacados.",
        errors,
      };
    }

    return {
      success: false,
      message: "Erro interno do servidor. Tente novamente.",
    };
  }
}
