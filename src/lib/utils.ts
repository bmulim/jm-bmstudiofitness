import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata CPF para exibição no formato 000.000.000-00
 * @param cpf - CPF sem formatação (11 dígitos)
 * @returns CPF formatado
 */
/**
 * Formata um valor em centavos para exibição em Reais (R$)
 * @param cents - Valor em centavos
 * @returns String formatada em Reais
 */
export function formatCurrency(cents: number): string {
  const valueInReais = cents / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valueInReais);
}

export function formatCPF(cpf: string): string {
  if (!cpf) return "";

  // Remove qualquer formatação existente
  const cleanCPF = cpf.replace(/\D/g, "");

  // Aplica a formatação 000.000.000-00
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
