---
description: Estratégias de teste, padrões e requisitos de cobertura
globs: ["**/*.spec.ts", "**/*.test.ts"]
alwaysApply: false
---

# Testing Standards

## Estratégia de Testes

### Pirâmide de Testes

```
        /\
       /  \      E2E Tests (poucos)
      /────\     - Fluxos críticos completos
     /      \    
    /────────\   Integration Tests (moderados)
   /          \  - APIs, repositórios, serviços
  /────────────\ 
 /              \ Unit Tests (muitos)
/────────────────\ - Entidades, value objects, use cases
```

## Tipos de Testes

### Unit Tests

**O que testar**:
- Entidades do domain
- Value objects
- Use cases (com mocks)
- Funções utilitárias puras
- Lógica de negócio isolada

**Frameworks**: Vitest

```typescript
// src/domain/entities/user.entity.spec.ts
import { describe, it, expect } from 'vitest';
import { User } from './user.entity';
import { Email } from '../value-objects/email';
import { Password } from '../value-objects/password';

describe('User Entity', () => {
  describe('create', () => {
    it('should create a valid user', async () => {
      const email = Email.create('test@example.com');
      const password = await Password.create('SecurePass123!');

      const user = User.create({
        email,
        password,
        name: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(user.email.getValue()).toBe('test@example.com');
      expect(user.name).toBe('John Doe');
    });
  });

  describe('validatePassword', () => {
    it('should return true for correct password', async () => {
      const email = Email.create('test@example.com');
      const password = await Password.create('SecurePass123!');
      const user = User.create({ email, password, /* ... */ });

      const isValid = await user.validatePassword('SecurePass123!');

      expect(isValid).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const email = Email.create('test@example.com');
      const password = await Password.create('SecurePass123!');
      const user = User.create({ email, password, /* ... */ });

      const isValid = await user.validatePassword('WrongPassword');

      expect(isValid).toBe(false);
    });
  });

  describe('updateName', () => {
    it('should update user name and updatedAt', async () => {
      const user = User.create({ /* ... */ });
      const originalUpdatedAt = user.updatedAt;

      // Wait to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 10));

      user.updateName('Jane Doe');

      expect(user.name).toBe('Jane Doe');
      expect(user.updatedAt).not.toEqual(originalUpdatedAt);
    });
  });
});
```

### Integration Tests

**O que testar**:
- Repositórios (com banco de teste)
- API endpoints (com servidor de teste)
- Serviços externos (com mocks ou stubs)
- Fluxos entre camadas

**Frameworks**: Vitest + Supertest

```typescript
// src/application/use-cases/create-user.use-case.spec.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { createContainer } from '@/config/di-container';
import { TYPES } from '@/config/types';
import { CreateUserUseCase } from './create-user.use-case';

describe('CreateUserUseCase (Integration)', () => {
  let prisma: PrismaClient;
  let useCase: CreateUserUseCase;

  beforeEach(async () => {
    // Setup test database
    prisma = new PrismaClient({
      datasources: { db: { url: process.env.TEST_DATABASE_URL } }
    });
    
    // Clean database
    await prisma.user.deleteMany();
    
    // Setup DI container
    const container = createContainer();
    useCase = container.get<CreateUserUseCase>(TYPES.CreateUserUseCase);
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  it('should create a new user in database', async () => {
    const result = await useCase.execute({
      email: 'newuser@example.com',
      password: 'SecurePass123!',
      name: 'New User',
    });

    expect(result).toHaveProperty('userId');
    expect(result.email).toBe('newuser@example.com');

    // Verify in database
    const userInDb = await prisma.user.findUnique({
      where: { id: result.userId }
    });
    expect(userInDb).toBeTruthy();
    expect(userInDb?.email).toBe('newuser@example.com');
  });

  it('should throw error if email already exists', async () => {
    // Create first user
    await useCase.execute({
      email: 'duplicate@example.com',
      password: 'SecurePass123!',
      name: 'First User',
    });

    // Try to create duplicate
    await expect(
      useCase.execute({
        email: 'duplicate@example.com',
        password: 'SecurePass123!',
        name: 'Second User',
      })
    ).rejects.toThrow('User already exists');
  });
});
```

### API Tests

```typescript
// src/infrastructure/http/routes/auth.routes.spec.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '@/infrastructure/http/server';

describe('Auth API', () => {
  let server: any;

  beforeAll(async () => {
    server = await app.listen({ port: 0 }); // Random port
  });

  afterAll(async () => {
    await server.close();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(server.server)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'SecurePass123!',
          name: 'Test User',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('userId');
      expect(response.body.data).toHaveProperty('accessToken');
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(server.server)
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: 'SecurePass123!',
          name: 'Test User',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 409 for duplicate email', async () => {
      // Register first user
      await request(server.server)
        .post('/api/v1/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'SecurePass123!',
          name: 'First User',
        });

      // Try duplicate
      const response = await request(server.server)
        .post('/api/v1/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'SecurePass123!',
          name: 'Second User',
        });

      expect(response.status).toBe(409);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with correct credentials', async () => {
      // Create user first
      await request(server.server)
        .post('/api/v1/auth/register')
        .send({
          email: 'login@example.com',
          password: 'SecurePass123!',
          name: 'Login User',
        });

      // Login
      const response = await request(server.server)
        .post('/api/v1/auth/login')
        .send({
          email: 'login@example.com',
          password: 'SecurePass123!',
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
    });

    it('should return 401 for wrong password', async () => {
      const response = await request(server.server)
        .post('/api/v1/auth/login')
        .send({
          email: 'login@example.com',
          password: 'WrongPassword',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/v1/users/profile', () => {
    it('should return user profile with valid token', async () => {
      // Register and get token
      const registerResponse = await request(server.server)
        .post('/api/v1/auth/register')
        .send({
          email: 'profile@example.com',
          password: 'SecurePass123!',
          name: 'Profile User',
        });

      const token = registerResponse.body.data.accessToken;

      // Get profile
      const response = await request(server.server)
        .get('/api/v1/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe('profile@example.com');
    });

    it('should return 401 without token', async () => {
      const response = await request(server.server)
        .get('/api/v1/users/profile');

      expect(response.status).toBe(401);
    });
  });
});
```

### E2E Tests (Frontend)

```typescript
// apps/web/tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should complete registration flow', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Click register link
    await page.click('text=Register');

    // Fill registration form
    await page.fill('input[name="name"]', 'E2E Test User');
    await page.fill('input[name="email"]', 'e2e@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.fill('input[name="confirmPassword"]', 'SecurePass123!');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard');

    // Verify dashboard loaded
    await expect(page.locator('h1')).toContainText('Welcome');
  });

  test('should show error for invalid email', async ({ page }) => {
    await page.goto('http://localhost:5173/register');

    await page.fill('input[name="email"]', 'invalid-email');
    await page.blur('input[name="email"]');

    await expect(page.locator('text=Invalid email')).toBeVisible();
  });
});
```

## Padrões de Teste

### AAA Pattern (Arrange, Act, Assert)

```typescript
it('should calculate BMR correctly', () => {
  // Arrange (setup)
  const weight = 70; // kg
  const height = 175; // cm
  const age = 30;
  const gender = 'male';

  // Act (execute)
  const bmr = calculateBMR(weight, height, age, gender);

  // Assert (verify)
  expect(bmr).toBe(1673.75);
});
```

### Mocking

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('GenerateWorkoutPlanUseCase', () => {
  it('should call AI service and save plan', async () => {
    // Mock repository
    const mockRepository = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
    };

    // Mock AI service
    const mockAIService = {
      generateWorkoutPlan: vi.fn().mockResolvedValue({
        name: 'Test Plan',
        weeks: [],
      }),
    };

    const useCase = new GenerateWorkoutPlanUseCase(
      mockRepository as any,
      mockAIService as any
    );

    await useCase.execute({ userId: '123', /* ... */ });

    // Verify mocks were called
    expect(mockAIService.generateWorkoutPlan).toHaveBeenCalledOnce();
    expect(mockRepository.save).toHaveBeenCalledOnce();
  });
});
```

### Test Data Builders

```typescript
// tests/builders/user.builder.ts
export class UserBuilder {
  private props = {
    email: 'test@example.com',
    password: 'SecurePass123!',
    name: 'Test User',
  };

  withEmail(email: string): UserBuilder {
    this.props.email = email;
    return this;
  }

  withName(name: string): UserBuilder {
    this.props.name = name;
    return this;
  }

  build(): User {
    return User.create({
      email: Email.create(this.props.email),
      password: Password.create(this.props.password),
      name: this.props.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

// Usage
it('should...', () => {
  const user = new UserBuilder()
    .withEmail('custom@example.com')
    .withName('Custom Name')
    .build();
});
```

## Cobertura de Testes

### Requisitos Mínimos

- **Lógica de negócio (domain/application)**: 70% mínimo
- **Controllers**: 60% mínimo
- **Repositories**: 60% mínimo
- **Utilities**: 80% mínimo

### Verificar Cobertura

```bash
# Run tests with coverage
npm run test:coverage

# View coverage report
open coverage/index.html
```

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

## Organização de Testes

### Estrutura de Pastas

```
src/
├── domain/
│   └── entities/
│       ├── user.entity.ts
│       └── user.entity.spec.ts        # Co-located
├── application/
│   └── use-cases/
│       ├── create-user.use-case.ts
│       └── create-user.use-case.spec.ts
└── infrastructure/
    └── database/
        └── repositories/
            ├── prisma-user.repository.ts
            └── prisma-user.repository.spec.ts

tests/
├── integration/
│   ├── api/
│   │   ├── auth.spec.ts
│   │   └── workout.spec.ts
│   └── repositories/
│       └── user.repository.spec.ts
├── e2e/
│   ├── auth.spec.ts
│   └── workout-flow.spec.ts
└── helpers/
    ├── test-database.ts
    └── builders/
        └── user.builder.ts
```

## Setup de Testes

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/index.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Test Setup

```typescript
// tests/setup.ts
import { beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.TEST_DATABASE_URL },
  },
});

beforeAll(async () => {
  // Run migrations on test database
  // execSync('npx prisma migrate deploy');
});

afterAll(async () => {
  await prisma.$disconnect();
});
```

## Checklist de Testes

- [ ] Unit tests para toda lógica de negócio
- [ ] Integration tests para repositórios
- [ ] API tests para todos os endpoints
- [ ] E2E tests para fluxos críticos
- [ ] Cobertura mínima atingida (70% business logic)
- [ ] Testes seguem padrão AAA
- [ ] Mocks usados apropriadamente
- [ ] Test data builders para setup complexo
- [ ] Testes descritivos (describe/it claros)
- [ ] Edge cases cobertos
- [ ] Testes passando antes de commit
- [ ] Sem testes flaky (intermitentes)
