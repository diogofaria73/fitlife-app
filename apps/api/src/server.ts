import 'reflect-metadata';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { env } from './config/env';
import { authRoutes } from './infrastructure/http/routes/auth-routes';

/**
 * Creates and configures Fastify server
 */
async function createServer(): Promise<ReturnType<typeof Fastify>> {
  const server = Fastify({
    logger: {
      level: env.NODE_ENV === 'development' ? 'info' : 'warn',
    },
  });

  // Register CORS
  await server.register(cors, {
    origin: env.NODE_ENV === 'development' 
      ? true  // Allow all origins in development
      : [env.WEB_URL, env.MOBILE_APP_SCHEME],
    credentials: true,
  });

  // Register Swagger
  await server.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'FitLife API',
        description: 'AI-powered fitness and nutrition application API',
        version: '1.0.0',
      },
      servers: [
        {
          url: `http://localhost:${env.PORT}`,
          description: 'Development server',
        },
      ],
      tags: [
        { name: 'Authentication', description: 'User authentication endpoints' },
        { name: 'Health', description: 'Health check endpoints' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  // Register Swagger UI
  await server.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
    staticCSP: false,
  });

  // Health check endpoint
  server.get('/health', {
    schema: {
      tags: ['Health'],
      description: 'Check API health status',
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
            environment: { type: 'string' },
          },
        },
      },
    },
  }, async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    };
  });

  // Register API routes
  await server.register(authRoutes, { prefix: '/api/v1' });
  
  // TODO: Register other route modules
  // await server.register(userRoutes, { prefix: '/api/v1/users' });
  // await server.register(workoutRoutes, { prefix: '/api/v1/workouts' });
  // await server.register(mealRoutes, { prefix: '/api/v1/meals' });
  // await server.register(progressRoutes, { prefix: '/api/v1/progress' });

  return server;
}

/**
 * Starts the server
 */
async function start(): Promise<void> {
  try {
    const server = await createServer();

    await server.listen({
      port: env.PORT,
      host: '0.0.0.0',
    });

    server.log.info(`🚀 Server running on http://localhost:${env.PORT}`);
    server.log.info(`📚 Environment: ${env.NODE_ENV}`);
    server.log.info(`🔗 API endpoint: http://localhost:${env.PORT}/api/v1`);
    server.log.info(`📖 API Documentation: http://localhost:${env.PORT}/docs`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start server if this file is executed directly
if (require.main === module) {
  start();
}

export { createServer, start };
