"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import {
  employeeSalaryHistoryTable,
  employeesTable,
  personalDataTable,
  usersTable,
} from "@/db/schema";
import { canUpdateUserType } from "@/lib/check-permission";

export interface UpdateEmployeeData {
  // Dados pessoais (opcional)
  name?: string;
  email?: string;
  telephone?: string;
  address?: string;

  // Dados funcionais
  position?: string;
  shift?: string;
  shiftStartTime?: string;
  shiftEndTime?: string;
  salaryInCents?: number;

  // Para controle de histórico de salário
  currentUserId?: string; // ID do admin fazendo a alteração
  salaryChangeReason?: string;
  salaryEffectiveDate?: string;
}

export async function updateEmployeeAction(
  employeeId: string,
  data: UpdateEmployeeData,
) {
  try {
    // Buscar funcionário atual
    const [employee] = await db
      .select({
        id: employeesTable.id,
        userId: employeesTable.userId,
        salaryInCents: employeesTable.salaryInCents,
        userRole: usersTable.userRole,
      })
      .from(employeesTable)
      .innerJoin(usersTable, eq(employeesTable.userId, usersTable.id))
      .where(eq(employeesTable.id, employeeId));

    if (!employee) {
      return {
        success: false,
        error: "Funcionário não encontrado",
      };
    }

    // VERIFICAR PERMISSÕES - apenas admin pode editar funcionários/professores
    // Funcionário só pode editar alunos
    const targetUserType =
      employee.userRole === "professor" ? "professor" : "funcionario";

    const permissionCheck = await canUpdateUserType(
      targetUserType,
      employee.userId,
    );

    if (!permissionCheck.allowed) {
      return {
        success: false,
        error:
          permissionCheck.error ||
          `Você não tem permissão para editar ${targetUserType === "professor" ? "professores" : "funcionários"}`,
      };
    }

    console.log(
      `✅ Usuário ${permissionCheck.user?.email} autorizado a editar ${targetUserType}`,
    );

    // Se houver alteração de salário, registrar no histórico
    if (
      data.salaryInCents !== undefined &&
      data.salaryInCents !== employee.salaryInCents &&
      data.currentUserId
    ) {
      await db.insert(employeeSalaryHistoryTable).values({
        employeeId: employee.id,
        previousSalaryInCents: employee.salaryInCents,
        newSalaryInCents: data.salaryInCents,
        changeReason: data.salaryChangeReason || "Ajuste salarial",
        changedBy: data.currentUserId,
        effectiveDate:
          data.salaryEffectiveDate || new Date().toISOString().split("T")[0],
      });
    }

    // Atualizar dados do funcionário
    const employeeUpdates: Partial<typeof employeesTable.$inferInsert> = {};
    if (data.position !== undefined) employeeUpdates.position = data.position;
    if (data.shift !== undefined) employeeUpdates.shift = data.shift;
    if (data.shiftStartTime !== undefined)
      employeeUpdates.shiftStartTime = data.shiftStartTime;
    if (data.shiftEndTime !== undefined)
      employeeUpdates.shiftEndTime = data.shiftEndTime;
    if (data.salaryInCents !== undefined)
      employeeUpdates.salaryInCents = data.salaryInCents;
    employeeUpdates.updatedAt = new Date();

    if (Object.keys(employeeUpdates).length > 1) {
      // > 1 porque updatedAt sempre está presente
      await db
        .update(employeesTable)
        .set(employeeUpdates)
        .where(eq(employeesTable.id, employeeId));
    }

    // Atualizar dados pessoais se fornecidos
    const personalUpdates: Partial<typeof personalDataTable.$inferInsert> = {};
    if (data.email !== undefined) personalUpdates.email = data.email;
    if (data.telephone !== undefined)
      personalUpdates.telephone = data.telephone;
    if (data.address !== undefined) personalUpdates.address = data.address;

    if (Object.keys(personalUpdates).length > 0) {
      await db
        .update(personalDataTable)
        .set(personalUpdates)
        .where(eq(personalDataTable.userId, employee.userId));
    }

    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: "Funcionário atualizado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao atualizar funcionário:", error);
    return {
      success: false,
      error: "Erro ao atualizar funcionário",
    };
  }
}
