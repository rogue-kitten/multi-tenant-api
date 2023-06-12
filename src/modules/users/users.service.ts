import { db } from '@/db/index';
import { roles, user, usersToRoles } from '@/db/schema';
import bcrypt from 'bcrypt';
import { InferModel, and, eq } from 'drizzle-orm';

/**
 * stores a new user in the database
 * hashes the password of the user before it stores it in
 */
export const createUser = async (data: InferModel<typeof user, 'insert'>) => {
  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  const password = await bcrypt.hash(data.password, salt);

  const result = await db
    .insert(user)
    .values({ ...data, password })
    .returning({
      id: user.id,
      name: user.name,
      email: user.email,
      applicationId: user.applicationId,
    });

  return result[0];
};

/**
 * checks in the db if there are any users for an application already present
 */
export const getUserByApplication = async (applicationId: string) => {
  const result = await db
    .select({
      id: user.id,
    })
    .from(user)
    .where(eq(user.applicationId, applicationId))
    .limit(1);

  return result;
};

/**
 * assigns a given role to the given user belonging to a particular application
 */
export const assignRoleToUser = async (
  data: InferModel<typeof usersToRoles, 'insert'>
) => {
  const result = await db.insert(usersToRoles).values(data).returning();

  return result[0];
};

/**
 * gets the user based on the email and application
 * then gets all the roles assigned to this user for this application
 * creates a unique array for all the permissions which are assigned to this user
 */
export const findUserByEmail = async (email: string, applicationId: string) => {
  const result = await db
    .select({
      email: user.email,
      id: user.id,
      password: user.password,
      roleName: roles.name,
      permissions: roles.permissions,
    })
    .from(user)
    .where(and(eq(user.email, email), eq(user.applicationId, applicationId)))
    .leftJoin(
      usersToRoles,
      and(
        eq(usersToRoles.applicationId, applicationId),
        eq(usersToRoles.userId, user.id)
      )
    )
    .leftJoin(
      roles,
      and(
        eq(roles.id, usersToRoles.roleId),
        eq(roles.applicationId, applicationId)
      )
    );

  if (!result.length) return null;

  /**
   * gets a unique list of permissions based on all the roles the user has for a given application,
   * we do this because for an application, a user might have more than one role
   */
  const currentUser = result.reduce((acc, curr) => {
    if (!acc.id) {
      return {
        ...curr,
        permissions: new Set(curr.permissions),
      };
    }

    if (!curr.permissions) return acc;

    curr.permissions.forEach((permission) => {
      acc.permissions.add(permission);
    });

    return acc;
  }, {} as Omit<(typeof result)[number], 'permissions'> & { permissions: Set<string> });

  return {
    ...currentUser,
    permissions: Array.from(currentUser.permissions),
  };
};
