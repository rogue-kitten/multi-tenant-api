import { FastifyInstance } from 'fastify';
import {
  assignRoleToUserHandler,
  createUserHandler,
  loginHandler,
} from './users.controller';
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

  /**
   * assigns the user a role
   */
  app.post('/roles', {
    schema: {
      body: $ref('assignRoleSchema'),
    },
    handler: assignRoleToUserHandler,
  });
};
