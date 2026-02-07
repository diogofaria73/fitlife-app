---
description: Templates de prompts reutilizáveis para desenvolvimento com Cursor AI
alwaysApply: false
---

# AI Prompt Templates

Templates otimizados para uso com Cursor AI no desenvolvimento do FitLife.

## Como Usar

1. Copie o template apropriado
2. Preencha os placeholders `{...}`
3. Adicione contexto específico se necessário
4. Cole no Cursor Chat (Cmd/Ctrl + L)

---

## Template 1: Criar Domain Entity

```
Create a {EntityName} entity in the domain layer with the following requirements:

Business Rules:
- {rule 1}
- {rule 2}
- {rule 3}

Properties:
- {property 1}: {type} - {description}
- {property 2}: {type} - {description}

Value Objects Used:
- {ValueObject1}
- {ValueObject2}

Methods:
- {method1}: {description}
- {method2}: {description}

Follow DDD principles:
1. Pure business logic only
2. No external dependencies
3. Use value objects for validation
4. Immutable where appropriate
5. Clear method names reflecting domain language
6. Private constructor with static create() factory method

Location: apps/api/src/domain/entities/{entity-name}.entity.ts
```

**Exemplo Preenchido**:
```
Create a WorkoutPlan entity in the domain layer with the following requirements:

Business Rules:
- A workout plan must have at least 1 week
- A plan can have maximum 12 weeks
- Only one active plan per user at a time

Properties:
- id: UniqueEntityID - Unique identifier
- userId: UniqueEntityID - Owner of the plan
- name: string - Plan name
- description: string - Plan description
- status: PlanStatus - ACTIVE | ARCHIVED | DRAFT
- weeks: WorkoutWeek[] - Array of workout weeks
- createdAt: Date - Creation timestamp
- updatedAt: Date - Last update timestamp

Value Objects Used:
- UniqueEntityID
- PlanStatus (enum)

Methods:
- addWeek(week: WorkoutWeek): void - Add a week to the plan
- removeWeek(weekNumber: number): void - Remove a specific week
- archive(): void - Archive the plan (change status to ARCHIVED)
- activate(): void - Set plan as active

Follow DDD principles:
1. Pure business logic only
2. No external dependencies
3. Use value objects for validation
4. Immutable where appropriate
5. Clear method names reflecting domain language
6. Private constructor with static create() factory method

Location: apps/api/src/domain/entities/workout-plan.entity.ts
```

---

## Template 2: Criar Use Case

```
Create a {UseCaseName} use case in the application layer:

Purpose:
{Clear description of what this use case does}

Input DTO:
{
  field1: type,
  field2: type
}

Output DTO:
{
  field1: type,
  field2: type
}

Business Logic:
1. {step 1}
2. {step 2}
3. {step 3}

Dependencies (inject via constructor):
- {Repository1}: I{Repository1}
- {Service1}: I{Service1}

Error Cases:
- {ErrorCase1}: throw {ErrorType1}
- {ErrorCase2}: throw {ErrorType2}

Requirements:
- Use @injectable() decorator
- Constructor injection for all dependencies
- Explicit return type Promise<OutputDTO>
- Throw domain errors with descriptive messages
- No framework coupling

Location: apps/api/src/application/use-cases/{feature}/{use-case-name}.use-case.ts
```

**Exemplo Preenchido**:
```
Create a CreateUserUseCase in the application layer:

Purpose:
Register a new user in the system with email/password authentication

Input DTO:
{
  email: string,
  password: string,
  name: string
}

Output DTO:
{
  userId: string,
  email: string,
  name: string,
  createdAt: Date
}

Business Logic:
1. Create Email value object (validates format)
2. Create Password value object (hashes with bcrypt)
3. Check if user with email already exists
4. Create User entity
5. Save user via repository
6. Return UserResponseDTO

Dependencies (inject via constructor):
- userRepository: IUserRepository

Error Cases:
- Email already exists: throw UserAlreadyExistsError
- Invalid email format: throw InvalidEmailError (from Email.create)
- Weak password: throw WeakPasswordError (from Password.create)

Requirements:
- Use @injectable() decorator
- Constructor injection for all dependencies
- Explicit return type Promise<UserResponseDTO>
- Throw domain errors with descriptive messages
- No framework coupling

Location: apps/api/src/application/use-cases/user/create-user.use-case.ts
```

---

## Template 3: Criar Repository Implementation

```
Create a Prisma implementation of I{EntityName}Repository:

Entity: {EntityName}
Interface Location: apps/api/src/domain/repositories/{entity-name}.repository.interface.ts

Methods to implement:
- findById(id: UniqueEntityID): Promise<{Entity} | null>
- save(entity: {Entity}): Promise<void>
- update(entity: {Entity}): Promise<void>
- delete(id: UniqueEntityID): Promise<void>
- {customMethod}: {signature}

Mapper Methods Needed:
- toDomain(raw: PrismaType): {Entity}
- toPersistence(entity: {Entity}): PrismaType

Prisma Model: {ModelName}
Database Table: {table_name}

Requirements:
1. Inject PrismaClient via constructor with @inject(TYPES.PrismaClient)
2. Use @injectable() decorator
3. Handle Prisma errors appropriately
4. Use proper TypeScript types
5. Implement efficient queries (use select/include wisely)
6. Map between domain entities and Prisma types

Location: apps/api/src/infrastructure/database/repositories/prisma-{entity-name}.repository.ts
```

**Exemplo Preenchido**:
```
Create a Prisma implementation of IUserRepository:

Entity: User
Interface Location: apps/api/src/domain/repositories/user.repository.interface.ts

Methods to implement:
- findById(id: UniqueEntityID): Promise<User | null>
- findByEmail(email: Email): Promise<User | null>
- save(user: User): Promise<void>
- update(user: User): Promise<void>
- delete(id: UniqueEntityID): Promise<void>
- exists(email: Email): Promise<boolean>

Mapper Methods Needed:
- toDomain(raw: any): User
- toPersistence(user: User): any

Prisma Model: User
Database Table: users

Requirements:
1. Inject PrismaClient via constructor with @inject(TYPES.PrismaClient)
2. Use @injectable() decorator
3. Handle Prisma errors appropriately
4. Use proper TypeScript types
5. Implement efficient queries (use select/include wisely)
6. Map between domain entities and Prisma types

Location: apps/api/src/infrastructure/database/repositories/prisma-user.repository.ts
```

---

## Template 4: Criar API Endpoints

```
Create REST endpoints for {Resource}:

Base Path: /api/v1/{resource}

Endpoints:
1. POST /{resource} - Create new {resource}
   - Body: {CreateDTO}
   - Response: 201 + {ResourceDTO}
   - Auth: {Required/Optional}

2. GET /{resource}/:id - Get {resource} by ID
   - Response: 200 + {ResourceDTO}
   - Auth: {Required/Optional}

3. PUT /{resource}/:id - Update {resource}
   - Body: {UpdateDTO}
   - Response: 200 + {ResourceDTO}
   - Auth: Required

4. DELETE /{resource}/:id - Delete {resource}
   - Response: 204
   - Auth: Required

Controller Logic:
- Validate input using Zod schemas
- Get use case from DI container
- Execute use case
- Format response
- Handle errors via error middleware

Files to create:
- Controller: apps/api/src/infrastructure/http/controllers/{resource}.controller.ts
- Routes: apps/api/src/infrastructure/http/routes/{resource}.routes.ts
- Validators: apps/api/src/infrastructure/http/validators/{resource}.validator.ts

Reference Prisma schema for field types.
Follow REST conventions and return standardized responses.
```

---

## Template 5: Criar React Component

```
Create a {ComponentName} component for {purpose}:

Type: {Page | Component | Feature}
Location: apps/{web|mobile}/src/{location}

Props Interface:
{
  prop1: type;
  prop2: type;
}

UI Requirements:
- {requirement 1}
- {requirement 2}
- {requirement 3}

State Management:
- Use {useQuery | useMutation | useState} for {purpose}
- Store: {storeName} (if applicable)

API Integration:
- Endpoint: {endpoint}
- Hook: use{ResourceName}()

Styling:
- Web: Tailwind CSS + shadcn/ui components
- Mobile: React Native Paper components

Responsive:
- Mobile-first approach
- Breakpoints: sm, md, lg, xl (web only)

Accessibility:
- Proper ARIA labels
- Keyboard navigation
- Screen reader support

Error Handling:
- Loading state
- Error state
- Empty state

Reference similar components for patterns.
```

**Exemplo Preenchido**:
```
Create a LoginPage component for user authentication:

Type: Page
Location: apps/web/src/pages/auth/LoginPage.tsx

Props Interface:
{
  onSuccess?: () => void;
}

UI Requirements:
- Email input with validation
- Password input (masked) with show/hide toggle
- "Remember me" checkbox
- "Forgot password?" link
- Login button (disabled while loading)
- Link to registration page
- Display error messages clearly

State Management:
- Use useMutation for login action
- Use useAuthStore to save tokens
- Use react-hook-form for form state

API Integration:
- Endpoint: POST /api/v1/auth/login
- Hook: useLogin() from @/features/auth/api/auth-queries.ts

Styling:
- Tailwind CSS + shadcn/ui components
- Use Card, Input, Button, Label from shadcn/ui
- Gradient background
- Glass morphism effect on card
- Smooth animations

Responsive:
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Full screen on mobile
- Centered card on desktop

Accessibility:
- Proper ARIA labels
- Keyboard navigation (Tab to next field, Enter to submit)
- Screen reader support for errors

Error Handling:
- Loading state: Disable button, show spinner
- Error state: Display error message below form
- Success: Navigate to dashboard or onboarding

Reference similar components for patterns.
```

---

## Template 6: Criar Tests

```
Create tests for {Component/UseCase/Repository}:

File: {path}/{filename}.spec.ts

Test Coverage:
□ Happy path scenarios
□ Error cases
□ Edge cases
□ Input validation

For Use Cases:
- Mock all dependencies (repositories, services)
- Test business logic in isolation
- Verify repository/service method calls
- Check error throwing

For Repositories:
- Use test database
- Test CRUD operations
- Verify mappings (domain ↔ persistence)
- Test query performance (if applicable)

For Components:
- Test rendering with different props
- Test user interactions (click, type, submit)
- Test API integration (mocked)
- Test error/loading/empty states

Testing Framework: Vitest
Mocking: vi.fn() / vi.mock()
Assertions: expect()

Minimum coverage: 70% for business logic
```

---

## Template 7: Refatoração

```
Refactor {file/component/module} to improve {aspect}:

Current Issues:
- {issue 1}
- {issue 2}

Desired Outcome:
- {outcome 1}
- {outcome 2}

Constraints:
- Maintain existing functionality
- Keep tests passing
- Follow project conventions
- Don't break API contracts

Approach:
1. {step 1}
2. {step 2}
3. {step 3}

Reference: {relevant docs/patterns}
```

---

## Template 8: Debug

```
I'm experiencing {issue description} in {file/component}.

Context:
- What I'm trying to do: {goal}
- What's happening: {actual behavior}
- What I expected: {expected behavior}
- Error message (if any): {error}

Relevant Code:
{paste code snippet}

Steps to Reproduce:
1. {step 1}
2. {step 2}
3. {step 3}

Please:
1. Analyze the code and identify the issue
2. Explain why it's happening
3. Suggest a fix
4. Show the corrected code

Reference relevant files from the codebase if needed.
```

---

## Template 9: Gerar Migration

```
Create a Prisma migration to {action}:

Changes needed:
- {change 1}
- {change 2}

Schema updates:
{paste relevant schema changes}

Requirements:
- Preserve existing data
- Add proper indexes
- Use appropriate constraints
- Consider cascade deletes

Migration name: {descriptive_name}

Generate the migration and verify it's safe to run.
```

---

## Template 10: Adicionar Feature Completa

```
Implement {FeatureName} feature:

Requirements:
- {requirement 1}
- {requirement 2}
- {requirement 3}

Architecture:
Backend:
- Domain entities: {list}
- Use cases: {list}
- API endpoints: {list}

Frontend:
- Pages/components: {list}
- State management: {approach}
- API integration: {endpoints}

Implementation Order:
1. Backend domain layer
2. Backend application layer
3. Backend infrastructure layer
4. API endpoints
5. Frontend components
6. Integration
7. Tests

Follow project standards:
- DDD architecture
- Conventional commits
- Test coverage >70%
- Type-safe code

Reference: @workspace for existing patterns
```

---

## Dicas de Uso

### 1. Adicione Contexto
```
@workspace Create a User entity following the same pattern as WorkoutPlan entity
```

### 2. Referencie Arquivos
```
@file:user.entity.ts Create similar entity for UserProfile
```

### 3. Use Documentação
```
@docs Based on DDD best practices, create...
```

### 4. Iteração
Se o resultado não for ideal:
```
Refactor the previous code to follow these specific requirements:
- {requirement 1}
- {requirement 2}
```

### 5. Code Review
```
Review the code in @file:user.controller.ts and suggest improvements for:
- Error handling
- Type safety
- Code organization
- Performance
```

## Prompts Comuns

### Setup Inicial
```
Setup a new TypeScript project with:
- Fastify 4.x
- Prisma 5.x
- Vitest
- ESLint + Prettier
- tsconfig with strict mode
- Path aliases (@/*)

Create the folder structure for DDD architecture:
- src/domain
- src/application
- src/infrastructure
```

### Criar Schema Prisma Completo
```
Create a complete Prisma schema for a fitness app with:
- Users (auth, profile)
- Workout plans (weeks, days, exercises)
- Meal plans (weeks, days, meals)
- Progress tracking (logs, photos)
- Proper relations and indexes

Use PostgreSQL, UUIDs for IDs, and snake_case for database names.
```

### Setup DI Container
```
Create an InversifyJS DI container for the fitness app with:
- PrismaClient (singleton)
- All repositories (User, WorkoutPlan, MealPlan, etc.)
- All use cases (Create, Update, Get, Delete)
- Services (AuthService, AIService)

Export TYPES symbols and createContainer function.
```

---

Para implementação fase por fase completa, consulte:
- [implementation.md](./implementation.md)

Para referência técnica completa:
- [Technical Implementation Guide](../technical_implementation_guide.md)
