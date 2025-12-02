"use server";

import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";

import { db } from "@/db";
import {
  employeesTable,
  professorCheckInsTable,
  usersTable,
} from "@/db/schema";
import { verifyToken } from "@/lib/auth-utils";
import { UserRole } from "@/types/user-roles";

export interface ProfessorCheckInResult {
  success: boolean;
  message: string;
  error?: string;
  checkInData?: {
    date: string;
    time: string;
  };
}

/**
 * Registra check-in de professor (apenas presença, sem controle de horário)
 * Professores não têm controle de entrada/saída como funcionários
 */
export async function professorCheckInAction(
  notes?: string,
): Promise<ProfessorCheckInResult> {
  try {
    // 1. Verificar autenticação
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Não autenticado",
        error: "Usuário não autenticado",
      };
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return {
        success: false,
        message: "Token inválido",
        error: "Token inválido ou expirado",
      };
    }

    // 2. Verificar se é professor
    const [user] = await db
      .select({
        role: usersTable.userRole,
        employeeId: employeesTable.id,
      })
      .from(usersTable)
      .leftJoin(employeesTable, eq(usersTable.id, employeesTable.userId))
      .where(eq(usersTable.id, decoded.userId))
      .limit(1);

    if (!user) {
      return {
        success: false,
        message: "Usuário não encontrado",
        error: "Usuário não encontrado no sistema",
      };
    }

    if (user.role !== UserRole.PROFESSOR) {
      return {
        success: false,
        message: "Acesso negado",
        error: "Apenas professores podem fazer check-in",
      };
    }

    if (!user.employeeId) {
      return {
        success: false,
        message: "Professor sem registro",
        error: "Professor não tem registro de funcionário",
      };
    }

    // 3. Verificar se já fez check-in hoje
    const today = new Date().toISOString().split("T")[0];
    const [existingCheckIn] = await db
      .select()
      .from(professorCheckInsTable)
      .where(
        and(
          eq(professorCheckInsTable.professorId, user.employeeId),
          eq(professorCheckInsTable.date, today),
        ),
      )
      .limit(1);

    if (existingCheckIn) {
      return {
        success: false,
        message: "Check-in já registrado hoje",
        error: `Você já fez check-in hoje às ${existingCheckIn.checkInTime}`,
      };
    }

    // 4. Registrar check-in
    const now = new Date();
    const time = now.toTimeString().split(" ")[0].substring(0, 5); // HH:MM

    await db.insert(professorCheckInsTable).values({
      professorId: user.employeeId,
      date: today,
      checkInTime: time,
      notes: notes || null,
    });

    console.log(
      `✅ Check-in registrado: Professor ID ${user.employeeId} às ${time}`,
    );

    return {
      success: true,
      message: `Check-in registrado com sucesso às ${time}!`,
      checkInData: {
        date: today,
        time,
      },
    };
  } catch (error) {
    console.error("Erro ao registrar check-in de professor:", error);
    return {
      success: false,
      message: "Erro ao registrar check-in",
      error: "Erro interno do servidor. Tente novamente.",
    };
  }
}

/**
 * Busca histórico de check-ins de um professor
 */
export async function getProfessorCheckInsAction(
  startDate?: string,
  endDate?: string,
) {
  try {
    // 1. Verificar autenticação
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return {
        success: false,
        error: "Usuário não autenticado",
      };
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return {
        success: false,
        error: "Token inválido ou expirado",
      };
    }

    // 2. Buscar employeeId do professor
    const [user] = await db
      .select({
        role: usersTable.userRole,
        employeeId: employeesTable.id,
      })
      .from(usersTable)
      .leftJoin(employeesTable, eq(usersTable.id, employeesTable.userId))
      .where(eq(usersTable.id, decoded.userId))
      .limit(1);

    if (!user || user.role !== UserRole.PROFESSOR || !user.employeeId) {
      return {
        success: false,
        error: "Apenas professores podem acessar este recurso",
      };
    }

    // 3. Buscar check-ins
    let query = db
      .select()
      .from(professorCheckInsTable)
      .where(eq(professorCheckInsTable.professorId, user.employeeId))
      .$dynamic();

    // Aplicar filtros de data se fornecidos
    if (startDate && endDate) {
      query = query.where(
        and(
          eq(professorCheckInsTable.professorId, user.employeeId),
          // TODO: adicionar filtros de data quando necessário
        ),
      );
    }

    const checkIns = await query;

    return {
      success: true,
      data: checkIns,
    };
  } catch (error) {
    console.error("Erro ao buscar check-ins de professor:", error);
    return {
      success: false,
      error: "Erro ao carregar histórico de check-ins",
    };
  }
}
