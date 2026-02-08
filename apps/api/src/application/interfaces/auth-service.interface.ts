/**
 * Token Payload Interface
 * Data encoded in JWT tokens
 */
export interface TokenPayload {
  userId: string;
  email: string;
}

/**
 * Auth Service Interface
 * Handles JWT token generation and validation
 */
export interface IAuthService {
  /**
   * Generates an access token (short-lived)
   * @param payload - User data to encode
   * @returns JWT access token string
   */
  generateAccessToken(payload: TokenPayload): string;

  /**
   * Generates a refresh token (long-lived)
   * @param payload - User data to encode
   * @returns JWT refresh token string
   */
  generateRefreshToken(payload: TokenPayload): string;

  /**
   * Verifies and decodes an access token
   * @param token - JWT token string
   * @returns Decoded payload or null if invalid
   */
  verifyAccessToken(token: string): TokenPayload | null;

  /**
   * Verifies and decodes a refresh token
   * @param token - JWT token string
   * @returns Decoded payload or null if invalid
   */
  verifyRefreshToken(token: string): TokenPayload | null;
}
