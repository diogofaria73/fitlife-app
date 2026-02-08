import { User } from '../entities/user';
import { Email } from '../value-objects/email';

/**
 * User Repository Interface
 * Defines the contract for user data persistence
 */
export interface IUserRepository {
  /**
   * Saves a user to the database
   * @param user - User entity to save
   */
  save(user: User): Promise<void>;

  /**
   * Finds a user by email
   * @param email - Email value object
   * @returns User or null if not found
   */
  findByEmail(email: Email): Promise<User | null>;

  /**
   * Finds a user by ID
   * @param id - User ID string
   * @returns User or null if not found
   */
  findById(id: string): Promise<User | null>;

  /**
   * Checks if an email already exists in the database
   * @param email - Email value object
   * @returns True if email exists
   */
  emailExists(email: Email): Promise<boolean>;
}
