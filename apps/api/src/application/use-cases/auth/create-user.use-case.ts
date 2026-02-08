import { injectable, inject } from 'inversify';
import { TYPES } from '../../../config/types';
import { IUserRepository } from '../../../domain/repositories/user-repository.interface';
import { IAuthService } from '../../interfaces/auth-service.interface';
import { User } from '../../../domain/entities/user';
import { Email } from '../../../domain/value-objects/email';
import { Password } from '../../../domain/value-objects/password';
import { CreateUserDTO, AuthResponseDTO } from '../../dtos/auth.dto';
import { UserAlreadyExistsError, ValidationError } from '../../errors';

/**
 * Create User Use Case
 * Handles user registration business logic
 */
@injectable()
export class CreateUserUseCase {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.AuthService)
    private authService: IAuthService
  ) {}

  /**
   * Executes the user creation use case
   * @param dto - User registration data
   * @returns Auth response with user and tokens
   * @throws ValidationError if input is invalid
   * @throws UserAlreadyExistsError if email is already registered
   */
  public async execute(dto: CreateUserDTO): Promise<AuthResponseDTO> {
    // 1. Create and validate Email value object
    const emailOrError = Email.create(dto.email);
    if (emailOrError.isFailure) {
      throw new ValidationError(emailOrError.error!);
    }
    const email = emailOrError.getValue();

    // 2. Create and validate Password value object
    const passwordOrError = Password.create(dto.password);
    if (passwordOrError.isFailure) {
      throw new ValidationError(passwordOrError.error!);
    }
    const password = passwordOrError.getValue();

    // 3. Check if email already exists
    const emailExists = await this.userRepository.emailExists(email);
    if (emailExists) {
      throw new UserAlreadyExistsError('Email already exists');
    }

    // 4. Hash the password
    const hashedPasswordValue = await password.hash();
    const hashedPasswordOrError = Password.create(hashedPasswordValue, true);
    if (hashedPasswordOrError.isFailure) {
      throw new ValidationError(hashedPasswordOrError.error!);
    }
    const hashedPassword = hashedPasswordOrError.getValue();

    // 5. Create User entity
    const userOrError = User.create({
      email,
      password: hashedPassword,
      name: dto.name
    });

    if (userOrError.isFailure) {
      throw new ValidationError(userOrError.error!);
    }
    const user = userOrError.getValue();

    // 6. Save user to repository
    await this.userRepository.save(user);

    // 7. Generate JWT tokens
    const tokenPayload = {
      userId: user.id.toString(),
      email: user.email.value
    };

    const accessToken = this.authService.generateAccessToken(tokenPayload);
    const refreshToken = this.authService.generateRefreshToken(tokenPayload);

    // 8. Return auth response
    return {
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email.value,
        createdAt: user.createdAt
      },
      accessToken,
      refreshToken
    };
  }
}
