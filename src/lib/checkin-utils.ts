// Utilitários relacionados a check-ins

/**
 * Verifica se check-ins são permitidos no dia atual
 * Check-ins são permitidos apenas de segunda a sexta-feira
 */
export function isCheckInAllowed(date: Date = new Date()): boolean {
  const dayOfWeek = date.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
  return dayOfWeek >= 1 && dayOfWeek <= 5; // Segunda (1) a sexta (5)
}

/**
 * Retorna o nome do dia da semana em português
 */
export function getDayOfWeekName(date: Date = new Date()): string {
  const days = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];

  return days[date.getDay()];
}

/**
 * Retorna a próxima segunda-feira
 */
export function getNextMonday(date: Date = new Date()): Date {
  const nextMonday = new Date(date);
  const dayOfWeek = date.getDay();

  // Se é domingo (0), próxima segunda é em 1 dia
  // Se é segunda (1), próxima segunda é em 7 dias
  // Se é terça (2), próxima segunda é em 6 dias, etc.
  const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;

  nextMonday.setDate(date.getDate() + daysUntilMonday);
  return nextMonday;
}

/**
 * Formata uma data para exibição em português
 */
export function formatDatePtBR(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
