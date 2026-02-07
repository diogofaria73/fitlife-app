// Symbols for Dependency Injection

export const TYPES = {
  // Database
  PrismaClient: Symbol.for('PrismaClient'),

  // Repositories
  UserRepository: Symbol.for('UserRepository'),
  WorkoutPlanRepository: Symbol.for('WorkoutPlanRepository'),
  MealPlanRepository: Symbol.for('MealPlanRepository'),
  WorkoutLogRepository: Symbol.for('WorkoutLogRepository'),
  MealLogRepository: Symbol.for('MealLogRepository'),
  ProgressLogRepository: Symbol.for('ProgressLogRepository'),

  // Services
  AuthService: Symbol.for('AuthService'),
  AIService: Symbol.for('AIService'),
  StorageService: Symbol.for('StorageService'),
  CacheService: Symbol.for('CacheService'),
  NotificationService: Symbol.for('NotificationService'),

  // Use Cases - User
  CreateUserUseCase: Symbol.for('CreateUserUseCase'),
  AuthenticateUserUseCase: Symbol.for('AuthenticateUserUseCase'),
  GetUserProfileUseCase: Symbol.for('GetUserProfileUseCase'),
  UpdateUserProfileUseCase: Symbol.for('UpdateUserProfileUseCase'),

  // Use Cases - Workout
  GenerateWorkoutPlanUseCase: Symbol.for('GenerateWorkoutPlanUseCase'),
  GetActiveWorkoutPlanUseCase: Symbol.for('GetActiveWorkoutPlanUseCase'),
  UpdateWorkoutPlanUseCase: Symbol.for('UpdateWorkoutPlanUseCase'),
  LogWorkoutUseCase: Symbol.for('LogWorkoutUseCase'),
  GetWorkoutHistoryUseCase: Symbol.for('GetWorkoutHistoryUseCase'),

  // Use Cases - Meal
  GenerateMealPlanUseCase: Symbol.for('GenerateMealPlanUseCase'),
  GetActiveMealPlanUseCase: Symbol.for('GetActiveMealPlanUseCase'),
  UpdateMealPlanUseCase: Symbol.for('UpdateMealPlanUseCase'),
  LogMealUseCase: Symbol.for('LogMealUseCase'),
  GetMealHistoryUseCase: Symbol.for('GetMealHistoryUseCase'),

  // Use Cases - Progress
  RecordProgressUseCase: Symbol.for('RecordProgressUseCase'),
  GetProgressHistoryUseCase: Symbol.for('GetProgressHistoryUseCase'),
  UploadProgressPhotoUseCase: Symbol.for('UploadProgressPhotoUseCase'),
};
