import { applicationRoutes } from '@/application/application.routes';
import { applicationSchemas } from '@/application/application.schema';
import { userRoutes } from '@/users/users.route';
import { userSchemas } from '@/users/users.schema';
import jwt from '@fastify/jwt';
import Fastify, { FastifyReply, FastifyRequest } from 'fastify';

export const app = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
    },
  },
});

export const buildServer = async () => {
  /**
   * register plugins
   */
  app.register(jwt, { secret: 'sdklfvjnldkfjvndfklsvhbj' });

  /**
   * add decorators
   */
  app.decorate(
    'auth',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (error) {
        app.log.error(error);
        reply.send(error);
      }
    }
  );

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
