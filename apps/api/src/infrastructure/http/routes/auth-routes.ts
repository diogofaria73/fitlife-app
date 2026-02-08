import { FastifyInstance } from 'fastify';
import { container } from '../../../config/di-container';
import { AuthController } from '../controllers/auth-controller';
import { CreateUserUseCase } from '../../../application/use-cases/auth/create-user.use-case';
import { TYPES } from '../../../config/types';

/**
 * Auth Routes
 * Registers authentication endpoints
 */
export async function authRoutes(app: FastifyInstance): Promise<void> {
  // Get use case from DI container
  const createUserUseCase = container.get<CreateUserUseCase>(TYPES.CreateUserUseCase);

  // Instantiate controller
  const authController = new AuthController(createUserUseCase);

  /**
   * POST /auth/register
   * Register a new user
   */
  app.post('/auth/register', {
    schema: {
      tags: ['Authentication'],
      description: 'Register a new user',
      body: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 100,
            description: 'User full name'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address'
          },
          password: {
            type: 'string',
            minLength: 8,
            description: 'User password (min 8 chars, letters + numbers)'
          }
        }
      },
      response: {
        201: {
          description: 'User registered successfully',
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' }
              }
            },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' }
          }
        },
        400: {
          description: 'Validation error',
          type: 'object'
        },
        409: {
          description: 'Email already exists',
          type: 'object'
        }
      }
    }
  }, (request, reply) => authController.register(request, reply));
}
