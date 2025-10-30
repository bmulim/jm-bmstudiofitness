"use client";

import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { useActionState, useState } from "react";

import { loginAction } from "@/actions/auth/login-action";
import QuickCheckInCard from "@/components/QuickCheckIn";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const initialState = { email: "", error: "" };
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <div className="min-h-screen text-white">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="flex w-full max-w-4xl flex-col gap-8 lg:flex-row">
          {/* Card de Login */}
          <div className="flex flex-1 justify-center">
            <Card className="w-[350px] max-w-md border-[#C2A537] bg-black/95 backdrop-blur-sm md:max-w-lg lg:max-w-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-[#C2A537] md:text-xl">
                  <LogIn className="h-5 w-5" />
                  Fazer Login
                </CardTitle>
                <CardDescription className="text-xs text-slate-300 md:text-sm">
                  Digite seu email e senha para acessar sua conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                {state.error && (
                  <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-800">
                    {state.error}
                  </div>
                )}

                <form action={formAction} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-[#C2A537]">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      disabled={isPending}
                      className="bg-slate-900/50 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-[#C2A537]">
                      Senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="sua senha"
                        required
                        disabled={isPending}
                        className="bg-slate-900/50 pr-10 text-white placeholder:text-slate-500"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isPending}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-[#C2A537] text-black hover:bg-[#D4B547]"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Entrar
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-xs text-slate-400">
                      Acesso para admins, professores e alunos cadastrados
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Divisor */}
          <div className="hidden items-center lg:flex">
            <div className="h-64 w-px bg-slate-600"></div>
          </div>
          <div className="flex items-center justify-center lg:hidden">
            <div className="h-px w-32 bg-slate-600"></div>
            <span className="mx-4 text-slate-400">ou</span>
            <div className="h-px w-32 bg-slate-600"></div>
          </div>

          {/* Card de Check-in Rápido */}
          <div className="flex flex-1 justify-center">
            <QuickCheckInCard />
          </div>
        </div>
      </div>
    </div>
  );
}
