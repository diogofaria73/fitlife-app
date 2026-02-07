---
description: Guia fase por fase para implementação do FitLife com Cursor AI
alwaysApply: false
---

# AI Implementation Pipeline - Guia Prático

Este guia fornece um roadmap fase por fase para implementar o FitLife usando Cursor AI de forma eficiente.

## Filosofia de Implementação

**Abordagem Bottom-Up**:
1. Backend Core (Domain → Application → Infrastructure)
2. Database & Migrations
3. API Endpoints
4. AI Integration
5. Frontend Web
6. Frontend Mobile
7. Testing & Deployment

## Fases de Implementação

### FASE 1: Setup Inicial (Day 1)

**Objetivo**: Configurar estrutura do projeto e dependências

#### 1.1 Criar Monorepo
- Inicializar pnpm workspace
- Criar estrutura de apps/ e packages/
- Configurar TypeScript, ESLint, Prettier

#### 1.2 Setup Backend API
- Instalar dependências (Fastify, Prisma, Zod, InversifyJS)
- Configurar tsconfig.json
- Criar estrutura de pastas DDD
- Setup variáveis de ambiente

#### 1.3 Setup Prisma
- Inicializar Prisma
- Criar schema completo (usar do technical guide)
- Rodar migração inicial
- Testar com Prisma Studio

**Validação**: Server rodando, DB conectado, migrations aplicadas

---

### FASE 2: Domain Layer (Days 2-3)

**Objetivo**: Implementar lógica de negócio pura

#### 2.1 Value Objects
Criar (nesta ordem):
1. `UniqueEntityID` - Wrapper para UUIDs
2. `Email` - Com validação RFC 5322
3. `Password` - Com bcrypt hashing
4. `Weight`, `Height` - Com validações
5. `Calories`, `Macros` - Valores nutricionais

#### 2.2 Domain Entities
Criar (nesta ordem):
1. `User` - Entidade base
2. `UserProfile` - Dados pessoais e preferências
3. `WorkoutPlan` (aggregate root)
4. `WorkoutWeek`, `WorkoutDay`, `Exercise`
5. `MealPlan` (aggregate root)
6. `MealWeek`, `MealDay`, `Meal`
7. `ProgressLog`, `ProgressPhoto`

#### 2.3 Repository Interfaces
- `IUserRepository`
- `IWorkoutPlanRepository`
- `IMealPlanRepository`
- `IWorkoutLogRepository`
- `IMealLogRepository`
- `IProgressLogRepository`

**Validação**: Testes unitários passando para entities e value objects

---

### FASE 3: Application Layer (Days 4-5)

**Objetivo**: Criar casos de uso e DTOs

#### 3.1 DTOs
Criar para cada recurso:
- CreateDTO (input)
- UpdateDTO (input parcial)
- ResponseDTO (output)
- Schemas Zod para validação

#### 3.2 Use Cases - User Management
1. `CreateUserUseCase`
2. `AuthenticateUserUseCase`
3. `UpdateUserProfileUseCase`
4. `GetUserProfileUseCase`

#### 3.3 Use Cases - Workout
1. `GenerateWorkoutPlanUseCase` (sem AI por enquanto)
2. `GetActiveWorkoutPlanUseCase`
3. `UpdateWorkoutPlanUseCase`
4. `LogWorkoutUseCase`
5. `GetWorkoutHistoryUseCase`

#### 3.4 Use Cases - Nutrition
1. `GenerateMealPlanUseCase` (sem AI por enquanto)
2. `GetActiveMealPlanUseCase`
3. `UpdateMealPlanUseCase`
4. `LogMealUseCase`
5. `GetMealHistoryUseCase`

#### 3.5 Use Cases - Progress
1. `RecordProgressUseCase`
2. `GetProgressHistoryUseCase`
3. `UploadProgressPhotoUseCase`

**Validação**: Testes unitários com mocks passando

---

### FASE 4: Infrastructure Layer (Days 6-8)

**Objetivo**: Implementar detalhes técnicos

#### 4.1 Repository Implementations
Implementar com Prisma:
- `PrismaUserRepository`
- `PrismaWorkoutPlanRepository`
- `PrismaMealPlanRepository`
- `PrismaWorkoutLogRepository`
- `PrismaMealLogRepository`
- `PrismaProgressLogRepository`

Incluir métodos de mapeamento (toDomain/toPersistence)

#### 4.2 Dependency Injection
- Criar symbols em `types.ts`
- Configurar `di-container.ts`
- Registrar todas as dependências

#### 4.3 HTTP Layer (Fastify)
**Controllers**:
- `UserController`
- `WorkoutPlanController`
- `MealPlanController`
- `ProgressController`

**Routes**:
- `auth.routes.ts` (public)
- `user.routes.ts` (protected)
- `workout-plan.routes.ts`
- `meal-plan.routes.ts`
- `progress.routes.ts`

**Middlewares**:
- `auth.middleware.ts` (JWT verification)
- `error-handler.middleware.ts`
- `rate-limit.middleware.ts`

#### 4.4 Authentication Service
- `JWTAuthService`
  - generateAccessToken (15min)
  - generateRefreshToken (7d)
  - verifyToken
  - hashPassword / comparePassword

**Validação**: API funcionando, endpoints testados com Thunder Client/Postman

---

### FASE 5: API & Authentication (Days 9-10)

**Objetivo**: Completar endpoints REST

#### 5.1 Authentication Endpoints
- `POST /auth/register` - 201 + tokens
- `POST /auth/login` - 200 + tokens
- `POST /auth/refresh` - 200 + new access token
- `POST /auth/logout` - 204

#### 5.2 User Profile Endpoints
- `GET /users/profile` - 200 + profile
- `PUT /users/profile` - 200 + updated profile
- `POST /users/profile/complete` - Onboarding

#### 5.3 Documentação Swagger
- Configurar @fastify/swagger
- Documentar todos os endpoints
- Adicionar schemas de validação

#### 5.4 Testes de Integração
- Testes para auth flow completo
- Testes para profile CRUD
- Verificar error handling

**Validação**: Postman collection funcional, testes de integração passando

---

### FASE 6: AI Integration (Days 11-12)

**Objetivo**: Integrar Claude AI para geração de planos

#### 6.1 AI Service Interface
- Criar `IAIService` interface
- Definir tipos para requests/responses
- Definir estrutura de prompts

#### 6.2 Claude AI Implementation
- Instalar `@anthropic-ai/sdk`
- Implementar `ClaudeAIService`
- Criar prompts estruturados:
  - Workout plan generation
  - Meal plan generation
- Parser de JSON responses
- Error handling e retry logic

#### 6.3 GPT Fallback (opcional)
- Implementar `GPTAIService`
- Criar `AIServiceFactory` para fallback automático

#### 6.4 Integrar com Use Cases
- Atualizar `GenerateWorkoutPlanUseCase`
- Atualizar `GenerateMealPlanUseCase`
- Adicionar caching (Redis - 5min)
- Testar geração de planos

**Validação**: Planos sendo gerados via AI, salvos no DB, recuperáveis via API

---

### FASE 7: Frontend Web - Core (Days 13-17)

**Objetivo**: Setup e estrutura base da aplicação web

#### 7.1 Inicializar Projeto
- Vite + React + TypeScript
- Instalar dependências (Router, Query, Zustand, shadcn/ui)
- Configurar Tailwind CSS
- Setup shadcn/ui components

#### 7.2 API Client
- Criar `APIClient` com Axios
- Interceptors para JWT
- Token refresh automático
- Error handling

#### 7.3 State Management
**Zustand stores**:
- `auth.store.ts` (user, tokens, isAuthenticated)
- `ui.store.ts` (theme, sidebar, modals)
- `onboarding.store.ts` (form data, current step)

#### 7.4 React Query Setup
- Configurar QueryClient
- Criar hooks customizados:
  - `useAuth()`
  - `useWorkoutPlans()`
  - `useMealPlans()`
  - `useProgress()`

#### 7.5 Design System
- Configurar theme (cores, spacing, typography)
- Criar componentes base (Button, Card, Input, etc.)
- Definir layouts (DashboardLayout, AuthLayout)

**Validação**: App rodando, design system funcional, API client conectado

---

### FASE 8: Frontend Web - Features (Days 18-22)

**Objetivo**: Implementar páginas e funcionalidades

#### 8.1 Authentication Pages
- `LoginPage` - Email/password form
- `RegisterPage` - Registro com validação
- `ForgotPasswordPage`

#### 8.2 Onboarding Flow
Multi-step wizard:
1. PersonalInfoStep (idade, gênero, altura, peso)
2. GoalsStep (objetivo, peso alvo)
3. ExperienceStep (nível, restrições)
4. EquipmentStep (equipamentos disponíveis)
5. ScheduleStep (dias e tempo disponíveis)
6. NutritionStep (restrições alimentares, refeições/dia)
7. ReviewStep (confirmar tudo)

#### 8.3 Dashboard
- Header com saudação
- Cards de estatísticas
- Today's workout card
- Today's meals card
- Weekly activity chart
- Quick actions

#### 8.4 Workout Features
- `WorkoutPlansPage` - Lista de planos
- `WorkoutPlanDetailPage` - Detalhes do plano
- `WorkoutExecutionPage` - Executar treino
- `WorkoutHistoryPage` - Histórico

#### 8.5 Nutrition Features
- `MealPlansPage` - Plano ativo
- `MealPlanDetailPage` - Detalhes
- `MealTrackingPage` - Rastrear refeições
- `NutritionHistoryPage` - Histórico

#### 8.6 Progress Features
- `ProgressOverviewPage` - Gráficos de evolução
- `RecordProgressPage` - Registrar medidas/fotos
- `ProgressGalleryPage` - Galeria de fotos

**Validação**: Todas as features funcionais, fluxos completos testados

---

### FASE 9: Frontend Mobile - Core (Days 23-27)

**Objetivo**: Setup e estrutura do app mobile

#### 9.1 Inicializar Projeto
- React Native + TypeScript
- Instalar dependências (Navigation, Paper, Query, Zustand)
- Configurar React Native Paper theme
- Link native dependencies

#### 9.2 Navigation
- AuthNavigator (Login, Register)
- OnboardingNavigator (Multi-step)
- MainTabNavigator (5 tabs)
- Nested navigators para features

#### 9.3 Adaptar Serviços
- API Client com MMKV para storage
- Adaptar stores para AsyncStorage
- Handle network connectivity

#### 9.4 Design System
- Theme baseado em Material Design 3
- Componentes base (Button, Card, Input)
- Platform-specific code quando necessário

**Validação**: App rodando em simulador/emulador, navegação funcional

---

### FASE 10: Frontend Mobile - Features (Days 28-32)

**Objetivo**: Implementar funcionalidades mobile

#### 10.1 Auth & Onboarding
- Mesma estrutura do web, adaptada para mobile
- KeyboardAvoidingView
- Native pickers e sliders

#### 10.2 Dashboard
- ScrollView com RefreshControl
- Stats cards (horizontal scroll)
- Today's workout/meals
- Pull-to-refresh

#### 10.3 Workout Execution
- Fullscreen mode
- Set-by-set tracking
- Rest timer com notificações
- Haptic feedback
- Keep screen awake

#### 10.4 Progress com Fotos
- Camera integration (react-native-image-picker)
- Photo comparison view
- Image cropping
- Local caching

**Validação**: App funcional, features principais implementadas

---

### FASE 11: Testing & QA (Days 33-35)

**Objetivo**: Garantir qualidade

#### 11.1 Backend Tests
- Unit tests (entities, value objects, use cases)
- Integration tests (repositories, API)
- Atingir 70% coverage em business logic

#### 11.2 Frontend Tests
- Unit tests (utils, hooks, stores)
- Component tests (React Testing Library)
- E2E tests com Playwright (fluxos críticos)

#### 11.3 Manual Testing
- Testar todos os fluxos end-to-end
- Testar em diferentes dispositivos
- Verificar performance
- Checar acessibilidade

#### 11.4 Bug Fixes
- Corrigir bugs encontrados
- Otimizar performance
- Melhorar UX

**Validação**: Testes passando, bugs críticos corrigidos

---

### FASE 12: Deployment (Days 36-38)

**Objetivo**: Deploy para produção

#### 12.1 Docker Setup
- Dockerfile para backend
- docker-compose.yml
- Multi-stage builds

#### 12.2 CI/CD Pipeline
- GitHub Actions workflows
- Automated tests
- Deploy to Railway/Render (backend)
- Deploy to Vercel (web)

#### 12.3 Environment Configuration
- Production environment variables
- Database migrations em staging/prod
- Monitoring (Sentry)
- Logs (Winston/CloudWatch)

#### 12.4 Mobile Release
- Build iOS (Fastlane)
- Build Android (Gradle)
- Upload to TestFlight
- Upload to Play Console (Internal Testing)

**Validação**: App em produção, funcionando corretamente

---

## Prioridade de Implementação

1. **Backend Core** (Phases 1-4): Foundation crítica
2. **API & Auth** (Phase 5): Base para frontend
3. **AI Integration** (Phase 6): Diferencial do produto
4. **Web Frontend** (Phases 7-8): MVP first
5. **Mobile App** (Phases 9-10): Após web validado
6. **Testing** (Phase 11): Contínuo + sprint final
7. **Deployment** (Phase 12): Release

## Estimativa de Tempo

**Total**: ~38 dias (single developer com Cursor AI)

- Backend: 12 dias
- Frontend Web: 10 dias
- Mobile: 10 dias
- Testing: 3 dias
- Deployment: 3 dias

## Checklists Rápidos

### Antes de Cada Feature
- [ ] Ler documentação relevante
- [ ] Entender arquitetura/padrões
- [ ] Preparar prompt claro para Cursor

### Após Cada Feature
- [ ] Testes escritos e passando
- [ ] Linter sem erros
- [ ] Type-check passando
- [ ] Code review próprio
- [ ] Commit com mensagem clara

### Antes de Merge
- [ ] Todos os testes passando
- [ ] Coverage mínima atingida
- [ ] Documentação atualizada
- [ ] PR description completa
- [ ] Self-review concluído

## Recursos Adicionais

Para prompts específicos e templates, consulte:
- [ai-pipeline/prompts.md](./prompts.md)

Para detalhes técnicos completos:
- [Technical Implementation Guide](../technical_implementation_guide.md)
