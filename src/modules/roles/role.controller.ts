import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateRoleInput } from './role.schema';
import { createRole } from './roles.services';

/**
 * creates a role based on the permissions provided by the user
 */

export const createRoleHandler = async (
  request: FastifyRequest<{ Body: CreateRoleInput }>,
  reply: FastifyReply
) => {
  const { name, permissions, applicationId } = request.body;

  const role = await createRole({ name, permissions, applicationId });

  return { role };
};
