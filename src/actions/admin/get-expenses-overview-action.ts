"use server";

import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { studioExpensesTable } from "@/db/schema";

export interface ExpensesOverview {
  pending: {
    count: number;
    totalInCents: number;
    totalFormatted: string;
  };
  paid: {
    count: number;
    totalInCents: number;
    totalFormatted: string;
  };
}

export async function getExpensesOverviewAction(): Promise<{
  success: boolean;
  data?: ExpensesOverview;
  error?: string;
}> {
  try {
    // Buscar despesas pendentes (não pagas)
    const pendingResult = await db
      .select({
        count: sql<number>`COUNT(*)::int`,
        total: sql<number>`COALESCE(SUM(${studioExpensesTable.amountInCents}), 0)::int`,
      })
      .from(studioExpensesTable)
      .where(eq(studioExpensesTable.paid, false));

    // Buscar despesas pagas
    const paidResult = await db
      .select({
        count: sql<number>`COUNT(*)::int`,
        total: sql<number>`COALESCE(SUM(${studioExpensesTable.amountInCents}), 0)::int`,
      })
      .from(studioExpensesTable)
      .where(eq(studioExpensesTable.paid, true));

    const pendingCount = pendingResult[0]?.count || 0;
    const pendingTotal = pendingResult[0]?.total || 0;
    const paidCount = paidResult[0]?.count || 0;
    const paidTotal = paidResult[0]?.total || 0;

    // Formatar valores em reais
    const formatCurrency = (cents: number) => {
      const value = cents / 100;
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);
    };

    return {
      success: true,
      data: {
        pending: {
          count: pendingCount,
          totalInCents: pendingTotal,
          totalFormatted: formatCurrency(pendingTotal),
        },
        paid: {
          count: paidCount,
          totalInCents: paidTotal,
          totalFormatted: formatCurrency(paidTotal),
        },
      },
    };
  } catch (error) {
    console.error("Erro ao buscar visão geral de despesas:", error);
    return {
      success: false,
      error: "Erro ao carregar dados de despesas",
    };
  }
}
