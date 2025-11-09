"use client";

import {
  Activity,
  Calendar,
  Clock,
  Edit3,
  Eye,
  EyeOff,
  Heart,
  History,
  Search,
  TrendingUp,
  User,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { useState } from "react";

import { StudentFullData } from "@/actions/admin/get-students-full-data-action";
import CheckInCalendar from "@/components/CheckInCalendar";
import { SensitiveData } from "@/components/SensitiveData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { formatCPF } from "@/lib/utils";

interface StudentsTabProps {
  students: StudentFullData[];
}

export function StudentsTab({ students }: StudentsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] =
    useState<StudentFullData | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<
    "personal" | "checkins" | "schedule" | "health"
  >("personal");
  const [showPrivateData, setShowPrivateData] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

  const filteredStudents = students.filter((student) => {
    if (!searchTerm.trim()) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      student.name.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower) ||
      student.cpf.replace(/\D/g, "").includes(searchTerm.replace(/\D/g, ""))
    );
  });

  // Estatísticas focadas em operação, não em finanças
  const activeStudents = students.filter((s) => s.userRole === "aluno");
  const recentCheckIns = students.filter((s) => {
    // Lógica para verificar check-ins recentes (últimos 7 dias)
    return true; // Placeholder
  });

  const stats = {
    total: students.length,
    active: activeStudents.length,
    recentCheckIns: recentCheckIns.length,
    thisMonth: students.filter((s) => {
      const created = new Date(s.createdAt);
      const now = new Date();
      return (
        created.getMonth() === now.getMonth() &&
        created.getFullYear() === now.getFullYear()
      );
    }).length,
  };

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas - Foco Operacional */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-[#C2A537]/30 bg-gradient-to-br from-blue-600/10 to-blue-900/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total de Alunos</p>
                <h3 className="text-3xl font-bold text-white">{stats.total}</h3>
              </div>
              <div className="rounded-full bg-blue-600/20 p-3">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#C2A537]/30 bg-gradient-to-br from-green-600/10 to-green-900/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Alunos Ativos</p>
                <h3 className="text-3xl font-bold text-green-400">
                  {stats.active}
                </h3>
              </div>
              <div className="rounded-full bg-green-600/20 p-3">
                <UserCheck className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#C2A537]/30 bg-gradient-to-br from-purple-600/10 to-purple-900/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Check-ins Recentes</p>
                <h3 className="text-3xl font-bold text-purple-400">
                  {stats.recentCheckIns}
                </h3>
              </div>
              <div className="rounded-full bg-purple-600/20 p-3">
                <Activity className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#C2A537]/30 bg-gradient-to-br from-[#C2A537]/10 to-[#D4B547]/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Novos este Mês</p>
                <h3 className="text-3xl font-bold text-[#C2A537]">
                  {stats.thisMonth}
                </h3>
              </div>
              <div className="rounded-full bg-[#C2A537]/20 p-3">
                <TrendingUp className="h-6 w-6 text-[#C2A537]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Layout em 2 Colunas */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Coluna Esquerda - Lista de Alunos (menor) */}
        <div className="space-y-4 lg:col-span-2">
          <Card className="border-[#C2A537]/30 bg-black/40 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nome, email ou CPF..."
                  className="w-full rounded-lg border border-[#C2A537]/30 bg-black/60 py-3 pr-10 pl-10 text-white placeholder-slate-400 transition-all duration-200 focus:border-[#C2A537] focus:ring-2 focus:ring-[#C2A537]/20 focus:outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-[#C2A537]"
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className="mt-2 text-sm text-[#C2A537]">
                {filteredStudents.length} aluno(s) encontrado(s)
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#C2A537]/30 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-[#C2A537]">Lista de Alunos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[600px] space-y-2 overflow-y-auto pr-2">
                {filteredStudents.map((student) => (
                  <div
                    key={student.userId}
                    onClick={() => setSelectedStudent(student)}
                    className={`group cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
                      selectedStudent?.userId === student.userId
                        ? "border-[#C2A537] bg-[#C2A537]/10"
                        : "border-slate-700/50 bg-slate-800/30 hover:border-[#C2A537]/50 hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#C2A537] to-[#D4B547] text-lg font-bold text-black">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white group-hover:text-[#C2A537]">
                            {student.name}
                          </h4>
                          <p className="text-sm text-slate-400">
                            {student.email}
                          </p>
                          <p className="text-xs text-slate-500">
                            CPF: {formatCPF(student.cpf)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="rounded-full bg-green-600/20 px-3 py-1 text-xs font-medium text-green-400">
                          ✓ Ativo
                        </span>
                        <span className="text-xs text-slate-500">
                          ID: {student.userId.slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredStudents.length === 0 && (
                  <div className="py-12 text-center">
                    <User className="mx-auto mb-4 h-12 w-12 text-slate-600" />
                    <p className="text-slate-400">Nenhum aluno encontrado</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Direita - Cards de Detalhes (maior) */}
        <div className="space-y-4 lg:col-span-3">
          {selectedStudent ? (
            <>
              <Card className="border-[#C2A537]/40 bg-gradient-to-br from-black/90 to-slate-900/90 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#C2A537] to-[#D4B547] text-2xl font-bold text-black">
                        {selectedStudent.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#C2A537]">
                          {selectedStudent.name}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {selectedStudent.age} anos
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Status do Aluno */}
                  <div className="flex gap-2">
                    <span className="flex-1 rounded-lg bg-green-600/20 px-3 py-2 text-center text-sm font-medium text-green-400">
                      ✅ Aluno Ativo
                    </span>
                  </div>

                  {/* Informações de Gerenciamento */}
                  <div className="space-y-3 rounded-lg bg-slate-800/50 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Turno</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[#C2A537] hover:text-[#D4B547]"
                      >
                        <Edit3 className="mr-1 h-3 w-3" />
                        Manhã
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Horário</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[#C2A537] hover:text-[#D4B547]"
                      >
                        <Clock className="mr-1 h-3 w-3" />
                        08:00 - 10:00
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Cadastro</span>
                      <span className="text-white">
                        {new Date(selectedStudent.createdAt).toLocaleDateString(
                          "pt-BR",
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Ações de Gerenciamento */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => setShowPrivateData(!showPrivateData)}
                      variant="outline"
                      size="sm"
                      className="border-[#C2A537]/50 text-[#C2A537] hover:bg-[#C2A537]/10"
                    >
                      {showPrivateData ? (
                        <EyeOff className="mr-2 h-4 w-4" />
                      ) : (
                        <Eye className="mr-2 h-4 w-4" />
                      )}
                      {showPrivateData ? "Ocultar" : "Ver Dados"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      <UserX className="mr-2 h-4 w-4" />
                      Desativar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#C2A537]/30 bg-black/40 backdrop-blur-sm">
                <CardContent className="p-3">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "personal" as const, label: "Dados", icon: User },
                      { id: "health" as const, label: "Saúde", icon: Heart },
                      {
                        id: "schedule" as const,
                        label: "Horários",
                        icon: Calendar,
                      },
                      {
                        id: "checkins" as const,
                        label: "Check-ins",
                        icon: Activity,
                      },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          // Desktop/Tablet: Abre modal para check-ins
                          if (
                            tab.id === "checkins" &&
                            window.innerWidth >= 768
                          ) {
                            setIsCheckInModalOpen(true);
                          } else {
                            // Mobile ou outras abas: Mantém comportamento normal
                            setActiveDetailTab(tab.id);
                          }
                        }}
                        className={`flex flex-col items-center gap-1 rounded-lg p-3 text-xs font-medium transition-all ${
                          activeDetailTab === tab.id
                            ? "bg-[#C2A537] text-black"
                            : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white"
                        }`}
                      >
                        <tab.icon className="h-5 w-5" />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Card de conteúdo - Mobile com check-ins */}
              <Card className="border-[#C2A537]/30 bg-black/40 backdrop-blur-sm md:hidden">
                <CardContent className="max-h-[400px] overflow-y-auto p-4">
                  {activeDetailTab === "personal" && (
                    <PersonalDataSection
                      student={selectedStudent}
                      showPrivateData={showPrivateData}
                    />
                  )}
                  {activeDetailTab === "health" && (
                    <HealthSection
                      student={selectedStudent}
                      showPrivateData={showPrivateData}
                    />
                  )}
                  {activeDetailTab === "schedule" && <ScheduleSection />}
                  {activeDetailTab === "checkins" && <CheckInsSection />}
                </CardContent>
              </Card>

              {/* Card de conteúdo - Desktop/Tablet sem check-ins */}
              <Card className="hidden border-[#C2A537]/30 bg-black/40 backdrop-blur-sm md:block">
                <CardContent className="max-h-[400px] overflow-y-auto p-4">
                  {activeDetailTab === "personal" && (
                    <PersonalDataSection
                      student={selectedStudent}
                      showPrivateData={showPrivateData}
                    />
                  )}
                  {activeDetailTab === "health" && (
                    <HealthSection
                      student={selectedStudent}
                      showPrivateData={showPrivateData}
                    />
                  )}
                  {activeDetailTab === "schedule" && <ScheduleSection />}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-slate-700/50 bg-slate-800/30">
              <CardContent className="flex h-[500px] items-center justify-center p-6">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#C2A537]/10">
                    <User className="h-10 w-10 text-[#C2A537]/50" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-slate-400">
                    Selecione um Aluno
                  </h3>
                  <p className="text-sm text-slate-500">
                    Clique em um aluno da lista ao lado para ver os detalhes
                    completos
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal de Check-ins (Desktop/Tablet apenas) */}
      <Dialog open={isCheckInModalOpen} onOpenChange={setIsCheckInModalOpen}>
        <DialogContent className="max-h-[95vh] max-w-[80vw] overflow-hidden p-0">
          <DialogHeader className="border-b border-[#C2A537]/20 p-6 pb-4">
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-6 w-6" />
              Histórico de Check-ins
              {selectedStudent && (
                <span className="text-base font-normal text-slate-400">
                  - {selectedStudent.name}
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              Visualize o calendário e histórico de frequência do aluno
            </DialogDescription>
          </DialogHeader>
          <div className="grid max-h-[calc(95vh-120px)] gap-6 overflow-y-auto p-6 lg:grid-cols-2">
            <CheckInsModalContent />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Componente separado para conteúdo do modal de check-ins
function CheckInsModalContent() {
  const mockCheckIns = [
    { date: new Date(2025, 10, 1), time: "08:30", status: "present" as const },
    { date: new Date(2025, 10, 3), time: "09:15", status: "present" as const },
    { date: new Date(2025, 10, 5), time: "08:45", status: "late" as const },
    { date: new Date(2025, 10, 8), time: "08:20", status: "present" as const },
    { date: new Date(2025, 10, 9), time: "08:35", status: "present" as const },
    { date: new Date(2025, 10, 12), time: "09:00", status: "present" as const },
    { date: new Date(2025, 10, 15), time: "08:25", status: "present" as const },
    { date: new Date(2025, 10, 17), time: "09:30", status: "late" as const },
    { date: new Date(2025, 10, 19), time: "08:15", status: "present" as const },
    { date: new Date(2025, 10, 22), time: "08:50", status: "present" as const },
  ];

  return (
    <>
      {/* Coluna Esquerda - Calendário */}
      <div className="flex h-full flex-col">
        <CheckInCalendar
          checkIns={mockCheckIns}
          onDateClick={(date) => console.log("Data clicada:", date)}
          showLegend={true}
        />
      </div>

      {/* Coluna Direita - Lista de Check-ins */}
      <div className="flex h-full flex-col space-y-4">
        <div className="flex flex-1 flex-col rounded-lg border border-[#C2A537]/40 bg-black/40 backdrop-blur-sm">
          <div className="border-b border-[#C2A537]/20 p-4">
            <h3 className="text-lg font-semibold text-[#C2A537]">
              Últimos Check-ins
            </h3>
            <p className="text-sm text-slate-400">
              {mockCheckIns.length} registros encontrados
            </p>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-4">
            {mockCheckIns.map((checkIn, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/30 p-3 transition-all hover:border-[#C2A537]/30 hover:bg-slate-700/40"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      checkIn.status === "present"
                        ? "bg-green-500 shadow-lg shadow-green-500/50"
                        : checkIn.status === "late"
                          ? "bg-yellow-500 shadow-lg shadow-yellow-500/50"
                          : "bg-red-500 shadow-lg shadow-red-500/50"
                    } animate-pulse`}
                  />
                  <div>
                    <span className="block text-sm font-medium text-white">
                      {checkIn.date.toLocaleDateString("pt-BR", {
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                      })}
                    </span>
                    <span className="text-xs text-slate-400">
                      {checkIn.date.getFullYear()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-300">
                    {checkIn.time}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      checkIn.status === "present"
                        ? "bg-green-500/20 text-green-400"
                        : checkIn.status === "late"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {checkIn.status === "present"
                      ? "Presente"
                      : checkIn.status === "late"
                        ? "Atrasado"
                        : "Falta"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-green-500/30 bg-green-900/20 p-3 text-center">
            <div className="text-2xl font-bold text-green-400">
              {mockCheckIns.filter((c) => c.status === "present").length}
            </div>
            <div className="text-xs text-slate-400">Presenças</div>
          </div>
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-900/20 p-3 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {mockCheckIns.filter((c) => c.status === "late").length}
            </div>
            <div className="text-xs text-slate-400">Atrasos</div>
          </div>
          <div className="rounded-lg border border-[#C2A537]/30 bg-[#C2A537]/10 p-3 text-center">
            <div className="text-2xl font-bold text-[#C2A537]">
              {mockCheckIns.length}
            </div>
            <div className="text-xs text-slate-400">Total</div>
          </div>
        </div>
      </div>
    </>
  );
}

function PersonalDataSection({
  student,
  showPrivateData,
}: {
  student: StudentFullData;
  showPrivateData: boolean;
}) {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-[#C2A537]">
        Informações Pessoais
      </h4>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label className="text-slate-400">Nome</Label>
          <p className="text-white">{student.name}</p>
        </div>
        <div>
          <Label className="text-slate-400">Email</Label>
          <SensitiveData
            data={student.email}
            type="email"
            studentId={student.userId}
            className="text-white"
          />
        </div>
        <div>
          <Label className="text-slate-400">CPF</Label>
          <SensitiveData
            data={formatCPF(student.cpf)}
            type="cpf"
            studentId={student.userId}
            className="text-white"
          />
        </div>
        <div>
          <Label className="text-slate-400">Telefone</Label>
          <SensitiveData
            data={student.telephone}
            type="phone"
            studentId={student.userId}
            className="text-white"
          />
        </div>
        <div>
          <Label className="text-slate-400">Nascimento</Label>
          <p className="text-white">
            {new Date(student.bornDate).toLocaleDateString("pt-BR")}
          </p>
        </div>
        <div>
          <Label className="text-slate-400">Idade</Label>
          <p className="text-white">{student.age} anos</p>
        </div>
        {showPrivateData && (
          <div className="sm:col-span-2">
            <Label className="text-slate-400">Endereço</Label>
            <p className="text-white">{student.address}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckInsSection() {
  // Dados de exemplo - substituir por dados reais do backend
  const mockCheckIns = [
    { date: new Date(2025, 10, 1), time: "08:30", status: "present" as const },
    { date: new Date(2025, 10, 3), time: "09:15", status: "present" as const },
    { date: new Date(2025, 10, 5), time: "08:45", status: "late" as const },
    { date: new Date(2025, 10, 8), time: "08:20", status: "present" as const },
    { date: new Date(2025, 10, 9), time: "08:35", status: "present" as const },
  ];

  return (
    <div className="space-y-4">
      {/* Lista de Check-ins Recentes */}
      <Card className="border-[#C2A537]/40 bg-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-sm text-[#C2A537]">
            Histórico de Check-ins
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockCheckIns.slice(0, 5).map((checkIn, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-slate-800/30 p-3 transition-all hover:bg-slate-700/40"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      checkIn.status === "present"
                        ? "bg-green-500 shadow-lg shadow-green-500/50"
                        : checkIn.status === "late"
                          ? "bg-yellow-500 shadow-lg shadow-yellow-500/50"
                          : "bg-red-500 shadow-lg shadow-red-500/50"
                    } animate-pulse`}
                  />
                  <span className="text-sm text-white">
                    {checkIn.date.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">{checkIn.time}</span>
                  <span
                    className={`text-xs font-medium ${
                      checkIn.status === "present"
                        ? "text-green-400"
                        : checkIn.status === "late"
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {checkIn.status === "present"
                      ? "Presente"
                      : checkIn.status === "late"
                        ? "Atrasado"
                        : "Falta"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ScheduleSection() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-[#C2A537]">
          Turno e Horários
        </h4>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="ghost"
          size="sm"
          className="text-[#C2A537] hover:text-[#D4B547]"
        >
          <Edit3 className="mr-2 h-4 w-4" />
          {isEditing ? "Cancelar" : "Editar"}
        </Button>
      </div>

      <div className="space-y-4">
        {/* Turno */}
        <div className="rounded-lg bg-slate-800/30 p-4">
          <Label className="text-slate-400">Turno Preferencial</Label>
          {isEditing ? (
            <select className="mt-2 w-full rounded-lg border border-[#C2A537]/30 bg-black/60 p-2 text-white focus:border-[#C2A537] focus:outline-none">
              <option value="manha">Manhã (06:00 - 12:00)</option>
              <option value="tarde">Tarde (12:00 - 18:00)</option>
              <option value="noite">Noite (18:00 - 22:00)</option>
            </select>
          ) : (
            <p className="mt-2 text-white">Manhã (06:00 - 12:00)</p>
          )}
        </div>

        {/* Horário Específico */}
        <div className="rounded-lg bg-slate-800/30 p-4">
          <Label className="text-slate-400">Horário de Treino</Label>
          {isEditing ? (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input
                type="time"
                className="rounded-lg border border-[#C2A537]/30 bg-black/60 p-2 text-white focus:border-[#C2A537] focus:outline-none"
                defaultValue="08:00"
              />
              <input
                type="time"
                className="rounded-lg border border-[#C2A537]/30 bg-black/60 p-2 text-white focus:border-[#C2A537] focus:outline-none"
                defaultValue="10:00"
              />
            </div>
          ) : (
            <p className="mt-2 text-white">08:00 - 10:00</p>
          )}
        </div>

        {/* Dias da Semana */}
        <div className="rounded-lg bg-slate-800/30 p-4">
          <Label className="text-slate-400">Dias da Semana</Label>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day) => (
              <button
                key={day}
                className="rounded-lg bg-[#C2A537]/20 px-3 py-1 text-sm font-medium text-[#C2A537] transition-colors hover:bg-[#C2A537]/30"
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {isEditing && (
          <Button className="w-full bg-[#C2A537] text-black hover:bg-[#D4B547]">
            <Clock className="mr-2 h-4 w-4" />
            Salvar Alterações
          </Button>
        )}
      </div>
    </div>
  );
}

function HealthSection({
  student,
  showPrivateData,
}: {
  student: StudentFullData;
  showPrivateData: boolean;
}) {
  if (!showPrivateData) {
    return (
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-[#C2A537]">Dados de Saúde</h4>
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-center">
          <Eye className="mx-auto mb-2 h-8 w-8 text-amber-500/50" />
          <p className="text-sm text-amber-400">
            Clique em &quot;Ver Tudo&quot; para visualizar dados sensíveis
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-[#C2A537]">Dados de Saúde</h4>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label className="text-slate-400">Peso</Label>
          <p className="text-white">{student.weightKg} kg</p>
        </div>
        <div>
          <Label className="text-slate-400">Altura</Label>
          <p className="text-white">{student.heightCm} cm</p>
        </div>
      </div>
      {student.coachaObservations && (
        <div>
          <Label className="text-slate-400">Observações do Coach</Label>
          <p className="text-white">{student.coachaObservations}</p>
        </div>
      )}
      {student.historyDiseases && (
        <div>
          <Label className="text-slate-400">Histórico de Doenças</Label>
          <p className="text-white">{student.historyDiseases}</p>
        </div>
      )}
      {student.allergies && (
        <div>
          <Label className="text-slate-400">Alergias</Label>
          <p className="text-white">{student.allergies}</p>
        </div>
      )}
    </div>
  );
}
