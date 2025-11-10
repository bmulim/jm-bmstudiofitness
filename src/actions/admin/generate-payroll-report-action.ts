"use server";

import { and, eq, gte, isNull, lte, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  employeesTable,
  employeeTimeRecordsTable,
  personalDataTable,
  usersTable,
} from "@/db/schema";

export interface PayrollEmployee {
  id: string;
  name: string;
  position: string;
  salary: string;
  salaryInCents: number;
  workedDays: number;
  totalHours: string;
  bonuses: number;
  deductions: number;
  netSalary: string;
  netSalaryInCents: number;
}

export interface PayrollReport {
  month: string;
  year: string;
  employees: PayrollEmployee[];
  totalGrossSalary: string;
  totalNetSalary: string;
  totalBonuses: number;
  totalDeductions: number;
  employeeCount: number;
}

export async function generatePayrollReportAction(month: number, year: number) {
  try {
    // Buscar funcionários ativos
    const employees = await db
      .select({
        id: employeesTable.id,
        userId: employeesTable.userId,
        name: usersTable.name,
        position: employeesTable.position,
        salaryInCents: employeesTable.salaryInCents,
      })
      .from(employeesTable)
      .innerJoin(usersTable, eq(employeesTable.userId, usersTable.id))
      .where(isNull(employeesTable.deletedAt));

    // Datas do mês
    const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${month.toString().padStart(2, "0")}-${lastDay}`;

    const payrollEmployees: PayrollEmployee[] = [];
    let totalGrossSalaryInCents = 0;
    let totalNetSalaryInCents = 0;
    let totalBonuses = 0;
    let totalDeductions = 0;

    for (const employee of employees) {
      // Buscar registros de ponto do mês
      const timeRecords = await db
        .select()
        .from(employeeTimeRecordsTable)
        .where(
          and(
            eq(employeeTimeRecordsTable.employeeId, employee.id),
            gte(employeeTimeRecordsTable.date, startDate),
            lte(employeeTimeRecordsTable.date, endDate),
          ),
        );

      const workedDays = timeRecords.filter(
        (r) => r.checkInTime && r.checkOutTime,
      ).length;

      // Calcular total de horas trabalhadas
      let totalMinutes = 0;
      timeRecords.forEach((record) => {
        if (record.totalHours) {
          const [hours, minutes] = record.totalHours.split(":").map(Number);
          totalMinutes += hours * 60 + minutes;
        }
      });

      const totalHours = `${Math.floor(totalMinutes / 60)}:${(totalMinutes % 60).toString().padStart(2, "0")}`;

      // Cálculos básicos (pode ser customizado)
      const bonuses = 0; // Implementar lógica de bônus
      const deductions = 0; // Implementar lógica de descontos (INSS, etc)
      const netSalaryInCents = employee.salaryInCents + bonuses - deductions;

      const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(cents / 100);
      };

      payrollEmployees.push({
        id: employee.id,
        name: employee.name,
        position: employee.position,
        salary: formatCurrency(employee.salaryInCents),
        salaryInCents: employee.salaryInCents,
        workedDays,
        totalHours,
        bonuses,
        deductions,
        netSalary: formatCurrency(netSalaryInCents),
        netSalaryInCents,
      });

      totalGrossSalaryInCents += employee.salaryInCents;
      totalNetSalaryInCents += netSalaryInCents;
      totalBonuses += bonuses;
      totalDeductions += deductions;
    }

    const formatCurrency = (cents: number) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(cents / 100);
    };

    const report: PayrollReport = {
      month: month.toString().padStart(2, "0"),
      year: year.toString(),
      employees: payrollEmployees,
      totalGrossSalary: formatCurrency(totalGrossSalaryInCents),
      totalNetSalary: formatCurrency(totalNetSalaryInCents),
      totalBonuses,
      totalDeductions,
      employeeCount: employees.length,
    };

    return {
      success: true,
      data: report,
    };
  } catch (error) {
    console.error("Erro ao gerar folha de pagamento:", error);
    return {
      success: false,
      error: "Erro ao gerar folha de pagamento",
    };
  }
}
