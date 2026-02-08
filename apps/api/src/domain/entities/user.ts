import { UniqueEntityID } from '../value-objects/unique-entity-id';
import { Email } from '../value-objects/email';
import { Password } from '../value-objects/password';
import { Result } from '../core/result';

interface UserProps {
  email: Email;
  password: Password;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User Entity
 * Represents an authenticated user in the system
 */
export class User {
  private constructor(
    public readonly id: UniqueEntityID,
    private props: UserProps
  ) {}

  /**
   * Creates a User entity
   * @param props - User properties (without timestamps for new users)
   * @param id - Optional existing ID (for reconstruction from DB)
   * @returns Result with User or error message
   */
  public static create(
    props: Omit<UserProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID
  ): Result<User> {
    // Validate name
    const name = props.name.trim();

    if (name.length < 2) {
      return Result.fail<User>('Name must be at least 2 characters');
    }

    if (name.length > 100) {
      return Result.fail<User>('Name must not exceed 100 characters');
    }

    const now = new Date();
    const user = new User(
      id || UniqueEntityID.create(),
      {
        email: props.email,
        password: props.password,
        name,
        createdAt: now,
        updatedAt: now
      }
    );

    return Result.ok<User>(user);
  }

  // Getters
  public get email(): Email {
    return this.props.email;
  }

  public get password(): Password {
    return this.props.password;
  }

  public get name(): string {
    return this.props.name;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  /**
   * Updates user name
   */
  public updateName(newName: string): Result<void> {
    const trimmedName = newName.trim();

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return Result.fail('Name must be between 2 and 100 characters');
    }

    this.props.name = trimmedName;
    this.props.updatedAt = new Date();

    return Result.ok();
  }
}
