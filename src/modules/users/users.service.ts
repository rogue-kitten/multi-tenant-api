import { db } from '@/db/index';
import { user, usersToRoles } from '@/db/schema';
import bcrypt from 'bcrypt';
import { InferModel, eq } from 'drizzle-orm';

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
