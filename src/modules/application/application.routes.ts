import { FastifyInstance } from 'fastify';
import {
  createApplicationHandler,
  getApplicationHandler,
} from './application.controller';
import { $ref } from './application.schema';

export async function applicationRoutes(app: FastifyInstance) {
  /**
   * route to create an application
   */
  app.post('/', {
    schema: {
      body: $ref('createApplicationSchema'),
    },
    handler: createApplicationHandler,
  });

  /**
   * route to list all the applications
   */
  app.get('/', {
    handler: getApplicationHandler,
  });
}
