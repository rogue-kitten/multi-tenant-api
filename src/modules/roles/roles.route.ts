import { PERMISSIONS } from '@/utils/permissions';
import { FastifyInstance } from 'fastify';
import { createRoleHandler } from './role.controller';
import { $ref } from './role.schema';

export const roleRoutes = async (app: FastifyInstance) => {
  app.post('/', {
    schema: {
      body: $ref('createRoleSchema'),
    },
    preHandler: [app.auth, app.guard.scope(PERMISSIONS['role:create'])],
    handler: createRoleHandler,
  });
};
