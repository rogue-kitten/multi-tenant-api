import { applicationRoutes } from '@/application/application.routes';
import { applicationSchemas } from '@/application/application.schema';
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
  applicationSchemas.forEach((schema) => {
    app.addSchema(schema);
  });

  /**
   * register routes
   */
  app.register(applicationRoutes, { prefix: '/api/application' });

  return app;
};
