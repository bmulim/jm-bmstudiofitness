"use server";

import { desc, eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import { db } from "@/db";
import { healthMetricsTable, studentHealthHistoryTable } from "@/db/schema";

interface HealthEntry {
  id: string;
  heightCm: number | null;
  weightKg: string | null;
  notes: string | null;
  updatedAt: string;
  createdAt: string;
}

interface CurrentHealthData {
  heightCm: number;
  weightKg: number;
  bloodType: string;
  updatedAt: string;
}

interface GetStudentHealthHistoryResponse {
  success: boolean;
  message: string;
  history?: HealthEntry[];
  currentHealth?: CurrentHealthData;
}

export async function getStudentHealthHistoryAction(): Promise<GetStudentHealthHistoryResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Token de autenticação não encontrado",
      };
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      role: string;
    };

    if (decoded.role !== "aluno") {
      return {
        success: false,
        message: "Acesso negado. Apenas alunos podem ver este histórico",
      };
    }

    // Buscar dados atuais de saúde do aluno
    const [currentHealthResult] = await db
      .select({
        heightCm: healthMetricsTable.heightCm,
        weightKg: healthMetricsTable.weightKg,
        bloodType: healthMetricsTable.bloodType,
        updatedAt: healthMetricsTable.updatedAt,
      })
      .from(healthMetricsTable)
      .where(eq(healthMetricsTable.userId, decoded.userId))
      .limit(1);

    // Buscar histórico de saúde do aluno (entradas criadas pelo próprio aluno)
    const historyResults = await db
      .select({
        id: studentHealthHistoryTable.id,
        heightCm: studentHealthHistoryTable.heightCm,
        weightKg: studentHealthHistoryTable.weightKg,
        notes: studentHealthHistoryTable.notes,
        updatedAt: studentHealthHistoryTable.updatedAt,
        createdAt: studentHealthHistoryTable.createdAt,
      })
      .from(studentHealthHistoryTable)
      .where(eq(studentHealthHistoryTable.userId, decoded.userId))
      .orderBy(desc(studentHealthHistoryTable.createdAt));

    const history: HealthEntry[] = historyResults.map((entry) => ({
      id: entry.id,
      heightCm: entry.heightCm,
      weightKg: entry.weightKg?.toString() || null,
      notes: entry.notes,
      updatedAt: entry.updatedAt, // date field - já é string
      createdAt: entry.createdAt.toISOString(), // timestamp field - precisa converter
    }));

    const currentHealth: CurrentHealthData | undefined = currentHealthResult
      ? {
          heightCm: parseInt(currentHealthResult.heightCm),
          weightKg: parseFloat(currentHealthResult.weightKg),
          bloodType: currentHealthResult.bloodType,
          updatedAt: currentHealthResult.updatedAt, // date field - já é string
        }
      : undefined;

    return {
      success: true,
      message: "Histórico carregado com sucesso",
      history,
      currentHealth,
    };
  } catch (error) {
    console.error("Erro ao buscar histórico de saúde:", error);
    return {
      success: false,
      message: "Erro interno do servidor",
    };
  }
}
