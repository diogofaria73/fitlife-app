import bcrypt from 'bcryptjs';
import { Result } from '../core/result';

/**
 * Password Value Object
 * Handles password validation and hashing
 */
export class Password {
  private constructor(
    public readonly value: string,
    public readonly hashed: boolean
  ) {}

  /**
   * Creates a Password value object
   * @param password - Raw or hashed password string
   * @param hashed - Whether the password is already hashed
   * @returns Result with Password or error message
   */
  public static create(password: string, hashed: boolean = false): Result<Password> {
    if (!password) {
      return Result.fail<Password>('Password is required');
    }

    // Skip validation if password is already hashed
    if (!hashed) {
      // Minimum length validation
      if (password.length < 8) {
        return Result.fail<Password>('Password must be at least 8 characters');
      }

      // Must contain letters
      const hasLetter = /[a-zA-Z]/.test(password);
      if (!hasLetter) {
        return Result.fail<Password>('Password must contain letters');
      }

      // Must contain numbers
      const hasNumber = /[0-9]/.test(password);
      if (!hasNumber) {
        return Result.fail<Password>('Password must contain numbers');
      }
    }

    return Result.ok<Password>(new Password(password, hashed));
  }

  /**
   * Hashes the password using bcrypt
   * @returns Hashed password string
   */
  public async hash(): Promise<string> {
    if (this.hashed) {
      return this.value;
    }

    const SALT_ROUNDS = 10;
    return bcrypt.hash(this.value, SALT_ROUNDS);
  }

  /**
   * Compares a plain password with this hashed password
   * @param plainPassword - Plain text password to compare
   * @returns True if passwords match
   */
  public async compare(plainPassword: string): Promise<boolean> {
    if (!this.hashed) {
      return false;
    }

    return bcrypt.compare(plainPassword, this.value);
  }
}
