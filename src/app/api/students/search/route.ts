import { and, eq, ilike, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { personalDataTable, usersTable } from "@/db/schema";
import { UserRole } from "@/types/user-roles";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    // Buscar alunos por nome, CPF ou email
    const students = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: personalDataTable.email,
        cpf: personalDataTable.cpf,
      })
      .from(usersTable)
      .innerJoin(personalDataTable, eq(usersTable.id, personalDataTable.userId))
      .where(
        and(
          eq(usersTable.userRole, UserRole.ALUNO),
          or(
            ilike(usersTable.name, `%${query}%`),
            ilike(personalDataTable.email, `%${query}%`),
            ilike(personalDataTable.cpf, `%${query}%`),
          ),
        ),
      )
      .limit(10);

    return NextResponse.json(students);
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
