"use server";

import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { employeesTable,personalDataTable, usersTable } from "@/db/schema";
import { UserRole } from "@/types/user-roles";

export interface CreateEmployeeData {
  // Dados pessoais
  name: string;
  cpf: string;
  email: string;
  telephone: string;
  address: string;
  bornDate: string;
  sex: "masculino" | "feminino";
  password: string;

  // Dados do emprego
  position: string; // Cargo
  shift: string; // Turno
  shiftStartTime: string; // Horário início
  shiftEndTime: string; // Horário fim
  salaryInCents: number; // Salário em centavos
  hireDate: string; // Data de contratação
}

export async function createEmployeeAction(data: CreateEmployeeData) {
  try {
    // Hash da senha
    const hashedPassword = await hash(data.password, 10);

    // Criar usuário com role de funcionário
    const [newUser] = await db
      .insert(usersTable)
      .values({
        name: data.name,
        userRole: UserRole.FUNCIONARIO,
        password: hashedPassword,
      })
      .returning();

    if (!newUser) {
      return {
        success: false,
        error: "Erro ao criar usuário do funcionário",
      };
    }

    // Criar dados pessoais
    await db.insert(personalDataTable).values({
      userId: newUser.id,
      cpf: data.cpf,
      email: data.email,
      telephone: data.telephone,
      address: data.address,
      bornDate: data.bornDate,
      sex: data.sex,
    });

    // Criar dados do funcionário
    await db.insert(employeesTable).values({
      userId: newUser.id,
      position: data.position,
      shift: data.shift,
      shiftStartTime: data.shiftStartTime,
      shiftEndTime: data.shiftEndTime,
      salaryInCents: data.salaryInCents,
      hireDate: data.hireDate,
    });

    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: "Funcionário cadastrado com sucesso!",
      employeeId: newUser.id,
    };
  } catch (error) {
    console.error("Erro ao cadastrar funcionário:", error);

    if (error instanceof Error) {
      if (error.message.includes("unique constraint")) {
        if (error.message.includes("cpf")) {
          return { success: false, error: "CPF já cadastrado" };
        }
        if (error.message.includes("email")) {
          return { success: false, error: "E-mail já cadastrado" };
        }
      }
    }

    return {
      success: false,
      error: "Erro ao cadastrar funcionário. Tente novamente.",
    };
  }
}
