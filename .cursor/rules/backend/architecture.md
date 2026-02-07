---
description: Arquitetura DDD/Clean Architecture - camadas, dependency injection e padrões
alwaysApply: false
---

# Backend Architecture - DDD & Clean Architecture

## Separação de Camadas

### Domain Layer (Núcleo)

**Responsabilidade**: Lógica de negócio pura, independente de frameworks

**Componentes**:
- **Entities**: Objetos de negócio principais (User, WorkoutPlan, MealPlan)
- **Value Objects**: Objetos imutáveis (Email, Password, Weight, Height)
- **Repository Interfaces**: Contratos para acesso a dados
- **Domain Services**: Lógica de negócio que não pertence a uma entidade
- **Domain Events**: Eventos disparados por operações de negócio

**Regras**:
- ❌ Nenhuma importação de frameworks ou infraestrutura
- ✅ Apenas lógica de negócio pura
- ✅ TypeScript puro com tipos explícitos

### Application Layer (Casos de Uso)

**Responsabilidade**: Orquestração de lógica de negócio

**Componentes**:
- **Use Cases**: Regras de aplicação específicas
- **DTOs**: Estruturas de dados para input/output
- **Interfaces/Ports**: Contratos para serviços externos (AI, Storage)
- **Application Services**: Coordenação de múltiplos use cases

**Regras**:
- ✅ Depende apenas de interfaces do domain
- ✅ Um use case = uma responsabilidade
- ✅ Injeção de dependências via construtor

### Infrastructure Layer (Implementação)

**Responsabilidade**: Detalhes técnicos e dependências externas

**Componentes**:
- **Database**: Prisma ORM, implementações de repositórios
- **HTTP**: Fastify server, routes, controllers
- **AI Providers**: Integrações Claude/GPT
- **Storage**: S3/R2 para arquivos
- **Cache**: Redis
- **Queue**: BullMQ para jobs em background

**Regras**:
- ✅ Implementa interfaces do domain/application
- ✅ Lida com todos os detalhes técnicos
- ✅ Pode importar frameworks e bibliotecas externas

## Dependency Injection

### Container Setup

```typescript
// src/config/di-container.ts
import { Container } from 'inversify';
import { TYPES } from './types';

export function createContainer(): Container {
  const container = new Container();
  
  // Repositories
  container.bind(TYPES.UserRepository).to(PrismaUserRepository);
  container.bind(TYPES.WorkoutPlanRepository).to(PrismaWorkoutPlanRepository);
  
  // Services
  container.bind(TYPES.AIService).to(ClaudeAIService);
  container.bind(TYPES.AuthService).to(JWTAuthService);
  
  // Use Cases
  container.bind(TYPES.CreateUserUseCase).to(CreateUserUseCase);
  
  return container;
}
```

### Uso de Decorators

```typescript
import { injectable, inject } from 'inversify';

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject(TYPES.UserRepository) 
    private readonly userRepository: IUserRepository
  ) {}
  
  async execute(dto: CreateUserDTO): Promise<UserResponseDTO> {
    // Implementation
  }
}
```

## Padrões de Implementação

### Entity Pattern

```typescript
export class User {
  private constructor(
    private readonly props: UserProps,
    private readonly id: UniqueEntityID
  ) {}

  public static create(props: UserProps, id?: UniqueEntityID): User {
    // Validations
    return new User(props, id ?? UniqueEntityID.create());
  }

  // Getters
  get userId(): UniqueEntityID { return this.id; }
  get email(): Email { return this.props.email; }

  // Business methods
  public updateName(name: string): void {
    this.props.name = name;
    this.props.updatedAt = new Date();
  }
}
```

### Value Object Pattern

```typescript
export class Email {
  private readonly value: string;

  private constructor(email: string) {
    this.value = email;
  }

  public static create(email: string): Email {
    if (!this.isValid(email)) {
      throw new InvalidEmailError(email);
    }
    return new Email(email.toLowerCase().trim());
  }

  private static isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  public getValue(): string { return this.value; }
  
  public equals(other: Email): boolean {
    return this.value === other.value;
  }
}
```

### Repository Pattern

**Interface (Domain)**:
```typescript
export interface IUserRepository {
  findById(id: UniqueEntityID): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
  delete(id: UniqueEntityID): Promise<void>;
}
```

**Implementação (Infrastructure)**:
```typescript
@injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) {}

  async findById(id: UniqueEntityID): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({
      where: { id: id.toString() }
    });
    return raw ? this.toDomain(raw) : null;
  }

  // Mapper methods
  private toDomain(raw: any): User { /* ... */ }
  private toPersistence(user: User): any { /* ... */ }
}
```

### Use Case Pattern

```typescript
@injectable()
export class CreateUserUseCase {
  constructor(
    @inject(TYPES.UserRepository) 
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: CreateUserDTO): Promise<UserResponseDTO> {
    // 1. Create value objects
    const email = Email.create(dto.email);
    const password = await Password.create(dto.password);

    // 2. Business validation
    const exists = await this.userRepository.exists(email);
    if (exists) throw new UserAlreadyExistsError(dto.email);

    // 3. Create entity
    const user = User.create({ email, password, name: dto.name, /* ... */ });

    // 4. Persist
    await this.userRepository.save(user);

    // 5. Return DTO
    return {
      userId: user.userId.toString(),
      email: user.email.getValue(),
      name: user.name
    };
  }
}
```

## Fluxo de Dados

```
Request → Controller → Use Case → Repository → Database
Response ← Controller ← Use Case ← Repository ← Database
```

### Regras de Dependência

```
Infrastructure → Application → Domain
     ✓              ✓            ✗
  (pode usar)   (pode usar)   (não pode usar nada)
```

**Direção das dependências**: Sempre para dentro (Domain é o núcleo)

## Error Handling

### Domain Errors

```typescript
// src/domain/errors/
export class InvalidEmailError extends Error {
  constructor(email: string) {
    super(`Invalid email: ${email}`);
    this.name = 'InvalidEmailError';
  }
}

export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
    this.name = 'UserAlreadyExistsError';
  }
}
```

### Application Errors

```typescript
// src/application/errors/
export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}
```

## Aggregates

### WorkoutPlan Aggregate

```typescript
// Aggregate Root
export class WorkoutPlan {
  private readonly weeks: WorkoutWeek[];
  
  addWeek(week: WorkoutWeek): void {
    // Business rules for adding weeks
    this.weeks.push(week);
  }
  
  // Aggregate ensures consistency
}

// Aggregate members
export class WorkoutWeek {
  private readonly days: WorkoutDay[];
}

export class WorkoutDay {
  private readonly exercises: Exercise[];
}
```

**Regra**: Sempre acessar membros do agregado através da raiz (WorkoutPlan)

## Checklist de Arquitetura

- [ ] Entities no domain layer não importam nada de infra
- [ ] Interfaces de repositórios definidas no domain
- [ ] Implementações de repositórios na infrastructure
- [ ] Use cases recebem dependências via construtor
- [ ] Value objects são imutáveis
- [ ] Agregados mantêm consistência interna
- [ ] Dependency injection configurado corretamente
- [ ] Cada camada tem responsabilidade clara
