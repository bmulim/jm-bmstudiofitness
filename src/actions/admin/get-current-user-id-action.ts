"use server";

import { getCurrentUser } from "@/lib/auth-server";

export async function getCurrentUserIdAction(): Promise<{
  success: boolean;
  userId?: string;
  error?: string;
}> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error: "Usuário não autenticado",
      };
    }

    return {
      success: true,
      userId: user.userId,
    };
  } catch (error) {
    console.error("Erro ao obter ID do usuário:", error);
    return {
      success: false,
      error: "Erro ao obter ID do usuário",
    };
  }
}
