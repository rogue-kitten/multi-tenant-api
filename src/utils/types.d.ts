import { FastifyJWT } from '@fastify/jwt';
import { FastifyInstance } from 'fastify';

declare module 'fastify' {
  export interface FastifyInstance {
    auth: (request: FastifyRequest, reply: FastifyReply) => void;
  }
}

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      userId: string;
      email: string;
      applicationId: string;
      permissions: string[];
    };
  }
}
