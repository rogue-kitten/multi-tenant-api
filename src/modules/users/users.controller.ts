import { getRoleByName } from '@/roles/roles.services';
import { SYSTEM_ROLES } from '@/utils/permissions';
import { app } from '@/utils/server';
import bcrypt from 'bcrypt';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  AssignRoleInput,
  CreateUserInput,
  LoginUserInput,
} from './users.schema';
import {
  assignRoleToUser,
  createUser,
  findUserByEmail,
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

/**
 * verifies if the email and password is correct
 * Genertates an accessToken if it is correct
 */

export const loginHandler = async (
  request: FastifyRequest<{ Body: LoginUserInput }>,
  reply: FastifyReply
) => {
  const { password, email, applicationId } = request.body;

  /**
   * email check
   */
  const user = await findUserByEmail(email, applicationId);
  if (!user)
    return reply.code(400).send({ message: 'Invalid email or password' });

  /**
   * password check
   */
  const isValidPassword = await bcrypt
    .compare(password, user.password)
    .catch(() => false);

  if (!isValidPassword)
    return reply.code(400).send({ message: 'Invalid email or password' });

  /**
   * generate accessToken
   */
  const accessToken = app.jwt.sign({
    applicationId,
    email: user.email,
    userId: user.id,
    permissions: user.permissions,
  });

  return { accessToken };
};

/**
 * assigns a role to a user
 */
export const assignRoleToUserHandler = async (
  request: FastifyRequest<{ Body: AssignRoleInput }>,
  reply: FastifyReply
) => {
  const { applicationId, roleId, userId } = request.body;

  try {
    const result = await assignRoleToUser({ applicationId, roleId, userId });

    return { result };
  } catch (e) {
    return reply.code(400).send({ message: 'Could not assign role to user' });
  }
};
