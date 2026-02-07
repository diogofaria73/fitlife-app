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

## 🚀 Quick Start

### Opção A: Docker (Recomendado) 🐳

```bash
# Iniciar todos os serviços (PostgreSQL, Redis, API)
docker-compose up -d

# Aplicar migrations
docker-compose exec api pnpm db:migrate

# (Opcional) Seed database
docker-compose exec api pnpm db:seed

# Acessar:
# - API: http://localhost:3000
# - Prisma Studio: http://localhost:5555
```

Ver documentação completa em [DOCKER.md](./DOCKER.md)

### Opção B: Instalação Local

#### Pré-requisitos

- Node.js 20+
- pnpm 8+
- PostgreSQL 16
- Redis (opcional para caching)

#### Instalação

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cd apps/api
cp .env.example .env
# Edite .env com suas configurações

# Gerar Prisma Client
cd apps/api
pnpm db:generate

# Rodar migrations
pnpm db:migrate

# Seed database (opcional)
pnpm db:seed
```

### Desenvolvimento

```bash
# Backend API (porta 3000)
cd apps/api
pnpm dev

# Frontend Web (porta 5173)
cd apps/web
pnpm dev

# Frontend Mobile
cd apps/mobile
pnpm start
pnpm android  # ou pnpm ios
```

## 📚 Documentação

- [Docker Setup](./DOCKER.md) - Guia completo Docker
- [GitHub Setup](./GITHUB_SETUP.md) - Informações do repositório
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
# Backend
pnpm --filter @fitlife/api dev         # Dev server
pnpm --filter @fitlife/api test        # Run tests
pnpm --filter @fitlife/api db:studio   # Prisma Studio

# Web
pnpm --filter @fitlife/web dev         # Dev server
pnpm --filter @fitlife/web build       # Build production

# Mobile
pnpm --filter @fitlife/mobile start    # Metro bundler
pnpm --filter @fitlife/mobile android  # Run Android
pnpm --filter @fitlife/mobile ios      # Run iOS

# Root (todos os apps)
pnpm dev        # Dev mode para todos
pnpm build      # Build todos
pnpm test       # Testes em todos
pnpm lint       # Lint todos
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
