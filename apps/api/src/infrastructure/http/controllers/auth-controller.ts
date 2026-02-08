import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { CreateUserUseCase } from '../../../application/use-cases/auth/create-user.use-case';
import { UserAlreadyExistsError, ValidationError } from '../../../application/errors';

// Zod schema for registration validation
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters'),
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Za-z]/, 'Password must contain letters')
    .regex(/[0-9]/, 'Password must contain numbers')
});

/**
 * Auth Controller
 * Handles HTTP requests for authentication endpoints
 */
export class AuthController {
  constructor(
    private createUserUseCase: CreateUserUseCase
  ) {}

  /**
   * POST /auth/register
   * Registers a new user
   */
  public async register(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      // Validate request body with Zod
      const body = registerSchema.parse(request.body);

      // Execute use case
      const result = await this.createUserUseCase.execute(body);

      // Return 201 Created with auth response
      return reply.status(201).send(result);
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Validation error',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }

      // Handle business logic errors
      if (error instanceof UserAlreadyExistsError) {
        return reply.status(409).send({
          error: error.message,
          code: 'E-AUTH-001'
        });
      }

      if (error instanceof ValidationError) {
        return reply.status(400).send({
          error: error.message,
          code: 'VALIDATION_ERROR'
        });
      }

      // Handle unexpected errors
      console.error('Register error:', error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }
}
