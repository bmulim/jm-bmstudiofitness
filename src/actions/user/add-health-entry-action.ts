"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import { studentHealthHistoryTable } from "@/db/schema";

// Schema de validação
const addHealthEntrySchema = z.object({
  heightCm: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z
      .number()
      .min(100, "Altura deve ser pelo menos 100cm")
      .max(250, "Altura deve ser no máximo 250cm")
      .optional(),
  ),
  weightKg: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z
      .number()
      .min(30, "Peso deve ser pelo menos 30kg")
      .max(200, "Peso deve ser no máximo 200kg")
      .optional(),
  ),
  notes: z
    .string()
    .max(1000, "Observações devem ter no máximo 1000 caracteres")
    .optional(),
});

interface AddHealthEntryState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export async function addStudentHealthEntryAction(
  prevState: AddHealthEntryState,
  formData: FormData,
): Promise<AddHealthEntryState> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Token de autenticação não encontrado",
      };
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      role: string;
    };

    if (decoded.role !== "aluno") {
      return {
        success: false,
        message:
          "Acesso negado. Apenas alunos podem adicionar entradas de saúde",
      };
    }

    // Extrair e validar dados do formulário
    const rawData = {
      heightCm: formData.get("heightCm") as string,
      weightKg: formData.get("weightKg") as string,
      notes: formData.get("notes") as string,
    };

    const validationResult = addHealthEntrySchema.safeParse(rawData);

    if (!validationResult.success) {
      const errors: Record<string, string[]> = {};
      validationResult.error.errors.forEach((error) => {
        const field = error.path[0] as string;
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field].push(error.message);
      });

      return {
        success: false,
        message: "Erro de validação",
        errors,
      };
    }

    const { heightCm, weightKg, notes } = validationResult.data;

    // Verificar se pelo menos um campo foi preenchido
    if (!heightCm && !weightKg && (!notes || notes.trim() === "")) {
      return {
        success: false,
        message: "Preencha pelo menos um campo para criar uma entrada",
      };
    }

    // Criar nova entrada no histórico
    await db.insert(studentHealthHistoryTable).values({
      userId: decoded.userId,
      heightCm: heightCm || null,
      weightKg: weightKg ? weightKg.toString() : null,
      notes: notes && notes.trim() !== "" ? notes.trim() : null,
    });

    return {
      success: true,
      message: "Entrada de saúde adicionada com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao adicionar entrada de saúde:", error);
    return {
      success: false,
      message: "Erro interno do servidor",
    };
  }
}
