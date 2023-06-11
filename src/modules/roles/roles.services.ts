import { db } from '@/db/index';
import { roles } from '@/db/schema';
import { InferModel } from 'drizzle-orm';

export const createRole = async (data: InferModel<typeof roles, 'insert'>) => {
  const result = await db.insert(roles).values(data).returning();

  return result[0];
};
