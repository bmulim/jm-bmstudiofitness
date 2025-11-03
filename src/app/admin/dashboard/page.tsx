"use client";

import { DollarSign, Eye, EyeOff, Plus, User, Users } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

import {
  getAllStudentsFullDataAction,
  StudentFullData,
} from "@/actions/admin/get-students-full-data-action";
import { updateCoachObservationsAction } from "@/actions/coach/update-coach-observations-action";
import { AdminLayout } from "@/components/Admin/AdminLayout";
import {
  DashboardHeader,
  FrequencyChart,
  SearchBar,
  SearchResults,
  SelectedStudent,
  StatCard,
  StudentDetails,
} from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { formatCPF } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [students, setStudents] = useState<StudentFullData[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentFullData[]>(
    [],
  );
  const [selectedStudent, setSelectedStudent] =
    useState<StudentFullData | null>(null);
  const [activeTab, setActiveTab] = useState<
    "personal" | "financial" | "health"
  >("personal");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Função para carregar dados dos alunos
  const loadStudents = async () => {
    try {
      const data = await getAllStudentsFullDataAction();
      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      console.error("Erro ao carregar dados dos alunos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados dos alunos
  useEffect(() => {
    loadStudents();
  }, []);

  // Filtrar alunos baseado na pesquisa
  useEffect(() => {
    if (!searchTerm) {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.cpf.includes(searchTerm),
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  // Estatísticas
  const totalStudents = students.length;
  const studentsUpToDate = students.filter((s) => s.isPaymentUpToDate).length;
  const studentsOverdue = totalStudents - studentsUpToDate;

  // Dados para gráfico de frequência por turno (simulado)
  const shiftData = [
    {
      shift: "Manhã",
      count: Math.floor(totalStudents * 0.3),
      color: "bg-orange-500",
    },
    {
      shift: "Tarde",
      count: Math.floor(totalStudents * 0.4),
      color: "bg-blue-500",
    },
    {
      shift: "Noite",
      count: Math.floor(totalStudents * 0.3),
      color: "bg-purple-500",
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-lg text-[#C2A537]">Carregando dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen w-full p-2 lg:p-8 xl:p-1">
        <div className="mx-auto space-y-8">
          {/* Cabeçalho */}
          <DashboardHeader
            title="🏋️ Dashboard Administrativo"
            description="Visualize e gerencie informações completas dos alunos"
          />

          {/* Estatísticas gerais */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
            <StatCard
              title="Total de Alunos"
              value={totalStudents}
              icon={Users}
              color="blue"
            />
            <StatCard
              title="Pagamentos em Dia"
              value={studentsUpToDate}
              icon={DollarSign}
              color="green"
            />
            <StatCard
              title="Pagamentos em Atraso"
              value={studentsOverdue}
              icon={DollarSign}
              color="red"
            />
          </div>

          {/* Gráfico de Frequência por Turno - Linha completa */}
          <div className="w-full">
            <FrequencyChart
              title="Frequência por Turno"
              subtitle="Distribuição dos alunos ao longo do dia"
              data={shiftData}
              total={totalStudents}
            />
          </div>

          {/* Busca Global */}
          <div className="w-full">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="🔍 Nome, email ou CPF..."
              resultsCount={filteredStudents.length}
            >
              {/* Resultados da Busca */}
              {searchTerm && filteredStudents.length > 0 && (
                <SearchResults
                  students={filteredStudents.map((student) => ({
                    userId: student.userId,
                    name: student.name,
                    email: student.email,
                    isPaymentUpToDate: student.isPaymentUpToDate,
                  }))}
                  onSelect={(simplifiedStudent) => {
                    const fullStudent = filteredStudents.find(
                      (s) => s.userId === simplifiedStudent.userId,
                    );
                    if (fullStudent) {
                      setSelectedStudent(fullStudent);
                    }
                  }}
                  onClear={() => setSearchTerm("")}
                  selectedStudentId={selectedStudent?.userId}
                />
              )}

              {/* Aluno Selecionado */}
              {selectedStudent && (
                <SelectedStudent
                  student={{
                    userId: selectedStudent.userId,
                    name: selectedStudent.name,
                    email: selectedStudent.email,
                    isPaymentUpToDate: selectedStudent.isPaymentUpToDate,
                  }}
                  onClear={() => setSelectedStudent(null)}
                />
              )}
            </SearchBar>
          </div>

          {/* Seção principal com lista e detalhes */}
          <div className="grid gap-8 xl:gap-12">
            {/* Detalhes do aluno selecionado - Ocupa toda a largura */}
            <div className="w-full">
              {selectedStudent ? (
                <StudentDetails
                  student={{
                    name: selectedStudent.name,
                    createdAt: selectedStudent.createdAt,
                    isPaymentUpToDate: selectedStudent.isPaymentUpToDate,
                  }}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                >
                  {activeTab === "personal" && (
                    <PersonalDataTab student={selectedStudent} />
                  )}
                  {activeTab === "financial" && (
                    <FinancialDataTab student={selectedStudent} />
                  )}
                  {activeTab === "health" && (
                    <HealthDataTab student={selectedStudent} />
                  )}
                </StudentDetails>
              ) : (
                <Card className="border-slate-700 bg-slate-800/50">
                  <CardContent className="flex h-96 items-center justify-center">
                    <div className="text-center">
                      <User className="mx-auto h-16 w-16 text-slate-500" />
                      <p className="mt-4 text-slate-400">
                        Selecione um aluno para ver os detalhes
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function PersonalDataTab({ student }: { student: StudentFullData }) {
  return (
    <div className="space-y-8 lg:space-y-10">
      <div className="grid gap-6 md:grid-cols-2 lg:gap-8 xl:grid-cols-3">
        <div>
          <label className="text-sm font-medium text-[#C2A537] lg:text-base">
            Nome Completo
          </label>
          <p className="text-base text-white lg:text-lg">{student.name}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-[#C2A537] lg:text-base">
            Email
          </label>
          <p className="text-base text-white lg:text-lg">{student.email}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-[#C2A537] lg:text-base">
            CPF
          </label>
          <p className="text-base text-white lg:text-lg">
            {formatCPF(student.cpf)}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-[#C2A537] lg:text-base">
            Telefone
          </label>
          <p className="text-base text-white lg:text-lg">{student.telephone}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-[#C2A537] lg:text-base">
            Data de Nascimento
          </label>
          <p className="text-base text-white lg:text-lg">
            {new Date(student.bornDate).toLocaleDateString("pt-BR")} (
            {student.age} anos)
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-[#C2A537] lg:text-base">
            Tipo Sanguíneo
          </label>
          <p className="text-base text-white lg:text-lg">{student.bloodType}</p>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-[#C2A537] lg:text-base">
          Endereço
        </label>
        <p className="text-base text-white lg:text-lg">{student.address}</p>
      </div>

      <div>
        <label className="text-sm font-medium text-[#C2A537]">
          Endereço Completo
        </label>
        <p className="text-white">{student.address}</p>
      </div>
    </div>
  );
}

function FinancialDataTab({ student }: { student: StudentFullData }) {
  return (
    <div className="space-y-8 lg:space-y-10">
      <div className="grid gap-6 md:grid-cols-2 lg:gap-8 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <label className="text-sm font-medium text-[#C2A537] lg:text-base">
            Valor da Mensalidade
          </label>
          <p className="text-2xl font-bold text-white lg:text-3xl xl:text-4xl">
            {student.formattedMonthlyFee}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-[#C2A537] lg:text-base">
            Método de Pagamento
          </label>
          <p className="text-base text-white capitalize lg:text-lg">
            {student.paymentMethod.replace("_", " ")}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-[#C2A537] lg:text-base">
            Dia de Vencimento
          </label>
          <p className="text-base text-white lg:text-lg">
            Dia {student.dueDate} de cada mês
          </p>
        </div>
        <div className="md:col-span-2 xl:col-span-1">
          <label className="text-sm font-medium text-[#C2A537] lg:text-base">
            Status do Pagamento
          </label>
          <div
            className={`inline-flex rounded-full px-4 py-2 text-sm font-medium lg:px-6 lg:py-3 lg:text-base ${
              student.isPaymentUpToDate
                ? "bg-green-600 text-green-100"
                : "bg-red-600 text-red-100"
            }`}
          >
            {student.isPaymentUpToDate ? "✅ Em dia" : "❌ Em atraso"}
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-[#C2A537] lg:text-base">
          Último Pagamento
        </label>
        <p className="text-base text-white lg:text-lg">
          {student.lastPaymentDate
            ? new Date(student.lastPaymentDate).toLocaleDateString("pt-BR")
            : "Nenhum pagamento registrado"}
        </p>
      </div>
    </div>
  );
}

function HealthDataTab({ student }: { student: StudentFullData }) {
  const [showAddObservations, setShowAddObservations] = useState(false);
  const [showGeneralHistory, setShowGeneralHistory] = useState(false);
  const [showPrivateHistory, setShowPrivateHistory] = useState(false);

  const initialState = { success: false, error: "", message: "" };
  const [, action, isPending] = useActionState(
    updateCoachObservationsAction,
    initialState,
  );

  return (
    <div className="space-y-8 lg:space-y-12">
      {/* Dados físicos */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-[#C2A537] lg:mb-6 lg:text-xl xl:text-2xl">
          Dados Físicos
        </h3>
        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          <div>
            <label className="text-sm font-medium text-[#C2A537] lg:text-base">
              Altura
            </label>
            <p className="text-base text-white lg:text-lg">
              {student.heightCm} cm
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-[#C2A537] lg:text-base">
              Peso
            </label>
            <p className="text-base text-white lg:text-lg">
              {student.weightKg} kg
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-[#C2A537] lg:text-base">
              Tipo Sanguíneo
            </label>
            <p className="text-base text-white lg:text-lg">
              {student.bloodType}
            </p>
          </div>
        </div>
      </div>

      {/* Histórico de atividades */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-[#C2A537] lg:mb-6 lg:text-xl xl:text-2xl">
          Histórico de Atividades
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8 xl:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-[#C2A537] lg:text-base">
              Praticou esportes antes?
            </label>
            <p className="text-base text-white lg:text-lg">
              {student.hasPracticedSports ? "Sim" : "Não"}
            </p>
          </div>
          <div className="xl:col-span-2">
            <label className="text-sm font-medium text-[#C2A537] lg:text-base">
              Último exercício
            </label>
            <p className="text-base text-white lg:text-lg">
              {student.lastExercise}
            </p>
          </div>
          <div className="md:col-span-2 xl:col-span-3">
            <label className="text-sm font-medium text-[#C2A537] lg:text-base">
              Histórico esportivo
            </label>
            <p className="text-base text-white lg:text-lg">
              {student.sportsHistory}
            </p>
          </div>
        </div>
      </div>

      {/* Saúde e medicamentos */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-[#C2A537] lg:mb-6 lg:text-xl xl:text-2xl">
          Saúde e Medicamentos
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          <div>
            <label className="text-sm font-medium text-[#C2A537] lg:text-base">
              Histórico de doenças
            </label>
            <p className="text-base text-white lg:text-lg">
              {student.historyDiseases || "Nenhum"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-[#C2A537] lg:text-base">
              Medicamentos em uso
            </label>
            <p className="text-base text-white lg:text-lg">
              {student.medications || "Nenhum"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-[#C2A537] lg:text-base">
              Alergias
            </label>
            <p className="text-base text-white lg:text-lg">
              {student.allergies || "Nenhuma"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-[#C2A537] lg:text-base">
              Lesões
            </label>
            <p className="text-base text-white lg:text-lg">
              {student.injuries || "Nenhuma"}
            </p>
          </div>
        </div>
      </div>

      {/* Hábitos e rotina */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-[#C2A537] lg:mb-6 lg:text-xl xl:text-2xl">
          Hábitos e Rotina
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          <div>
            <label className="text-sm font-medium text-[#C2A537] lg:text-base">
              Rotina alimentar
            </label>
            <p className="text-base text-white lg:text-lg">
              {student.alimentalRoutine}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-[#C2A537] lg:text-base">
              Rotina diária
            </label>
            <p className="text-base text-white lg:text-lg">
              {student.diaryRoutine}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-[#C2A537] lg:text-base">
              Usa suplementos?
            </label>
            <p className="text-base text-white lg:text-lg">
              {student.useSupplements ? "Sim" : "Não"}
            </p>
          </div>
          {student.useSupplements && student.whatSupplements && (
            <div>
              <label className="text-sm font-medium text-[#C2A537] lg:text-base">
                Quais suplementos?
              </label>
              <p className="text-base text-white lg:text-lg">
                {student.whatSupplements}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Observações */}
      <div>
        <div className="mb-4 flex items-center justify-between lg:mb-6">
          <h3 className="text-lg font-semibold text-[#C2A537] lg:text-xl xl:text-2xl">
            Observações
          </h3>
          <Button
            onClick={() => setShowAddObservations(!showAddObservations)}
            variant="outline"
            className="border-[#C2A537] bg-black/95 text-[#C2A537] hover:bg-[#C2A537]/10 hover:text-[#D4B547]"
          >
            <Plus className="mr-2 h-4 w-4" />
            {showAddObservations ? "Cancelar" : "Adicionar Observação"}
          </Button>
        </div>

        {/* Formulário de Observações */}
        {showAddObservations && (
          <Card className="mb-6 border-[#C2A537]/30 bg-black/40">
            <CardHeader>
              <CardTitle className="text-[#C2A537]">
                Adicionar Observação de Treinamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form action={action} className="space-y-4">
                <input type="hidden" name="studentId" value={student.userId} />

                <div>
                  <Label
                    htmlFor="generalObservations"
                    className="text-slate-300"
                  >
                    Observações Gerais (visíveis para o aluno)
                  </Label>
                  <textarea
                    id="generalObservations"
                    name="generalObservations"
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-[#C2A537]/30 bg-slate-900/50 p-3 text-slate-200 placeholder:text-slate-500 focus:border-[#C2A537] focus:ring-[#C2A537]"
                    placeholder="Digite observações sobre o treino, progresso, etc."
                    defaultValue={student.coachaObservations || ""}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="privateObservations"
                    className="text-slate-300"
                  >
                    Observações Particulares (apenas para treinadores/admin)
                  </Label>
                  <textarea
                    id="privateObservations"
                    name="privateObservations"
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-[#C2A537]/30 bg-slate-900/50 p-3 text-slate-200 placeholder:text-slate-500 focus:border-[#C2A537] focus:ring-[#C2A537]"
                    placeholder="Digite observações privadas, anotações pessoais..."
                    defaultValue={student.coachObservationsParticular || ""}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="border-[#C2A537] bg-[#C2A537] text-black hover:bg-[#D4B547]"
                  >
                    {isPending ? "Salvando..." : "Salvar Observações"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddObservations(false)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6 lg:space-y-8">
          {student.otherNotes && (
            <div>
              <label className="text-sm font-medium text-[#C2A537] lg:text-base">
                Observações do aluno
              </label>
              <p className="text-base text-white lg:text-lg">
                {student.otherNotes}
              </p>
            </div>
          )}
          {student.coachaObservations && (
            <div>
              <label className="text-sm font-medium text-[#C2A537] lg:text-base">
                Observações do treinador
              </label>
              <p className="text-base text-white lg:text-lg">
                {student.coachaObservations}
              </p>
              <Button
                onClick={() => setShowGeneralHistory(!showGeneralHistory)}
                variant="ghost"
                className="mt-2 text-slate-400 hover:text-[#C2A537]"
              >
                <Eye className="mr-2 h-4 w-4" />
                {showGeneralHistory ? "Ocultar" : "Ver"} histórico
              </Button>
            </div>
          )}
          {student.coachObservationsParticular && (
            <div>
              <label className="text-sm font-medium text-[#C2A537] lg:text-base">
                Observações particulares
              </label>
              <p className="text-base text-white lg:text-lg">
                {student.coachObservationsParticular}
              </p>
              <Button
                onClick={() => setShowPrivateHistory(!showPrivateHistory)}
                variant="ghost"
                className="mt-2 text-slate-400 hover:text-[#C2A537]"
              >
                <EyeOff className="mr-2 h-4 w-4" />
                {showPrivateHistory ? "Ocultar" : "Ver"} histórico
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 text-xs text-slate-400 lg:mt-8 lg:text-sm">
        Dados de saúde atualizados em:{" "}
        {new Date(student.healthUpdatedAt).toLocaleDateString("pt-BR")}
      </div>
    </div>
  );
}
