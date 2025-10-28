"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { financialTable } from "@/db/schema";

// Schema de validação para atualização de pagamento
const updatePaymentSchema = z.object({
  userId: z.string().uuid("ID do usuário inválido"),
  paid: z.boolean(),
  lastPaymentDate: z.string().optional(),
});

export interface PaymentUpdateState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export async function updatePaymentAction(
  userId: string,
  paid: boolean,
): Promise<PaymentUpdateState> {
  try {
    // Validar dados
    const validatedData = updatePaymentSchema.parse({
      userId,
      paid,
      lastPaymentDate: paid
        ? new Date().toISOString().split("T")[0]
        : undefined,
    });

    // Atualizar status de pagamento
    await db
      .update(financialTable)
      .set({
        paid: validatedData.paid,
        lastPaymentDate: validatedData.paid
          ? validatedData.lastPaymentDate
          : null,
        updatedAt: new Date().toISOString().split("T")[0],
      })
      .where(eq(financialTable.userId, validatedData.userId));

    return {
      success: true,
      message: `Pagamento ${paid ? "confirmado" : "marcado como pendente"} com sucesso!`,
    };
  } catch (error) {
    console.error("Erro ao atualizar pagamento:", error);

    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        if (!errors[field]) errors[field] = [];
        errors[field].push(issue.message);
      });

      return {
        success: false,
        message: "Dados inválidos para atualização de pagamento.",
        errors,
      };
    }

    return {
      success: false,
      message: "Erro interno do servidor. Tente novamente.",
    };
  }
}
