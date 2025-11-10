import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { formatCurrency } from "@/lib/utils";
import { expenseCategoryOptions } from "@/types/expense-categories";

import type { Expense } from "./types";

export function generateExpensePDF(expenses: Expense[]) {
  // Cria um novo documento PDF
  const doc = new jsPDF();

  // Configurações do cabeçalho
  doc.setFontSize(20);
  doc.text("Relatório de Despesas", 14, 15);

  doc.setFontSize(10);
  doc.text(
    `Data de geração: ${format(new Date(), "PPP", { locale: ptBR })}`,
    14,
    25,
  );

  // Prepara os dados para a tabela
  const tableData = expenses.map((expense) => {
    const category = expenseCategoryOptions.find(
      (opt) => opt.value === expense.category,
    );
    return [
      expense.description,
      category?.label || expense.category,
      formatCurrency(expense.amountInCents),
      format(new Date(expense.dueDate), "dd/MM/yyyy"),
      expense.paid ? "Pago" : "Pendente",
      expense.recurrent ? "Sim" : "Não",
    ];
  });

  // Calcula o total das despesas
  const totalExpenses = expenses.reduce(
    (acc, expense) => acc + expense.amountInCents,
    0,
  );
  const totalPaid = expenses
    .filter((e) => e.paid)
    .reduce((acc, expense) => acc + expense.amountInCents, 0);
  const totalPending = totalExpenses - totalPaid;

  // Configuração e geração da tabela
  autoTable(doc, {
    head: [
      ["Descrição", "Categoria", "Valor", "Vencimento", "Status", "Recorrente"],
    ],
    body: tableData,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [194, 165, 55], // Cor dourada (#C2A537)
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: "bold",
    },
    startY: 35,
  });

  // Adiciona o resumo financeiro
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = (doc as any).lastAutoTable.finalY || 35;

  doc.setFontSize(10);
  doc.text("Resumo Financeiro:", 14, finalY + 10);
  doc.text(
    `Total de Despesas: ${formatCurrency(totalExpenses)}`,
    14,
    finalY + 20,
  );
  doc.text(`Total Pago: ${formatCurrency(totalPaid)}`, 14, finalY + 27);
  doc.text(`Total Pendente: ${formatCurrency(totalPending)}`, 14, finalY + 34);

  // Salva o PDF
  const fileName = `relatorio-despesas-${format(new Date(), "dd-MM-yyyy")}.pdf`;
  doc.save(fileName);
}
