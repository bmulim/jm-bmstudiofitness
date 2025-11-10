import type { ExpenseCategory } from "@/types/expense-categories";

export interface Expense {
  id: string;
  description: string;
  category: ExpenseCategory;
  amountInCents: number;
  dueDate: string;
  paid: boolean;
  paymentDate: string | null;
  paymentMethod: string;
  recurrent: boolean;
  notes?: string | null;
  attachment?: string | null;
  createdAt: string;
}
