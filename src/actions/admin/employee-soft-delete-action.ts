"use server";

import { eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { employeesTable } from "@/db/schema";

export async function softDeleteEmployeeAction(employeeId: string) {
  try {
    await db
      .update(employeesTable)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(employeesTable.id, employeeId));

    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: "Funcionário desativado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao desativar funcionário:", error);
    return {
      success: false,
      error: "Erro ao desativar funcionário",
    };
  }
}

export async function reactivateEmployeeAction(employeeId: string) {
  try {
    await db
      .update(employeesTable)
      .set({
        deletedAt: null,
        updatedAt: new Date(),
      })
      .where(eq(employeesTable.id, employeeId));

    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: "Funcionário reativado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao reativar funcionário:", error);
    return {
      success: false,
      error: "Erro ao reativar funcionário",
    };
  }
}
