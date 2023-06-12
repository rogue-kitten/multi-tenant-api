import { applicationRoutes } from '@/application/application.routes';
import { applicationSchemas } from '@/application/application.schema';
import { roleSchema } from '@/roles/role.schema';
import { roleRoutes } from '@/roles/roles.route';
import { userRoutes } from '@/users/users.route';
import { userSchemas } from '@/users/users.schema';
import jwt from '@fastify/jwt';
import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import guard from 'fastify-guard';

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
  app.register(guard, {
    requestProperty: 'user',
    scopeProperty: 'permissions',
    errorHandler(result, request, reply) {
      return reply.code(401).send({
        message: 'You do not have the permissions to perform that action',
      });
    },
  });

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
  [...applicationSchemas, ...userSchemas, ...roleSchema].forEach((schema) => {
    app.addSchema(schema);
  });

  /**
   * register routes
   */
  app.register(applicationRoutes, { prefix: '/api/application' });
  app.register(userRoutes, { prefix: '/api/users' });
  app.register(roleRoutes, { prefix: '/api/roles' });

  return app;
};
