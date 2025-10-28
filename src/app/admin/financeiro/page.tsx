"use client";

import { useEffect, useState } from "react";

import {
  getStudentsPaymentsAction,
  StudentPaymentData,
} from "@/actions/admin/get-students-payments-action";
import { updatePaymentAction } from "@/actions/admin/update-payment-action";
import { Container } from "@/components/Container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminPaymentsPage() {
  const [students, setStudents] = useState<StudentPaymentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // Carregar dados dos alunos
  useEffect(() => {
    async function loadStudents() {
      try {
        const data = await getStudentsPaymentsAction();
        setStudents(data);
      } catch (error) {
        console.error("Erro ao carregar dados dos alunos:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, []);

  // Atualizar status de pagamento
  const handlePaymentUpdate = async (userId: string, paid: boolean) => {
    setUpdating(userId);
    try {
      const result = await updatePaymentAction(userId, paid);
      if (result.success) {
        // Recarregar dados
        const updatedData = await getStudentsPaymentsAction();
        setStudents(updatedData);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Erro ao atualizar pagamento:", error);
      alert("Erro ao atualizar pagamento");
    } finally {
      setUpdating(null);
    }
  };

  // Filtrar alunos por status
  const studentsUpToDate = students.filter((s) => s.isUpToDate);
  const studentsOverdue = students.filter((s) => !s.isUpToDate);

  if (loading) {
    return (
      <Container>
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-lg text-[#C2A537]">
            Carregando dados dos alunos...
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="min-h-screen bg-linear-to-br from-black/95 to-gray-900 py-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Cabeçalho */}
          <Card className="border-[#C2A537] bg-black/95">
            <CardHeader>
              <CardTitle className="text-2xl text-[#C2A537]">
                Gerenciamento de Pagamentos
              </CardTitle>
              <CardDescription className="text-slate-300">
                Controle os pagamentos e mensalidades dos alunos
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Estatísticas */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-green-600 bg-green-900/30">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-400">
                    {studentsUpToDate.length}
                  </p>
                  <p className="text-sm text-green-300">Pagamentos em Dia</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-600 bg-red-900/30">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-400">
                    {studentsOverdue.length}
                  </p>
                  <p className="text-sm text-red-300">Pagamentos em Atraso</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#C2A537] bg-[#C2A537]/10">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#C2A537]">
                    {students.length}
                  </p>
                  <p className="text-sm text-[#C2A537]">Total de Alunos</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alunos em atraso */}
          {studentsOverdue.length > 0 && (
            <Card className="border-red-600 bg-red-900/20">
              <CardHeader>
                <CardTitle className="text-xl text-red-400">
                  ⚠️ Alunos com Pagamento em Atraso
                </CardTitle>
                <CardDescription className="text-red-300">
                  Estes alunos não podem fazer check-in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentsOverdue.map((student) => (
                    <StudentPaymentCard
                      key={student.userId}
                      student={student}
                      onUpdate={handlePaymentUpdate}
                      isUpdating={updating === student.userId}
                      variant="overdue"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Alunos em dia */}
          <Card className="border-green-600 bg-green-900/20">
            <CardHeader>
              <CardTitle className="text-xl text-green-400">
                ✅ Alunos com Pagamento em Dia
              </CardTitle>
              <CardDescription className="text-green-300">
                Estes alunos podem fazer check-in normalmente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentsUpToDate.map((student) => (
                  <StudentPaymentCard
                    key={student.userId}
                    student={student}
                    onUpdate={handlePaymentUpdate}
                    isUpdating={updating === student.userId}
                    variant="uptodate"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}

interface StudentPaymentCardProps {
  student: StudentPaymentData;
  onUpdate: (userId: string, paid: boolean) => void;
  isUpdating: boolean;
  variant: "overdue" | "uptodate";
}

function StudentPaymentCard({
  student,
  onUpdate,
  isUpdating,
  variant,
}: StudentPaymentCardProps) {
  const borderColor =
    variant === "overdue" ? "border-red-500" : "border-green-500";
  const bgColor = variant === "overdue" ? "bg-red-900/10" : "bg-green-900/10";

  return (
    <div className={`rounded-lg border p-4 ${borderColor} ${bgColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="font-semibold text-white">{student.name}</h3>
              <p className="text-sm text-slate-400">
                {student.email} • CPF: {student.cpf}
              </p>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div>
              <p className="text-slate-400">Mensalidade</p>
              <p className="font-medium text-white">{student.formattedValue}</p>
            </div>
            <div>
              <p className="text-slate-400">Vencimento</p>
              <p className="font-medium text-white">Dia {student.dueDate}</p>
            </div>
            <div>
              <p className="text-slate-400">Método</p>
              <p className="font-medium text-white capitalize">
                {student.paymentMethod.replace("_", " ")}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Último Pagamento</p>
              <p className="font-medium text-white">
                {student.lastPaymentDate
                  ? new Date(student.lastPaymentDate).toLocaleDateString(
                      "pt-BR",
                    )
                  : "Nunca"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {!student.paid && (
            <button
              onClick={() => onUpdate(student.userId, true)}
              disabled={isUpdating}
              className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {isUpdating ? "..." : "Confirmar Pagamento"}
            </button>
          )}
          {student.paid && (
            <button
              onClick={() => onUpdate(student.userId, false)}
              disabled={isUpdating}
              className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isUpdating ? "..." : "Marcar como Pendente"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
