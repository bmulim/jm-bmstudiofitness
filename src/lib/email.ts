import crypto from "crypto";

// Por enquanto vamos simular o envio de e-mail
// Posteriormente pode ser integrado com Resend, SendGrid, etc.
export async function sendConfirmationEmail(
  email: string,
  name: string,
  token: string,
): Promise<boolean> {
  try {
    // URL de confirmação
    const confirmationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/user/confirm?token=${token}`;

    // Log do e-mail (em produção seria enviado de fato)
    console.log("📧 E-mail de confirmação:", {
      to: email,
      subject: "Bem-vindo(a) ao BM Studio Fitness - Confirme sua conta",
      name,
      confirmationUrl,
    });

    // Por enquanto sempre retorna sucesso
    // Em produção: usar Resend, SendGrid, Nodemailer, etc.
    return true;
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return false;
  }
}

export function generateConfirmationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function getTokenExpirationDate(): Date {
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 24); // Token expira em 24 horas
  return expiration;
}
