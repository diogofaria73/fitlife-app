---
description: Convenções de nomenclatura, padrões TypeScript e organização de arquivos
alwaysApply: true
---

# Code Style Standards

## Nomenclatura

### TypeScript/JavaScript

**Classes e Interfaces**:
```typescript
// ✅ PascalCase
class UserRepository { }
class CreateUserUseCase { }
interface IUserRepository { }
type UserResponseDTO = { };

// Prefixo 'I' para interfaces
interface IUserRepository { }  // ✅
interface UserRepository { }   // ❌
```

**Funções e Métodos**:
```typescript
// ✅ camelCase
function createUser() { }
function getUserById() { }
async function generateWorkoutPlan() { }

class UserService {
  async findByEmail() { }   // ✅
  async FindByEmail() { }   // ❌
}
```

**Variáveis**:
```typescript
// ✅ camelCase
const userId = '123';
const workoutDuration = 45;
let isAuthenticated = false;

// ❌ Evite
const UserID = '123';
const workout_duration = 45;
```

**Constantes**:
```typescript
// ✅ SCREAMING_SNAKE_CASE
const MAX_LOGIN_ATTEMPTS = 5;
const JWT_EXPIRY_TIME = '15m';
const API_BASE_URL = 'https://api.fitlife.com';

// Para objetos de configuração, use camelCase
const config = {
  maxAttempts: 5,
  jwtExpiry: '15m'
};
```

**Arquivos e Pastas**:
```typescript
// ✅ kebab-case
user.entity.ts
create-user.use-case.ts
workout-plan.repository.ts
user-profile/
value-objects/

// ❌ Evite
UserEntity.ts
CreateUserUseCase.ts
user_entity.ts
```

### React Components

```typescript
// ✅ PascalCase para componentes
function LoginPage() { }
const WorkoutCard = () => { };

// ✅ camelCase para hooks
function useAuth() { }
function useWorkoutPlan() { }

// ✅ PascalCase com sufixo Props
interface LoginPageProps {
  onSuccess: () => void;
}

// Arquivos
LoginPage.tsx           // ✅
WorkoutCard.tsx         // ✅
useAuth.ts              // ✅
useWorkoutPlan.ts       // ✅
```

## TypeScript

### Tipos Explícitos

```typescript
// ❌ BAD - tipos implícitos
function createUser(email, password) {
  return { id: '123', email };
}

// ✅ GOOD - tipos explícitos
function createUser(email: string, password: string): UserResponse {
  return { id: '123', email };
}

// ✅ GOOD - tipos de retorno explícitos
async function getUser(id: string): Promise<User | null> {
  return await userRepository.findById(id);
}
```

### Evite 'any'

```typescript
// ❌ BAD
function processData(data: any) {
  return data.value;
}

// ✅ GOOD - use unknown se o tipo for realmente desconhecido
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Invalid data');
}

// ✅ BETTER - use tipos específicos
interface DataInput {
  value: string;
}

function processData(data: DataInput) {
  return data.value;
}
```

### Interfaces vs Types

```typescript
// ✅ Use interface para shapes de objetos
interface User {
  id: string;
  email: string;
  name: string;
}

// ✅ Use type para unions, intersections, primitivos
type Status = 'active' | 'inactive' | 'pending';
type ID = string | number;
type UserWithProfile = User & { profile: UserProfile };

// ✅ Interfaces podem ser estendidas
interface Employee extends User {
  employeeId: string;
  department: string;
}
```

### Enums vs Union Types

```typescript
// ✅ Use const enum para valores conhecidos em tempo de compilação
const enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING'
}

// ✅ Use union types para tipos mais simples
type Theme = 'light' | 'dark';
type Size = 'sm' | 'md' | 'lg';

// ❌ Evite enums regulares (geram JavaScript extra)
enum Status {  // ❌
  Active,
  Inactive
}
```

### Utility Types

```typescript
// Partial - todos os campos opcionais
type UpdateUserDTO = Partial<CreateUserDTO>;

// Pick - selecionar campos específicos
type UserBasicInfo = Pick<User, 'id' | 'name' | 'email'>;

// Omit - excluir campos
type UserWithoutPassword = Omit<User, 'password'>;

// Required - todos os campos obrigatórios
type CompleteProfile = Required<UserProfile>;

// Record - objeto com keys tipadas
type ErrorMessages = Record<string, string>;
```

## Qualidade de Código

### Extração de Magic Numbers/Strings

```typescript
// ❌ BAD
function isPasswordStrong(password: string): boolean {
  return password.length >= 8 && /[A-Z]/.test(password);
}

if (attempts > 3) {
  throw new Error('Too many attempts');
}

// ✅ GOOD
const MIN_PASSWORD_LENGTH = 8;
const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;
const MAX_LOGIN_ATTEMPTS = 3;

function isPasswordStrong(password: string): boolean {
  return password.length >= MIN_PASSWORD_LENGTH 
    && PASSWORD_UPPERCASE_REGEX.test(password);
}

if (attempts > MAX_LOGIN_ATTEMPTS) {
  throw new Error('Too many attempts');
}
```

### Princípio da Responsabilidade Única

```typescript
// ❌ BAD - múltiplas responsabilidades
class UserService {
  async createUser(data: any) {
    // Validate
    if (!data.email) throw new Error('Invalid email');
    
    // Hash password
    const hash = await bcrypt.hash(data.password, 10);
    
    // Save to DB
    await db.user.create({ ...data, password: hash });
    
    // Send email
    await sendEmail(data.email, 'Welcome!');
  }
}

// ✅ GOOD - separação de responsabilidades
class CreateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private emailService: IEmailService
  ) {}

  async execute(dto: CreateUserDTO): Promise<UserResponse> {
    const email = Email.create(dto.email);
    const password = await Password.create(dto.password);
    
    const user = User.create({ email, password, name: dto.name });
    await this.userRepository.save(user);
    
    await this.emailService.sendWelcome(user.email.getValue());
    
    return this.toDTO(user);
  }
}
```

### Composição sobre Herança

```typescript
// ❌ BAD - herança profunda
class Entity { }
class Person extends Entity { }
class User extends Person { }
class AdminUser extends User { }  // Too deep!

// ✅ GOOD - composição
interface ILogger {
  log(message: string): void;
}

interface IValidator {
  validate(data: unknown): boolean;
}

class UserService {
  constructor(
    private logger: ILogger,
    private validator: IValidator
  ) {}
}
```

### Mensagens de Erro Descritivas

```typescript
// ❌ BAD
throw new Error('Invalid data');
throw new Error('Error');

// ✅ GOOD
throw new Error('Invalid email format: expected format user@domain.com');
throw new UserNotFoundError(`User with ID ${userId} not found`);
throw new ValidationError('Password must contain at least one uppercase letter', {
  field: 'password',
  value: password
});
```

## Organização de Arquivos

### Estrutura de Arquivos

```
src/
├── domain/
│   ├── entities/
│   │   ├── user.entity.ts              # Uma classe por arquivo
│   │   └── workout-plan.entity.ts
│   ├── value-objects/
│   │   ├── email.ts
│   │   └── password.ts
│   └── repositories/
│       └── user.repository.interface.ts
├── application/
│   ├── use-cases/
│   │   └── user/
│   │       ├── create-user.use-case.ts
│   │       └── get-user.use-case.ts
│   └── dtos/
│       └── user/
│           ├── create-user.dto.ts
│           └── user-response.dto.ts
└── infrastructure/
    └── database/
        └── repositories/
            └── prisma-user.repository.ts
```

### Regras de Organização

1. **Um classe/interface por arquivo**
   - ✅ `user.entity.ts` contém apenas `User`
   - ❌ `entities.ts` contém várias entidades

2. **Agrupar por feature**
   ```
   features/
   ├── auth/
   │   ├── components/
   │   ├── hooks/
   │   ├── api/
   │   └── types/
   └── workout/
       ├── components/
       ├── hooks/
       ├── api/
       └── types/
   ```

3. **Manter arquivos pequenos**
   - ✅ Máximo 300 linhas
   - Se ultrapassar, refatore em arquivos menores

4. **Co-localizar testes**
   ```
   src/
   ├── domain/
   │   └── entities/
   │       ├── user.entity.ts
   │       └── user.entity.spec.ts      # Teste ao lado
   ```

### Imports

```typescript
// ✅ Ordem de imports
// 1. External libraries
import React from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal absolute imports
import { User } from '@/domain/entities/user.entity';
import { IUserRepository } from '@/domain/repositories/user.repository.interface';

// 3. Relative imports
import { config } from '../config';
import { logger } from './logger';

// ❌ Evite imports relativos profundos
import { User } from '../../../domain/entities/user.entity';  // BAD

// ✅ Use path aliases
import { User } from '@/domain/entities/user.entity';          // GOOD
```

### Barrel Exports (index.ts)

```typescript
// src/domain/entities/index.ts
export { User } from './user.entity';
export { WorkoutPlan } from './workout-plan.entity';
export { MealPlan } from './meal-plan.entity';

// Usage
import { User, WorkoutPlan } from '@/domain/entities';

// ⚠️ Cuidado: pode causar imports circulares
```

## Formatação

### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### ESLint Rules (principais)

```json
{
  "@typescript-eslint/explicit-function-return-type": "error",
  "@typescript-eslint/no-explicit-any": "error",
  "@typescript-eslint/no-unused-vars": "error",
  "no-console": "warn",
  "prefer-const": "error"
}
```

## Comentários e Documentação

### JSDoc para APIs Públicas

```typescript
/**
 * Creates a new user in the system
 * 
 * @param dto - User creation data
 * @returns Created user information
 * @throws {UserAlreadyExistsError} If email is already registered
 * @throws {InvalidEmailError} If email format is invalid
 * 
 * @example
 * ```typescript
 * const user = await createUserUseCase.execute({
 *   email: 'user@example.com',
 *   password: 'SecurePass123!',
 *   name: 'John Doe'
 * });
 * ```
 */
async execute(dto: CreateUserDTO): Promise<UserResponse> {
  // Implementation
}
```

### Comentários de Código

```typescript
// ✅ GOOD - explica o "porquê"
// Redis cache is used here because this query is expensive
// and the data changes infrequently (< 1x per hour)
const cachedData = await redis.get(cacheKey);

// ❌ BAD - apenas repete o código
// Get data from redis
const cachedData = await redis.get(cacheKey);

// ✅ GOOD - explica lógica complexa
// Calculate BMR using Mifflin-St Jeor equation
// Men: BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age(years) + 5
const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
```

## Checklist de Code Style

- [ ] Nomenclatura consistente (PascalCase, camelCase, kebab-case)
- [ ] Tipos TypeScript explícitos em todas as funções
- [ ] Sem uso de 'any' (use 'unknown' se necessário)
- [ ] Magic numbers/strings extraídos para constantes
- [ ] Um classe/interface por arquivo
- [ ] Arquivos com menos de 300 linhas
- [ ] Imports organizados (external → internal → relative)
- [ ] Path aliases configurados e usados
- [ ] JSDoc em APIs públicas
- [ ] Comentários explicam o "porquê", não o "o quê"
- [ ] Prettier e ESLint configurados
- [ ] Código em inglês
