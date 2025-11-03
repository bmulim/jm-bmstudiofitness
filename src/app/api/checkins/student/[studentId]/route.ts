import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { checkInTable, usersTable } from "@/db/schema";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> },
) {
  try {
    const { studentId } = await params;

    if (!studentId) {
      return NextResponse.json(
        { error: "ID do aluno é obrigatório" },
        { status: 400 },
      );
    }

    // Buscar todos os check-ins do aluno
    const checkIns = await db
      .select({
        id: checkInTable.id,
        userId: checkInTable.userId,
        checkInDate: checkInTable.checkInDate,
        checkInTime: checkInTable.checkInTime,
        method: checkInTable.method,
        identifier: checkInTable.identifier,
        userName: usersTable.name,
      })
      .from(checkInTable)
      .innerJoin(usersTable, eq(checkInTable.userId, usersTable.id))
      .where(eq(checkInTable.userId, studentId))
      .orderBy(checkInTable.checkInDate, checkInTable.checkInTime);

    return NextResponse.json(checkIns);
  } catch (error) {
    console.error("Erro ao buscar check-ins do aluno:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
