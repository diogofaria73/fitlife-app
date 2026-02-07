import 'reflect-metadata';
import { Container } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { TYPES } from './types';

/**
 * Creates and configures the Dependency Injection container
 * @returns Configured InversifyJS container
 */
export function createContainer(): Container {
  const container = new Container();

  // Database
  container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(new PrismaClient());

  // Repositories
  // TODO: Bind repository implementations
  // container.bind(TYPES.UserRepository).to(PrismaUserRepository);
  // container.bind(TYPES.WorkoutPlanRepository).to(PrismaWorkoutPlanRepository);
  // container.bind(TYPES.MealPlanRepository).to(PrismaMealPlanRepository);
  // container.bind(TYPES.WorkoutLogRepository).to(PrismaWorkoutLogRepository);
  // container.bind(TYPES.MealLogRepository).to(PrismaMealLogRepository);
  // container.bind(TYPES.ProgressLogRepository).to(PrismaProgressLogRepository);

  // Services
  // TODO: Bind service implementations
  // container.bind(TYPES.AuthService).to(JWTAuthService);
  // container.bind(TYPES.AIService).to(ClaudeAIService);
  // container.bind(TYPES.StorageService).to(S3StorageService);
  // container.bind(TYPES.CacheService).to(RedisCacheService);

  // Use Cases
  // TODO: Bind use case implementations
  // container.bind(TYPES.CreateUserUseCase).to(CreateUserUseCase);
  // container.bind(TYPES.AuthenticateUserUseCase).to(AuthenticateUserUseCase);
  // ... etc

  return container;
}

// Export singleton instance
export const container = createContainer();
