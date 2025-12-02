import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { generateExpensePDF } from "./ExpensePDFReport";
import type { Expense } from "./types";

interface ExpenseReportProps {
  expenses: Expense[];
}

export function ExpenseReport({ expenses }: ExpenseReportProps) {
  const [generatingPDF, setGeneratingPDF] = useState(false);

  // Separar despesas fixas e variáveis
  const fixedExpenses = expenses.filter((expense) => expense.recurrent);
  const variableExpenses = expenses.filter((expense) => !expense.recurrent);

  // Calcular totais
  const totalFixed = fixedExpenses.reduce(
    (acc, curr) => acc + curr.amountInCents,
    0,
  );
  const totalVariable = variableExpenses.reduce(
    (acc, curr) => acc + curr.amountInCents,
    0,
  );

  const generatePDF = async () => {
    try {
      setGeneratingPDF(true);
      generateExpensePDF(expenses);
      toast.success("Relatório gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar relatório");
    } finally {
      setGeneratingPDF(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#C2A537]">
            Resumo de Despesas
          </h2>
          <p className="text-slate-400">
            Gerado em {format(new Date(), "PPP", { locale: ptBR })}
          </p>
        </div>
        <Button
          onClick={generatePDF}
          disabled={generatingPDF}
          className="bg-[#C2A537]/20 text-[#C2A537] hover:bg-[#C2A537]/30"
        >
          {generatingPDF && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Gerar Relatório PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-6">
          <h3 className="mb-4 text-lg font-medium text-[#C2A537]">
            Despesas Fixas
          </h3>
          <div className="space-y-4">
            {fixedExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between"
              >
                <span className="text-slate-200">{expense.description}</span>
                <span className="text-slate-200">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(expense.amountInCents / 100)}
                </span>
              </div>
            ))}
            <div className="border-t border-slate-700 pt-4">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-[#C2A537]">Total Fixo</span>
                <span className="text-[#C2A537]">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(totalFixed / 100)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-6">
          <h3 className="mb-4 text-lg font-medium text-[#C2A537]">
            Despesas Variáveis
          </h3>
          <div className="space-y-4">
            {variableExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between"
              >
                <span className="text-slate-200">{expense.description}</span>
                <span className="text-slate-200">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(expense.amountInCents / 100)}
                </span>
              </div>
            ))}
            <div className="border-t border-slate-700 pt-4">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-[#C2A537]">Total Variável</span>
                <span className="text-[#C2A537]">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(totalVariable / 100)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-6">
        <div className="flex items-center justify-between text-xl font-semibold">
          <span className="text-[#C2A537]">Total Geral</span>
          <span className="text-[#C2A537]">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format((totalFixed + totalVariable) / 100)}
          </span>
        </div>
      </div>
    </div>
  );
}
