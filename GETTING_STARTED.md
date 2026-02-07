# 🚀 Guia de Inicialização Rápida - FitLife

Este guia te leva do zero ao projeto rodando em minutos.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- ✅ Node.js 20+ ([Download](https://nodejs.org/))
- ✅ pnpm 8+ (instale com `npm install -g pnpm`)
- ✅ PostgreSQL 16 ([Download](https://www.postgresql.org/download/))
- ✅ Git

**Opcional mas recomendado:**
- Redis ([Download](https://redis.io/download))
- Docker Desktop ([Download](https://www.docker.com/products/docker-desktop))

## 🎯 Início Rápido (5 minutos)

### 1️⃣ Instalar Dependências

```bash
# Na raiz do projeto
pnpm install
```

Isso irá instalar todas as dependências dos 3 apps (api, web, mobile) e do package shared.

### 2️⃣ Configurar Banco de Dados

#### Opção A: PostgreSQL Local

```bash
# Criar database
createdb fitlife

# Ou via psql
psql -U postgres
CREATE DATABASE fitlife;
\q
```

#### Opção B: Docker (Recomendado)

```bash
# Criar e iniciar PostgreSQL + Redis
docker run -d \
  --name fitlife-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=fitlife \
  -p 5432:5432 \
  postgres:16-alpine

docker run -d \
  --name fitlife-redis \
  -p 6379:6379 \
  redis:7-alpine
```

### 3️⃣ Configurar Variáveis de Ambiente

```bash
cd apps/api
cp .env.example .env
```

Edite `apps/api/.env` com suas configurações:

```env
# Mínimo necessário para iniciar
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fitlife
JWT_SECRET=mude-para-algo-seguro-em-producao

# API Keys (necessárias para AI features)
ANTHROPIC_API_KEY=sk-ant-seu-key-aqui  # Obter em https://console.anthropic.com/
OPENAI_API_KEY=sk-seu-key-aqui          # Obter em https://platform.openai.com/

# Resto pode usar defaults do .env.example
```

### 4️⃣ Setup Prisma

```bash
cd apps/api

# Gerar Prisma Client
pnpm db:generate

# Criar e aplicar migrations
pnpm db:migrate

# Verificar no Prisma Studio (opcional)
pnpm db:studio
# Abre em http://localhost:5555
```

### 5️⃣ Iniciar o Backend

```bash
cd apps/api
pnpm dev
```

Você deve ver:
```
🚀 Server running on http://localhost:3000
📚 Environment: development
```

Teste o health check:
```bash
curl http://localhost:3000/health
```

### 6️⃣ Iniciar o Frontend Web (opcional)

Em outro terminal:

```bash
cd apps/web
pnpm dev
```

Abre em http://localhost:5173

### 7️⃣ Iniciar Mobile (opcional)

```bash
cd apps/mobile

# iOS
pnpm ios

# Android
pnpm android
```

## ✅ Verificações

### Backend está rodando?

```bash
# Health check
curl http://localhost:3000/health

# Resposta esperada:
# {"status":"ok","timestamp":"...","environment":"development"}
```

### Database está conectado?

```bash
cd apps/api
pnpm db:studio
```

Deve abrir Prisma Studio sem erros.

### Prisma Client gerado?

```bash
ls apps/api/node_modules/.prisma/client
# Deve existir
```

## 🐛 Troubleshooting

### ❌ Erro: "Can't reach database server"

**Problema**: PostgreSQL não está rodando

**Solução**:
```bash
# Verificar se PostgreSQL está rodando
pg_isready

# macOS (via Homebrew)
brew services start postgresql@16

# Docker
docker start fitlife-postgres

# Ubuntu
sudo systemctl start postgresql
```

### ❌ Erro: "Environment variable not found: DATABASE_URL"

**Problema**: Arquivo .env não existe ou está vazio

**Solução**:
```bash
cd apps/api
cp .env.example .env
# Editar .env com suas configurações
```

### ❌ Erro: "Prisma Client not found"

**Problema**: Prisma Client não foi gerado

**Solução**:
```bash
cd apps/api
pnpm db:generate
```

### ❌ Erro: "Cannot find module '@/*'"

**Problema**: Path aliases não configurados

**Solução**:
```bash
# Limpar e reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### ❌ Erro: Port 3000 already in use

**Problema**: Porta já está sendo usada

**Solução**:
```bash
# Encontrar processo
lsof -ti:3000

# Matar processo
kill -9 $(lsof -ti:3000)

# Ou alterar porta no .env
PORT=3001
```

## 📚 Próximos Passos

Agora que tudo está rodando, comece a implementar:

### 1. Domain Layer (Primeira Fase)

Consulte: `.cursor/rules/ai-pipeline/implementation.md` - FASE 2

Use os templates em: `.cursor/rules/ai-pipeline/prompts.md`

**Criar primeiro**:
1. Value Objects (Email, Password)
2. Entities (User)
3. Repository Interface (IUserRepository)

### 2. Application Layer

1. DTOs (CreateUserDTO, UserResponseDTO)
2. Use Cases (CreateUserUseCase, AuthenticateUserUseCase)

### 3. Infrastructure Layer

1. Repository Implementation (PrismaUserRepository)
2. Controllers (UserController)
3. Routes (auth.routes.ts)

## 🛠️ Scripts Úteis

```bash
# Backend
cd apps/api
pnpm dev              # Dev server
pnpm build            # Build para produção
pnpm test             # Rodar testes
pnpm test:watch       # Testes em watch mode
pnpm test:coverage    # Coverage report
pnpm lint             # Lint código
pnpm type-check       # Type check

# Database
pnpm db:migrate       # Criar migration
pnpm db:generate      # Gerar Prisma Client
pnpm db:studio        # Abrir Prisma Studio
pnpm db:seed          # Seed database

# Web
cd apps/web
pnpm dev              # Dev server
pnpm build            # Build
pnpm preview          # Preview build

# Mobile
cd apps/mobile
pnpm start            # Metro bundler
pnpm android          # Run Android
pnpm ios              # Run iOS
```

## 📖 Documentação

- **Cursor Rules**: [.cursor/rules/README.md](./.cursor/rules/README.md)
- **Backend Architecture**: [.cursor/rules/backend/architecture.md](./.cursor/rules/backend/architecture.md)
- **API Standards**: [.cursor/rules/backend/api-standards.md](./.cursor/rules/backend/api-standards.md)
- **Database**: [.cursor/rules/backend/database.md](./.cursor/rules/backend/database.md)
- **Implementation Guide**: [.cursor/rules/ai-pipeline/implementation.md](./.cursor/rules/ai-pipeline/implementation.md)
- **Prompt Templates**: [.cursor/rules/ai-pipeline/prompts.md](./.cursor/rules/ai-pipeline/prompts.md)

## 🎓 Recursos de Aprendizado

- [Prisma Docs](https://www.prisma.io/docs)
- [Fastify Docs](https://www.fastify.io/docs)
- [InversifyJS Docs](https://inversify.io/)
- [DDD Pattern](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## 💬 Dúvidas?

1. Consulte a documentação em `.cursor/rules/`
2. Use Cursor AI com `@workspace` para contexto
3. Revise os exemplos nos arquivos de rules

---

**Boa codificação! 🚀**
