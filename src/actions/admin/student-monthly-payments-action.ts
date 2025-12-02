"use server";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

import { db } from "@/db";
import { financialTable, usersTable } from "@/db/schema";
import { verifyToken } from "@/lib/auth-utils";
import { UserRole } from "@/types/user-roles";

export interface StudentMonthlyPayment {
  userId: string;
  studentName: string;
  monthlyFeeValue: number; // Em reais
  dueDate: number;
  paid: boolean;
  lastPaymentDate: string | null;
  paymentMethod: string;
}

/**
 * Busca lista de mensalidades dos alunos
 * APENAS funcionários e administradores podem acessar
 * Funcionários veem apenas: nome, valor da mensalidade, status (pago/não pago)
 */
export async function getStudentMonthlyPaymentsAction(): Promise<{
  success: boolean;
  data?: StudentMonthlyPayment[];
  error?: string;
}> {
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

    // 2. Verificar se é funcionário ou admin
    const [user] = await db
      .select({ role: usersTable.userRole })
      .from(usersTable)
      .where(eq(usersTable.id, decoded.userId))
      .limit(1);

    if (!user) {
      return {
        success: false,
        error: "Usuário não encontrado",
      };
    }

    if (![UserRole.ADMIN, UserRole.FUNCIONARIO].includes(user.role)) {
      return {
        success: false,
        error:
          "Apenas administradores e funcionários podem acessar esta informação",
      };
    }

    // 3. Buscar mensalidades dos alunos (apenas alunos ativos)
    const payments = await db
      .select({
        userId: usersTable.id,
        studentName: usersTable.name,
        monthlyFeeValueInCents: financialTable.monthlyFeeValueInCents,
        dueDate: financialTable.dueDate,
        paid: financialTable.paid,
        lastPaymentDate: financialTable.lastPaymentDate,
        paymentMethod: financialTable.paymentMethod,
        deletedAt: usersTable.deletedAt,
      })
      .from(financialTable)
      .innerJoin(usersTable, eq(financialTable.userId, usersTable.id))
      .where(eq(usersTable.userRole, UserRole.ALUNO))
      .orderBy(usersTable.name);

    // 4. Formatar dados (ocultar informações sensíveis de funcionários)
    const formattedPayments: StudentMonthlyPayment[] = payments
      .filter((p) => !p.deletedAt) // Filtrar alunos deletados
      .map((payment) => ({
        userId: payment.userId,
        studentName: payment.studentName,
        monthlyFeeValue: payment.monthlyFeeValueInCents / 100, // Converter para reais
        dueDate: payment.dueDate,
        paid: payment.paid,
        lastPaymentDate: payment.lastPaymentDate,
        paymentMethod: payment.paymentMethod,
      }));

    console.log(
      `✅ Funcionário ${decoded.userId} (${user.role}) acessou lista de mensalidades`,
    );

    return {
      success: true,
      data: formattedPayments,
    };
  } catch (error) {
    console.error("Erro ao buscar mensalidades dos alunos:", error);
    return {
      success: false,
      error: "Erro ao carregar lista de mensalidades",
    };
  }
}

/**
 * Atualiza status de pagamento de um aluno
 * APENAS funcionários e administradores podem usar
 */
export async function updatePaymentStatusAction(
  studentUserId: string,
  paid: boolean,
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
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

    // 2. Verificar se é funcionário ou admin
    const [user] = await db
      .select({ role: usersTable.userRole })
      .from(usersTable)
      .where(eq(usersTable.id, decoded.userId))
      .limit(1);

    if (!user) {
      return {
        success: false,
        error: "Usuário não encontrado",
      };
    }

    if (![UserRole.ADMIN, UserRole.FUNCIONARIO].includes(user.role)) {
      return {
        success: false,
        error:
          "Apenas administradores e funcionários podem alterar status de pagamento",
      };
    }

    // 3. Verificar se o aluno existe e é realmente aluno
    const [student] = await db
      .select({ role: usersTable.userRole })
      .from(usersTable)
      .where(eq(usersTable.id, studentUserId))
      .limit(1);

    if (!student || student.role !== UserRole.ALUNO) {
      return {
        success: false,
        error: "Aluno não encontrado",
      };
    }

    // 4. Atualizar status de pagamento
    const updateData: {
      paid: boolean;
      updatedAt: string;
      lastPaymentDate?: string;
    } = {
      paid,
      updatedAt: new Date().toISOString().split("T")[0],
    };

    // Se marcar como pago, registrar data de pagamento
    if (paid) {
      updateData.lastPaymentDate = new Date().toISOString().split("T")[0];
    }

    await db
      .update(financialTable)
      .set(updateData)
      .where(eq(financialTable.userId, studentUserId));

    console.log(
      `✅ ${user.role} ${decoded.userId} alterou status de pagamento do aluno ${studentUserId} para ${paid ? "PAGO" : "PENDENTE"}`,
    );

    return {
      success: true,
      message: `Status atualizado para ${paid ? "PAGO" : "PENDENTE"} com sucesso!`,
    };
  } catch (error) {
    console.error("Erro ao atualizar status de pagamento:", error);
    return {
      success: false,
      error: "Erro ao atualizar status de pagamento",
    };
  }
}
