import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { IAuthService, TokenPayload } from '../../application/interfaces/auth-service.interface';

/**
 * JWT Auth Service Implementation
 * Handles JWT token generation and validation using jsonwebtoken
 */
@injectable()
export class JWTAuthService implements IAuthService {
  /**
   * Generates an access token (15 minutes expiry)
   */
  public generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN || '15m'
    } as jwt.SignOptions);
  }

  /**
   * Generates a refresh token (7 days expiry)
   */
  public generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.REFRESH_TOKEN_EXPIRES_IN || '7d'
    } as jwt.SignOptions);
  }

  /**
   * Verifies and decodes an access token
   */
  public verifyAccessToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verifies and decodes a refresh token
   */
  public verifyRefreshToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }
}
