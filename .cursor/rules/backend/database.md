---
description: Schema Prisma, migrations, queries e otimizações de banco de dados
globs: "**/prisma/**/*"
alwaysApply: false
---

# Database Standards - Prisma & PostgreSQL

## Schema Prisma

### Convenções de Nomenclatura

**Models (Tabelas)**:
- PascalCase no schema: `User`, `WorkoutPlan`, `MealLog`
- snake_case no banco: `users`, `workout_plans`, `meal_logs`
- Use `@@map("table_name")` para mapear

**Campos**:
- camelCase no schema: `userId`, `createdAt`, `workoutPlanId`
- snake_case no banco: `user_id`, `created_at`, `workout_plan_id`
- Use `@map("column_name")` para mapear

**Exemplo**:
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  createdAt DateTime @default(now()) @map("created_at")
  
  profile UserProfile?
  
  @@map("users")
}
```

### Tipos de Dados

```prisma
// IDs
id String @id @default(uuid())          // UUID preferred
id Int    @id @default(autoincrement()) // For sequences

// Strings
name   String                            // VARCHAR(255)
text   String @db.Text                   // TEXT (unlimited)
email  String @unique                    // Unique constraint

// Numbers
age    Int                               // INTEGER
weight Float                             // DOUBLE PRECISION
price  Decimal @db.Decimal(10, 2)       // DECIMAL(10,2)

// Dates
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
date      DateTime @db.Date              // DATE only

// JSON
metadata Json                            // JSONB in PostgreSQL
settings Json @db.JsonB                  // Explicit JSONB

// Enums
status Status                            // Custom enum
role   Role   @default(USER)            // With default

// Arrays
tags String[]                           // TEXT[]
```

### Relações

#### One-to-One
```prisma
model User {
  id      String      @id @default(uuid())
  profile UserProfile?
}

model UserProfile {
  id     String @id @default(uuid())
  userId String @unique @map("user_id")
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### One-to-Many
```prisma
model User {
  id           String        @id @default(uuid())
  workoutPlans WorkoutPlan[]
}

model WorkoutPlan {
  id     String @id @default(uuid())
  userId String @map("user_id")
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### Many-to-Many (Implicit)
```prisma
model Post {
  id   String @id @default(uuid())
  tags Tag[]
}

model Tag {
  id    String @id @default(uuid())
  posts Post[]
}
```

#### Many-to-Many (Explicit)
```prisma
model User {
  id        String         @id @default(uuid())
  favorites UserFavorite[]
}

model Exercise {
  id        String         @id @default(uuid())
  favorites UserFavorite[]
}

model UserFavorite {
  userId     String   @map("user_id")
  exerciseId String   @map("exercise_id")
  createdAt  DateTime @default(now()) @map("created_at")
  
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  exercise Exercise @relation(fields: [exerciseId], references: [id], onDelete: Cascade)
  
  @@id([userId, exerciseId])
  @@map("user_favorites")
}
```

### Enums

```prisma
enum Gender {
  MALE
  FEMALE
  OTHER
}

enum FitnessGoal {
  LOSE_WEIGHT
  GAIN_MUSCLE
  MAINTAIN_WEIGHT
  IMPROVE_ENDURANCE
}

enum PlanStatus {
  ACTIVE
  ARCHIVED
  DRAFT
}
```

### Indexes

```prisma
model User {
  id    String @id @default(uuid())
  email String @unique
  name  String
  
  workoutLogs WorkoutLog[]
  
  // Single column index
  @@index([name])
  
  @@map("users")
}

model WorkoutLog {
  id     String   @id @default(uuid())
  userId String   @map("user_id")
  date   DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id])
  
  // Composite index (frequently queried together)
  @@index([userId, date])
  
  // Index with sort order
  @@index([date(sort: Desc)])
  
  @@map("workout_logs")
}
```

**Quando criar índices**:
- ✅ Colunas em `WHERE` clauses frequentes
- ✅ Foreign keys (criados automaticamente)
- ✅ Colunas usadas em `ORDER BY`
- ✅ Composite indexes para queries com múltiplas condições
- ❌ Evite índices em tabelas pequenas (<1000 rows)
- ❌ Evite índices em colunas raramente consultadas

### Constraints

```prisma
model User {
  id    String @id @default(uuid())
  email String @unique
  
  @@unique([email], name: "unique_user_email")
}

model WorkoutDay {
  id            String @id @default(uuid())
  workoutWeekId String @map("workout_week_id")
  dayName       String @map("day_name")
  
  // Composite unique constraint
  @@unique([workoutWeekId, dayName])
}
```

## Migrations

### Criar Migração

```bash
# Development - cria migration e aplica
npx prisma migrate dev --name add_user_profile

# Production - apenas aplica migrations existentes
npx prisma migrate deploy

# Reset database (CUIDADO: deleta todos os dados)
npx prisma migrate reset
```

### Boas Práticas de Migrations

1. **Nomes descritivos**: `add_user_profile`, `add_workout_indexes`, `fix_meal_plan_cascade`
2. **Migrations pequenas**: Uma mudança lógica por migration
3. **Testadas localmente**: Sempre teste antes de commit
4. **Reversíveis**: Quando possível, crie migrations que podem ser revertidas
5. **Dados seguros**: Use migrations customizadas para manipular dados

### Migration Manual (SQL)

```sql
-- Create a custom migration file in prisma/migrations
-- Example: 20240101000000_custom_migration/migration.sql

-- Add custom SQL
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);

-- Migrate data
UPDATE workout_plans SET status = 'ACTIVE' WHERE status IS NULL;
```

## Queries Eficientes

### Select Específico

```typescript
// ❌ BAD - traz todas as colunas
const user = await prisma.user.findUnique({
  where: { id: userId }
});

// ✅ GOOD - traz apenas o necessário
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    email: true,
    name: true
  }
});
```

### Evitar N+1 Queries

```typescript
// ❌ BAD - N+1 problem
const users = await prisma.user.findMany();
for (const user of users) {
  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id }
  });
}

// ✅ GOOD - single query com include
const users = await prisma.user.findMany({
  include: {
    profile: true
  }
});
```

### Paginação

```typescript
async function getWorkoutLogs(userId: string, page: number = 1, pageSize: number = 20) {
  const skip = (page - 1) * pageSize;
  
  const [logs, total] = await Promise.all([
    prisma.workoutLog.findMany({
      where: { userId },
      skip,
      take: pageSize,
      orderBy: { date: 'desc' },
      select: {
        id: true,
        date: true,
        completed: true,
        exercises: {
          select: {
            exerciseName: true,
            sets: true
          }
        }
      }
    }),
    prisma.workoutLog.count({ where: { userId } })
  ]);
  
  return {
    data: logs,
    pagination: {
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      totalItems: total
    }
  };
}
```

### Transações

```typescript
// Simple transaction
await prisma.$transaction([
  prisma.user.create({ data: userData }),
  prisma.userProfile.create({ data: profileData })
]);

// Interactive transaction
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: userData });
  
  const profile = await tx.userProfile.create({
    data: {
      ...profileData,
      userId: user.id
    }
  });
  
  // If any operation fails, everything rolls back
  return { user, profile };
});
```

### Batch Operations

```typescript
// Create many
await prisma.exercise.createMany({
  data: exercises.map(e => ({
    workoutDayId: dayId,
    name: e.name,
    sets: e.sets,
    reps: e.reps
  }))
});

// Update many
await prisma.workoutPlan.updateMany({
  where: { userId, status: 'ACTIVE' },
  data: { status: 'ARCHIVED' }
});

// Delete many
await prisma.workoutLog.deleteMany({
  where: {
    userId,
    date: { lt: new Date('2023-01-01') }
  }
});
```

### Raw Queries (quando necessário)

```typescript
// Query raw
const result = await prisma.$queryRaw`
  SELECT u.id, u.name, COUNT(wl.id) as workout_count
  FROM users u
  LEFT JOIN workout_logs wl ON u.id = wl.user_id
  WHERE u.created_at > ${startDate}
  GROUP BY u.id, u.name
  HAVING COUNT(wl.id) > 10
`;

// Execute raw (INSERT, UPDATE, DELETE)
await prisma.$executeRaw`
  UPDATE users
  SET last_active = CURRENT_TIMESTAMP
  WHERE id = ${userId}
`;
```

## Otimizações

### Connection Pooling

```typescript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// DATABASE_URL format:
// postgresql://user:password@localhost:5432/dbname?connection_limit=10&pool_timeout=20
```

### Soft Deletes

```prisma
model User {
  id        String    @id @default(uuid())
  email     String    @unique
  deletedAt DateTime? @map("deleted_at")
  
  @@map("users")
}

// Query helper
const activeUsers = await prisma.user.findMany({
  where: { deletedAt: null }
});
```

### Query Optimization

```typescript
// Use indexes for frequent queries
// Example: Finding active workout plans for a user
await prisma.workoutPlan.findMany({
  where: {
    userId,           // indexed (foreign key)
    status: 'ACTIVE'  // should add index if queried often
  }
});

// Add index in schema:
model WorkoutPlan {
  // ...
  @@index([userId, status])
}
```

## Seeding

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.exercise.deleteMany();
  
  // Seed data
  await prisma.exercise.createMany({
    data: [
      { name: 'Bench Press', muscleGroup: 'Chest', /* ... */ },
      { name: 'Squat', muscleGroup: 'Legs', /* ... */ },
      { name: 'Deadlift', muscleGroup: 'Back', /* ... */ }
    ]
  });
  
  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

```json
// package.json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

## Checklist de Database

- [ ] Nomenclatura consistente (snake_case no DB, camelCase no código)
- [ ] Foreign keys com `onDelete` apropriado (Cascade/SetNull/Restrict)
- [ ] Índices em colunas frequentemente consultadas
- [ ] Unique constraints onde necessário
- [ ] Migrations testadas localmente antes de commit
- [ ] Queries otimizadas (select específico, evitar N+1)
- [ ] Paginação implementada para listas grandes
- [ ] Transações usadas para operações relacionadas
- [ ] Connection pooling configurado
- [ ] Seed scripts para dados iniciais
