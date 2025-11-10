"use server";

import { format } from "date-fns";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { studioExpensesTable } from "@/db/schema";
import { adminGuard, verifyToken } from "@/lib/auth-utils";

export interface CreateExpenseInput {
  description: string;
  category: string;
  amountInCents: number;
  dueDate: string | Date;
  paymentMethod: string;
  recurrent: boolean;
  notes?: string | null;
  attachment?: string | null;
}

export async function createExpenseAction(input: CreateExpenseInput) {
  try {
    await adminGuard();

    const cookieStore = await (await import("next/headers")).cookies();
    const authToken = cookieStore.get("auth-token")?.value;
    const payload = verifyToken(authToken!);

    // Formata a data como string ISO (YYYY-MM-DD)
    const dueDate = format(new Date(input.dueDate), "yyyy-MM-dd");

    try {
      console.log("Inserindo despesa:", {
        description: input.description,
        category: input.category,
        amountInCents: input.amountInCents,
        dueDate,
        paymentMethod: input.paymentMethod,
        recurrent: input.recurrent,
        notes: input.notes || null,
        attachment: input.attachment || null,
        createdBy: payload!.userId,
      });

      await db.insert(studioExpensesTable).values({
        description: input.description,
        category: input.category,
        amountInCents: input.amountInCents,
        dueDate,
        paymentMethod: input.paymentMethod,
        recurrent: input.recurrent,
        notes: input.notes || null,
        attachment: input.attachment || null,
        createdBy: payload!.userId,
      });
    } catch (error) {
      console.error("Erro detalhado:", error);
      throw error;
    }

    revalidatePath("/admin/dashboard?tab=financial");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar despesa:", error);
    return { error: "Erro ao criar despesa" };
  }
}

export async function getExpensesAction() {
  await adminGuard();

  try {
    const expenses = await db.query.studioExpensesTable.findMany({
      orderBy: (expenses, { desc }) => [desc(expenses.createdAt)],
    });

    return { expenses };
  } catch (error) {
    console.error("Erro ao buscar despesas:", error);
    return { error: "Erro ao buscar despesas" };
  }
}

export interface UpdateExpenseInput {
  id: string;
  paid: boolean;
  paymentDate?: string | null;
}

export async function updateExpenseAction(input: UpdateExpenseInput) {
  await adminGuard();

  try {
    await db
      .update(studioExpensesTable)
      .set({
        paid: input.paid,
        paymentDate: input.paymentDate ? new Date(input.paymentDate) : null,
        updatedAt: new Date(),
      })
      .where(eq(studioExpensesTable.id, input.id));

    revalidatePath("/admin/dashboard?tab=financial");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar despesa:", error);
    return { error: "Erro ao atualizar despesa" };
  }
}

export async function deleteExpenseAction(id: string) {
  await adminGuard();

  try {
    await db.delete(studioExpensesTable).where(eq(studioExpensesTable.id, id));

    revalidatePath("/admin/dashboard?tab=financial");
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir despesa:", error);
    return { error: "Erro ao excluir despesa" };
  }
}
