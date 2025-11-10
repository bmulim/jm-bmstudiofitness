# Análise de Permissões - Estado Atual vs Requisitos

## ✅ O que está CORRETO

### 1. Estrutura de Roles no Banco de Dados

- ✅ A tabela `usersTable` possui campo `userRole` com tipo `UserRole`
- ✅ Os 4 níveis estão definidos em `src/types/user-roles.ts`:
  - `ADMIN`
  - `PROFESSOR`
  - `FUNCIONARIO`
  - `ALUNO`

### 2. Middleware de Autenticação

- ✅ O middleware protege rotas corretamente
- ✅ Redirecionamentos baseados em roles funcionam
- ✅ Área `/admin` protegida para admin e funcionário
- ✅ Área `/coach` protegida para admin e professor
- ✅ Área `/user` protegida para aluno

### 3. Schema de Observações do Professor

- ✅ Tabela `healthMetricsTable` possui dois campos:
  - `coachaObservations` - observações públicas (visíveis ao aluno)
  - `coachObservationsParticular` - observações particulares (apenas professor/admin)

---

## ❌ PROBLEMAS ENCONTRADOS

### 1. **Funcionário pode criar APENAS Professor e Aluno (não está implementado)**

**Problema:**
Não existe verificação de quem pode criar qual tipo de usuário. Qualquer pessoa autenticada pode criar qualquer tipo de usuário.

**Requisito:**

- Administrador: pode criar Admin, Funcionário, Professor, Aluno
- Funcionário: pode criar APENAS Professor e Aluno
- Professor: NÃO pode criar usuários
- Aluno: NÃO pode criar usuários

**Localização do problema:**

- `src/actions/user/create-aluno-action.ts` - não verifica quem está criando
- `src/actions/admin/create-employee-action.ts` - não verifica permissões
- Não existe action para criar professor separadamente
- Não existe action para criar funcionário separadamente

---

### 2. **Funcionário TEM acesso a dados de saúde (deveria NÃO ter)**

**Problema:**
Em `src/types/user-roles.ts`, o `FUNCIONARIO` tem permissão para:

```typescript
{
  resource: "healthMetrics",
  actions: ["create", "read", "update"],
  conditions: {
    targetUserType: "aluno",
    excludeFields: ["coachObservationsParticular"],
  },
}
```

**Requisito:**
Funcionário **NÃO** deve ter acesso a dados de saúde dos alunos.

---

### 3. **Funcionário TEM acesso a valores financeiros completos (deveria ser limitado)**

**Problema:**
Em `src/types/user-roles.ts`, o `FUNCIONARIO` tem permissão para:

```typescript
{
  resource: "financial",
  actions: ["create", "read", "update"],
  conditions: { targetUserType: "aluno" },
}
```

**Requisito:**
Funcionário deve ter acesso **APENAS**:

- Situação da mensalidade (pago/não pago)
- Valor da mensalidade individual do aluno
- **SEM** acesso a montantes totais, relatórios gerenciais, despesas, receitas

**Necessário criar:**

- Resource separado: `financialMonthlyPayment` (somente status e valor)
- Bloquear acesso ao resource `financial` completo
- Criar views/actions específicas para funcionário

---

### 4. **Aluno NÃO pode editar seus próprios dados de saúde (deveria poder)**

**Problema:**
Em `src/types/user-roles.ts`, o `ALUNO` tem:

```typescript
{
  resource: "healthMetrics",
  actions: ["read"], // ❌ SÓ LEITURA
  conditions: {
    ownData: true,
    excludeFields: ["coachObservationsParticular"],
  },
}
```

**Requisito:**
Aluno deve poder **editar** seus dados de saúde (peso, lesões, medicamentos, suplementação).

**Correção necessária:**

```typescript
{
  resource: "healthMetrics",
  actions: ["read", "update"], // ✅ ADICIONAR UPDATE
  conditions: {
    ownData: true,
    excludeFields: ["coachObservationsParticular"],
  },
}
```

---

### 5. **Professor faz check-in COM controle de horário (deveria ser SEM)**

**Problema:**
Não existe diferenciação entre:

- Check-in de funcionário (com horário para cálculo de horas)
- Check-in de professor (sem controle de horário)

**Requisito:**

- Funcionário: registra ponto com entrada/saída e cálculo de horas
- Professor: apenas registra presença, sem controle de horário

**Necessário criar:**

- Tabela separada `professorCheckInsTable` ou campo `type` na tabela de check-ins
- Action separada para professor fazer check-in simples
- UI diferente para professor (sem mostrar controle de ponto)

---

### 6. **Aluno NÃO pode pagar mensalidade pelo sistema (deveria poder)**

**Problema:**
Não existe action ou página para aluno efetuar pagamento.

**Requisito:**
Aluno deve poder pagar mensalidade direto da área do aluno.

**Necessário criar:**

- Action: `payMonthlyFeeAction` (aluno)
- Página: `/user/payment`
- Integração com gateway de pagamento (Stripe, PagSeguro, etc.)
- Atualização automática do status de pagamento

---

### 7. **Sistema de permissões NÃO está sendo usado nas actions**

**Problema:**
As actions não verificam permissões antes de executar operações.

**Exemplo:**
`create-aluno-action.ts` não verifica se o usuário logado tem permissão para criar aluno.

**Necessário:**
Adicionar verificação de permissões em TODAS as actions:

```typescript
import { hasPermission } from "@/types/user-roles";
import { getCurrentUser } from "@/lib/get-current-user";

export async function someAction() {
  const user = await getCurrentUser();

  if (
    !hasPermission(user.role, "users", "create", { targetUserType: "aluno" })
  ) {
    return { success: false, error: "Sem permissão" };
  }

  // ... resto da action
}
```

---

## 🔧 CORREÇÕES NECESSÁRIAS

### Prioridade ALTA

#### 1. Corrigir permissões do Funcionário

```typescript
// src/types/user-roles.ts
{
  role: UserRole.FUNCIONARIO,
  description: "Acesso limitado ao financeiro e gestão de professores/alunos",
  permissions: [
    {
      resource: "users",
      actions: ["create", "read", "update"],
      conditions: { targetUserType: ["professor", "aluno"] }, // ✅ Apenas professor e aluno
    },
    {
      resource: "healthMetrics",
      actions: [], // ❌ SEM ACESSO
    },
    {
      resource: "financialMonthlyPayment", // ✅ NOVO RESOURCE
      actions: ["read", "update"], // Apenas ver status e alterar pago/não pago
      conditions: { targetUserType: "aluno" },
    },
    {
      resource: "financial", // ❌ SEM ACESSO AO COMPLETO
      actions: [],
    },
  ],
}
```

#### 2. Permitir Aluno editar dados de saúde

```typescript
// src/types/user-roles.ts
{
  role: UserRole.ALUNO,
  permissions: [
    {
      resource: "healthMetrics",
      actions: ["read", "update"], // ✅ ADICIONAR UPDATE
      conditions: {
        ownData: true,
        excludeFields: ["coachObservationsParticular"], // Continua sem ver particulares
      },
    },
  ],
}
```

#### 3. Criar sistema de check-in diferenciado

**Nova tabela:**

```typescript
// src/db/schema.ts
export const professorCheckInsTable = pgTable("tb_professor_check_ins", {
  id: uuid("id").primaryKey().defaultRandom(),
  professorId: uuid("professor_id")
    .notNull()
    .references(() => employeesTable.id),
  date: date("date").notNull(),
  checkInTime: text("check_in_time").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

**Nova action:**

```typescript
// src/actions/coach/professor-checkin-action.ts
export async function professorCheckInAction() {
  const user = await getCurrentUser();

  if (user.role !== "professor") {
    return { success: false, error: "Apenas professores" };
  }

  // Registra apenas presença, sem controle de horário
  await db.insert(professorCheckInsTable).values({
    professorId: user.employeeId,
    date: new Date().toISOString().split("T")[0],
    checkInTime: new Date().toTimeString().split(" ")[0].substring(0, 5),
  });

  return { success: true };
}
```

#### 4. Adicionar verificação de permissões em todas as actions

**Criar helper:**

```typescript
// src/lib/check-permission.ts
import { getCurrentUser } from "@/lib/get-current-user";
import { hasPermission, UserRole } from "@/types/user-roles";

export async function checkPermission(
  resource: string,
  action: string,
  context?: any,
): Promise<{ allowed: boolean; user: any; error?: string }> {
  const user = await getCurrentUser();

  if (!user) {
    return { allowed: false, user: null, error: "Usuário não autenticado" };
  }

  const allowed = hasPermission(user.role, resource, action, context);

  if (!allowed) {
    return { allowed: false, user, error: "Sem permissão para esta ação" };
  }

  return { allowed: true, user };
}
```

**Usar em actions:**

```typescript
// src/actions/admin/create-employee-action.ts
export async function createEmployeeAction(data: any) {
  const { allowed, user, error } = await checkPermission("users", "create", {
    targetUserType: "funcionario",
  });

  if (!allowed) {
    return { success: false, error };
  }

  // Continua com a criação...
}
```

#### 5. Criar action para aluno pagar mensalidade

```typescript
// src/actions/user/pay-monthly-fee-action.ts
export async function payMonthlyFeeAction(paymentData: {
  method: string;
  transactionId?: string;
}) {
  const user = await getCurrentUser();

  if (user.role !== "aluno") {
    return { success: false, error: "Apenas alunos" };
  }

  // Atualizar status de pagamento
  await db
    .update(financialTable)
    .set({
      paid: true,
      lastPaymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: paymentData.method,
    })
    .where(eq(financialTable.userId, user.id));

  return { success: true };
}
```

### Prioridade MÉDIA

#### 6. Criar actions separadas para criação de usuários

```typescript
// src/actions/admin/create-admin-action.ts (apenas admin pode usar)
// src/actions/admin/create-funcionario-action.ts (apenas admin pode usar)
// src/actions/admin/create-professor-action.ts (admin e funcionário podem usar)
// src/actions/admin/create-aluno-action.ts (admin e funcionário podem usar)
```

Cada action deve verificar permissões no início.

### Prioridade BAIXA

#### 7. Criar dashboard específico para cada role

- `/admin/dashboard` - visão completa
- `/funcionario/dashboard` - apenas mensalidades limitadas
- `/coach/dashboard` - dados de saúde dos alunos
- `/user/dashboard` - dados próprios do aluno

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Correções Críticas de Segurança

- [ ] Corrigir permissões do `FUNCIONARIO` em `user-roles.ts`
- [ ] Remover acesso a `healthMetrics` do funcionário
- [ ] Criar resource `financialMonthlyPayment` limitado
- [ ] Adicionar `update` ao `healthMetrics` do aluno
- [ ] Criar helper `checkPermission()`
- [ ] Adicionar verificação de permissões em actions existentes

### Fase 2: Funcionalidades Novas

- [ ] Criar tabela `professorCheckInsTable`
- [ ] Criar action `professorCheckInAction`
- [ ] Criar UI de check-in para professor
- [ ] Criar action `payMonthlyFeeAction`
- [ ] Criar página `/user/payment`
- [ ] Integrar gateway de pagamento

### Fase 3: Refinamento

- [ ] Separar actions de criação por tipo de usuário
- [ ] Criar dashboards específicos por role
- [ ] Adicionar logs de auditoria
- [ ] Testes de permissões

---

## 🎯 PRÓXIMOS PASSOS RECOMENDADOS

1. **Primeiro:** Corrigir arquivo `src/types/user-roles.ts`
2. **Segundo:** Criar helper `checkPermission()`
3. **Terceiro:** Adicionar verificação em actions críticas (create, update, delete)
4. **Quarto:** Implementar check-in diferenciado para professor
5. **Quinto:** Implementar pagamento para aluno
6. **Sexto:** Criar actions separadas por tipo de usuário
7. **Sétimo:** Refinar UIs e dashboards específicos

---

## ⚠️ AVISOS IMPORTANTES

### Segurança

- ❌ **CRÍTICO:** Funcionário tem acesso a dados de saúde (deveria NÃO ter)
- ❌ **CRÍTICO:** Não há verificação de permissões nas actions
- ❌ **ALTO:** Qualquer pessoa pode criar qualquer tipo de usuário

### Funcionalidade

- ⚠️ **MÉDIO:** Aluno não pode editar seus próprios dados de saúde
- ⚠️ **MÉDIO:** Aluno não pode pagar mensalidade
- ⚠️ **BAIXO:** Professor e funcionário têm mesmo tipo de check-in

---

## 📊 RESUMO

**Total de problemas encontrados:** 7

- **Críticos (segurança):** 3
- **Altos (funcionalidade importante):** 2
- **Médios:** 1
- **Baixos:** 1

**Estimativa de tempo para correções:**

- Fase 1 (Críticas): ~8 horas
- Fase 2 (Funcionalidades): ~12 horas
- Fase 3 (Refinamento): ~6 horas
- **Total:** ~26 horas
