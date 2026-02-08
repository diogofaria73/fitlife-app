import { Result } from '../core/result';

/**
 * Email Value Object
 * Encapsulates email validation and normalization logic
 */
export class Email {
  private constructor(public readonly value: string) {}

  /**
   * Creates an Email value object
   * @param email - Raw email string
   * @returns Result with Email or error message
   */
  public static create(email: string): Result<Email> {
    if (!email) {
      return Result.fail<Email>('Email is required');
    }

    // Normalize first: lowercase and trim
    const normalizedEmail = email.toLowerCase().trim();

    // Email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return Result.fail<Email>('Invalid email format');
    }

    return Result.ok<Email>(new Email(normalizedEmail));
  }

  /**
   * Checks equality with another Email
   */
  public equals(other: Email): boolean {
    return this.value === other.value;
  }
}
