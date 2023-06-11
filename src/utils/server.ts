import { applicationRoutes } from '@/application/application.routes';
import { applicationSchemas } from '@/application/application.schema';
import { userRoutes } from '@/users/users.route';
import { userSchemas } from '@/users/users.schema';
import Fastify from 'fastify';

export const buildServer = async () => {
  const app = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
      },
    },
  });

  /**
   * register plugins
   */

  /**
   * register schemas
   */
  [...applicationSchemas, ...userSchemas].forEach((schema) => {
    app.addSchema(schema);
  });

  /**
   * register routes
   */
  app.register(applicationRoutes, { prefix: '/api/application' });
  app.register(userRoutes, { prefix: '/api/users' });

  return app;
};
