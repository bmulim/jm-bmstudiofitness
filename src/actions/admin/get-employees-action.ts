"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { usersTable, personalDataTable, employeesTable } from "@/db/schema";

export interface EmployeeFullData {
  id: string;
  employeeId: string; // ID da tabela tb_employees
  name: string;
  cpf: string;
  email: string;
  telephone: string;
  address: string;
  bornDate: string;
  sex: "masculino" | "feminino";
  position: string;
  shift: string;
  shiftStartTime: string;
  shiftEndTime: string;
  salaryInCents: number;
  salaryFormatted: string;
  hireDate: string;
  createdAt: string;
  deletedAt: string | null;
}

export async function getEmployeesAction(): Promise<{
  success: boolean;
  data?: EmployeeFullData[];
  error?: string;
}> {
  try {
    // Buscar todos os funcionários com seus dados pessoais
    const employees = await db
      .select({
        employeeId: employeesTable.id,
        userId: usersTable.id,
        name: usersTable.name,
        cpf: personalDataTable.cpf,
        email: personalDataTable.email,
        telephone: personalDataTable.telephone,
        address: personalDataTable.address,
        bornDate: personalDataTable.bornDate,
        sex: personalDataTable.sex,
        position: employeesTable.position,
        shift: employeesTable.shift,
        shiftStartTime: employeesTable.shiftStartTime,
        shiftEndTime: employeesTable.shiftEndTime,
        salaryInCents: employeesTable.salaryInCents,
        hireDate: employeesTable.hireDate,
        createdAt: employeesTable.createdAt,
        deletedAt: employeesTable.deletedAt,
      })
      .from(employeesTable)
      .innerJoin(usersTable, eq(employeesTable.userId, usersTable.id))
      .innerJoin(personalDataTable, eq(personalDataTable.userId, usersTable.id))
      .orderBy(usersTable.name);

    // Formatar dados
    const formattedEmployees: EmployeeFullData[] = employees.map((emp) => ({
      id: emp.userId,
      employeeId: emp.employeeId,
      name: emp.name,
      cpf: emp.cpf,
      email: emp.email,
      telephone: emp.telephone,
      address: emp.address,
      bornDate: emp.bornDate as string,
      sex: emp.sex,
      position: emp.position,
      shift: emp.shift,
      shiftStartTime: emp.shiftStartTime,
      shiftEndTime: emp.shiftEndTime,
      salaryInCents: emp.salaryInCents,
      salaryFormatted: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(emp.salaryInCents / 100),
      hireDate: emp.hireDate as string,
      createdAt: emp.createdAt?.toISOString?.() || new Date().toISOString(),
      deletedAt: emp.deletedAt?.toISOString?.() || null,
    }));

    return {
      success: true,
      data: formattedEmployees,
    };
  } catch (error) {
    console.error("Erro ao buscar funcionários:", error);
    return {
      success: false,
      error: "Erro ao carregar lista de funcionários",
    };
  }
}
