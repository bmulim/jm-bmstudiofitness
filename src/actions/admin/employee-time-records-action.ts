"use server";

import { and, desc, eq, gte, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { employeeTimeRecordsTable } from "@/db/schema";

export interface TimeRecordData {
  employeeId: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  notes?: string;
}

export interface TimeRecord {
  id: string;
  employeeId: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  totalHours: string | null;
  notes: string | null;
  approved: boolean;
  approvedBy: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

// Calcular horas trabalhadas
function calculateTotalHours(checkIn: string, checkOut: string): string {
  const [checkInHour, checkInMinute] = checkIn.split(":").map(Number);
  const [checkOutHour, checkOutMinute] = checkOut.split(":").map(Number);

  const checkInMinutes = checkInHour * 60 + checkInMinute;
  const checkOutMinutes = checkOutHour * 60 + checkOutMinute;

  let totalMinutes = checkOutMinutes - checkInMinutes;
  if (totalMinutes < 0) totalMinutes += 24 * 60; // Se passou da meia-noite

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}:${minutes.toString().padStart(2, "0")}`;
}

export async function registerTimeRecordAction(data: TimeRecordData) {
  try {
    // Verificar se já existe registro para este dia
    const [existing] = await db
      .select()
      .from(employeeTimeRecordsTable)
      .where(
        and(
          eq(employeeTimeRecordsTable.employeeId, data.employeeId),
          eq(employeeTimeRecordsTable.date, data.date),
        ),
      );

    if (existing) {
      // Atualizar registro existente com check-out
      const totalHours = data.checkOutTime
        ? calculateTotalHours(existing.checkInTime!, data.checkOutTime)
        : null;

      await db
        .update(employeeTimeRecordsTable)
        .set({
          checkOutTime: data.checkOutTime,
          totalHours,
          notes: data.notes,
          updatedAt: new Date(),
        })
        .where(eq(employeeTimeRecordsTable.id, existing.id));

      return {
        success: true,
        message: "Saída registrada com sucesso!",
      };
    }

    // Criar novo registro de entrada
    await db.insert(employeeTimeRecordsTable).values({
      employeeId: data.employeeId,
      date: data.date,
      checkInTime: data.checkInTime,
      checkOutTime: data.checkOutTime,
      totalHours: null,
      notes: data.notes,
    });

    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: "Entrada registrada com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao registrar ponto:", error);
    return {
      success: false,
      error: "Erro ao registrar ponto",
    };
  }
}

export async function getEmployeeTimeRecordsAction(
  employeeId: string,
  startDate: string,
  endDate: string,
) {
  try {
    const records = await db
      .select()
      .from(employeeTimeRecordsTable)
      .where(
        and(
          eq(employeeTimeRecordsTable.employeeId, employeeId),
          gte(employeeTimeRecordsTable.date, startDate),
          lte(employeeTimeRecordsTable.date, endDate),
        ),
      )
      .orderBy(desc(employeeTimeRecordsTable.date));

    return {
      success: true,
      data: records,
    };
  } catch (error) {
    console.error("Erro ao buscar registros de ponto:", error);
    return {
      success: false,
      error: "Erro ao carregar registros de ponto",
    };
  }
}

export async function approveTimeRecordAction(
  recordId: string,
  approvedBy: string,
) {
  try {
    await db
      .update(employeeTimeRecordsTable)
      .set({
        approved: true,
        approvedBy,
        updatedAt: new Date(),
      })
      .where(eq(employeeTimeRecordsTable.id, recordId));

    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: "Ponto aprovado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao aprovar ponto:", error);
    return {
      success: false,
      error: "Erro ao aprovar ponto",
    };
  }
}
