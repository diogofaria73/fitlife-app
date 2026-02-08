# FitLife - Visão Geral dos Requisitos Funcionais

## Metadata
- **Projeto**: FitLife - AI-Powered Fitness & Nutrition App
- **Versão**: 1.0
- **Última Atualização**: 2026-02-08
- **Status**: Draft
- **Autores**: Equipe FitLife

## 1. Visão Geral do Produto

### 1.1 Descrição

O FitLife é uma aplicação fullstack de fitness e nutrição que utiliza Inteligência Artificial para gerar planos personalizados de treino e alimentação. O sistema analisa o perfil do usuário (idade, peso, altura, objetivos, nível de experiência) e cria programas adaptados às suas necessidades e restrições.

### 1.2 Propósito

Democratizar o acesso a planos de fitness e nutrição personalizados, eliminando a necessidade de personal trainers e nutricionistas caros, enquanto mantém qualidade profissional através do uso de IA avançada.

### 1.3 Público-Alvo

- Iniciantes em fitness buscando orientação
- Praticantes intermediários querendo variar treinos
- Pessoas com restrições alimentares específicas
- Usuários que preferem treinar em casa ou na academia
- Faixa etária: 18-65 anos

## 2. Objetivos do Sistema

### 2.1 Objetivos de Negócio

1. **Acessibilidade**: Tornar fitness personalizado acessível a todos
2. **Personalização**: Adaptar 100% às necessidades individuais
3. **Engajamento**: Manter usuários ativos com conteúdo relevante
4. **Escalabilidade**: Atender milhares de usuários simultaneamente
5. **Qualidade**: Fornecer planos equivalentes a profissionais humanos

### 2.2 Objetivos Técnicos

1. **Performance**: Resposta da API < 200ms (exceto geração de IA)
2. **Disponibilidade**: 99.5% uptime
3. **Segurança**: Proteção de dados pessoais e de saúde (LGPD/GDPR)
4. **Escalabilidade**: Suportar 10K+ usuários ativos
5. **Manutenibilidade**: Arquitetura limpa e bem documentada

## 3. Stakeholders

### 3.1 Primários
- **Usuários Finais**: Pessoas buscando fitness personalizado
- **Equipe de Produto**: Define funcionalidades e prioridades
- **Equipe de Desenvolvimento**: Implementa e mantém o sistema

### 3.2 Secundários
- **Profissionais de Saúde**: Consultoria para validação de algoritmos
- **Investidores**: Interessados no crescimento e métricas
- **Parceiros de Integração**: APIs de pagamento, analytics, etc.

## 4. Escopo do Sistema

### 4.1 Funcionalidades Incluídas (In Scope)

#### Módulo de Autenticação
- Registro com email/senha
- Login e logout
- Refresh tokens (JWT)
- Recuperação de senha

#### Módulo de Perfil
- Criação de perfil personalizado
- Atualização de dados (peso, altura, idade)
- Definição de objetivos fitness
- Configuração de preferências de treino
- Configuração de preferências alimentares

#### Módulo de Treinos
- Geração de planos com IA (Claude/GPT)
- Visualização de planos e exercícios
- Registro de treinos executados
- Histórico de treinos

#### Módulo de Nutrição
- Geração de planos alimentares com IA
- Visualização de planos e refeições
- Registro de refeições consumidas
- Histórico de alimentação

#### Módulo de Progresso
- Registro de medidas corporais
- Gráficos de evolução
- Estatísticas de treinos
- Estatísticas de nutrição

### 4.2 Funcionalidades Excluídas (Out of Scope - v1.0)

- ❌ Integração com wearables (Apple Watch, Fitbit)
- ❌ Rede social / feed comunitário
- ❌ Chat ao vivo com nutricionistas
- ❌ Marketplace de suplementos
- ❌ Vídeos de demonstração de exercícios
- ❌ Gamificação com badges e conquistas
- ❌ Integração com apps terceiros (MyFitnessPal, etc)

## 5. Arquitetura e Tecnologias

### 5.1 Stack Tecnológico

**Backend**:
- Node.js 20 + TypeScript 5.3
- Fastify 4 (REST API)
- Prisma 5.22 + PostgreSQL 16
- Redis (cache)
- BullMQ (filas)
- InversifyJS (DI)

**Frontend Web**:
- React 18 + Vite
- Tailwind CSS + shadcn/ui
- Zustand (state)
- React Query (data fetching)

**Frontend Mobile**:
- React Native 0.73
- React Navigation 6
- React Native Paper

**IA**:
- Anthropic Claude (Haiku) - primário
- OpenAI GPT-4o-mini - fallback

### 5.2 Arquitetura

**DDD (Domain-Driven Design)** + **Clean Architecture**

Camadas:
1. **Domain**: Entidades, Value Objects, Repository Interfaces
2. **Application**: Use Cases, DTOs, Interfaces de serviços
3. **Infrastructure**: Prisma, Fastify, IA, Storage, Cache

Ver documentação detalhada em `.cursor/rules/backend/architecture.md`

## 6. Estrutura da Documentação

Este documento é o índice principal. Requisitos detalhados por módulo:

| Módulo | Documento | Descrição |
|--------|-----------|-----------|
| Autenticação | [002-auth-module-requirements.md](./002-auth-module-requirements.md) | Registro, login, tokens |
| Perfil | [003-profile-module-requirements.md](./003-profile-module-requirements.md) | Dados pessoais, preferências |
| Treinos | [004-workout-module-requirements.md](./004-workout-module-requirements.md) | Geração e registro de treinos |
| Nutrição | [005-nutrition-module-requirements.md](./005-nutrition-module-requirements.md) | Geração e registro de refeições |
| Progresso | [006-progress-module-requirements.md](./006-progress-module-requirements.md) | Métricas e evolução |

## 7. Convenções de Documentação

### 7.1 Formato de IDs

**Requisitos Funcionais**: `RF-[MÓDULO]-[NÚMERO]`
- Exemplo: `RF-AUTH-001`, `RF-WORKOUT-005`

**Regras de Negócio**: `RN-[MÓDULO]-[NÚMERO]`
- Exemplo: `RN-PROFILE-001`

**Casos de Uso**: `UC-[MÓDULO]-[NÚMERO]`
- Exemplo: `UC-AUTH-001`

### 7.2 Priorização (MoSCoW)

- 🔴 **Must Have**: Essencial para MVP
- 🟡 **Should Have**: Importante mas não bloqueante
- 🟢 **Could Have**: Desejável se houver tempo
- ⚪ **Won't Have**: Fora do escopo v1.0

### 7.3 Status dos Requisitos

- 📝 **Draft**: Em elaboração
- ✅ **Approved**: Aprovado para implementação
- 🚧 **In Development**: Em desenvolvimento
- ✔️ **Done**: Implementado e testado
- ⏸️ **On Hold**: Pausado temporariamente
- ❌ **Cancelled**: Cancelado

## 8. Modelos de Dados Principais

Baseado no schema Prisma ([apps/api/prisma/schema.prisma](../../api/prisma/schema.prisma)):

### 8.1 Entidades Core

1. **User** - Usuário do sistema
2. **UserProfile** - Perfil personalizado do usuário
3. **WorkoutPlan** - Plano de treino gerado
4. **Exercise** - Exercício individual
5. **MealPlan** - Plano alimentar gerado
6. **Meal** - Refeição individual
7. **WorkoutLog** - Registro de treino executado
8. **MealLog** - Registro de refeição consumida
9. **ProgressLog** - Registro de medidas corporais
10. **RefreshToken** - Token de autenticação

### 8.2 Enums Importantes

- **Gender**: MALE, FEMALE, OTHER
- **FitnessGoal**: LOSE_WEIGHT, GAIN_MUSCLE, MAINTAIN_WEIGHT, IMPROVE_ENDURANCE
- **ExperienceLevel**: SEDENTARY, BEGINNER, INTERMEDIATE, ADVANCED
- **Equipment**: FULL_GYM, HOME_BASIC, BODYWEIGHT

## 9. Integrações Externas

### 9.1 Serviços de IA

- **Anthropic Claude** (Haiku): Geração de planos (primário)
- **OpenAI GPT-4o-mini**: Fallback caso Claude falhe

### 9.2 Armazenamento

- **AWS S3 / CloudFlare R2**: Upload de fotos de progresso

### 9.3 Cache e Filas

- **Redis**: Cache de planos gerados
- **BullMQ**: Processamento assíncrono de geração de planos

## 10. Requisitos Não-Funcionais

### 10.1 Performance

- RF-NFR-001: API deve responder em < 200ms (exceto IA)
- RF-NFR-002: Geração de plano com IA: < 30 segundos
- RF-NFR-003: Frontend web deve carregar em < 2 segundos

### 10.2 Segurança

- RF-NFR-004: Senhas hasheadas com bcrypt (cost 10)
- RF-NFR-005: JWT com expiração de 15 minutos
- RF-NFR-006: HTTPS obrigatório em produção
- RF-NFR-007: Rate limiting por IP (100 req/min)

### 10.3 Escalabilidade

- RF-NFR-008: Suportar 10K usuários simultâneos
- RF-NFR-009: Database com indexes otimizados
- RF-NFR-010: Cache Redis para queries frequentes

### 10.4 Disponibilidade

- RF-NFR-011: 99.5% uptime
- RF-NFR-012: Health checks a cada 30s
- RF-NFR-013: Graceful shutdown em deploys

### 10.5 Usabilidade

- RF-NFR-014: Interface responsiva (mobile-first)
- RF-NFR-015: Acessibilidade WCAG 2.1 AA
- RF-NFR-016: Suporte a português brasileiro

## 11. Matriz de Rastreabilidade

Relacionamento entre requisitos e implementação:

| RF | Entidade Domain | Use Case | Endpoint API |
|----|-----------------|----------|--------------|
| RF-AUTH-001 | User | CreateUserUseCase | POST /api/v1/auth/register |
| RF-AUTH-002 | User, RefreshToken | AuthenticateUserUseCase | POST /api/v1/auth/login |
| RF-PROFILE-001 | UserProfile | CreateProfileUseCase | POST /api/v1/profiles |
| RF-WORKOUT-001 | WorkoutPlan, Exercise | GenerateWorkoutPlanUseCase | POST /api/v1/workouts/generate |
| RF-NUTRITION-001 | MealPlan, Meal | GenerateMealPlanUseCase | POST /api/v1/meals/generate |

## 12. Glossário

- **AI/IA**: Inteligência Artificial
- **DDD**: Domain-Driven Design
- **DTO**: Data Transfer Object
- **JWT**: JSON Web Token
- **MVP**: Minimum Viable Product
- **ORM**: Object-Relational Mapping
- **RF**: Requisito Funcional
- **RN**: Regra de Negócio
- **UC**: Use Case (Caso de Uso)
- **API**: Application Programming Interface
- **REST**: Representational State Transfer

## 13. Referências

- [Prisma Schema](../../api/prisma/schema.prisma)
- [Backend Architecture](../../../.cursor/rules/backend/architecture.md)
- [API Standards](../../../.cursor/rules/backend/api-standards.md)
- [Implementation Guide](../../../.cursor/rules/ai-pipeline/implementation.md)

## 14. Controle de Versão

| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 2026-02-08 | Equipe FitLife | Versão inicial |

## 15. Próximas Ações

1. ✅ Revisar este overview com equipe de produto
2. 📝 Elaborar requisitos detalhados por módulo (002-006)
3. 🎯 Priorizar requisitos usando MoSCoW
4. 📊 Criar backlog de desenvolvimento
5. 🚀 Iniciar implementação por módulos
