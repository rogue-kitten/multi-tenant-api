import { db } from '@/db/index';
import { application } from '@/db/schema';
import { InferModel } from 'drizzle-orm';

/**
 * creates a new application
 */
export const createApplication = async (
  data: InferModel<typeof application, 'insert'>
) => {
  const result = await db.insert(application).values(data).returning();

  return result[0];
};

/**
 * gets the list of applications
 */
export const getApplications = async () => {
  const result = await db
    .select({
      id: application.id,
      name: application.name,
      createdAt: application.createdAt,
    })
    .from(application);

  return result;
};
