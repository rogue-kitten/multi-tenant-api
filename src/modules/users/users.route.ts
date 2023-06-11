import { FastifyInstance } from 'fastify';
import { createUserHandler } from './users.controller';
import { $ref } from './users.schema';

export const userRoutes = async (app: FastifyInstance) => {
  app.post('/', {
    schema: {
      body: $ref('createUserSchema'),
    },
    handler: createUserHandler,
  });
};
