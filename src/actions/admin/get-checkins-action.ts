"use server";

import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { checkInTable, personalDataTable, usersTable } from "@/db/schema";

export interface CheckInData {
  id: string;
  userName: string;
  cpf: string;
  email: string;
  checkInDate: string;
  checkInTime: string;
  method: string;
  identifier: string;
}

export async function getCheckInsAction(date?: string): Promise<CheckInData[]> {
  try {
    const targetDate = date || new Date().toISOString().split("T")[0];

    const checkIns = await db
      .select({
        id: checkInTable.id,
        userName: usersTable.name,
        cpf: personalDataTable.cpf,
        email: personalDataTable.email,
        checkInDate: checkInTable.checkInDate,
        checkInTime: checkInTable.checkInTime,
        method: checkInTable.method,
        identifier: checkInTable.identifier,
      })
      .from(checkInTable)
      .innerJoin(usersTable, eq(checkInTable.userId, usersTable.id))
      .innerJoin(personalDataTable, eq(usersTable.id, personalDataTable.userId))
      .where(eq(checkInTable.checkInDate, targetDate))
      .orderBy(desc(checkInTable.checkInTime));

    return checkIns;
  } catch (error) {
    console.error("Erro ao buscar check-ins:", error);
    return [];
  }
}
