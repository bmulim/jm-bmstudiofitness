/**
 * Utilitários para verificação de pagamentos
 */

/**
 * Verifica se o pagamento está em dia baseado na data de vencimento
 * @param dueDate Dia do mês para vencimento (1-10)
 * @param lastPaymentDate Data do último pagamento
 * @param paid Status de pagamento atual
 * @returns true se o pagamento está em dia, false caso contrário
 */
export function isPaymentUpToDate(
  dueDate: number,
  lastPaymentDate: string | null,
  paid: boolean,
): boolean {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Se está marcado como pago e o último pagamento foi neste mês, está em dia
  if (paid && lastPaymentDate) {
    const lastPayment = new Date(lastPaymentDate);
    const lastPaymentMonth = lastPayment.getMonth();
    const lastPaymentYear = lastPayment.getFullYear();

    // Se o último pagamento foi neste mês e ano, está em dia
    if (lastPaymentMonth === currentMonth && lastPaymentYear === currentYear) {
      return true;
    }
  }

  // Se não pagou ainda neste mês
  if (!paid || !lastPaymentDate) {
    // Se ainda não passou do dia de vencimento, considera em dia
    if (currentDay <= dueDate) {
      return true;
    }
    // Se passou do dia de vencimento, está em atraso
    return false;
  }

  // Caso padrão: verificar se o último pagamento foi neste mês
  const lastPayment = new Date(lastPaymentDate);
  const lastPaymentMonth = lastPayment.getMonth();
  const lastPaymentYear = lastPayment.getFullYear();

  return lastPaymentMonth === currentMonth && lastPaymentYear === currentYear;
}

/**
 * Calcula quantos dias restam até o vencimento
 * @param dueDate Dia do mês para vencimento (1-10)
 * @returns Número de dias até o vencimento (negativo se já venceu)
 */
export function getDaysUntilDue(dueDate: number): number {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Data de vencimento neste mês
  const dueThisMonth = new Date(currentYear, currentMonth, dueDate);

  // Se já passou do vencimento neste mês, calcular para o próximo mês
  if (currentDay > dueDate) {
    const dueNextMonth = new Date(currentYear, currentMonth + 1, dueDate);
    const diffTime = dueNextMonth.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Ainda não venceu neste mês
  const diffTime = dueThisMonth.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Verifica se um dia está dentro do limite de até o 10º dia útil
 * @param day Dia do mês (1-31)
 * @returns true se está dentro do limite, false caso contrário
 */
export function isValidDueDate(day: number): boolean {
  return day >= 1 && day <= 10;
}

/**
 * Formata o valor em centavos para exibição em reais
 * @param valueInCents Valor em centavos
 * @returns String formatada em reais (ex: "R$ 150,00")
 */
export function formatCurrency(valueInCents: number): string {
  const valueInReais = valueInCents / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valueInReais);
}

/**
 * Converte valor em reais para centavos
 * @param valueInReais Valor em reais
 * @returns Valor em centavos
 */
export function convertToCents(valueInReais: number): number {
  return Math.round(valueInReais * 100);
}
