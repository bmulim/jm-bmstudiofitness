"use client";

import { ArrowLeft, Heart, Plus } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";

import { addStudentHealthEntryAction } from "@/actions/user/add-health-entry-action";
import { getStudentHealthHistoryAction } from "@/actions/user/get-health-history-action";
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

interface HealthEntry {
  id: string;
  heightCm: number | null;
  weightKg: string | null;
  notes: string | null;
  updatedAt: string;
  createdAt: string;
}

interface CurrentHealthData {
  heightCm: number;
  weightKg: number;
  bloodType: string;
  updatedAt: string;
}

interface AddHealthEntryState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

const initialState: AddHealthEntryState = {
  success: false,
  message: "",
};

export default function StudentHealthHistoryPage() {
  const [healthHistory, setHealthHistory] = useState<HealthEntry[]>([]);
  const [currentHealth, setCurrentHealth] = useState<CurrentHealthData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [state, formAction, isPending] = useActionState(
    addStudentHealthEntryAction,
    initialState,
  );

  useEffect(() => {
    const loadHealthData = async () => {
      try {
        const data = await getStudentHealthHistoryAction();
        if (data.success) {
          setHealthHistory(data.history || []);
          setCurrentHealth(data.currentHealth || null);
        } else {
          setError(data.message);
        }
      } catch {
        setError("Erro ao carregar histórico de saúde");
      } finally {
        setLoading(false);
      }
    };

    loadHealthData();
  }, []);

  useEffect(() => {
    if (state.success) {
      setShowAddForm(false);
      // Recarregar dados
      const loadHealthData = async () => {
        const data = await getStudentHealthHistoryAction();
        if (data.success) {
          setHealthHistory(data.history || []);
          setCurrentHealth(data.currentHealth || null);
        }
      };
      loadHealthData();
    }
  }, [state.success]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 text-white">
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-lg text-[#C2A537]">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 text-white">
        <div className="flex min-h-screen items-center justify-center">
          <Card className="w-full max-w-md border-red-600 bg-red-900/30">
            <CardContent className="p-6 text-center">
              <p className="text-red-400">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto p-4 lg:p-8">
        {/* Cabeçalho */}
        <Card className="mb-8 border-[#C2A537] bg-black/95">
          <CardHeader>
            <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
              <div className="text-center lg:text-left">
                <CardTitle className="flex items-center gap-2 text-2xl text-[#C2A537] lg:text-3xl">
                  <Heart className="h-8 w-8" />
                  Histórico de Saúde
                </CardTitle>
                <CardDescription className="text-lg text-slate-300">
                  Acompanhe sua evolução e mantenha seus dados atualizados
                </CardDescription>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="border-[#C2A537] bg-[#C2A537] text-black hover:bg-[#D4B547]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {showAddForm ? "Cancelar" : "Adicionar Entrada"}
                </Button>
                <Link href="/user/dashboard">
                  <Button
                    variant="outline"
                    className="border-[#C2A537] bg-black/95 text-[#C2A537] hover:bg-[#C2A537]/10 hover:text-[#D4B547]"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Dados Atuais de Saúde */}
        {currentHealth && (
          <Card className="mb-8 border-green-600 bg-green-900/30">
            <CardHeader>
              <CardTitle className="text-green-400">
                Seus Dados Atuais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-green-300">Altura</p>
                  <p className="text-xl font-semibold text-white">
                    {currentHealth.heightCm} cm
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-300">Peso</p>
                  <p className="text-xl font-semibold text-white">
                    {currentHealth.weightKg} kg
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-300">Tipo Sanguíneo</p>
                  <p className="text-xl font-semibold text-white">
                    {currentHealth.bloodType}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-xs text-green-300">
                Última atualização:{" "}
                {new Date(currentHealth.updatedAt).toLocaleDateString("pt-BR")}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Formulário de Adicionar Entrada */}
        {showAddForm && (
          <Card className="mb-8 border-[#C2A537]/30 bg-black/40">
            <CardHeader>
              <CardTitle className="text-[#C2A537]">
                Adicionar Nova Entrada
              </CardTitle>
              <CardDescription>
                Registre mudanças em sua altura, peso ou observações sobre sua
                saúde
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

              <form action={formAction} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="heightCm" className="text-slate-300">
                      Altura (cm)
                    </Label>
                    <Input
                      id="heightCm"
                      name="heightCm"
                      type="number"
                      min="100"
                      max="250"
                      placeholder="Ex: 175"
                      disabled={isPending}
                      className="mt-1 bg-slate-900/50 text-white placeholder:text-slate-500"
                    />
                    {state.errors?.heightCm && (
                      <p className="mt-1 text-sm text-red-400">
                        {state.errors.heightCm[0]}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="weightKg" className="text-slate-300">
                      Peso (kg)
                    </Label>
                    <Input
                      id="weightKg"
                      name="weightKg"
                      type="number"
                      step="0.1"
                      min="30"
                      max="200"
                      placeholder="Ex: 70.5"
                      disabled={isPending}
                      className="mt-1 bg-slate-900/50 text-white placeholder:text-slate-500"
                    />
                    {state.errors?.weightKg && (
                      <p className="mt-1 text-sm text-red-400">
                        {state.errors.weightKg[0]}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="text-slate-300">
                    Observações (opcional)
                  </Label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    placeholder="Descreva como você está se sentindo, mudanças na rotina, etc."
                    disabled={isPending}
                    className="mt-1 block w-full rounded-md border border-[#C2A537]/30 bg-slate-900/50 p-3 text-white placeholder:text-slate-500 focus:border-[#C2A537] focus:ring-[#C2A537]"
                  />
                  {state.errors?.notes && (
                    <p className="mt-1 text-sm text-red-400">
                      {state.errors.notes[0]}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="border-[#C2A537] bg-[#C2A537] text-black hover:bg-[#D4B547]"
                  >
                    {isPending ? "Salvando..." : "Salvar Entrada"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Histórico */}
        <Card className="border-[#C2A537]/50 bg-black/40">
          <CardHeader>
            <CardTitle className="text-[#C2A537]">
              Histórico de Entradas
            </CardTitle>
            <CardDescription>
              Suas atualizações de saúde em ordem cronológica
            </CardDescription>
          </CardHeader>
          <CardContent>
            {healthHistory.length === 0 ? (
              <div className="py-8 text-center">
                <Heart className="mx-auto mb-4 h-12 w-12 text-slate-500" />
                <p className="mb-2 text-slate-400">
                  Nenhuma entrada registrada ainda
                </p>
                <p className="text-sm text-slate-500">
                  Clique em &quot;Adicionar Entrada&quot; para começar a
                  acompanhar sua evolução
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {healthHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-lg border border-slate-700 bg-slate-800/50 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex gap-6">
                        {entry.heightCm && (
                          <div>
                            <p className="text-sm text-slate-400">Altura</p>
                            <p className="text-white">{entry.heightCm} cm</p>
                          </div>
                        )}
                        {entry.weightKg && (
                          <div>
                            <p className="text-sm text-slate-400">Peso</p>
                            <p className="text-white">{entry.weightKg} kg</p>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">
                          {new Date(entry.createdAt).toLocaleDateString(
                            "pt-BR",
                          )}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(entry.createdAt).toLocaleTimeString(
                            "pt-BR",
                          )}
                        </p>
                      </div>
                    </div>
                    {entry.notes && (
                      <div className="mt-3 border-t border-slate-700 pt-3">
                        <p className="mb-1 text-sm text-slate-400">
                          Observações:
                        </p>
                        <p className="text-slate-300">{entry.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
