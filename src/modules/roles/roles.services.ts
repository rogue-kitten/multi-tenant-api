import { db } from '@/db/index';
import { roles } from '@/db/schema';
import { InferModel, and, eq } from 'drizzle-orm';
/**
 * adds a new role to the database
 */
export const createRole = async (data: InferModel<typeof roles, 'insert'>) => {
  const result = await db.insert(roles).values(data).returning();

  return result[0];
};

/**
 * fetches the role for an application from the db based on the name of the role
 */
export const getRoleByName = async (name: string, applicationId: string) => {
  const result = await db
    .select({
      id: roles.id,
    })
    .from(roles)
    .where(and(eq(roles.name, name), eq(roles.applicationId, applicationId)))
    .limit(1);

  return result[0];
};
