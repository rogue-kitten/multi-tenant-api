import { FastifyInstance } from 'fastify';
import { createRoleHandler } from './role.controller';
import { $ref } from './role.schema';

export const roleRoutes = async (app: FastifyInstance) => {
  app.post('/', {
    schema: {
      body: $ref('createRoleSchema'),
    },
    handler: createRoleHandler,
  });
};
