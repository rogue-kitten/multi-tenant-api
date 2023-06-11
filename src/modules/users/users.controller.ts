import { getRoleByName } from '@/roles/roles.services';
import { SYSTEM_ROLES } from '@/utils/permissions';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateUserInput } from './users.schema';
import {
  assignRoleToUser,
  createUser,
  getUserByApplication,
} from './users.service';

/**
 * creates a new user and assigns it the correct roles depending on if it is the initial user or not
 */
export const createUserHandler = async (
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply
) => {
  const { initialUser, ...data } = request.body;

  const roleName = initialUser
    ? SYSTEM_ROLES.SUPER_ADMIN
    : SYSTEM_ROLES.APPLICATION_USER;

  /**
   * need to actually check if this is the initial user if they are trying to assume the super admin role
   */
  if (roleName === SYSTEM_ROLES.SUPER_ADMIN) {
    const appUsers = await getUserByApplication(data.applicationId);

    if (appUsers.length > 0)
      return reply.code(400).send({
        message: 'Application already has an initial users registered',
        applicationId: data.applicationId,
      });
  }

  const role = await getRoleByName(roleName, data.applicationId);
  if (!role) return reply.code(404).send({ message: 'Role not found' });

  try {
    const user = await createUser(data);

    await assignRoleToUser({
      userId: user.id,
      applicationId: data.applicationId,
      roleId: role.id,
    });

    return reply.code(201).send(user);
  } catch (error) {
    return reply.code(500).send(error);
  }
};
