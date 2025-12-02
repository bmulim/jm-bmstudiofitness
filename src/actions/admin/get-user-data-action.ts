"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import {
  employeesTable,
  financialTable,
  personalDataTable,
  usersTable,
} from "@/db/schema";

export interface UserData {
  userId: string;
  name: string;
  role: string;
  email: string;
  telephone: string;
  address: string;
  cpf?: string;
  bornDate?: string;

  // Dados de funcionário/professor (se aplicável)
  employeeId?: string;
  position?: string;
  shift?: string;
  shiftStartTime?: string;
  shiftEndTime?: string;
  salaryInCents?: number;

  // Dados de aluno (se aplicável)
  monthlyFeeValueInCents?: number;
  paymentMethod?: string;
  dueDate?: number;
}

export async function getUserDataAction(userId: string): Promise<{
  success: boolean;
  data?: UserData;
  error?: string;
}> {
  try {
    // Buscar dados básicos do usuário
    const [user] = await db
      .select({
        userId: usersTable.id,
        name: usersTable.name,
        role: usersTable.userRole,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) {
      return {
        success: false,
        error: "Usuário não encontrado",
      };
    }

    // Buscar dados pessoais
    const [personalData] = await db
      .select({
        email: personalDataTable.email,
        telephone: personalDataTable.telephone,
        address: personalDataTable.address,
        cpf: personalDataTable.cpf,
        bornDate: personalDataTable.bornDate,
      })
      .from(personalDataTable)
      .where(eq(personalDataTable.userId, userId))
      .limit(1);

    const userData: UserData = {
      userId: user.userId,
      name: user.name,
      role: user.role,
      email: personalData?.email || "",
      telephone: personalData?.telephone || "",
      address: personalData?.address || "",
      cpf: personalData?.cpf,
      bornDate: personalData?.bornDate,
    };

    // Se for funcionário ou professor, buscar dados de employee
    if (user.role === "funcionario" || user.role === "professor") {
      const [employeeData] = await db
        .select({
          employeeId: employeesTable.id,
          position: employeesTable.position,
          shift: employeesTable.shift,
          shiftStartTime: employeesTable.shiftStartTime,
          shiftEndTime: employeesTable.shiftEndTime,
          salaryInCents: employeesTable.salaryInCents,
        })
        .from(employeesTable)
        .where(eq(employeesTable.userId, userId))
        .limit(1);

      if (employeeData) {
        userData.employeeId = employeeData.employeeId;
        userData.position = employeeData.position;
        userData.shift = employeeData.shift;
        userData.shiftStartTime = employeeData.shiftStartTime || undefined;
        userData.shiftEndTime = employeeData.shiftEndTime || undefined;
        userData.salaryInCents = employeeData.salaryInCents;
      }
    }

    // Se for aluno, buscar dados financeiros
    if (user.role === "aluno") {
      const [financialData] = await db
        .select({
          monthlyFeeValueInCents: financialTable.monthlyFeeValueInCents,
          paymentMethod: financialTable.paymentMethod,
          dueDate: financialTable.dueDate,
        })
        .from(financialTable)
        .where(eq(financialTable.userId, userId))
        .limit(1);

      if (financialData) {
        userData.monthlyFeeValueInCents = financialData.monthlyFeeValueInCents;
        userData.paymentMethod = financialData.paymentMethod;
        userData.dueDate = financialData.dueDate;
      }
    }

    return {
      success: true,
      data: userData,
    };
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return {
      success: false,
      error: "Erro ao buscar dados do usuário",
    };
  }
}
