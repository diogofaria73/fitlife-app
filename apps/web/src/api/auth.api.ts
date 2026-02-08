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
 * Register Response Interface
 */
export interface RegisterResponse {
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
 * Auth API Service
 * Handles authentication-related API calls
 */
export const authApi = {
  /**
   * Registers a new user
   * @param data - User registration data
   * @returns Auth response with user and tokens
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data);
    return response.data;
  }
};
