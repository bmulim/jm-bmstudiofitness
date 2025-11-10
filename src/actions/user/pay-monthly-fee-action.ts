"use server";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

import { db } from "@/db";
import { financialTable, usersTable } from "@/db/schema";
import { verifyToken } from "@/lib/auth-utils";
import { UserRole } from "@/types/user-roles";

export interface PayMonthlyFeeData {
  paymentMethod:
    | "pix"
    | "cartao_credito"
    | "cartao_debito"
    | "dinheiro"
    | "transferencia";
  transactionId?: string; // ID da transação do gateway de pagamento
  paymentProof?: string; // URL do comprovante (se houver)
}

export interface PayMonthlyFeeResult {
  success: boolean;
  message: string;
  error?: string;
  paymentData?: {
    paidAt: string;
    method: string;
    nextDueDate: string;
  };
}

/**
 * Permite que o aluno pague sua própria mensalidade
 * APENAS alunos podem usar esta action
 */
export async function payMonthlyFeeAction(
  data: PayMonthlyFeeData,
): Promise<PayMonthlyFeeResult> {
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

    // 2. Verificar se é aluno
    const [user] = await db
      .select({ role: usersTable.userRole })
      .from(usersTable)
      .where(eq(usersTable.id, decoded.userId))
      .limit(1);

    if (!user) {
      return {
        success: false,
        message: "Usuário não encontrado",
        error: "Usuário não encontrado no sistema",
      };
    }

    if (user.role !== UserRole.ALUNO) {
      return {
        success: false,
        message: "Acesso negado",
        error: "Apenas alunos podem pagar mensalidades através desta função",
      };
    }

    // 3. Buscar dados financeiros do aluno
    const [financial] = await db
      .select()
      .from(financialTable)
      .where(eq(financialTable.userId, decoded.userId))
      .limit(1);

    if (!financial) {
      return {
        success: false,
        message: "Dados financeiros não encontrados",
        error: "Não foi possível localizar seus dados financeiros",
      };
    }

    // 4. Verificar se já está pago
    if (financial.paid) {
      return {
        success: false,
        message: "Mensalidade já paga",
        error: `Sua mensalidade já foi paga em ${new Date(financial.lastPaymentDate!).toLocaleDateString("pt-BR")}`,
      };
    }

    // 5. Processar pagamento
    const paymentDate = new Date().toISOString().split("T")[0];

    // Calcular próxima data de vencimento
    const today = new Date();
    const nextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      financial.dueDate,
    );
    const nextDueDateStr = nextMonth.toISOString().split("T")[0];

    // Atualizar status de pagamento
    await db
      .update(financialTable)
      .set({
        paid: true,
        lastPaymentDate: paymentDate,
        paymentMethod: data.paymentMethod,
        updatedAt: paymentDate,
      })
      .where(eq(financialTable.userId, decoded.userId));

    console.log(
      `✅ Pagamento registrado: Aluno ${decoded.userId} pagou mensalidade via ${data.paymentMethod}`,
    );

    // TODO: Integrar com gateway de pagamento real (Stripe, PagSeguro, etc)
    // TODO: Enviar email de confirmação de pagamento
    // TODO: Gerar recibo PDF

    return {
      success: true,
      message: "Pagamento registrado com sucesso!",
      paymentData: {
        paidAt: paymentDate,
        method: data.paymentMethod,
        nextDueDate: nextDueDateStr,
      },
    };
  } catch (error) {
    console.error("Erro ao processar pagamento de mensalidade:", error);
    return {
      success: false,
      message: "Erro ao processar pagamento",
      error:
        "Erro interno do servidor. Tente novamente ou entre em contato com a academia.",
    };
  }
}

/**
 * Busca status da mensalidade do aluno logado
 */
export async function getMyPaymentStatusAction() {
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

    // 2. Verificar se é aluno
    const [user] = await db
      .select({ role: usersTable.userRole })
      .from(usersTable)
      .where(eq(usersTable.id, decoded.userId))
      .limit(1);

    if (!user || user.role !== UserRole.ALUNO) {
      return {
        success: false,
        error: "Apenas alunos podem acessar este recurso",
      };
    }

    // 3. Buscar dados financeiros
    const [financial] = await db
      .select()
      .from(financialTable)
      .where(eq(financialTable.userId, decoded.userId))
      .limit(1);

    if (!financial) {
      return {
        success: false,
        error: "Dados financeiros não encontrados",
      };
    }

    return {
      success: true,
      data: {
        paid: financial.paid,
        monthlyFeeValue: financial.monthlyFeeValueInCents / 100,
        dueDate: financial.dueDate,
        lastPaymentDate: financial.lastPaymentDate,
        paymentMethod: financial.paymentMethod,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar status de pagamento:", error);
    return {
      success: false,
      error: "Erro ao carregar dados de pagamento",
    };
  }
}
