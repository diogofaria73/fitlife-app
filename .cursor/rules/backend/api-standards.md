---
description: Padrões de API REST, controllers, rotas e tratamento de erros
globs: "**/api/**/*.ts"
alwaysApply: false
---

# API Standards - Backend Conventions

## Error Handling

### ❌ BAD
```typescript
try {
  await fetchData();
} catch (e) {
  // Silent fail
}
```

### ✅ GOOD
```typescript
try {
  await fetchData();
} catch (e) {
  logger.error('Failed to fetch data', { error: e, context: { userId } });
  throw new DataFetchError('Unable to retrieve data', { cause: e });
}
```

### Regras de Error Handling

1. **Sempre logue erros** com contexto relevante
2. **Nunca engula exceções** silenciosamente
3. **Lance erros de domínio** apropriados
4. **Inclua stack traces** em desenvolvimento
5. **Sanitize mensagens** em produção

## Controllers

### Estrutura de Controller

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';
import { container } from '@/config/di-container';
import { TYPES } from '@/config/types';

export class UserController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      // 1. Validate input
      const dto = createUserSchema.parse(request.body);

      // 2. Get use case from DI container
      const useCase = container.get<CreateUserUseCase>(
        TYPES.CreateUserUseCase
      );

      // 3. Execute use case
      const result = await useCase.execute(dto);

      // 4. Return response
      return reply.status(201).send({
        success: true,
        data: result
      });
    } catch (error) {
      // Error middleware handles this
      throw error;
    }
  }

  async findById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const useCase = container.get<GetUserUseCase>(TYPES.GetUserUseCase);
    
    const result = await useCase.execute({ userId: id });
    
    return reply.status(200).send({
      success: true,
      data: result
    });
  }
}
```

### Regras de Controllers

- ✅ Controllers apenas orquestram (não contêm lógica de negócio)
- ✅ Validação de input usando Zod schemas
- ✅ Obtenha use cases do container DI
- ✅ Retorne respostas padronizadas
- ✅ Deixe o error middleware tratar exceções

## Routes

### Definição de Rotas

```typescript
import { FastifyInstance } from 'fastify';
import { UserController } from '@/infrastructure/http/controllers/user.controller';
import { authenticate } from '@/infrastructure/http/middlewares/auth.middleware';

export async function userRoutes(fastify: FastifyInstance) {
  const controller = new UserController();

  // Public routes
  fastify.post('/auth/register', controller.create);
  fastify.post('/auth/login', controller.login);

  // Protected routes
  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook('onRequest', authenticate);
    
    protectedRoutes.get('/users/profile', controller.getProfile);
    protectedRoutes.put('/users/profile', controller.updateProfile);
    protectedRoutes.delete('/users/:id', controller.delete);
  });
}
```

### Convenções de Rotas

**Base path**: `/api/v1`

**Recursos**:
- `GET /users` - Listar usuários
- `GET /users/:id` - Obter usuário por ID
- `POST /users` - Criar usuário
- `PUT /users/:id` - Atualizar usuário (completo)
- `PATCH /users/:id` - Atualizar usuário (parcial)
- `DELETE /users/:id` - Deletar usuário

**Status Codes**:
- `200 OK` - Sucesso (GET, PUT, PATCH)
- `201 Created` - Recurso criado (POST)
- `204 No Content` - Sucesso sem corpo (DELETE)
- `400 Bad Request` - Validação falhou
- `401 Unauthorized` - Não autenticado
- `403 Forbidden` - Não autorizado
- `404 Not Found` - Recurso não encontrado
- `409 Conflict` - Conflito (ex: email duplicado)
- `422 Unprocessable Entity` - Erro de lógica de negócio
- `500 Internal Server Error` - Erro do servidor

## Validators (Zod)

### Schema Definition

```typescript
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number'),
  name: z.string().min(2, 'Name must be at least 2 characters')
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided'
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
```

### Validação em Controllers

```typescript
// Inline validation
const dto = createUserSchema.parse(request.body);

// Com tratamento de erro personalizado
try {
  const dto = createUserSchema.parse(request.body);
} catch (error) {
  if (error instanceof z.ZodError) {
    return reply.status(400).send({
      success: false,
      errors: error.errors
    });
  }
  throw error;
}
```

## Use Cases (Application Layer)

### Estrutura de Use Case

```typescript
import { injectable, inject } from 'inversify';

export interface CreateWorkoutPlanDTO {
  userId: string;
  goal: string;
  experienceLevel: string;
  availableDays: string[];
}

export interface WorkoutPlanResponseDTO {
  id: string;
  name: string;
  description: string;
  weeks: WeekDTO[];
}

@injectable()
export class CreateWorkoutPlanUseCase {
  constructor(
    @inject(TYPES.WorkoutPlanRepository)
    private readonly workoutPlanRepository: IWorkoutPlanRepository,
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.AIService)
    private readonly aiService: IAIService
  ) {}

  async execute(dto: CreateWorkoutPlanDTO): Promise<WorkoutPlanResponseDTO> {
    // 1. Validate user exists
    const user = await this.userRepository.findById(
      UniqueEntityID.create(dto.userId)
    );
    if (!user) {
      throw new UserNotFoundError(dto.userId);
    }

    // 2. Generate plan via AI
    const aiResponse = await this.aiService.generateWorkoutPlan({
      userProfile: { /* ... */ }
    });

    // 3. Create domain entity
    const workoutPlan = WorkoutPlan.create({
      userId: user.userId,
      name: aiResponse.name,
      description: aiResponse.description,
      weeks: this.mapWeeks(aiResponse.weeks)
    });

    // 4. Persist
    await this.workoutPlanRepository.save(workoutPlan);

    // 5. Return DTO
    return this.toDTO(workoutPlan);
  }

  private mapWeeks(weeks: any[]): WorkoutWeek[] {
    // Mapping logic
  }

  private toDTO(plan: WorkoutPlan): WorkoutPlanResponseDTO {
    // DTO mapping
  }
}
```

### Regras de Use Cases

- ✅ Um use case = uma responsabilidade
- ✅ Método `execute()` com input DTO e output DTO
- ✅ Validação de regras de negócio
- ✅ Coordenação de múltiplos repositórios/serviços se necessário
- ✅ Lance erros de domínio/aplicação apropriados
- ✅ Sempre retorne DTOs (não entidades do domain)

## Middleware

### Authentication Middleware

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';
import { verify } from 'jsonwebtoken';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return reply.status(401).send({
        success: false,
        error: 'Missing authentication token'
      });
    }

    const decoded = verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    // Attach user to request
    request.user = { userId: decoded.sub };
  } catch (error) {
    return reply.status(401).send({
      success: false,
      error: 'Invalid or expired token'
    });
  }
}
```

### Error Handler Middleware

```typescript
import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Log error
  logger.error('Request error', {
    error,
    path: request.url,
    method: request.method
  });

  // Domain errors
  if (error instanceof UserAlreadyExistsError) {
    return reply.status(409).send({
      success: false,
      error: error.message
    });
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({
      success: false,
      error: error.message
    });
  }

  // Validation errors (Zod)
  if (error.name === 'ZodError') {
    return reply.status(400).send({
      success: false,
      errors: error.issues
    });
  }

  // Default error
  return reply.status(500).send({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message
  });
}
```

## Response Format

### Padrão de Resposta

```typescript
// Success response
{
  "success": true,
  "data": { /* ... */ }
}

// Error response
{
  "success": false,
  "error": "Error message",
  "errors": [ /* validation errors */ ]
}

// Paginated response
{
  "success": true,
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalPages": 5,
    "totalItems": 100
  }
}
```

## Swagger/OpenAPI Documentation

### Decorators para Documentação

```typescript
fastify.post('/users', {
  schema: {
    description: 'Create a new user',
    tags: ['users'],
    body: {
      type: 'object',
      required: ['email', 'password', 'name'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 8 },
        name: { type: 'string', minLength: 2 }
      }
    },
    response: {
      201: {
        description: 'User created successfully',
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              userId: { type: 'string' },
              email: { type: 'string' },
              name: { type: 'string' }
            }
          }
        }
      }
    }
  }
}, controller.create);
```

## Checklist de API Standards

- [ ] Controllers apenas orquestram (sem lógica de negócio)
- [ ] Validação de input com Zod
- [ ] Use cases injetados via DI container
- [ ] Respostas padronizadas (success/error)
- [ ] Status codes HTTP corretos
- [ ] Middleware de autenticação em rotas protegidas
- [ ] Error handling centralizado
- [ ] Logs estruturados com contexto
- [ ] Documentação Swagger/OpenAPI
- [ ] DTOs tipados para input/output
