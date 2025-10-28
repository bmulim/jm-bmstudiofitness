# 🏋️‍♂️ JM Studio Fitness - Sistema de Gerenciamento de Academia

Sistema completo de gerenciamento para academias desenvolvido com Next.js 15, React 19 e PostgreSQL. Oferece funcionalidades de administração, cadastro de alunos, check-ins automáticos e controle financeiro.

## 🚀 Funcionalidades Principais

### 👤 **Sistema de Usuários**
- **3 tipos de usuário**: Administrador, Professor e Aluno
- **Autenticação JWT** com tokens seguros e Edge Runtime
- **Middleware de proteção** para rotas administrativas
- **Sistema de logout** com confirmação e limpeza de sessão

### 🎯 **Área Administrativa**
- **Dashboard completo** com estatísticas em tempo real
- **Gerenciamento de alunos** com dados pessoais, financeiros e de saúde
- **Relatórios de check-ins** com filtros por data e aluno
- **Calendário visual** mostrando histórico de frequência
- **Controle de pagamentos** com status e alertas de vencimento

### 📝 **Sistema de Check-ins**
- **Check-in por CPF ou email** com validação automática
- **Restrição por dias úteis** (segunda a sexta-feira)
- **Verificação de pagamentos** antes do check-in
- **Histórico completo** de frequência por aluno
- **Interface responsiva** com feedback visual

### 💰 **Controle Financeiro**
- **Gestão de mensalidades** com valores personalizados
- **Múltiplos métodos de pagamento** (PIX, cartão, dinheiro, etc.)
- **Dias de vencimento** flexíveis (1-10 do mês)
- **Alertas de inadimplência** durante check-ins
- **Relatórios financeiros** integrados

### 🏥 **Dados de Saúde**
- **Ficha completa** de saúde dos alunos
- **Métricas físicas** (altura, peso, IMC automático)
- **Histórico médico** (alergias, medicamentos, lesões)
- **Rotina alimentar** e suplementação
- **Observações do instrutor** (públicas e privadas)

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca de interface de usuário
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de estilização
- **Shadcn/ui** - Componentes de interface
- **Lucide React** - Ícones

### **Backend**
- **Next.js API Routes** - Endpoints da aplicação
- **Server Actions** - Ações do servidor
- **Middleware** - Proteção de rotas
- **JWT (Jose)** - Autenticação compatível com Edge Runtime

### **Banco de Dados**
- **PostgreSQL** - Banco de dados principal
- **Drizzle ORM** - ORM type-safe
- **Schema** estruturado com relacionamentos

### **Segurança**
- **bcryptjs** - Hash de senhas
- **JWT tokens** - Autenticação stateless
- **Middleware** - Proteção de rotas
- **Validação** - Server-side e client-side

## 📁 Estrutura do Projeto

```
📦 jm-bmstudiofitness/
├── 📁 src/
│   ├── 📁 app/                    # App Router do Next.js
│   │   ├── 📁 admin/             # Área administrativa
│   │   │   ├── 📁 checkins/      # Relatórios de check-ins
│   │   │   ├── 📁 dashboard/     # Dashboard principal
│   │   │   └── 📁 login/         # Login administrativo
│   │   ├── 📁 api/               # API Routes
│   │   │   ├── 📁 auth/          # Autenticação
│   │   │   ├── 📁 checkins/      # Endpoints de check-ins
│   │   │   └── 📁 students/      # Endpoints de alunos
│   │   ├── 📁 user/              # Área do usuário
│   │   │   ├── 📁 cadastro/      # Cadastro de alunos
│   │   │   └── 📁 [id]/checkin/  # Check-in individual
│   │   └── layout.tsx            # Layout principal
│   ├── 📁 actions/               # Server Actions
│   │   ├── 📁 admin/             # Ações administrativas
│   │   ├── 📁 auth/              # Ações de autenticação
│   │   └── 📁 user/              # Ações do usuário
│   ├── 📁 components/            # Componentes React
│   │   ├── 📁 Admin/             # Componentes administrativos
│   │   ├── 📁 ui/                # Componentes base (Shadcn)
│   │   └── ...                   # Outros componentes
│   ├── 📁 db/                    # Banco de dados
│   │   ├── schema.ts             # Schema do banco
│   │   ├── seed.ts               # Dados de teste
│   │   └── index.ts              # Configuração do Drizzle
│   ├── 📁 lib/                   # Utilitários
│   │   ├── auth-utils.ts         # Utilitários de autenticação
│   │   ├── auth-edge.ts          # JWT para Edge Runtime
│   │   ├── checkin-utils.ts      # Utilitários de check-in
│   │   └── payment-utils.ts      # Utilitários de pagamento
│   ├── 📁 types/                 # Tipos TypeScript
│   └── middleware.ts             # Middleware de proteção
├── 📁 drizzle/                   # Migrações do banco
├── .env.local                    # Variáveis de ambiente
├── package.json                  # Dependências
└── README.md                     # Este arquivo
```

## ⚙️ Configuração e Instalação

### **Pré-requisitos**
- Node.js 18+ 
- PostgreSQL 14+
- npm/yarn/pnpm

### **1. Clone o repositório**
```bash
git clone https://github.com/bmulim/jm-bmstudiofitness.git
cd jm-bmstudiofitness
```

### **2. Instale as dependências**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### **3. Configure as variáveis de ambiente**
Crie um arquivo `.env.local` na raiz do projeto:

```env
# Banco de dados PostgreSQL
DATABASE_URL="postgresql://usuario:senha@localhost:5432/jm_studio_fitness"

# JWT Secret (use uma chave forte em produção)
JWT_SECRET="sua-chave-secreta-jwt-aqui-mude-em-producao-123456789"
```

### **4. Configure o banco de dados**
```bash
# Execute as migrações
npm run db:push

# Execute o seed para dados de teste
npx tsx src/db/seed.ts
```

### **5. Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

Acesse `http://localhost:3000` no seu navegador.

## 👥 Usuários de Teste

Após executar o seed, você terá os seguintes usuários para teste:

### **👑 Administrador**
- **Email:** `admin@bmstudio.com`
- **Senha:** `admin123`
- **Acesso:** Todas as funcionalidades

### **🎓 Professor**
- **Email:** `maria.professor@bmstudio.com`
- **Senha:** `prof123`
- **Acesso:** Área de professores

### **🏃‍♂️ Alunos de Teste**
- **Ana Costa** - CPF: `123.456.789-01` - Email: `ana.costa@email.com`
- **Bruno Lima** - CPF: `234.567.890-12` - Email: `bruno.lima@email.com`
- **Carla Mendes** - CPF: `345.678.901-23` - Email: `carla.mendes@email.com`
- **Daniel Oliveira** - CPF: `456.789.012-34` - Email: `daniel.oliveira@email.com`

## 🚪 Como Usar o Sistema

### **1. Acesso Administrativo**
1. Acesse `/admin/login`
2. Use as credenciais de administrador
3. Explore o dashboard e funcionalidades

### **2. Check-in de Alunos**
1. Acesse `/user/[id]/checkin` (onde [id] é qualquer número)
2. Digite CPF ou email de um aluno
3. Check-in será processado se:
   - For dia útil (segunda a sexta)
   - Aluno estiver com pagamento em dia
   - Não tiver feito check-in hoje

### **3. Cadastro de Novos Alunos**
1. Acesse `/user/cadastro`
2. Preencha todos os formulários:
   - Dados pessoais
   - Informações de saúde
   - Dados financeiros
3. Aluno será criado e poderá fazer check-ins

### **4. Relatórios de Check-ins**
1. No painel admin, acesse "Check-ins"
2. Pesquise por aluno (nome, CPF ou email)
3. Visualize o calendário com histórico
4. Navegue entre meses para ver frequência

## 🏗️ Arquitetura do Sistema

### **Autenticação**
- JWT tokens com expiração de 7 dias
- Middleware de proteção automática
- Edge Runtime compatibility com biblioteca `jose`
- Logout seguro com limpeza de cookies

### **Banco de Dados**
- **5 tabelas principais:**
  - `tb_users` - Usuários do sistema
  - `tb_personal_data` - Dados pessoais
  - `tb_health_metrics` - Métricas de saúde
  - `tb_financial` - Dados financeiros
  - `tb_check_ins` - Registros de check-ins

### **Validações**
- **Check-ins:** Apenas segunda a sexta-feira
- **Pagamentos:** Verificação antes do check-in
- **Duplicatas:** Máximo 1 check-in por dia
- **Tipos de usuário:** Apenas alunos fazem check-in

### **Segurança**
- Senhas hashadas com bcrypt (12 rounds)
- Tokens JWT seguros
- Middleware de proteção de rotas
- Validação server-side e client-side

## 🎨 Design System

### **Cores Principais**
- **Dourado:** `#C2A537` - Cor principal da marca
- **Preto:** `#1b1b1a` - Fundo principal
- **Cinza:** `#slate-*` - Textos e elementos secundários

### **Componentes**
- Sistema baseado em **Shadcn/ui**
- **Tailwind CSS** para estilização
- **Responsivo** mobile-first
- **Dark theme** por padrão

## 📊 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Build para produção
npm run start        # Inicia servidor de produção

# Qualidade de código
npm run lint         # Executa ESLint

# Banco de dados
npx drizzle-kit push     # Aplica mudanças no schema
npx tsx src/db/seed.ts   # Executa seed de dados de teste
```

## 🐛 Solução de Problemas

### **Erro de conexão com banco**
- Verifique se o PostgreSQL está rodando
- Confirme a `DATABASE_URL` no `.env.local`
- Execute as migrações: `npx drizzle-kit push`

### **Erro de autenticação**
- Limpe os cookies do navegador
- Verifique o `JWT_SECRET` no `.env.local`
- Refaça o login

### **Check-in não funciona**
- Verifique se é dia útil (segunda a sexta)
- Confirme se o aluno existe no sistema
- Verifique se o pagamento está em dia

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: Minha nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Desenvolvido por

**Bruno Mulim** - [GitHub](https://github.com/bmulim)

---

**JM Studio Fitness** - Transformando vidas através da tecnologia e do fitness! 💪
