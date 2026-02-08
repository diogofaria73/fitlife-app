/**
 * Create User DTO
 * Input data for user registration
 */
export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

/**
 * User DTO
 * Output data representing a user (without sensitive info)
 */
export interface UserDTO {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

/**
 * Auth Response DTO
 * Output data for authentication endpoints (register/login)
 */
export interface AuthResponseDTO {
  user: UserDTO;
  accessToken: string;
  refreshToken: string;
}
