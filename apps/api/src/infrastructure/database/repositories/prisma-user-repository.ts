import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { TYPES } from '../../../config/types';
import { IUserRepository } from '../../../domain/repositories/user-repository.interface';
import { User } from '../../../domain/entities/user';
import { Email } from '../../../domain/value-objects/email';
import { Password } from '../../../domain/value-objects/password';
import { UniqueEntityID } from '../../../domain/value-objects/unique-entity-id';

/**
 * Prisma User Repository Implementation
 * Handles user persistence using Prisma ORM
 */
@injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(
    @inject(TYPES.PrismaClient)
    private prisma: PrismaClient
  ) { }

  /**
   * Saves a user to the database
   */
  public async save(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.id.toString(),
        email: user.email.value,
        password: user.password.value,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  }

  /**
   * Finds a user by email
   */
  public async findByEmail(email: Email): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { email: email.value }
    });

    if (!userData) {
      return null;
    }

    return this.toDomain(userData);
  }

  /**
   * Finds a user by ID
   */
  public async findById(id: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!userData) {
      return null;
    }

    return this.toDomain(userData);
  }

  /**
   * Checks if an email already exists
   */
  public async emailExists(email: Email): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email: email.value }
    });

    return count > 0;
  }

  /**
   * Maps Prisma user data to domain User entity
   */
  private toDomain(raw: any): User {
    const emailOrError = Email.create(raw.email);
    const passwordOrError = Password.create(raw.password, true);

    if (emailOrError.isFailure || passwordOrError.isFailure) {
      throw new Error('Invalid user data from database');
    }

    const userOrError = User.create(
      {
        email: emailOrError.getValue(),
        password: passwordOrError.getValue(),
        name: raw.name
      },
      UniqueEntityID.create(raw.id)
    );

    if (userOrError.isFailure) {
      throw new Error(`Failed to reconstruct user: ${userOrError.error}`);
    }

    return userOrError.getValue();
  }
}
