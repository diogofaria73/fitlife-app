import 'reflect-metadata';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { env } from './config/env';

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
    origin: [env.WEB_URL, env.MOBILE_APP_SCHEME],
    credentials: true,
  });

  // Health check endpoint
  server.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    };
  });

  // API routes will be registered here
  // TODO: Register route modules
  // await server.register(authRoutes, { prefix: '/api/v1/auth' });
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
