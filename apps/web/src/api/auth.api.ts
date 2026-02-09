import { apiClient } from './client';

/**
 * Register Request Interface
 */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/**
 * Login Request Interface
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Auth Response Interface
 */
export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

/**
 * Register Response Interface
 * @deprecated Use AuthResponse instead
 */
export interface RegisterResponse extends AuthResponse {}

/**
 * Auth API Service
 * Handles authentication-related API calls
 */
export const authApi = {
  /**
   * Registers a new user
   * @param data - User registration data
   * @returns Auth response with user and tokens
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Logs in an existing user
   * @param data - User login credentials
   * @returns Auth response with user and tokens
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  }
};
