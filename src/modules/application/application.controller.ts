import { createRole } from '@/roles/roles.services';
import {
  ALL_PERMISSIONS,
  SYSTEM_ROLES,
  USER_ROLE_PERMISSIONS,
} from '@/utils/permissions';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateApplicationInput } from './application.schema';
import { createApplication, getApplications } from './application.service';

/**
 * creates an application
 * creates default roles for the admin and the user
 */
export const createApplicationHandler = async (
  request: FastifyRequest<{ Body: CreateApplicationInput }>,
  reply: FastifyReply
) => {
  const { name } = request.body;

  try {
    const application = await createApplication({ name });

    // creates the admin role
    const superAdminRolesPromise = createRole({
      applicationId: application.id,
      name: SYSTEM_ROLES.SUPER_ADMIN,
      permissions: ALL_PERMISSIONS as unknown as string[],
    });

    // creates the user roles
    const applicationUserRolePromise = createRole({
      applicationId: application.id,
      name: SYSTEM_ROLES.APPLICATION_USER,
      permissions: USER_ROLE_PERMISSIONS,
    });

    const [superAdminRoles, applicationUserRole] = await Promise.allSettled([
      superAdminRolesPromise,
      applicationUserRolePromise,
    ]);

    if (superAdminRoles.status === 'rejected')
      throw new Error('Error occured while creating the superAdminRoles');

    if (applicationUserRole.status === 'rejected')
      throw new Error('Error occured while creating the applicationUserRole');

    return reply.code(201).send({
      application,
      superAdminRoles: superAdminRoles.value,
      applicationUserRole: applicationUserRole.value,
    });
  } catch (e) {
    return reply.code(500).send(e);
  }
};

/**
 * gets a list of all the applications present
 */
export const getApplicationHandler = async () => {
  return getApplications();
};
