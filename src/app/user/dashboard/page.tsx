"use client";

import { Activity, Calendar, Heart, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { logoutAction } from "@/actions/auth/logout-action";
import { getStudentDataAction } from "@/actions/user/get-student-data-action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StudentData {
  user: {
    id: string;
    name: string;
  };
  personalData: {
    email: string;
    cpf: string;
    bornDate: string;
    address: string;
    telephone: string;
  };
  healthMetrics: {
    heightCm: number;
    weightKg: number;
    bloodType: string;
    updatedAt: string;
  };
  financial: {
    paid: boolean;
    monthlyFeeValueInCents: number;
    dueDate: number;
    lastPaymentDate: string | null;
  };
}

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const data = await getStudentDataAction();
        if (data.success && data.data) {
          setStudentData(data.data);
        } else {
          setError(data.message || "Erro ao carregar dados");
        }
      } catch {
        setError("Erro ao carregar dados do aluno");
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 text-white">
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-lg text-[#C2A537]">Carregando seus dados...</p>
        </div>
      </div>
    );
  }

  if (error || !studentData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 text-white">
        <div className="flex min-h-screen items-center justify-center">
          <Card className="w-full max-w-md border-red-600 bg-red-900/30">
            <CardContent className="p-6 text-center">
              <p className="text-red-400">{error || "Dados não encontrados"}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const age =
    new Date().getFullYear() -
    new Date(studentData.personalData.bornDate).getFullYear();
  const monthlyFee = (
    studentData.financial.monthlyFeeValueInCents / 100
  ).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto p-4 lg:p-8">
        {/* Cabeçalho */}
        <Card className="mb-8 border-[#C2A537] bg-black/95">
          <CardHeader>
            <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
              <div className="text-center lg:text-left">
                <CardTitle className="text-2xl text-[#C2A537] lg:text-3xl">
                  🏋️ Bem-vindo, {studentData.user.name}!
                </CardTitle>
                <CardDescription className="text-lg text-slate-300">
                  Sua área pessoal do BM Studio Fitness
                </CardDescription>
              </div>

              {/* Botão de Logout */}
              <form action={logoutAction}>
                <Button
                  type="submit"
                  variant="outline"
                  className="border-[#C2A537] bg-black/95 text-[#C2A537] hover:bg-[#C2A537]/10 hover:text-[#D4B547]"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </form>
            </div>
          </CardHeader>
        </Card>

        {/* Cards de Navegação */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-blue-600 bg-blue-900/30 transition-transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <User className="h-10 w-10 text-blue-400" />
                <div>
                  <h3 className="font-semibold text-blue-400">Meus Dados</h3>
                  <p className="text-sm text-blue-300">Informações pessoais</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Link href="/user/health">
            <Card className="cursor-pointer border-green-600 bg-green-900/30 transition-transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Heart className="h-10 w-10 text-green-400" />
                  <div>
                    <h3 className="font-semibold text-green-400">
                      Histórico de Saúde
                    </h3>
                    <p className="text-sm text-green-300">
                      Métricas e evolução
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/user/check-ins">
            <Card className="cursor-pointer border-orange-600 bg-orange-900/30 transition-transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Activity className="h-10 w-10 text-orange-400" />
                  <div>
                    <h3 className="font-semibold text-orange-400">Check-ins</h3>
                    <p className="text-sm text-orange-300">
                      Histórico de presenças
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="border-purple-600 bg-purple-900/30 transition-transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Calendar className="h-10 w-10 text-purple-400" />
                <div>
                  <h3 className="font-semibold text-purple-400">Pagamentos</h3>
                  <p className="text-sm text-purple-300">Status financeiro</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo Rápido */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Dados Pessoais */}
          <Card className="border-[#C2A537]/50 bg-black/40">
            <CardHeader>
              <CardTitle className="text-[#C2A537]">
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-slate-400">E-mail</p>
                <p className="text-white">{studentData.personalData.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Idade</p>
                <p className="text-white">{age} anos</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Telefone</p>
                <p className="text-white">
                  {studentData.personalData.telephone}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Dados de Saúde */}
          <Card className="border-[#C2A537]/50 bg-black/40">
            <CardHeader>
              <CardTitle className="text-[#C2A537]">Dados de Saúde</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-slate-400">Altura</p>
                <p className="text-white">
                  {studentData.healthMetrics.heightCm} cm
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Peso</p>
                <p className="text-white">
                  {studentData.healthMetrics.weightKg} kg
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Tipo Sanguíneo</p>
                <p className="text-white">
                  {studentData.healthMetrics.bloodType}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Status Financeiro */}
          <Card className="border-[#C2A537]/50 bg-black/40">
            <CardHeader>
              <CardTitle className="text-[#C2A537]">
                Status Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-slate-400">Mensalidade</p>
                <p className="text-white">{monthlyFee}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Vencimento</p>
                <p className="text-white">
                  Dia {studentData.financial.dueDate}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Status</p>
                <p
                  className={`font-semibold ${
                    studentData.financial.paid
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {studentData.financial.paid ? "✅ Em dia" : "❌ Pendente"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
