"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { employeeSalaryHistoryTable, usersTable } from "@/db/schema";

export interface SalaryHistoryEntry {
  id: string;
  previousSalary: string;
  newSalary: string;
  changeReason: string | null;
  changedByName: string;
  effectiveDate: string;
  createdAt: string;
}

export async function getEmployeeSalaryHistoryAction(employeeId: string) {
  try {
    const history = await db
      .select({
        id: employeeSalaryHistoryTable.id,
        previousSalaryInCents: employeeSalaryHistoryTable.previousSalaryInCents,
        newSalaryInCents: employeeSalaryHistoryTable.newSalaryInCents,
        changeReason: employeeSalaryHistoryTable.changeReason,
        changedByName: usersTable.name,
        effectiveDate: employeeSalaryHistoryTable.effectiveDate,
        createdAt: employeeSalaryHistoryTable.createdAt,
      })
      .from(employeeSalaryHistoryTable)
      .innerJoin(
        usersTable,
        eq(employeeSalaryHistoryTable.changedBy, usersTable.id),
      )
      .where(eq(employeeSalaryHistoryTable.employeeId, employeeId))
      .orderBy(employeeSalaryHistoryTable.createdAt);

    const formatCurrency = (cents: number) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(cents / 100);
    };

    const formattedHistory: SalaryHistoryEntry[] = history.map((entry) => ({
      id: entry.id,
      previousSalary: formatCurrency(entry.previousSalaryInCents),
      newSalary: formatCurrency(entry.newSalaryInCents),
      changeReason: entry.changeReason,
      changedByName: entry.changedByName,
      effectiveDate: entry.effectiveDate as string,
      createdAt: entry.createdAt?.toISOString?.() || new Date().toISOString(),
    }));

    return {
      success: true,
      data: formattedHistory,
    };
  } catch (error) {
    console.error("Erro ao buscar histórico de salários:", error);
    return {
      success: false,
      error: "Erro ao carregar histórico de salários",
    };
  }
}
