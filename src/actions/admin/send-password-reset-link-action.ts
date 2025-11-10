"use server";

import crypto from "crypto";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import {
  personalDataTable,
  userConfirmationTokensTable,
  usersTable,
} from "@/db/schema";
import { sendResetPasswordEmail } from "@/lib/email";

/**
 * Gera um link de redefinição de senha e envia por email
 */
export async function sendPasswordResetLinkAction(userId: string) {
  try {
    // Buscar dados do usuário
    const user = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user || user.length === 0) {
      return {
        success: false,
        message: "Usuário não encontrado",
      };
    }

    const userData = user[0];

    // Buscar email na tabela personal_data
    const personalData = await db
      .select({
        email: personalDataTable.email,
      })
      .from(personalDataTable)
      .where(eq(personalDataTable.userId, userId))
      .limit(1);

    if (!personalData || personalData.length === 0 || !personalData[0].email) {
      return {
        success: false,
        message: "Usuário não possui e-mail cadastrado",
      };
    }

    const userEmail = personalData[0].email;

    // Gerar token único
    const token = crypto.randomBytes(32).toString("hex");

    // Definir expiração para 24 horas a partir de agora
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Salvar token no banco
    await db.insert(userConfirmationTokensTable).values({
      userId,
      token,
      expiresAt,
      used: false,
    });

    // Enviar email usando a função de redefinição de senha
    const emailSent = await sendResetPasswordEmail(
      userEmail,
      userData.name,
      token,
    );

    if (!emailSent) {
      return {
        success: false,
        message: "Erro ao enviar e-mail. Verifique as configurações.",
      };
    }

    return {
      success: true,
      message: `Link de redefinição enviado para ${userEmail}`,
    };
  } catch (error) {
    console.error("Erro ao enviar link de redefinição:", error);
    return {
      success: false,
      message: "Erro ao enviar link de redefinição. Tente novamente.",
    };
  }
}
