"use server";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

import { db } from "@/db";
import {
  financialTable,
  healthMetricsTable,
  personalDataTable,
  usersTable,
} from "@/db/schema";
import { verifyTokenEdge } from "@/lib/auth-edge";

interface StudentDataResult {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
    };
    personalData: {
      email: string;
      cpf: string;
      bornDate: string;
      address: string;
      telephone: string;
    };
    healthMetrics: {
      heightCm: number;
      weightKg: number;
      bloodType: string;
      updatedAt: string;
    };
    financial: {
      paid: boolean;
      monthlyFeeValueInCents: number;
      dueDate: number;
      lastPaymentDate: string | null;
    };
  };
}

export async function getStudentDataAction(): Promise<StudentDataResult> {
  try {
    // Verificar autenticação
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Token de autenticação não encontrado",
      };
    }

    const payload = await verifyTokenEdge(token);

    if (!payload || payload.role !== "aluno") {
      return {
        success: false,
        message: "Acesso negado. Apenas alunos podem acessar estes dados.",
      };
    }

    // Buscar dados completos do aluno
    const [studentData] = await db
      .select({
        user: {
          id: usersTable.id,
          name: usersTable.name,
        },
        personalData: {
          email: personalDataTable.email,
          cpf: personalDataTable.cpf,
          bornDate: personalDataTable.bornDate,
          address: personalDataTable.address,
          telephone: personalDataTable.telephone,
        },
        healthMetrics: {
          heightCm: healthMetricsTable.heightCm,
          weightKg: healthMetricsTable.weightKg,
          bloodType: healthMetricsTable.bloodType,
          updatedAt: healthMetricsTable.updatedAt,
        },
        financial: {
          paid: financialTable.paid,
          monthlyFeeValueInCents: financialTable.monthlyFeeValueInCents,
          dueDate: financialTable.dueDate,
          lastPaymentDate: financialTable.lastPaymentDate,
        },
      })
      .from(usersTable)
      .innerJoin(personalDataTable, eq(usersTable.id, personalDataTable.userId))
      .innerJoin(
        healthMetricsTable,
        eq(usersTable.id, healthMetricsTable.userId),
      )
      .innerJoin(financialTable, eq(usersTable.id, financialTable.userId))
      .where(eq(usersTable.id, payload.userId))
      .limit(1);

    if (!studentData) {
      return {
        success: false,
        message: "Dados do aluno não encontrados",
      };
    }

    return {
      success: true,
      message: "Dados carregados com sucesso",
      data: {
        user: studentData.user,
        personalData: studentData.personalData,
        healthMetrics: {
          heightCm: parseInt(studentData.healthMetrics.heightCm.toString()),
          weightKg: parseFloat(studentData.healthMetrics.weightKg.toString()),
          bloodType: studentData.healthMetrics.bloodType,
          updatedAt: studentData.healthMetrics.updatedAt,
        },
        financial: studentData.financial,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar dados do aluno:", error);
    return {
      success: false,
      message: "Erro interno do servidor",
    };
  }
}
