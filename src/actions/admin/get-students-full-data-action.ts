"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import {
  financialTable,
  healthMetricsTable,
  personalDataTable,
  usersTable,
} from "@/db/schema";
import { formatCurrency, isPaymentUpToDate } from "@/lib/payment-utils";
import { UserRole } from "@/types/user-roles";

export interface StudentFullData {
  // Dados básicos do usuário
  userId: string;
  name: string;
  userRole: string;
  createdAt: string;
  deletedAt: string | null;

  // Dados pessoais
  cpf: string;
  email: string;
  bornDate: string;
  address: string;
  telephone: string;
  age: number;

  // Dados financeiros
  monthlyFeeValueInCents: number;
  paymentMethod: string;
  dueDate: number;
  paid: boolean;
  lastPaymentDate: string | null;
  isPaymentUpToDate: boolean;
  formattedMonthlyFee: string;

  // Dados de saúde
  heightCm: string;
  weightKg: string;
  bloodType: string;
  hasPracticedSports: boolean;
  lastExercise: string;
  historyDiseases: string;
  medications: string;
  sportsHistory: string;
  allergies: string;
  injuries: string;
  alimentalRoutine: string;
  diaryRoutine: string;
  useSupplements: boolean;
  whatSupplements: string | null;
  otherNotes: string | null;
  coachaObservations: string | null;
  coachObservationsParticular: string | null;
  healthUpdatedAt: string;
}

// Buscar todos os alunos com dados completos
export async function getAllStudentsFullDataAction(): Promise<
  StudentFullData[]
> {
  try {
    const students = await db
      .select({
        // Dados básicos
        userId: usersTable.id,
        name: usersTable.name,
        userRole: usersTable.userRole,
        createdAt: usersTable.createdAt,
        deletedAt: usersTable.deletedAt,

        // Dados pessoais
        cpf: personalDataTable.cpf,
        email: personalDataTable.email,
        bornDate: personalDataTable.bornDate,
        address: personalDataTable.address,
        telephone: personalDataTable.telephone,

        // Dados financeiros
        monthlyFeeValueInCents: financialTable.monthlyFeeValueInCents,
        paymentMethod: financialTable.paymentMethod,
        dueDate: financialTable.dueDate,
        paid: financialTable.paid,
        lastPaymentDate: financialTable.lastPaymentDate,

        // Dados de saúde
        heightCm: healthMetricsTable.heightCm,
        weightKg: healthMetricsTable.weightKg,
        bloodType: healthMetricsTable.bloodType,
        hasPracticedSports: healthMetricsTable.hasPracticedSports,
        lastExercise: healthMetricsTable.lastExercise,
        historyDiseases: healthMetricsTable.historyDiseases,
        medications: healthMetricsTable.medications,
        sportsHistory: healthMetricsTable.sportsHistory,
        allergies: healthMetricsTable.allergies,
        injuries: healthMetricsTable.injuries,
        alimentalRoutine: healthMetricsTable.alimentalRoutine,
        diaryRoutine: healthMetricsTable.diaryRoutine,
        useSupplements: healthMetricsTable.useSupplements,
        whatSupplements: healthMetricsTable.whatSupplements,
        otherNotes: healthMetricsTable.otherNotes,
        coachaObservations: healthMetricsTable.coachaObservations,
        coachObservationsParticular:
          healthMetricsTable.coachObservationsParticular,
        healthUpdatedAt: healthMetricsTable.updatedAt,
      })
      .from(usersTable)
      .innerJoin(personalDataTable, eq(usersTable.id, personalDataTable.userId))
      .innerJoin(financialTable, eq(usersTable.id, financialTable.userId))
      .innerJoin(
        healthMetricsTable,
        eq(usersTable.id, healthMetricsTable.userId),
      )
      .where(eq(usersTable.userRole, UserRole.ALUNO)) // Removido filtro de deletedAt para incluir desativados
      .orderBy(usersTable.name);

    // Processar dados adicionais
    const processedStudents: StudentFullData[] = students.map((student) => {
      // Calcular idade
      const birthDate = new Date(student.bornDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      // Verificar status de pagamento
      const isPaymentUpToDateStatus = isPaymentUpToDate(
        student.dueDate,
        student.lastPaymentDate,
        student.paid,
      );

      // Formatar valor da mensalidade
      const formattedMonthlyFee = formatCurrency(
        student.monthlyFeeValueInCents,
      );

      return {
        ...student,
        deletedAt: student.deletedAt ? student.deletedAt.toISOString() : null,
        age,
        isPaymentUpToDate: isPaymentUpToDateStatus,
        formattedMonthlyFee,
      };
    });

    return processedStudents;
  } catch (error) {
    console.error("Erro ao buscar dados completos dos alunos:", error);
    return [];
  }
}

// Buscar dados de um aluno específico
export async function getStudentFullDataAction(
  userId: string,
): Promise<StudentFullData | null> {
  try {
    const student = await db
      .select({
        // Dados básicos
        userId: usersTable.id,
        name: usersTable.name,
        userRole: usersTable.userRole,
        createdAt: usersTable.createdAt,
        deletedAt: usersTable.deletedAt,

        // Dados pessoais
        cpf: personalDataTable.cpf,
        email: personalDataTable.email,
        bornDate: personalDataTable.bornDate,
        address: personalDataTable.address,
        telephone: personalDataTable.telephone,

        // Dados financeiros
        monthlyFeeValueInCents: financialTable.monthlyFeeValueInCents,
        paymentMethod: financialTable.paymentMethod,
        dueDate: financialTable.dueDate,
        paid: financialTable.paid,
        lastPaymentDate: financialTable.lastPaymentDate,

        // Dados de saúde
        heightCm: healthMetricsTable.heightCm,
        weightKg: healthMetricsTable.weightKg,
        bloodType: healthMetricsTable.bloodType,
        hasPracticedSports: healthMetricsTable.hasPracticedSports,
        lastExercise: healthMetricsTable.lastExercise,
        historyDiseases: healthMetricsTable.historyDiseases,
        medications: healthMetricsTable.medications,
        sportsHistory: healthMetricsTable.sportsHistory,
        allergies: healthMetricsTable.allergies,
        injuries: healthMetricsTable.injuries,
        alimentalRoutine: healthMetricsTable.alimentalRoutine,
        diaryRoutine: healthMetricsTable.diaryRoutine,
        useSupplements: healthMetricsTable.useSupplements,
        whatSupplements: healthMetricsTable.whatSupplements,
        otherNotes: healthMetricsTable.otherNotes,
        coachaObservations: healthMetricsTable.coachaObservations,
        coachObservationsParticular:
          healthMetricsTable.coachObservationsParticular,
        healthUpdatedAt: healthMetricsTable.updatedAt,
      })
      .from(usersTable)
      .innerJoin(personalDataTable, eq(usersTable.id, personalDataTable.userId))
      .innerJoin(financialTable, eq(usersTable.id, financialTable.userId))
      .innerJoin(
        healthMetricsTable,
        eq(usersTable.id, healthMetricsTable.userId),
      )
      .where(eq(usersTable.id, userId)) // Removido filtro deletedAt para incluir desativados
      .limit(1);

    if (student.length === 0) {
      return null;
    }

    const studentData = student[0];

    // Calcular idade
    const birthDate = new Date(studentData.bornDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    // Verificar status de pagamento
    const isPaymentUpToDateStatus = isPaymentUpToDate(
      studentData.dueDate,
      studentData.lastPaymentDate,
      studentData.paid,
    );

    // Formatar valor da mensalidade
    const formattedMonthlyFee = formatCurrency(
      studentData.monthlyFeeValueInCents,
    );

    return {
      ...studentData,
      deletedAt: studentData.deletedAt
        ? studentData.deletedAt.toISOString()
        : null,
      age,
      isPaymentUpToDate: isPaymentUpToDateStatus,
      formattedMonthlyFee,
    };
  } catch (error) {
    console.error("Erro ao buscar dados do aluno:", error);
    return null;
  }
}
