# Níveis de Acesso - JM Fitness Studio

## Hierarquia de Usuários

O sistema possui 4 níveis de acesso, cada um com permissões específicas:

---

## 1. Administrador

### Permissões Completas

- ✅ Acesso total ao sistema
- ✅ Pode criar outros administradores
- ✅ Pode criar e gerenciar funcionários
- ✅ Pode criar e gerenciar professores
- ✅ Pode criar e gerenciar alunos
- ✅ Acesso completo ao financeiro (todos os valores e montantes)
- ✅ Acesso a todos os dados de saúde dos alunos
- ✅ Visualização de observações públicas e particulares
- ✅ Acesso ao controle de ponto de funcionários e professores
- ✅ Gestão de mensalidades

---

## 2. Funcionário

### Permissões de Financeiro (Limitadas)

- ✅ Acesso **SOMENTE** à situação das mensalidades dos alunos
- ✅ Visualização do valor da mensalidade individual do aluno
- ✅ Pode alterar status de pagamento (pago/não pago)
- ❌ **SEM** acesso a outros valores financeiros
- ❌ **SEM** visualização de montantes totais
- ❌ **SEM** acesso a relatórios financeiros gerais

### Permissões de Gestão de Usuários

- ✅ Pode criar usuários do tipo **Professor**
- ✅ Pode criar usuários do tipo **Aluno**
- ✅ Pode alterar dados de professores e alunos
- ❌ **NÃO** pode criar funcionários
- ❌ **NÃO** pode criar administradores
- ❌ **NÃO** pode alterar dados de funcionários ou administradores

### Outras Permissões

- ✅ Controle de ponto próprio (check-in/check-out)
- ❌ **SEM** acesso a dados de saúde dos alunos

---

## 3. Professor

### Permissões de Dados de Saúde

- ✅ Acesso completo aos dados de saúde dos alunos
- ✅ Pode alterar: peso, lesões, medicamentos, suplementação
- ✅ Pode incluir e editar **observações públicas** (visíveis ao aluno)
- ✅ Pode incluir e editar **observações particulares** (visíveis apenas para professores e administradores)
- ✅ Visualização de observações particulares de outros professores

### Permissões de Check-in

- ✅ Pode fazer check-in como funcionário
- ❌ **SEM** controle de horário (não registra ponto)

### Restrições

- ❌ **SEM** acesso ao financeiro
- ❌ **NÃO** pode criar ou gerenciar usuários
- ❌ **SEM** acesso a dados de funcionários

---

## 4. Aluno

### Permissões de Dados de Saúde

- ✅ Pode visualizar seus próprios dados de saúde
- ✅ Pode editar seus dados: peso, lesões, medicamentos, suplementação
- ✅ Visualização das **observações públicas** do professor
- ❌ **JAMAIS** pode ver observações particulares

### Permissões Financeiras

- ✅ Visualização do status da sua mensalidade
- ✅ Pode efetuar pagamento direto da área do aluno
- ❌ **SEM** acesso a valores de outros alunos

### Restrições

- ❌ **SEM** acesso a dados de outros alunos
- ❌ **NÃO** pode criar ou gerenciar usuários
- ❌ **SEM** acesso administrativo

---

## Resumo de Permissões por Funcionalidade

| Funcionalidade                      | Administrador | Funcionário | Professor |     Aluno     |
| ----------------------------------- | :-----------: | :---------: | :-------: | :-----------: |
| **Criar Administradores**           |      ✅       |     ❌      |    ❌     |      ❌       |
| **Criar Funcionários**              |      ✅       |     ❌      |    ❌     |      ❌       |
| **Criar Professores**               |      ✅       |     ✅      |    ❌     |      ❌       |
| **Criar Alunos**                    |      ✅       |     ✅      |    ❌     |      ❌       |
| **Editar Funcionários**             |      ✅       |     ❌      |    ❌     |      ❌       |
| **Editar Professores**              |      ✅       |     ✅      |    ❌     |      ❌       |
| **Editar Alunos**                   |      ✅       |     ✅      |    ❌     |      ❌       |
| **Financeiro Completo**             |      ✅       |     ❌      |    ❌     |      ❌       |
| **Ver Mensalidade Individual**      |      ✅       |     ✅      |    ❌     | ✅ (própria)  |
| **Alterar Status Pagamento**        |      ✅       |     ✅      |    ❌     |      ❌       |
| **Pagar Mensalidade**               |      ✅       |     ❌      |    ❌     | ✅ (própria)  |
| **Ver Dados Saúde (Todos)**         |      ✅       |     ❌      |    ✅     |      ❌       |
| **Ver Dados Saúde (Próprios)**      |      ✅       |     ❌      |    ✅     |      ✅       |
| **Editar Dados Saúde (Outros)**     |      ✅       |     ❌      |    ✅     |      ❌       |
| **Editar Dados Saúde (Próprios)**   |      ✅       |     ❌      |    ✅     |      ✅       |
| **Ver Observações Públicas**        |      ✅       |     ❌      |    ✅     | ✅ (próprias) |
| **Ver Observações Particulares**    |      ✅       |     ❌      |    ✅     |      ❌       |
| **Criar Observações Públicas**      |      ✅       |     ❌      |    ✅     |      ❌       |
| **Criar Observações Particulares**  |      ✅       |     ❌      |    ✅     |      ❌       |
| **Controle de Ponto (com horário)** |      ✅       |     ✅      |    ❌     |      ❌       |
| **Check-in Simples (sem horário)**  |      ✅       |     ✅      |    ✅     |      ❌       |

---

## Notas Importantes

### Observações do Professor

- **Observações Públicas**: Visíveis ao aluno e podem ser usadas para feedback, orientações de treino, etc.
- **Observações Particulares**: Visíveis apenas para professores e administradores. Podem conter informações sensíveis, avaliações internas, etc.

### Financeiro do Funcionário

- O funcionário tem acesso **muito limitado** ao financeiro
- Vê apenas: nome do aluno, valor da mensalidade, status (pago/não pago)
- **NÃO** vê: total de receitas, despesas, lucros, relatórios gerenciais

### Controle de Ponto

- **Funcionário**: Registra entrada/saída com horário completo para cálculo de horas trabalhadas
- **Professor**: Apenas check-in para registro de presença, sem controle de horário

### Hierarquia de Criação de Usuários

```
Administrador
  └── Pode criar: Administrador, Funcionário, Professor, Aluno

Funcionário
  └── Pode criar: Professor, Aluno

Professor
  └── Não pode criar usuários

Aluno
  └── Não pode criar usuários
```
