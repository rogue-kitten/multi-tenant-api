import { ALL_PERMISSIONS } from '@/utils/permissions';
import { buildJsonSchemas } from 'fastify-zod';
import { z } from 'zod';

const createRoleSchema = z.object({
  name: z.string(),
  permissions: z.array(z.enum(ALL_PERMISSIONS)),
  applicationId: z.string().uuid(),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;

export const { $ref, schemas: roleSchema } = buildJsonSchemas(
  {
    createRoleSchema,
  },
  {
    $id: 'rolesSchema',
  }
);
