"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

import { confirmUserAction } from "@/actions/user/confirm-user-action";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { InputText } from "@/components/InputText";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ConfirmUserState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  userData?: {
    name: string;
    email: string;
    cpf: string;
  };
}

const initialState: ConfirmUserState = {
  success: false,
  message: "",
};

export default function ConfirmUserPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [state, formAction, isPending] = useActionState(
    confirmUserAction,
    initialState,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se o token existe
    if (!token) {
      router.push("/user/login");
      return;
    }
    setLoading(false);
  }, [token, router]);

  useEffect(() => {
    // Redirecionar após sucesso
    if (state.success) {
      setTimeout(() => {
        router.push("/user/login");
      }, 3000);
    }
  }, [state.success, router]);

  if (loading) {
    return (
      <Container>
        <div className="flex min-h-screen items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="flex items-center justify-center p-8">
              <p className="text-center text-lg">Carregando...</p>
            </CardContent>
          </Card>
        </div>
      </Container>
    );
  }

  if (!token) {
    return null; // Será redirecionado
  }

  return (
    <Container>
      <div className="flex min-h-screen items-center justify-center py-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-[#C2A537]">
              🏋️ BM Studio Fitness
            </CardTitle>
            <CardDescription className="text-center">
              Confirme seus dados e crie sua senha
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state.message && (
              <div
                className={`mb-4 rounded-md p-3 text-sm ${
                  state.success
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {state.message}
              </div>
            )}

            {state.userData && (
              <div className="mb-6 rounded-md bg-slate-100 p-4">
                <h3 className="mb-2 font-semibold">Seus dados cadastrados:</h3>
                <p>
                  <strong>Nome:</strong> {state.userData.name}
                </p>
                <p>
                  <strong>E-mail:</strong> {state.userData.email}
                </p>
                <p>
                  <strong>CPF:</strong> {state.userData.cpf}
                </p>
              </div>
            )}

            {!state.success && (
              <form action={formAction} className="space-y-4">
                <input type="hidden" name="token" value={token} />

                <InputText
                  type="email"
                  name="email"
                  labelText="Confirme seu e-mail"
                  placeholder="Digite o e-mail cadastrado"
                  disabled={isPending}
                  required
                />
                {state.errors?.email && (
                  <p className="text-sm text-red-600">
                    {state.errors.email[0]}
                  </p>
                )}

                <InputText
                  type="text"
                  name="cpf"
                  labelText="Confirme seu CPF"
                  placeholder="Digite o CPF cadastrado (apenas números)"
                  disabled={isPending}
                  required
                />
                {state.errors?.cpf && (
                  <p className="text-sm text-red-600">{state.errors.cpf[0]}</p>
                )}

                <InputText
                  type="password"
                  name="password"
                  labelText="Crie sua senha"
                  placeholder="Digite uma senha segura"
                  disabled={isPending}
                  required
                />
                {state.errors?.password && (
                  <p className="text-sm text-red-600">
                    {state.errors.password[0]}
                  </p>
                )}

                <InputText
                  type="password"
                  name="confirmPassword"
                  labelText="Confirme sua senha"
                  placeholder="Digite a senha novamente"
                  disabled={isPending}
                  required
                />
                {state.errors?.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {state.errors.confirmPassword[0]}
                  </p>
                )}

                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? "Confirmando..." : "Confirmar e Criar Conta"}
                </Button>
              </form>
            )}

            {state.success && (
              <div className="text-center">
                <p className="mb-4 text-green-600">
                  ✅ Conta confirmada com sucesso!
                </p>
                <p className="text-sm text-slate-600">
                  Você será redirecionado para o login em alguns segundos...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
