"use server";

import { desc, eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import { db } from "@/db";
import { checkInTable } from "@/db/schema";

interface CheckIn {
  id: string;
  checkInDate: string;
  checkInTime: string;
  checkInTimestamp: string;
  method: string;
  identifier: string;
  createdAt: string;
}

interface CheckInStats {
  totalCheckIns: number;
  thisMonth: number;
  thisWeek: number;
  lastCheckIn: string | null;
}

interface GetCheckInsResponse {
  success: boolean;
  message: string;
  checkIns?: CheckIn[];
  stats?: CheckInStats;
}

export async function getStudentCheckInsAction(): Promise<GetCheckInsResponse> {
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

    // Buscar todos os check-ins do aluno
    const allCheckIns = await db
      .select({
        id: checkInTable.id,
        checkInDate: checkInTable.checkInDate,
        checkInTime: checkInTable.checkInTime,
        checkInTimestamp: checkInTable.checkInTimestamp,
        method: checkInTable.method,
        identifier: checkInTable.identifier,
        createdAt: checkInTable.createdAt,
      })
      .from(checkInTable)
      .where(eq(checkInTable.userId, decoded.userId))
      .orderBy(desc(checkInTable.checkInTimestamp)); // Ordenar pelo timestamp exato

    // Converter para o formato esperado
    const checkIns: CheckIn[] = allCheckIns.map((checkIn) => ({
      id: checkIn.id,
      checkInDate: checkIn.checkInDate, // date field - já é string
      checkInTime: checkIn.checkInTime,
      checkInTimestamp: checkIn.checkInTimestamp.toISOString(), // timestamp field - converter para string
      method: checkIn.method,
      identifier: checkIn.identifier,
      createdAt: checkIn.createdAt.toISOString(), // timestamp field - converter para string
    }));

    // Calcular estatísticas
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Domingo da semana atual

    // Total de check-ins
    const totalCheckIns = allCheckIns.length;

    // Check-ins deste mês
    const thisMonthCheckIns = allCheckIns.filter((checkIn) => {
      const checkInDate = new Date(checkIn.checkInDate); // checkInDate já é string
      return checkInDate >= startOfMonth;
    }).length;

    // Check-ins desta semana
    const thisWeekCheckIns = allCheckIns.filter((checkIn) => {
      const checkInDate = new Date(checkIn.checkInDate); // checkInDate já é string
      return checkInDate >= startOfWeek;
    }).length;

    // Último check-in
    const lastCheckIn =
      allCheckIns.length > 0
        ? allCheckIns[0].checkInTimestamp.toISOString()
        : null;

    const stats: CheckInStats = {
      totalCheckIns,
      thisMonth: thisMonthCheckIns,
      thisWeek: thisWeekCheckIns,
      lastCheckIn,
    };

    return {
      success: true,
      message: "Check-ins carregados com sucesso",
      checkIns,
      stats,
    };
  } catch (error) {
    console.error("Erro ao buscar check-ins:", error);
    return {
      success: false,
      message: "Erro interno do servidor",
    };
  }
}
