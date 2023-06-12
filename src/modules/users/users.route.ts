import { FastifyInstance } from 'fastify';
import { createUserHandler, loginHandler } from './users.controller';
import { $ref } from './users.schema';

export const userRoutes = async (app: FastifyInstance) => {
  /**
   * create User route
   */
  app.post('/', {
    schema: {
      body: $ref('createUserSchema'),
    },
    handler: createUserHandler,
  });

  /**
   * login user route
   */
  app.post('/login', {
    schema: {
      body: $ref('loginUserSchema'),
      response: {
        200: $ref('loginUserReplySchema'),
      },
    },
    handler: loginHandler,
  });
};
