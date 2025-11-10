"use server";

import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { personalDataTable, usersTable } from "@/db/schema";
import { canCreateUserType } from "@/lib/check-permission";
import { UserRole } from "@/types/user-roles";

// Schema de validação para criação de administrador
const createAdminSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  cpf: z.string().regex(/^\d{11}$/, "CPF deve ter 11 dígitos"),
  email: z.string().email("Email inválido"),
  sex: z.enum(["masculino", "feminino"]),
  bornDate: z.string().refine((date) => {
    const parsedDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - parsedDate.getFullYear();
    return age >= 18 && age <= 100;
  }, "Idade deve estar entre 18 e 100 anos"),
  address: z.string().min(10, "Endereço deve ter pelo menos 10 caracteres"),
  telephone: z.string().min(10, "Telefone deve ter pelo menos 10 caracteres"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type CreateAdminFormData = z.infer<typeof createAdminSchema>;

export interface CreateAdminResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  adminId?: string;
}

export async function createAdminAction(
  data: CreateAdminFormData,
): Promise<CreateAdminResult> {
  try {
    // 1. VERIFICAR PERMISSÕES - Apenas admin pode criar outros admins
    const permissionCheck = await canCreateUserType("admin");

    if (!permissionCheck.allowed) {
      return {
        success: false,
        message:
          permissionCheck.error ||
          "Apenas administradores podem criar outros administradores",
      };
    }

    console.log(
      `✅ Admin ${permissionCheck.user?.email} autorizado a criar administrador`,
    );

    // 2. Validar dados
    const validatedData = createAdminSchema.parse(data);

    // 3. Verificar se CPF ou email já existem
    const existingCPF = await db
      .select()
      .from(personalDataTable)
      .where(eq(personalDataTable.cpf, validatedData.cpf))
      .limit(1);

    if (existingCPF.length > 0) {
      return {
        success: false,
        message: "CPF já cadastrado no sistema",
        errors: { cpf: ["Este CPF já está em uso"] },
      };
    }

    const existingEmail = await db
      .select()
      .from(personalDataTable)
      .where(eq(personalDataTable.email, validatedData.email))
      .limit(1);

    if (existingEmail.length > 0) {
      return {
        success: false,
        message: "Email já cadastrado no sistema",
        errors: { email: ["Este email já está em uso"] },
      };
    }

    // 4. Hash da senha
    const hashedPassword = await hash(validatedData.password, 10);

    // 5. Criar administrador em transação
    const result = await db.transaction(async (tx) => {
      // Criar usuário com role de ADMIN
      const [newAdmin] = await tx
        .insert(usersTable)
        .values({
          name: validatedData.name,
          userRole: UserRole.ADMIN,
          password: hashedPassword,
          createdAt: new Date().toISOString().split("T")[0],
        })
        .returning({ id: usersTable.id });

      // Criar dados pessoais
      await tx.insert(personalDataTable).values({
        userId: newAdmin.id,
        cpf: validatedData.cpf,
        email: validatedData.email,
        sex: validatedData.sex,
        bornDate: validatedData.bornDate,
        address: validatedData.address,
        telephone: validatedData.telephone,
      });

      return { adminId: newAdmin.id };
    });

    console.log(
      `✅ Administrador ${validatedData.name} criado com sucesso por ${permissionCheck.user?.email}`,
    );

    return {
      success: true,
      message: "Administrador criado com sucesso!",
      adminId: result.adminId,
    };
  } catch (error) {
    console.error("Erro ao criar administrador:", error);

    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        if (!errors[field]) errors[field] = [];
        errors[field].push(issue.message);
      });

      return {
        success: false,
        message: "Dados inválidos. Verifique os campos.",
        errors,
      };
    }

    return {
      success: false,
      message: "Erro ao criar administrador. Tente novamente.",
    };
  }
}
