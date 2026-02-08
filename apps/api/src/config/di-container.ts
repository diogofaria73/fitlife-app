import 'reflect-metadata';
import { Container } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { TYPES } from './types';

// Domain
import { IUserRepository } from '../domain/repositories/user-repository.interface';

// Application
import { CreateUserUseCase } from '../application/use-cases/auth/create-user.use-case';
import { IAuthService } from '../application/interfaces/auth-service.interface';

// Infrastructure
import { PrismaUserRepository } from '../infrastructure/database/repositories/prisma-user-repository';
import { JWTAuthService } from '../infrastructure/auth/jwt-auth-service';

/**
 * Creates and configures the Dependency Injection container
 * @returns Configured InversifyJS container
 */
export function createContainer(): Container {
  const container = new Container();

  // Database
  const prisma = new PrismaClient();
  container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prisma);

  // Repositories
  container.bind<IUserRepository>(TYPES.UserRepository)
    .to(PrismaUserRepository)
    .inSingletonScope();
  
  // TODO: Bind other repository implementations
  // container.bind(TYPES.WorkoutPlanRepository).to(PrismaWorkoutPlanRepository);
  // container.bind(TYPES.MealPlanRepository).to(PrismaMealPlanRepository);
  // container.bind(TYPES.WorkoutLogRepository).to(PrismaWorkoutLogRepository);
  // container.bind(TYPES.MealLogRepository).to(PrismaMealLogRepository);
  // container.bind(TYPES.ProgressLogRepository).to(PrismaProgressLogRepository);

  // Services
  container.bind<IAuthService>(TYPES.AuthService)
    .to(JWTAuthService)
    .inSingletonScope();
  
  // TODO: Bind other service implementations
  // container.bind(TYPES.AIService).to(ClaudeAIService);
  // container.bind(TYPES.StorageService).to(S3StorageService);
  // container.bind(TYPES.CacheService).to(RedisCacheService);

  // Use Cases
  container.bind<CreateUserUseCase>(TYPES.CreateUserUseCase)
    .to(CreateUserUseCase);
  
  // TODO: Bind other use case implementations
  // container.bind(TYPES.AuthenticateUserUseCase).to(AuthenticateUserUseCase);
  // ... etc

  return container;
}

// Export singleton instance
export const container = createContainer();
