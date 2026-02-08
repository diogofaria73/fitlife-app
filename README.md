# FitLife - AI-Powered Fitness & Nutrition App

Aplicação fullstack de fitness personalizada com geração de planos de treino e nutrição usando IA.

## 🏗️ Estrutura do Projeto

```
fitlife-app/
├── apps/
│   ├── api/          # Backend API (Node.js + Fastify + Prisma)
│   ├── web/          # Frontend Web (React + Vite)
│   └── mobile/       # Frontend Mobile (React Native)
└── packages/
    └── shared/       # Código compartilhado (types, utils)
```

## 💻 Tech Stack

### Database & ORM

- **Prisma 5.22.0** - ORM moderno e type-safe para PostgreSQL
- **PostgreSQL 16** - Banco de dados relacional

**Configuração:**
- Schema: `apps/api/prisma/schema.prisma`
- Migrations: `apps/api/prisma/migrations/`
- Cliente gerado automaticamente com type-safety completo

**Comandos úteis:**
```bash
cd apps/api
pnpm db:generate    # Gera Prisma Client
pnpm db:migrate     # Aplica migrations
pnpm db:studio      # Abre Prisma Studio (GUI)
pnpm db:seed        # Popula banco com dados
```

---

## 🚀 Quick Start

### Opção A: Execução Local (Recomendado para Desenvolvimento) ⚡

Executa API e Web **localmente** (fora do Docker) com hot reload completo. Serviços de infraestrutura (PostgreSQL, Redis) sempre rodam em Docker.

```bash
# 1. Setup automático
./setup.sh

# Ou usando pnpm
pnpm setup
```

O script irá:
1. ✅ Validar pré-requisitos (Node.js, pnpm, Docker)
2. 📦 Instalar todas as dependências
3. 📝 Criar arquivos `.env` com valores padrão
4. 🐳 Iniciar serviços Docker (PostgreSQL, Redis)
5. 🗄️ Configurar banco de dados (Prisma migrations)
6. 🎯 Menu interativo para escolher quais apps executar **localmente**

**Opções do menu:**
- Todas as aplicações (API + Web + Mobile)
- API + Web
- API + Mobile
- Somente API
- Somente Web
- Somente Mobile
- Sair (setup completo, não executar)

**Modo não-interativo com flags:**
```bash
./setup.sh --api --web        # Apenas API e Web (local)
./setup.sh --api              # Apenas API (local)
./setup.sh --clean --api      # Limpar e reinstalar, depois rodar API
```

**Desenvolvimento após setup:**
```bash
# Rodar API e Web juntos
pnpm dev

# Rodar separadamente
pnpm dev:api          # Apenas API local
pnpm dev:web          # Apenas Web local

# Gerenciar serviços Docker (PostgreSQL, Redis)
pnpm services:up      # Subir serviços
pnpm services:down    # Parar serviços
```

**Para parar tudo:**
```bash
./stop.sh
# ou
pnpm stop
```

---

### Opção B: Execução Full-Docker (Explícita) 🐳

Executa **tudo** em Docker (API, Web, PostgreSQL, Redis). Útil para testar em ambiente isolado ou CI/CD.

```bash
# Setup para Docker
./setup.sh --docker

# Ou usando pnpm
pnpm setup:docker
```

**Ou manualmente:**
```bash
# Subir todos os serviços
docker compose --profile docker-apps up -d

# Ver logs
docker logs -f fitlife-api
docker logs -f fitlife-web

# Acessar:
# - API: http://localhost:3001
# - Web: http://localhost:5173
# - Prisma Studio: docker compose --profile tools up prisma-studio
```

**Comandos Docker úteis:**
```bash
pnpm dev:docker          # API + Web no Docker
pnpm dev:docker:api      # Apenas API no Docker
pnpm dev:docker:web      # Apenas Web no Docker
```

---

### Comandos Úteis

```bash
# Gerenciar serviços de infraestrutura
pnpm services:up         # PostgreSQL + Redis
pnpm services:down       # Parar PostgreSQL + Redis

# Parar tudo (local e Docker)
pnpm stop

# Prisma Studio (GUI de banco de dados)
cd apps/api && pnpm db:studio
```

---

## 📚 Documentação

### API Documentation

A documentação interativa da API está disponível via Swagger UI:

**Local:** http://localhost:3001/docs

A documentação é gerada automaticamente a partir dos schemas OpenAPI definidos nas rotas.

**Endpoints disponíveis:**
- **Swagger UI:** `http://localhost:3001/docs`
- **OpenAPI JSON:** `http://localhost:3001/docs/json`
- **OpenAPI YAML:** `http://localhost:3001/docs/yaml`

### Estrutura de Documentação

Toda documentação está organizada em `apps/docs/`:

- **[Documentação Técnica](./apps/docs/tech_docs/)** - Setup, arquitetura, APIs, DevOps
  - [001 - Setup Guide](./apps/docs/tech_docs/001-setup-guide.md)
  
- **[Documentação de Negócio](./apps/docs/business_docs/)** - Requisitos, fluxos, regras de negócio

### Regras de Documentação

- Arquivos numerados: `001-nome-descritivo.md`
- Usar kebab-case para nomes
- Separar documentação técnica de negócio
- Ver [regras completas](./.cursor/rules/standards/documentation.md)

### Outras Documentações

- [Cursor Rules](./.cursor/rules/README.md) - Regras e convenções do projeto
- [Backend Architecture](./.cursor/rules/backend/architecture.md) - Arquitetura DDD
- [API Standards](./.cursor/rules/backend/api-standards.md) - Padrões de API
- [Implementation Guide](./.cursor/rules/ai-pipeline/implementation.md) - Guia de implementação

## 🏛️ Arquitetura

O projeto segue **Domain-Driven Design (DDD)** e **Clean Architecture**:

- **Domain Layer**: Lógica de negócio pura (entities, value objects)
- **Application Layer**: Casos de uso e orquestração
- **Infrastructure Layer**: Implementações técnicas (Prisma, Fastify, AI)

## 🛠️ Tech Stack

### Backend
- Node.js 20 + TypeScript
- Fastify 4 (API framework)
- Prisma 5 (ORM)
- PostgreSQL 16
- Redis (caching)
- InversifyJS (DI)
- Vitest (testes)

### Frontend Web
- React 18 + Vite
- TypeScript
- Tailwind CSS + shadcn/ui
- Zustand (state)
- React Query (data fetching)
- React Router 6

### Frontend Mobile
- React Native 0.73
- TypeScript
- React Navigation 6
- React Native Paper
- Zustand + React Query

### AI
- Anthropic Claude (Haiku)
- OpenAI GPT-4o-mini (fallback)

## 📝 Scripts Úteis

```bash
# ===== DESENVOLVIMENTO LOCAL (Recomendado) =====

# Rodar API e Web juntos
pnpm dev

# Rodar separadamente
pnpm dev:api          # Backend API local
pnpm dev:web          # Frontend Web local

# Serviços Docker (PostgreSQL, Redis)
pnpm services:up      # Subir serviços
pnpm services:down    # Parar serviços

# ===== DESENVOLVIMENTO DOCKER (Explícito) =====

pnpm dev:docker          # API + Web no Docker
pnpm dev:docker:api      # Apenas API no Docker
pnpm dev:docker:web      # Apenas Web no Docker

# ===== BACKEND =====

cd apps/api
pnpm dev              # Dev server local
pnpm test             # Run tests
pnpm db:studio        # Prisma Studio
pnpm db:generate      # Gerar Prisma Client
pnpm db:migrate       # Rodar migrations

# ===== WEB =====

cd apps/web
pnpm dev              # Dev server local
pnpm build            # Build production

# ===== MOBILE =====

cd apps/mobile
pnpm start            # Metro bundler
pnpm android          # Run Android
pnpm ios              # Run iOS

# ===== MONOREPO =====

pnpm build            # Build todos os apps
pnpm test             # Testes em todos
pnpm lint             # Lint todos
```

## 🧪 Testes

```bash
# Backend
cd apps/api
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # Coverage report
```

## 🗄️ Database

```bash
# Migrations
pnpm db:migrate          # Create and apply migration
pnpm db:migrate:deploy   # Apply migrations (production)

# Prisma Studio (GUI)
pnpm db:studio

# Seed
pnpm db:seed
```

## 📦 Packages

- `@fitlife/api` - Backend API
- `@fitlife/web` - Frontend Web
- `@fitlife/mobile` - Frontend Mobile
- `@fitlife/shared` - Shared types and utils

## 🤝 Contribuindo

1. Leia as [Cursor Rules](./.cursor/rules/README.md)
2. Siga [Code Style](./.cursor/rules/standards/code-style.md)
3. Use [Conventional Commits](./.cursor/rules/standards/git-workflow.md)
4. Mantenha testes com 70%+ coverage

## 📄 Licença

Private - All rights reserved

---

**Versão**: 1.0.0  
**Última Atualização**: 2026-02-07
