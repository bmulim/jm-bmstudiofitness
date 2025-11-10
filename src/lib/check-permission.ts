"use server";

import { cookies } from "next/headers";

import { verifyToken } from "@/lib/auth-utils";
import { hasPermission, PermissionContext, UserRole } from "@/types/user-roles";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface PermissionCheckResult {
  allowed: boolean;
  user: CurrentUser | null;
  error?: string;
}

/**
 * Verifica se o usuário atual tem permissão para realizar uma ação em um recurso
 * @param resource - Nome do recurso (users, healthMetrics, financial, etc)
 * @param action - Ação a ser realizada (create, read, update, delete)
 * @param context - Contexto adicional para verificação de condições
 * @returns Objeto com allowed, user e error (se houver)
 */
export async function checkPermission(
  resource: string,
  action: string,
  context?: PermissionContext,
): Promise<PermissionCheckResult> {
  try {
    // Obter token do cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return {
        allowed: false,
        user: null,
        error: "Usuário não autenticado",
      };
    }

    // Verificar e decodificar token
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return {
        allowed: false,
        user: null,
        error: "Token inválido ou expirado",
      };
    }

    // Criar objeto de usuário
    const user: CurrentUser = {
      id: decoded.userId,
      name: "", // Será preenchido quando necessário
      email: decoded.email,
      role: decoded.role as UserRole,
    };

    // Verificar permissão
    const allowed = hasPermission(user.role, resource, action, {
      ...context,
      userId: user.id,
    });

    if (!allowed) {
      return {
        allowed: false,
        user,
        error: "Você não tem permissão para realizar esta ação",
      };
    }

    return {
      allowed: true,
      user,
    };
  } catch (error) {
    console.error("Erro ao verificar permissão:", error);
    return {
      allowed: false,
      user: null,
      error: "Erro ao verificar permissões",
    };
  }
}

/**
 * Verifica se o usuário pode criar um tipo específico de usuário
 * @param targetUserType - Tipo de usuário a ser criado (admin, funcionario, professor, aluno)
 * @returns Objeto com allowed, user e error (se houver)
 */
export async function canCreateUserType(
  targetUserType: string,
): Promise<PermissionCheckResult> {
  return checkPermission("users", "create", { targetUserType });
}

/**
 * Verifica se o usuário pode editar um tipo específico de usuário
 * @param targetUserType - Tipo de usuário a ser editado
 * @param targetUserId - ID do usuário a ser editado (para verificar se é próprio)
 * @returns Objeto com allowed, user e error (se houver)
 */
export async function canUpdateUserType(
  targetUserType: string,
  targetUserId?: string,
): Promise<PermissionCheckResult> {
  const result = await checkPermission("users", "update", {
    targetUserType,
    targetUserId,
  });

  // Se não tem permissão geral, verificar se é próprio dado
  if (!result.allowed && targetUserId && result.user) {
    const ownDataResult = await checkPermission("users", "update", {
      targetUserType,
      targetUserId,
      userId: result.user.id,
    });
    return ownDataResult;
  }

  return result;
}

/**
 * Verifica se o usuário pode acessar dados de saúde
 * @param targetUserId - ID do usuário cujos dados serão acessados
 * @param action - Ação a ser realizada (read, update)
 * @returns Objeto com allowed, user e error (se houver)
 */
export async function canAccessHealthMetrics(
  action: "read" | "update",
  targetUserId?: string,
): Promise<PermissionCheckResult> {
  return checkPermission("healthMetrics", action, {
    targetUserId,
  });
}

/**
 * Verifica se o usuário pode acessar dados financeiros
 * @param targetUserId - ID do usuário cujos dados serão acessados
 * @param action - Ação a ser realizada (read, update)
 * @returns Objeto com allowed, user e error (se houver)
 */
export async function canAccessFinancial(
  action: "read" | "update",
  targetUserId?: string,
): Promise<PermissionCheckResult> {
  return checkPermission("financial", action, {
    targetUserId,
  });
}

/**
 * Verifica se o usuário pode acessar apenas status de mensalidade
 * (para funcionários com acesso limitado)
 * @param targetUserId - ID do aluno cuja mensalidade será acessada
 * @param action - Ação a ser realizada (read, update)
 * @returns Objeto com allowed, user e error (se houver)
 */
export async function canAccessMonthlyPayment(
  action: "read" | "update",
  targetUserId?: string,
): Promise<PermissionCheckResult> {
  return checkPermission("financialMonthlyPayment", action, {
    targetUserType: "aluno",
    targetUserId,
  });
}
