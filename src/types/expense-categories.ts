export type ExpenseCategory =
  | "energia"
  | "agua"
  | "aluguel"
  | "internet"
  | "telefone"
  | "manutencao"
  | "material_limpeza"
  | "material_escritorio"
  | "equipamentos"
  | "marketing"
  | "seguranca"
  | "seguros"
  | "impostos"
  | "salarios"
  | "outros";

export const expenseCategoryOptions = [
  { value: "energia", label: "Energia Elétrica" },
  { value: "agua", label: "Água" },
  { value: "aluguel", label: "Aluguel" },
  { value: "internet", label: "Internet" },
  { value: "telefone", label: "Telefone" },
  { value: "manutencao", label: "Manutenção" },
  { value: "material_limpeza", label: "Material de Limpeza" },
  { value: "material_escritorio", label: "Material de Escritório" },
  { value: "equipamentos", label: "Equipamentos" },
  { value: "marketing", label: "Marketing" },
  { value: "seguranca", label: "Segurança" },
  { value: "seguros", label: "Seguros" },
  { value: "impostos", label: "Impostos" },
  { value: "salarios", label: "Salários" },
  { value: "outros", label: "Outros" },
] as const;
