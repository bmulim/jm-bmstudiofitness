"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import {
  financialTable,
  healthMetricsTable,
  personalDataTable,
  usersTable,
} from "@/db/schema";

export interface UpdateStudentData {
  // Dados básicos
  name?: string;

  // Dados pessoais
  cpf?: string;
  email?: string;
  bornDate?: string;
  address?: string;
  telephone?: string;

  // Dados financeiros
  monthlyFeeValueInCents?: number;
  paymentMethod?: string;
  dueDate?: number;

  // Dados de saúde (opcionais)
  heightCm?: string;
  weightKg?: string;
  bloodType?: string;
}

export async function updateStudentAction(
  userId: string,
  data: UpdateStudentData,
) {
  try {
    // Atualizar dados básicos do usuário
    if (data.name) {
      await db
        .update(usersTable)
        .set({
          name: data.name,
        })
        .where(eq(usersTable.id, userId));
    }

    // Atualizar dados pessoais
    const personalDataUpdates: Partial<typeof personalDataTable.$inferInsert> =
      {};

    if (data.cpf) personalDataUpdates.cpf = data.cpf;
    if (data.email) personalDataUpdates.email = data.email;
    if (data.bornDate) personalDataUpdates.bornDate = data.bornDate;
    if (data.address) personalDataUpdates.address = data.address;
    if (data.telephone) personalDataUpdates.telephone = data.telephone;

    if (Object.keys(personalDataUpdates).length > 0) {
      await db
        .update(personalDataTable)
        .set(personalDataUpdates)
        .where(eq(personalDataTable.userId, userId));
    }

    // Atualizar dados financeiros
    const financialUpdates: Partial<typeof financialTable.$inferInsert> = {};

    if (data.monthlyFeeValueInCents !== undefined)
      financialUpdates.monthlyFeeValueInCents = data.monthlyFeeValueInCents;
    if (data.paymentMethod) financialUpdates.paymentMethod = data.paymentMethod;
    if (data.dueDate !== undefined) financialUpdates.dueDate = data.dueDate;

    if (Object.keys(financialUpdates).length > 0) {
      await db
        .update(financialTable)
        .set(financialUpdates)
        .where(eq(financialTable.userId, userId));
    }

    // Atualizar dados de saúde (se fornecidos)
    const healthUpdates: Partial<typeof healthMetricsTable.$inferInsert> = {};

    if (data.heightCm) healthUpdates.heightCm = data.heightCm;
    if (data.weightKg) healthUpdates.weightKg = data.weightKg;
    if (data.bloodType) healthUpdates.bloodType = data.bloodType;

    if (Object.keys(healthUpdates).length > 0) {
      healthUpdates.updatedAt = new Date().toISOString();
      await db
        .update(healthMetricsTable)
        .set(healthUpdates)
        .where(eq(healthMetricsTable.userId, userId));
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Dados do aluno atualizados com sucesso",
    };
  } catch (error) {
    console.error("Erro ao atualizar aluno:", error);
    return {
      success: false,
      error: "Erro ao atualizar dados do aluno. Tente novamente.",
    };
  }
}
