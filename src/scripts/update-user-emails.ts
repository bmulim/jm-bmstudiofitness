import { eq } from "drizzle-orm";

import { db } from "../db";
import { personalDataTable } from "../db/schema";

async function updateUserEmails() {
  try {
    console.log("Atualizando emails dos usuários...");

    // Buscar todos os usuários com email temporário
    const usersWithTempEmail = await db
      .select()
      .from(personalDataTable)
      .where(eq(personalDataTable.email, "temp@example.com"));

    console.log(
      `Encontrados ${usersWithTempEmail.length} usuários com email temporário`,
    );

    // Atualizar cada usuário com um email único baseado no CPF
    for (const user of usersWithTempEmail) {
      const newEmail = `user-${user.cpf}@bmstudiofitness.com`;

      await db
        .update(personalDataTable)
        .set({ email: newEmail })
        .where(eq(personalDataTable.id, user.id));

      console.log(`Usuário ${user.id} atualizado com email: ${newEmail}`);
    }

    console.log("Atualização concluída!");
  } catch (error) {
    console.error("Erro ao atualizar emails:", error);
  }
}

updateUserEmails().then(() => process.exit(0));
