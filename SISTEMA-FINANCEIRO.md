# Sistema Financeiro - JM Fitness Studio

## 🎯 Funcionalidades Implementadas

### 💳 **Controle de Pagamentos**

- ✅ **Campo de mensalidade** no cadastro de alunos
- ✅ **Método de pagamento** (dinheiro, PIX, cartão, transferência)
- ✅ **Data de vencimento** limitada entre dias 1-10 do mês
- ✅ **Verificação automática** de pagamento em dia
- ✅ **Bloqueio de check-in** para inadimplentes

### 🗄️ **Estrutura do Banco de Dados**

#### Tabela `financialTable`

```sql
tb_financial (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES tb_users(id),
  monthly_fee_value_in_cents INTEGER NOT NULL,    -- Valor da mensalidade em centavos
  payment_method TEXT NOT NULL,                   -- Método de pagamento
  due_date INTEGER NOT NULL,                      -- Dia do vencimento (1-10)
  paid BOOLEAN DEFAULT FALSE,                     -- Status do pagamento
  last_payment_date DATE,                         -- Data do último pagamento
  updated_at DATE NOT NULL,
  created_at DATE NOT NULL
)
```

#### Métodos de Pagamento Disponíveis

- **dinheiro** - Pagamento em espécie
- **pix** - Transferência instantânea
- **cartao_credito** - Cartão de crédito
- **cartao_debito** - Cartão de débito
- **transferencia** - Transferência bancária

### 📋 **Formulário de Cadastro Atualizado**

Novos campos adicionados na seção "Dados Financeiros":

1. **Valor da Mensalidade**
   - Input numérico com decimais
   - Validação: R$ 50,00 - R$ 1.000,00
   - Armazenado em centavos no banco

2. **Método de Pagamento**
   - Select com opções pré-definidas
   - Campo obrigatório

3. **Dia de Vencimento**
   - Select limitado a dias 1-10
   - Restrição para pagamento até 10º dia útil

### 🔒 **Sistema de Verificação de Check-in**

#### Validações Implementadas

```typescript
// Verificação automática durante check-in
const paymentUpToDate = isPaymentUpToDate(
  user.dueDate, // Dia do vencimento
  user.lastPaymentDate, // Data do último pagamento
  user.paid, // Status atual
);

if (!paymentUpToDate) {
  return "Pagamento em atraso. Procure a recepção.";
}
```

#### Lógica de Verificação

1. **Se marcado como pago** E **último pagamento foi neste mês** → ✅ Liberado
2. **Se não pagou ainda** E **não passou do dia de vencimento** → ✅ Liberado
3. **Se passou do dia de vencimento** E **não pagou** → ❌ Bloqueado
4. **Se último pagamento foi mês anterior** → ❌ Bloqueado

### 🎛️ **Painel Administrativo de Pagamentos**

#### Rota: `/admin/pagamentos`

Funcionalidades do painel:

- **Listagem completa** de todos os alunos
- **Separação visual** entre pagamentos em dia e em atraso
- **Estatísticas em tempo real**
- **Botões de ação** para confirmar/pendenciar pagamentos
- **Informações detalhadas** por aluno

#### Dados Exibidos

- Nome, email e CPF do aluno
- Valor da mensalidade formatado
- Método de pagamento
- Dia de vencimento
- Data do último pagamento
- Status atual (em dia/atrasado)

#### Ações Disponíveis

- ✅ **Confirmar Pagamento** - Marca como pago e registra data
- ❌ **Marcar como Pendente** - Remove status de pago

### 🔧 **Funções Utilitárias Criadas**

#### `/src/lib/payment-utils.ts`

1. **`isPaymentUpToDate()`** - Verifica se pagamento está em dia
2. **`getDaysUntilDue()`** - Calcula dias até vencimento
3. **`isValidDueDate()`** - Valida se dia está entre 1-10
4. **`formatCurrency()`** - Formata centavos para reais
5. **`convertToCents()`** - Converte reais para centavos

### 📊 **Actions Criadas**

#### Cadastro de Aluno

- **`create-aluno-action.ts`** atualizado para incluir dados financeiros
- Validação de valores entre R$ 50-1000
- Criação automática do registro financeiro

#### Verificação de Check-in

- **`checkin-action.ts`** atualizado para verificar pagamento
- Consulta join com tabela financeira
- Bloqueio automático para inadimplentes

#### Gestão Administrativa

- **`get-students-payments-action.ts`** - Lista alunos com status financeiro
- **`update-payment-action.ts`** - Atualiza status de pagamento

### 🎨 **Interface de Usuário**

#### Página de Check-in

- ✅ **Aviso sobre pagamentos** na área informativa
- ✅ **Mensagem específica** para inadimplentes
- ✅ **Orientação visual** sobre necessidade de pagamento em dia

#### Página de Cadastro

- ✅ **Seção "Dados Financeiros"** bem estruturada
- ✅ **Validação em tempo real** dos campos
- ✅ **Aviso informativo** sobre regras de vencimento

#### Painel Admin

- ✅ **Design responsivo** e intuitivo
- ✅ **Cores diferenciadas** para status (verde/vermelho)
- ✅ **Estatísticas visuais** em cards
- ✅ **Ações rápidas** com feedback visual

### ⚠️ **Regras de Negócio**

#### Vencimentos

- **Limite:** Apenas dias 1-10 do mês
- **Justificativa:** Facilita controle financeiro e fluxo de caixa
- **Flexibilidade:** Aluno escolhe o dia dentro do limite

#### Pagamentos

- **Novo aluno:** Sempre inicia com status "pendente"
- **Check-in:** Bloqueado automaticamente se em atraso
- **Tolerância:** Até o dia do vencimento é considerado "em dia"

#### Valores

- **Mínimo:** R$ 50,00 (adequado para planos básicos)
- **Máximo:** R$ 1.000,00 (cobrir planos premium)
- **Armazenamento:** Em centavos para evitar problemas de precisão

### 🚀 **Fluxo Completo**

1. **Cadastro:** Aluno informa dados financeiros obrigatórios
2. **Sistema:** Cria registro financeiro com status "pendente"
3. **Check-in:** Verifica automaticamente se pagamento está em dia
4. **Admin:** Confirma pagamentos através do painel
5. **Automação:** Sistema atualiza status e libera/bloqueia acesso

### 💡 **Benefícios Implementados**

- **Automação total** do controle de inadimplência
- **Interface intuitiva** para gestão financeira
- **Segurança** contra acesso irregular
- **Flexibilidade** na escolha de métodos de pagamento
- **Transparência** para alunos sobre status de pagamento
- **Eficiência** administrativa com painel centralizado

O sistema está **100% funcional** e pronto para uso! 🎉
