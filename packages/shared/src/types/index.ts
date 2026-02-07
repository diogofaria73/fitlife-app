// Shared types between frontend and backend

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  age?: number;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  height?: number;
  weight?: number;
  goal?: 'LOSE_WEIGHT' | 'GAIN_MUSCLE' | 'MAINTAIN_WEIGHT' | 'IMPROVE_ENDURANCE';
  level?: 'SEDENTARY' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  availableDays?: string[];
  availableTime?: number;
  equipment?: ('FULL_GYM' | 'HOME_BASIC' | 'BODYWEIGHT')[];
  restrictions?: string[];
  dietaryRestrictions?: string[];
  mealsPerDay?: number;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  weeks: WorkoutWeek[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutWeek {
  id: string;
  weekNumber: number;
  days: WorkoutDay[];
}

export interface WorkoutDay {
  id: string;
  dayName: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  restSeconds: number;
  instructions: string;
  videoUrl?: string;
  order: number;
}

export interface MealPlan {
  id: string;
  userId: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  weeks: MealWeek[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MealWeek {
  id: string;
  weekNumber: number;
  days: MealDay[];
}

export interface MealDay {
  id: string;
  dayName: string;
  meals: Meal[];
}

export interface Meal {
  id: string;
  type: 'BREAKFAST' | 'MORNING_SNACK' | 'LUNCH' | 'AFTERNOON_SNACK' | 'DINNER' | 'EVENING_SNACK';
  name: string;
  ingredients: Array<{ name: string; quantity: string }>;
  instructions: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  order: number;
}

export interface ProgressLog {
  id: string;
  userId: string;
  date: Date;
  weight?: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  leftArm?: number;
  rightArm?: number;
  leftThigh?: number;
  rightThigh?: number;
  notes?: string;
  photos: ProgressPhoto[];
}

export interface ProgressPhoto {
  id: string;
  type: 'FRONT' | 'SIDE' | 'BACK';
  url: string;
  uploadedAt: Date;
}
